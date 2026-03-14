// ─────────────────────────────────────────────────────────────────────────────
// Lemon Appeal Content Calendar — Type Definitions
// Mirrors the 9-table Airtable schema from the system specification.
// ─────────────────────────────────────────────────────────────────────────────

export type Platform =
  | "Instagram"
  | "TikTok"
  | "Facebook"
  | "LinkedIn"
  | "YouTube"
  | "Email";

export type ContentType =
  | "Carousel"
  | "Reel"
  | "Article"
  | "Thread"
  | "Email"
  | "Video";

export type BriefStatus =
  | "Pending"
  | "Images Selected"
  | "Posted"
  | "KPIs Tracked";

export type EventType =
  | "Holiday"
  | "Internal Milestone"
  | "Product Launch"
  | "Community";

export type ContentPriority = "Mandatory" | "High" | "Medium" | "Flexible";

export type EventStatus =
  | "Pending"
  | "Brief Generated"
  | "Posted"
  | "KPIs Tracked";

export type CampaignStatus = "Planning" | "Active" | "Complete";

// ─── Table 1: Brand Master ────────────────────────────────────────────────────
export interface BrandMaster {
  id?: string;
  mission: string;
  values: string;
  positioning: string;
  targetAudience: string;
  toneRules: string;
  wordsToAvoid: string;
  sophiesVoiceNotes: string;
  globalKpiTarget: number;
  emailConversionTarget: number; // %
  engagementTarget: number; // %
  discoverabilityTarget: number; // % — keep under 15%
  lastUpdated?: string;
  updatedBy?: string;
}

// ─── Table 2: Campaign Instruction Sets ──────────────────────────────────────
export interface CampaignInstructionSet {
  id?: string;
  campaignName: string;
  startDate: string;
  endDate: string;
  strategicObjective: string;
  targetAudience: string;
  keyMessages: string;
  contentThemes: string;
  productFocus: string;
  artisanSpotlights?: string[];
  platformStrategy: string;
  campaignKpiTargets: string;
  campaignCopyDirection: string;
  status: CampaignStatus;
  createdBy?: string;
  lastUpdated?: string;
}

// ─── Table 3: Event Calendar ──────────────────────────────────────────────────
export interface EventCalendar {
  id?: string;
  eventDate: string;
  eventName: string;
  eventType: EventType;
  region: "European" | "Global" | "Italy-specific";
  campaignId: string; // linked Campaign
  contentPriority: ContentPriority;
  targetPostingDate: string;
  platforms: Platform[];
  suggestedTheme: string;
  notes?: string;
  status: EventStatus;
  createdBy?: string;
}

// ─── Table 4: Platform Rules ──────────────────────────────────────────────────
export interface PlatformRules {
  id?: string;
  platform: Platform;
  formatType: string;
  maxCharacters: number;
  imageSpecs: string;
  tone: string;
  ctaFramework: string;
  hashtagStrategy: string;
  postingFrequency: string;
  bestPostingTimes: string;
  linkPlacement: string;
  videoLength?: number;
  engagementExpectations: string;
  createdBy?: string;
}

// ─── Table 5: Brand Instructions ──────────────────────────────────────────────
export interface BrandInstruction {
  id?: string;
  instructionCategory:
    | "Voice"
    | "Messaging"
    | "Product"
    | "Positioning"
    | "Constraints";
  instructionText: string;
  examples?: string;
  priority: "Critical" | "High" | "Medium";
  appliesTo: string[]; // platforms or "All"
  lastUpdated?: string;
  updatedBy?: string;
}

// ─── Table 6: KPI Definitions ─────────────────────────────────────────────────
export interface KpiDefinition {
  id?: string;
  kpiName: string;
  platform: Platform | "Global";
  metricType: "Reach" | "Engagement" | "Conversion" | "Registration" | "Revenue";
  targetValue: string;
  measurementMethod: string;
  successThreshold: string;
  trackingFrequency: "Real-time" | "Daily" | "Weekly" | "Monthly";
  responsibleParty: string;
  notes?: string;
}

// ─── Table 7: Content Brief Output ───────────────────────────────────────────
export interface ContentBrief {
  id?: string;
  briefId?: number;
  eventOrCampaignId: string;
  targetDate: string;
  platform: Platform;
  contentType: ContentType;
  fullCopyDraft: string;
  copyToneNotes: string;
  cta: string;
  ctaPlacement: string;
  platformSpecs: string;
  imageRequirements: string;
  hashtagStrategy: string;
  kpiTargetIds?: string[];
  status: BriefStatus;
  imagesSelectedIds?: string[];
  postedDate?: string;
  postedBy?: string;
  notesChanges?: string;
  createdBy?: string;
  createdDate?: string;
  lastUpdated?: string;
}

// ─── Table 8: Asset Repository ────────────────────────────────────────────────
export interface Asset {
  id?: string;
  assetId?: number;
  assetName: string;
  assetType: "Image" | "Video" | "Graphic" | "Animation";
  fileUrl: string;
  source: "Internal Library" | "New Shoot" | "AI-Generated" | "Client Provided";
  tags: string[];
  approved: boolean;
  usedInBriefIds?: string[];
  uploadDate?: string;
  uploadedBy?: string;
  notes?: string;
}

// ─── Table 9: KPI Tracker ─────────────────────────────────────────────────────
export interface KpiTracker {
  id?: string;
  trackingId?: number;
  briefId: string;
  platform: Platform;
  postDate: string;
  targetKpis: string;
  actualKpis?: string;
  reach?: number;
  engagement?: number;
  engagementRate?: number;
  clicks?: number;
  registrations?: number;
  emailSignups?: number;
  websiteVisits?: number;
  conversions?: number;
  conversionValue?: number;
  performanceNotes?: string;
  dateTracked?: string;
  trackedBy?: string;
  lastUpdated?: string;
}

// ─── Brief Generation Context ─────────────────────────────────────────────────
// Aggregated context fed to Claude for brief generation.
export interface BriefGenerationContext {
  brandMaster: BrandMaster;
  campaign: CampaignInstructionSet;
  event: EventCalendar;
  platformRules: PlatformRules;
  brandInstructions: BrandInstruction[];
  kpiDefinitions: KpiDefinition[];
}

// ─── Brief Generation Request/Response ────────────────────────────────────────
export interface GenerateBriefsRequest {
  eventId: string;
  platforms?: Platform[]; // defaults to event.platforms
}

export interface GenerateBriefsResponse {
  eventId: string;
  eventName: string;
  briefs: ContentBrief[];
  generatedAt: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
}
