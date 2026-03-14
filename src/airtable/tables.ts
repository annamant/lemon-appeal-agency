/**
 * Airtable table accessors — typed wrappers for all 9 Lemon Appeal tables.
 * Each function fetches from Airtable and maps raw field values to typed
 * TypeScript interfaces defined in src/types/index.ts.
 */

import { base, TABLE_NAMES } from "./client";
import type {
  BrandMaster,
  BrandInstruction,
  CampaignInstructionSet,
  ContentBrief,
  EventCalendar,
  KpiDefinition,
  KpiTracker,
  Platform,
  PlatformRules,
} from "../types";

// ─── Helper ───────────────────────────────────────────────────────────────────

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function num(v: unknown): number {
  return typeof v === "number" ? v : 0;
}

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function bool(v: unknown): boolean {
  return typeof v === "boolean" ? v : false;
}

// ─── Table 1: Brand Master ────────────────────────────────────────────────────

export async function getBrandMaster(): Promise<BrandMaster> {
  const records = await base(TABLE_NAMES.BRAND_MASTER)
    .select({ maxRecords: 1 })
    .firstPage();

  if (records.length === 0) {
    throw new Error("No Brand Master record found in Airtable");
  }

  const f = records[0].fields;
  return {
    id: records[0].id,
    mission: str(f["Mission"]),
    values: str(f["Values"]),
    positioning: str(f["Positioning"]),
    targetAudience: str(f["Target Audience"]),
    toneRules: str(f["Tone Rules"]),
    wordsToAvoid: str(f["Words to Avoid"]),
    sophiesVoiceNotes: str(f["Sophie's Voice Notes"]),
    globalKpiTarget: num(f["Global KPI Target"]),
    emailConversionTarget: num(f["Email Conversion Target"]),
    engagementTarget: num(f["Engagement Target"]),
    discoverabilityTarget: num(f["Discoverability Target"]),
    lastUpdated: str(f["Last Updated"]),
    updatedBy: str(f["Updated By"]),
  };
}

// ─── Table 2: Campaign Instruction Sets ──────────────────────────────────────

export async function getCampaign(
  campaignId: string
): Promise<CampaignInstructionSet> {
  const record = await base(TABLE_NAMES.CAMPAIGN_INSTRUCTION_SETS).find(
    campaignId
  );
  const f = record.fields;

  return {
    id: record.id,
    campaignName: str(f["Campaign Name"]),
    startDate: str(f["Start Date"]),
    endDate: str(f["End Date"]),
    strategicObjective: str(f["Strategic Objective"]),
    targetAudience: str(f["Target Audience"]),
    keyMessages: str(f["Key Messages"]),
    contentThemes: str(f["Content Themes"]),
    productFocus: str(f["Product Focus"]),
    artisanSpotlights: arr<string>(f["Artisan Spotlights"]),
    platformStrategy: str(f["Platform Strategy"]),
    campaignKpiTargets: str(f["Campaign KPI Targets"]),
    campaignCopyDirection: str(f["Campaign Copy Direction"]),
    status: str(f["Status"]) as CampaignInstructionSet["status"],
    createdBy: str(f["Created By"]),
    lastUpdated: str(f["Last Updated"]),
  };
}

export async function getActiveCampaigns(): Promise<CampaignInstructionSet[]> {
  const records = await base(TABLE_NAMES.CAMPAIGN_INSTRUCTION_SETS)
    .select({ filterByFormula: "{Status} = 'Active'" })
    .all();

  return records.map((r) => {
    const f = r.fields;
    return {
      id: r.id,
      campaignName: str(f["Campaign Name"]),
      startDate: str(f["Start Date"]),
      endDate: str(f["End Date"]),
      strategicObjective: str(f["Strategic Objective"]),
      targetAudience: str(f["Target Audience"]),
      keyMessages: str(f["Key Messages"]),
      contentThemes: str(f["Content Themes"]),
      productFocus: str(f["Product Focus"]),
      artisanSpotlights: arr<string>(f["Artisan Spotlights"]),
      platformStrategy: str(f["Platform Strategy"]),
      campaignKpiTargets: str(f["Campaign KPI Targets"]),
      campaignCopyDirection: str(f["Campaign Copy Direction"]),
      status: str(f["Status"]) as CampaignInstructionSet["status"],
      createdBy: str(f["Created By"]),
      lastUpdated: str(f["Last Updated"]),
    };
  });
}

