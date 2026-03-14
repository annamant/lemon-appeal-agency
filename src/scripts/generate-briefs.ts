/**
 * CLI script: Generate content briefs for all pending events.
 *
 * Usage:
 *   npx ts-node src/scripts/generate-briefs.ts
 *   npx ts-node src/scripts/generate-briefs.ts --event rec<id>
 *   npx ts-node src/scripts/generate-briefs.ts --event rec<id> --platforms Instagram,TikTok
 */

import dotenv from "dotenv";
dotenv.config();

import { getPendingEvents } from "../airtable/tables";
import { generateBriefs } from "../claude/brief-generator";
import type { Platform } from "../types";

const VALID_PLATFORMS: Platform[] = [
  "Instagram",
  "TikTok",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "Email",
];

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const eventFlagIndex = args.indexOf("--event");
  const platformFlagIndex = args.indexOf("--platforms");

  const specificEventId =
    eventFlagIndex !== -1 ? args[eventFlagIndex + 1] : undefined;
  const specificPlatforms: Platform[] | undefined =
    platformFlagIndex !== -1
      ? (args[platformFlagIndex + 1].split(",") as Platform[]).filter((p) =>
          VALID_PLATFORMS.includes(p)
        )
      : undefined;

  console.log("🍋 Lemon Appeal — Content Brief Generator");
  console.log("==========================================\n");

  let events = specificEventId
    ? [{ id: specificEventId }]
    : await getPendingEvents();

  if (events.length === 0) {
    console.log("No pending events found. Add events to the Event Calendar first.");
    process.exit(0);
  }

  console.log(`Found ${events.length} event(s) to process.\n`);

  let totalBriefs = 0;
  let failedEvents = 0;

  for (const event of events) {
    if (!event.id) continue;

    try {
      const result = await generateBriefs({
        eventId: event.id,
        platforms: specificPlatforms,
      });

      totalBriefs += result.briefs.length;
      console.log(
        `✓ "${result.eventName}" — ${result.briefs.length} brief(s) generated\n`
      );
    } catch (err) {
      failedEvents++;
      console.error(`✗ Event ${event.id} failed: ${String(err)}\n`);
    }
  }

  console.log("==========================================");
  console.log(`Done. ${totalBriefs} brief(s) generated.`);
  if (failedEvents > 0) {
    console.log(`${failedEvents} event(s) failed — check logs above.`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
