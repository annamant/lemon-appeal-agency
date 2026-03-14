/**
 * Airtable setup guide script.
 *
 * This script does NOT auto-create Airtable tables (the Airtable REST API
 * does not support schema creation). Instead, it prints a structured checklist
 * of every table and field that must be created manually in Airtable.
 *
 * Run:  npx ts-node src/scripts/setup-airtable.ts
 */

const SCHEMA = {
  "Table 1 — Brand Master": [
    { field: "Mission", type: "Long text" },
    { field: "Values", type: "Long text" },
    { field: "Positioning", type: "Long text" },
    { field: "Target Audience", type: "Long text" },
    { field: "Tone Rules", type: "Long text" },
    { field: "Words to Avoid", type: "Short text (comma-separated)" },
    { field: "Sophie's Voice Notes", type: "Long text" },
    { field: "Global KPI Target", type: "Number" },
    { field: "Email Conversion Target", type: "Percent" },
    { field: "Engagement Target", type: "Percent" },
    { field: "Discoverability Target", type: "Percent" },
    { field: "Last Updated", type: "Date (auto)" },
    { field: "Updated By", type: "Collaborator (auto)" },
  ],

  "Table 2 — Campaign Instruction Sets": [
    { field: "Campaign Name", type: "Short text" },
    { field: "Start Date", type: "Date" },
    { field: "End Date", type: "Date" },
    { field: "Strategic Objective", type: "Long text" },
    { field: "Target Audience", type: "Long text" },
    { field: "Key Messages", type: "Long text" },
    { field: "Content Themes", type: "Long text" },
    { field: "Product Focus", type: "Short text" },
    {
      field: "Artisan Spotlights",
      type: "Link to another record (optional)",
    },
    { field: "Platform Strategy", type: "Long text" },
    { field: "Campaign KPI Targets", type: "Long text" },
    { field: "Campaign Copy Direction", type: "Long text" },
    {
      field: "Status",
      type: "Single select: Planning | Active | Complete",
    },
    { field: "Created By", type: "Collaborator (auto)" },
    { field: "Last Updated", type: "Date (auto)" },
  ],

  "Table 3 — Event Calendar": [
    { field: "Event Date", type: "Date" },
    { field: "Event Name", type: "Short text" },
    {
      field: "Event Type",
      type: "Single select: Holiday | Internal Milestone | Product Launch | Community",
    },
    {
      field: "Region",
      type: "Single select: European | Global | Italy-specific",
    },
    { field: "Campaign", type: "Link to Campaign Instruction Sets" },
    {
      field: "Content Priority",
      type: "Single select: Mandatory | High | Medium | Flexible",
    },
    { field: "Target Posting Date", type: "Date" },
    {
      field: "Platforms",
      type: "Multiple select: Instagram | TikTok | Facebook | LinkedIn | YouTube | Email",
    },
    { field: "Suggested Theme", type: "Long text" },
    { field: "Notes", type: "Long text" },
    {
      field: "Status",
      type: "Single select: Pending | Brief Generated | Posted | KPIs Tracked",
    },
    { field: "Created By", type: "Collaborator (auto)" },
  ],

  "Table 4 — Platform Rules": [
    {
      field: "Platform",
      type: "Single select: Instagram | TikTok | Facebook | LinkedIn | YouTube | Email",
    },
    { field: "Format Type", type: "Short text" },
    { field: "Max Characters", type: "Number" },
    { field: "Image Specs", type: "Long text" },
    { field: "Tone", type: "Long text" },
    { field: "CTA Framework", type: "Long text" },
    { field: "Hashtag Strategy", type: "Long text" },
    { field: "Posting Frequency", type: "Short text" },
    { field: "Best Posting Times", type: "Long text" },
    { field: "Link Placement", type: "Short text" },
    { field: "Video Length", type: "Number (seconds, optional)" },
    { field: "Engagement Expectations", type: "Long text" },
    { field: "Created By", type: "Collaborator (auto)" },
  ],

  "Table 5 — Brand Instructions": [
    {
      field: "Instruction Category",
      type: "Single select: Voice | Messaging | Product | Positioning | Constraints",
    },
    { field: "Instruction Text", type: "Long text" },
    { field: "Examples", type: "Long text (optional)" },
    {
      field: "Priority",
      type: "Single select: Critical | High | Medium",
    },
    {
      field: "Applies To",
      type: "Multiple select: All platforms | Instagram | TikTok | Facebook | LinkedIn | YouTube | Email",
    },
    { field: "Last Updated", type: "Date (auto)" },
    { field: "Updated By", type: "Collaborator (auto)" },
  ],

  "Table 6 — KPI Definitions": [
    { field: "KPI Name", type: "Short text" },
    {
      field: "Platform",
      type: "Single select: Global | Instagram | TikTok | Facebook | LinkedIn | YouTube | Email",
    },
    {
      field: "Metric Type",
      type: "Single select: Reach | Engagement | Conversion | Registration | Revenue",
    },
    { field: "Target Value", type: "Short text" },
    { field: "Measurement Method", type: "Long text" },
    { field: "Success Threshold", type: "Short text" },
    {
      field: "Tracking Frequency",
      type: "Single select: Real-time | Daily | Weekly | Monthly",
    },
    { field: "Responsible Party", type: "Short text" },
    { field: "Notes", type: "Long text (optional)" },
  ],

  "Table 7 — Content Brief Output": [
    { field: "Brief ID", type: "Autonumber" },
    {
      field: "Event / Campaign",
      type: "Link to Event Calendar",
    },
    { field: "Target Date", type: "Date" },
    {
      field: "Platform",
      type: "Single select: Instagram | TikTok | Facebook | LinkedIn | YouTube | Email",
    },
    {
      field: "Content Type",
      type: "Single select: Carousel | Reel | Article | Thread | Email | Video",
    },
    { field: "Full Copy Draft", type: "Long text" },
    { field: "Copy Tone Notes", type: "Long text" },
    { field: "CTA", type: "Short text" },
    { field: "CTA Placement", type: "Short text" },
    { field: "Platform Specs", type: "Long text" },
    { field: "Image Requirements", type: "Long text" },
    { field: "Hashtag Strategy", type: "Long text" },
    {
      field: "KPI Targets",
      type: "Link to KPI Definitions (optional)",
    },
    {
      field: "Status",
      type: "Single select: Pending | Images Selected | Posted | KPIs Tracked",
    },
    {
      field: "Images Selected",
      type: "Link to Asset Repository (optional)",
    },
    { field: "Posted Date", type: "Date (optional)" },
    { field: "Posted By", type: "Short text (optional)" },
    { field: "Notes / Changes", type: "Long text (optional)" },
    { field: "Created By", type: "Short text (auto)" },
    { field: "Created Date", type: "Date (auto)" },
    { field: "Last Updated", type: "Date (auto)" },
  ],

  "Table 8 — Asset Repository": [
    { field: "Asset ID", type: "Autonumber" },
    { field: "Asset Name", type: "Short text" },
    {
      field: "Asset Type",
      type: "Single select: Image | Video | Graphic | Animation",
    },
    { field: "File URL / Link", type: "URL" },
    {
      field: "Source",
      type: "Single select: Internal Library | New Shoot | AI-Generated | Client Provided",
    },
    {
      field: "Tags",
      type: "Multiple select: lemon | artisan | founder | lifestyle | ceremony | nature | product | location",
    },
    { field: "Approved", type: "Checkbox" },
    { field: "Used In Brief", type: "Link to Content Brief Output (optional)" },
    { field: "Upload Date", type: "Date (auto)" },
    { field: "Uploaded By", type: "Collaborator (auto)" },
    { field: "Notes", type: "Long text (optional)" },
  ],

  "Table 9 — KPI Tracker": [
    { field: "Tracking ID", type: "Autonumber" },
    { field: "Brief ID", type: "Link to Content Brief Output" },
    {
      field: "Platform",
      type: "Single select: Instagram | TikTok | Facebook | LinkedIn | YouTube | Email",
    },
    { field: "Post Date", type: "Date" },
    { field: "Target KPIs", type: "Long text" },
    { field: "Actual KPIs", type: "Long text (agency fills post-publish)" },
    { field: "Reach", type: "Number" },
    { field: "Engagement", type: "Number" },
    { field: "Engagement Rate", type: "Percent" },
    { field: "Clicks", type: "Number" },
    { field: "Registrations", type: "Number" },
    { field: "Email Signups", type: "Number" },
    { field: "Website Visits", type: "Number" },
    { field: "Conversions", type: "Number" },
    { field: "Conversion Value", type: "Currency" },
    { field: "Performance Notes", type: "Long text" },
    { field: "Date Tracked", type: "Date (auto)" },
    { field: "Tracked By", type: "Short text (auto)" },
    { field: "Last Updated", type: "Date (auto)" },
  ],
};

