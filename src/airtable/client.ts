import Airtable from "airtable";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey) {
  throw new Error("AIRTABLE_API_KEY environment variable is required");
}
if (!baseId) {
  throw new Error("AIRTABLE_BASE_ID environment variable is required");
}

Airtable.configure({ apiKey });

export const base = Airtable.base(baseId);

// Table name constants matching the spec exactly
export const TABLE_NAMES = {
  BRAND_MASTER: "Brand Master",
  CAMPAIGN_INSTRUCTION_SETS: "Campaign Instruction Sets",
  EVENT_CALENDAR: "Event Calendar",
  PLATFORM_RULES: "Platform Rules",
  BRAND_INSTRUCTIONS: "Brand Instructions",
  KPI_DEFINITIONS: "KPI Definitions",
  CONTENT_BRIEF_OUTPUT: "Content Brief Output",
  ASSET_REPOSITORY: "Asset Repository",
  KPI_TRACKER: "KPI Tracker",
} as const;