// ─── Table 3: Event Calendar ──────────────────────────────────────────────────

export async function getEvent(eventId: string): Promise<EventCalendar> {
  const record = await base(TABLE_NAMES.EVENT_CALENDAR).find(eventId);
  const f = record.fields;

  return {
    id: record.id,
    eventDate: str(f["Event Date"]),
    eventName: str(f["Event Name"]),
    eventType: str(f["Event Type"]) as EventCalendar["eventType"],
    region: str(f["Region"]) as EventCalendar["region"],
    campaignId: arr<string>(f["Campaign"])[0] ?? "",
    contentPriority: str(
      f["Content Priority"]
    ) as EventCalendar["contentPriority"],
    targetPostingDate: str(f["Target Posting Date"]),
    platforms: arr<Platform>(f["Platforms"]),
    suggestedTheme: str(f["Suggested Theme"]),
    notes: str(f["Notes"]),
    status: str(f["Status"]) as EventCalendar["status"],
    createdBy: str(f["Created By"]),
  };
}

export async function getPendingEvents(): Promise<EventCalendar[]> {
  const records = await base(TABLE_NAMES.EVENT_CALENDAR)
    .select({ filterByFormula: "{Status} = 'Pending'" })
    .all();

  return records.map((r) => {
    const f = r.fields;
    return {
      id: r.id,
      eventDate: str(f["Event Date"]),
      eventName: str(f["Event Name"]),
      eventType: str(f["Event Type"]) as EventCalendar["eventType"],
      region: str(f["Region"]) as EventCalendar["region"],
      campaignId: arr<string>(f["Campaign"])[0] ?? "",
      contentPriority: str(
        f["Content Priority"]
      ) as EventCalendar["contentPriority"],
      targetPostingDate: str(f["Target Posting Date"]),
      platforms: arr<Platform>(f["Platforms"]),
      suggestedTheme: str(f["Suggested Theme"]),
      notes: str(f["Notes"]),
      status: str(f["Status"]) as EventCalendar["status"],
      createdBy: str(f["Created By"]),
    };
  });
}

// ─── Table 4: Platform Rules ──────────────────────────────────────────────────

export async function getPlatformRules(platform: Platform): Promise<PlatformRules> {
  const records = await base(TABLE_NAMES.PLATFORM_RULES)
    .select({ filterByFormula: `{Platform} = '${platform}'`, maxRecords: 1 })
    .firstPage();

  if (records.length === 0) {
    throw new Error(`No platform rules found for: ${platform}`);
  }

  const f = records[0].fields;
  return {
    id: records[0].id,
    platform: str(f["Platform"]) as Platform,
    formatType: str(f["Format Type"]),
    maxCharacters: num(f["Max Characters"]),
    imageSpecs: str(f["Image Specs"]),
    tone: str(f["Tone"]),
    ctaFramework: str(f["CTA Framework"]),
    hashtagStrategy: str(f["Hashtag Strategy"]),
    postingFrequency: str(f["Posting Frequency"]),
    bestPostingTimes: str(f["Best Posting Times"]),
    linkPlacement: str(f["Link Placement"]),
    videoLength: f["Video Length"] ? num(f["Video Length"]) : undefined,
    engagementExpectations: str(f["Engagement Expectations"]),
    createdBy: str(f["Created By"]),
  };
}

export async function getAllPlatformRules(): Promise<PlatformRules[]> {
  const records = await base(TABLE_NAMES.PLATFORM_RULES).select().all();

  return records.map((r) => {
    const f = r.fields;
    return {
      id: r.id,
      platform: str(f["Platform"]) as Platform,
      formatType: str(f["Format Type"]),
      maxCharacters: num(f["Max Characters"]),
      imageSpecs: str(f["Image Specs"]),
      tone: str(f["Tone"]),
      ctaFramework: str(f["CTA Framework"]),
      hashtagStrategy: str(f["Hashtag Strategy"]),
      postingFrequency: str(f["Posting Frequency"]),
      bestPostingTimes: str(f["Best Posting Times"]),
      linkPlacement: str(f["Link Placement"]),
      videoLength: f["Video Length"] ? num(f["Video Length"]) : undefined,
      engagementExpectations: str(f["Engagement Expectations"]),
      createdBy: str(f["Created By"]),
    };
  });
}

