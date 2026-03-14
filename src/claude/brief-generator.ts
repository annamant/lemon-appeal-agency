/**
 * Claude-powered content brief generator.
 *
 * Architecture:
 * - Uses claude-opus-4-6 with adaptive thinking for high-quality copy
 * - Prompt caching on the system prompt (brand rules) reduces costs ~90%
 *   when generating briefs for multiple platforms in one run
 * - Streaming used for robustness with long outputs
 * - Returns typed ContentBrief objects ready for Airtable insertion
 */

import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";
import {
  getBrandMaster,
  getBrandInstructions,
  getCampaign,
  getEvent,
  getKpiDefinitions,
  getPlatformRules,
  createContentBrief,
  createKpiTrackerEntry,
} from "../airtable/tables";
import type {
  ContentBrief,
  GenerateBriefsRequest,
  GenerateBriefsResponse,
  Platform,
} from "../types";

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── Raw Claude output schema ─────────────────────────────────────────────────

interface ClaudeBriefOutput {
  contentType: ContentBrief["contentType"];
  fullCopyDraft: string;
  copyToneNotes: string;
  cta: string;
  ctaPlacement: string;
  platformSpecs: string;
  imageRequirements: string;
  hashtagStrategy: string;
}

// ─── Single-platform brief generation ────────────────────────────────────────

async function generateBriefForPlatform(
  eventId: string,
  platform: Platform,
  systemPromptText: string
): Promise<ContentBrief> {
  // Fetch all needed data in parallel
  const [event, platformRules, kpiDefs] = await Promise.all([
    getEvent(eventId),
    getPlatformRules(platform),
    getKpiDefinitions(platform),
  ]);

  const campaign = await getCampaign(event.campaignId);

  const userPrompt = buildUserPrompt(
    event,
    campaign,
    platform,
    platformRules,
    kpiDefs
  );

  // Stream the response — robustness for long copy outputs
  const stream = anthropic.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    thinking: { type: "adaptive" },
    // Cache the system prompt (brand rules) across all platform calls
    system: [
      {
        type: "text",
        text: systemPromptText,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  const response = await stream.finalMessage();

  // Extract the text block (thinking blocks precede it)
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error(
      `No text response from Claude for ${platform} brief on event ${eventId}`
    );
  }

  // Parse JSON — Claude returns JSON inside the text block
  let parsed: ClaudeBriefOutput;
  try {
    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON object found in Claude response");
    }
    parsed = JSON.parse(jsonMatch[0]) as ClaudeBriefOutput;
  } catch (err) {
    throw new Error(
      `Failed to parse Claude JSON response for ${platform}: ${String(err)}\n\nRaw: ${textBlock.text.slice(0, 500)}`
    );
  }

  // Build the ContentBrief record
  const brief: Omit<ContentBrief, "id" | "briefId"> = {
    eventOrCampaignId: eventId,
    targetDate: event.targetPostingDate,
    platform,
    contentType: parsed.contentType,
    fullCopyDraft: parsed.fullCopyDraft,
    copyToneNotes: parsed.copyToneNotes,
    cta: parsed.cta,
    ctaPlacement: parsed.ctaPlacement,
    platformSpecs: parsed.platformSpecs,
    imageRequirements: parsed.imageRequirements,
    hashtagStrategy: parsed.hashtagStrategy,
    status: "Pending",
    createdBy: "AI Generator",
    createdDate: new Date().toISOString(),
  };

  return brief;
}

// ─── Main export: generate briefs for all platforms ──────────────────────────

export async function generateBriefs(
  request: GenerateBriefsRequest
): Promise<GenerateBriefsResponse> {
  const { eventId } = request;

  // Fetch brand data upfront — shared across all platform calls
  const [brandMaster, brandInstructions, event] = await Promise.all([
    getBrandMaster(),
    getBrandInstructions(),
    getEvent(eventId),
  ]);

  const platforms = request.platforms ?? event.platforms;
  if (platforms.length === 0) {
    throw new Error(`Event ${eventId} has no platforms configured`);
  }

  // Build the system prompt once (will be cached by Anthropic)
  const systemPromptText = buildSystemPrompt(brandMaster, brandInstructions);

  console.log(
    `[BriefGenerator] Generating ${platforms.length} briefs for "${event.eventName}" (${eventId})`
  );

  // Generate briefs sequentially to respect Airtable rate limits and preserve
  // prompt cache hits. Switch to Promise.all if Airtable limits allow.
  const briefs: ContentBrief[] = [];

  for (const platform of platforms) {
    console.log(`  → ${platform}...`);
    try {
      const briefData = await generateBriefForPlatform(
        eventId,
        platform,
        systemPromptText
      );

      // Persist to Airtable
      const saved = await createContentBrief(briefData);
      briefs.push(saved);

      // Create a matching KPI tracker stub
      const kpiDefs = await getKpiDefinitions(platform);
      const kpiSummary = kpiDefs
        .map((k) => `${k.kpiName}: ${k.targetValue}`)
        .join(" | ");

      if (saved.id) {
        await createKpiTrackerEntry({
          briefId: saved.id,
          platform,
          postDate: event.targetPostingDate,
          targetKpis: kpiSummary,
        });
      }

      console.log(`  ✓ ${platform} brief saved (id: ${saved.id})`);
    } catch (err) {
      console.error(`  ✗ ${platform} failed: ${String(err)}`);
      // Continue with other platforms rather than aborting the whole run
    }
  }

  // Update the event status to "Brief Generated"
  // (done outside this function to keep concerns separate — see routes)

  return {
    eventId,
    eventName: event.eventName,
    briefs,
    generatedAt: new Date().toISOString(),
  };
}
