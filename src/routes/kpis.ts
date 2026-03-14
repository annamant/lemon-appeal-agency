import { Router, Request, Response } from "express";
import { updateKpiActuals } from "../airtable/tables";
import type { KpiTracker } from "../types";

export const kpisRouter = Router();

// PATCH /api/kpis/:id/actuals
// Body: actual KPI values input by the agency post-publish
kpisRouter.patch(
  "/:id/actuals",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const actuals = req.body as Partial<
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
    >;

    try {
      await updateKpiActuals(id, actuals);
      res.json({ success: true, id });
    } catch (err) {
      console.error("[PATCH /api/kpis/:id/actuals]", err);
      res.status(500).json({
        error: "Failed to update KPI actuals",
        details: String(err),
      });
    }
  }
);