// ─── Table 5: Brand Instructions ──────────────────────────────────────────────

export async function getBrandInstructions(
  platform?: Platform
): Promise<BrandInstruction[]> {
  const records = await base(TABLE_NAMES.BRAND_INSTRUCTIONS).select().all();

  return records
    .map((r) => {
      const f = r.fields;
      return {
        id: r.id,
        instructionCategory: str(
          f["Instruction Category"]
        ) as BrandInstruction["instructionCategory"],
        instructionText: str(f["Instruction Text"]),
        examples: str(f["Examples"]),
        priority: str(f["Priority"]) as BrandInstruction["priority"],
        appliesTo: arr<string>(f["Applies To"]),
        lastUpdated: str(f["Last Updated"]),
        updatedBy: str(f["Updated By"]),
      };
    })
    .filter((instr) => {
      if (!platform) return true;
      return (
        instr.appliesTo.includes("All platforms") ||
        instr.appliesTo.includes(platform)
      );
    });
}

// ─── Table 6: KPI Definitions ─────────────────────────────────────────────────

export async function getKpiDefinitions(
  platform?: Platform | "Global"
): Promise<KpiDefinition[]> {
  const records = await base(TABLE_NAMES.KPI_DEFINITIONS).select().all();

  return records
    .map((r) => {
      const f = r.fields;
      return {
        id: r.id,
        kpiName: str(f["KPI Name"]),
        platform: str(f["Platform"]) as KpiDefinition["platform"],
        metricType: str(f["Metric Type"]) as KpiDefinition["metricType"],
        targetValue: str(f["Target Value"]),
        measurementMethod: str(f["Measurement Method"]),
        successThreshold: str(f["Success Threshold"]),
        trackingFrequency: str(
          f["Tracking Frequency"]
        ) as KpiDefinition["trackingFrequency"],
        responsibleParty: str(f["Responsible Party"]),
        notes: str(f["Notes"]),
      };
    })
    .filter((kpi) => {
      if (!platform) return true;
      return kpi.platform === "Global" || kpi.platform === platform;
    });
}

// ─── Table 7: Content Brief Output ───────────────────────────────────────────

export async function createContentBrief(
  brief: Omit<ContentBrief, "id" | "briefId">
): Promise<ContentBrief> {
  const record = await base(TABLE_NAMES.CONTENT_BRIEF_OUTPUT).create({
    "Event / Campaign": brief.eventOrCampaignId
      ? [brief.eventOrCampaignId]
      : undefined,
    "Target Date": brief.targetDate,
    Platform: brief.platform,
    "Content Type": brief.contentType,
    "Full Copy Draft": brief.fullCopyDraft,
    "Copy Tone Notes": brief.copyToneNotes,
    CTA: brief.cta,
    "CTA Placement": brief.ctaPlacement,
    "Platform Specs": brief.platformSpecs,
    "Image Requirements": brief.imageRequirements,
    "Hashtag Strategy": brief.hashtagStrategy,
    Status: brief.status,
    "Created By": brief.createdBy ?? "AI Generator",
    "Created Date": new Date().toISOString(),
  });

  return {
    id: record.id,
    briefId: num(record.fields["Brief ID"]),
    ...brief,
  };
}

export async function updateBriefStatus(
  briefId: string,
  status: ContentBrief["status"],
  extras?: Partial<ContentBrief>
): Promise<void> {
  const fields: Record<string, unknown> = { Status: status };
  if (extras?.postedDate) fields["Posted Date"] = extras.postedDate;
  if (extras?.postedBy) fields["Posted By"] = extras.postedBy;
  if (extras?.notesChanges) fields["Notes / Changes"] = extras.notesChanges;
  if (extras?.imagesSelectedIds)
    fields["Images Selected"] = extras.imagesSelectedIds;

  await base(TABLE_NAMES.CONTENT_BRIEF_OUTPUT).update(briefId, fields);
}

