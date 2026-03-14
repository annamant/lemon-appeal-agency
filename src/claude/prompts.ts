/**
 * Prompt templates for Lemon Appeal content brief generation.
 *
 * Design philosophy:
 * - The system prompt encodes all static brand rules so they are cached.
 * - The user prompt supplies the dynamic per-event context.
 * - Claude returns a JSON object matching ContentBrief fields.
 */

import type {
  BrandInstruction,
  BrandMaster,
  CampaignInstructionSet,
  EventCalendar,
  KpiDefinition,
  Platform,
  PlatformRules,
} from "../types";

// ─── System Prompt (brand rules — cached across calls) ────────────────────────

export function buildSystemPrompt(
  brand: BrandMaster,
  instructions: BrandInstruction[]
): string {
  const criticalInstructions = instructions
    .filter((i) => i.priority === "Critical")
    .map((i) => `• [${i.instructionCategory}] ${i.instructionText}`)
    .join("\n");

  const highInstructions = instructions
    .filter((i) => i.priority === "High")
    .map((i) => `• [${i.instructionCategory}] ${i.instructionText}`)
    .join("\n");

  return `You are the content brief generator for Lemon Appeal — a heritage-driven enterprise that preserves Southern Italian artisan crafts from the Amalfi Coast.

## BRAND IDENTITY

**Mission:** ${brand.mission}

**Values:** ${brand.values}

**Positioning:** ${brand.positioning}

**Target Audience:** ${brand.targetAudience}

## TONE & VOICE RULES

${brand.toneRules}

**Sophie's Voice Guidelines:**
${brand.sophiesVoiceNotes}

## ABSOLUTE CONSTRAINTS — NEVER VIOLATE

Words you must NEVER use: ${brand.wordsToAvoid}

Critical brand instructions:
${criticalInstructions}

## HIGH-PRIORITY BRAND INSTRUCTIONS

${highInstructions}

## KPI CONTEXT

- Global community target: ${brand.globalKpiTarget} Lemoneers by Day 90
- Email conversion target: ${brand.emailConversionTarget}% email-to-purchase
- Engagement target: ${brand.engagementTarget}% per post
- Discoverability target: Under ${brand.discoverabilityTarget}% discount dependency

## OUTPUT FORMAT

You MUST return a valid JSON object with exactly these fields:

{
  "contentType": "<Carousel|Reel|Article|Thread|Email|Video>",
  "fullCopyDraft": "<complete, ready-to-use copy — no rewrites needed>",
  "copyToneNotes": "<brief explanation of tone choices>",
  "cta": "<the exact CTA text>",
  "ctaPlacement": "<Caption|Bio|Comment|Email footer>",
  "platformSpecs": "<character count check, image dimensions, aspect ratio>",
  "imageRequirements": "<what images/videos are needed, mood, subject matter>",
  "hashtagStrategy": "<recommended hashtags with reasoning>"
}

CRITICAL: The fullCopyDraft must be complete, polished, and ready for the agency to execute WITHOUT any rewrites. Write it as Sophie would — warm, specific, mission-first. Never generic. Never corporate. Always human.`;
}

// ─── User Prompt (dynamic per-event context) ──────────────────────────────────

export function buildUserPrompt(
  event: EventCalendar,
  campaign: CampaignInstructionSet,
  platform: Platform,
  platformRules: PlatformRules,
  kpiDefs: KpiDefinition[]
): string {
  const kpiSummary = kpiDefs
    .map((k) => `• ${k.kpiName}: ${k.targetValue}`)
    .join("\n");

  const platformToneNote =
    platformRules.tone
      ? `\n**Platform Tone Shift:** ${platformRules.tone}`
      : "";

  return `Generate a complete content brief for the following:

## EVENT / MOMENT

**Event:** ${event.eventName}
**Event Date:** ${event.eventDate}
**Target Posting Date:** ${event.targetPostingDate}
**Suggested Theme:** ${event.suggestedTheme}
**Priority:** ${event.contentPriority}
${event.notes ? `**Context Notes:** ${event.notes}` : ""}

## CAMPAIGN CONTEXT

**Campaign:** ${campaign.campaignName}
**Strategic Objective:** ${campaign.strategicObjective}
**Key Messages (use these):**
${campaign.keyMessages}

**Content Themes:**
${campaign.contentThemes}

**Product Focus:** ${campaign.productFocus}

**Copy Direction:**
${campaign.campaignCopyDirection}

## PLATFORM: ${platform.toUpperCase()}

**Format:** ${platformRules.formatType}
**Character Limit:** ${platformRules.maxCharacters} characters
**CTA Framework:** ${platformRules.ctaFramework}
**Hashtag Approach:** ${platformRules.hashtagStrategy}
**Image Specs:** ${platformRules.imageSpecs}
**Link Placement:** ${platformRules.linkPlacement}${platformToneNote}
${platformRules.videoLength ? `**Video Length:** ${platformRules.videoLength}s max` : ""}

## KPI TARGETS FOR THIS POST

${kpiSummary}

---

Now generate the complete content brief JSON for this ${platform} post. Remember: the copy must be final and ready to execute — no placeholders, no rewrites needed.`;
}