const PERMISSIONS = `
PERMISSION MODEL
────────────────────────────────────────────────────────────────────────
Table                   │ Anna  │ Danilo │ Agency
────────────────────────┼───────┼────────┼───────────────────────────────
Brand Master            │  R/W  │  R/W   │ Read only
Campaign Instructions   │  R/W  │  R/W   │ Read only
Event Calendar          │  R/W  │  R/W   │ Read only
Platform Rules          │  R/W  │  R/W   │ Read only
Brand Instructions      │  R/W  │  R/W   │ Read only
KPI Definitions         │  R/W  │  R/W   │ Read only
Content Brief Output    │  R/W  │  R/W   │ Read copy / Write status+assets
Asset Repository        │ Approve│ Approve│ Upload assets
KPI Tracker             │  R/W  │  R/W   │ Write actual KPIs
────────────────────────────────────────────────────────────────────────
`;

function printSetupGuide(): void {
  console.log("🍋 LEMON APPEAL — AIRTABLE SETUP GUIDE");
  console.log("=".repeat(60));
  console.log("\nCreate a new Airtable base and build these 9 tables:\n");

  for (const [tableName, fields] of Object.entries(SCHEMA)) {
    console.log(`\n📋 ${tableName}`);
    console.log("-".repeat(50));
    for (const { field, type } of fields) {
      console.log(`  ${field.padEnd(30)} ${type}`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(PERMISSIONS);

  console.log("=".repeat(60));
  console.log("\n📝 AFTER CREATING THE SCHEMA:");
  console.log("  1. Copy your Base ID from the Airtable URL");
  console.log("     (format: app<xxxxxxxx>)");
  console.log("  2. Generate an API key at airtable.com/account");
  console.log("  3. Add to your .env file:");
  console.log("     AIRTABLE_API_KEY=pat<your_key>");
  console.log("     AIRTABLE_BASE_ID=app<your_base_id>");
  console.log("\n📝 POPULATE IN THIS ORDER:");
  console.log("  1. Brand Master (1 record — the source of truth)");
  console.log("  2. Brand Instructions (voice rules, constraints)");
  console.log("  3. Platform Rules (1 record per platform = 6 records)");
  console.log("  4. KPI Definitions");
  console.log("  5. Campaign Instruction Sets (Track 1)");
  console.log("  6. Event Calendar (upcoming events)");
  console.log("\n📝 THEN GENERATE BRIEFS:");
  console.log("  npx ts-node src/scripts/generate-briefs.ts");
  console.log("\n✅ Done! The AI will query all tables and generate");
  console.log("   complete content briefs for the agency to execute.");
}

printSetupGuide();