export async function getBriefsByStatus(
  status: ContentBrief["status"]
): Promise<ContentBrief[]> {
  const records = await base(TABLE_NAMES.CONTENT_BRIEF_OUTPUT)
    .select({ filterByFormula: `{Status} = '${status}'` })
    .all();

  return records.map((r) => {
    const f = r.fields;
    return {
      id: r.id,
      briefId: num(f["Brief ID"]),
      eventOrCampaignId: arr<string>(f["Event / Campaign"])[0] ?? "",
      targetDate: str(f["Target Date"]),
      platform: str(f["Platform"]) as Platform,
      contentType: str(f["Content Type"]) as ContentBrief["contentType"],
      fullCopyDraft: str(f["Full Copy Draft"]),
      copyToneNotes: str(f["Copy Tone Notes"]),
      cta: str(f["CTA"]),
      ctaPlacement: str(f["CTA Placement"]),
      platformSpecs: str(f["Platform Specs"]),
      imageRequirements: str(f["Image Requirements"]),
      hashtagStrategy: str(f["Hashtag Strategy"]),
      kpiTargetIds: arr<string>(f["KPI Targets"]),
      status: str(f["Status"]) as ContentBrief["status"],
      imagesSelectedIds: arr<string>(f["Images Selected"]),
      postedDate: str(f["Posted Date"]),
      postedBy: str(f["Posted By"]),
      notesChanges: str(f["Notes / Changes"]),
      createdBy: str(f["Created By"]),
      createdDate: str(f["Created Date"]),
      lastUpdated: str(f["Last Updated"]),
    };
  });
}

// ─── Table 9: KPI Tracker ─────────────────────────────────────────────────────

export async function createKpiTrackerEntry(
  entry: Omit<KpiTracker, "id" | "trackingId">
): Promise<KpiTracker> {
  const record = await base(TABLE_NAMES.KPI_TRACKER).create({
    "Brief ID": [entry.briefId],
    Platform: entry.platform,
    "Post Date": entry.postDate,
    "Target KPIs": entry.targetKpis,
  });

  return {
    id: record.id,
    trackingId: num(record.fields["Tracking ID"]),
    ...entry,
  };
}

export async function updateKpiActuals(
  trackingId: string,
  actuals: Partial<
    Pick<
      KpiTracker,
      | "actualKpis"
      | "reach"
      | "engagement"
      | "engagementRate"
      | "clicks"
      | "registrations"
      | "emailSignups"
      | "websiteVisits"
      | "conversions"
      | "conversionValue"
      | "performanceNotes"
    >
  >
): Promise<void> {
  const fields: Record<string, unknown> = {};
  if (actuals.actualKpis) fields["Actual KPIs"] = actuals.actualKpis;
  if (actuals.reach !== undefined) fields["Reach"] = actuals.reach;
  if (actuals.engagement !== undefined) fields["Engagement"] = actuals.engagement;
  if (actuals.engagementRate !== undefined)
    fields["Engagement Rate"] = actuals.engagementRate;
  if (actuals.clicks !== undefined) fields["Clicks"] = actuals.clicks;
  if (actuals.registrations !== undefined)
    fields["Registrations"] = actuals.registrations;
  if (actuals.emailSignups !== undefined)
    fields["Email Signups"] = actuals.emailSignups;
  if (actuals.websiteVisits !== undefined)
    fields["Website Visits"] = actuals.websiteVisits;
  if (actuals.conversions !== undefined) fields["Conversions"] = actuals.conversions;
  if (actuals.conversionValue !== undefined)
    fields["Conversion Value"] = actuals.conversionValue;
  if (actuals.performanceNotes) fields["Performance Notes"] = actuals.performanceNotes;
  fields["Date Tracked"] = new Date().toISOString();

  await base(TABLE_NAMES.KPI_TRACKER).update(trackingId, fields);
}
