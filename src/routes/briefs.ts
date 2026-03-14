import { Router, Request, Response } from "express";
import { generateBriefs } from "../claude/brief-generator";
import { getBriefsByStatus, updateBriefStatus } from "../airtable/tables";
import type { GenerateBriefsRequest, Platform } from "../types";

export const briefsRouter = Router();

// POST /api/briefs/generate
// Body: { eventId: string, platforms?: Platform[] }
briefsRouter.post(
  "/generate",
  async (req: Request, res: Response): Promise<void> => {
    const { eventId, platforms } = req.body as {
      eventId?: string;
      platforms?: Platform[];
    };

    if (!eventId || typeof eventId !== "string") {
      res.status(400).json({ error: "eventId is required" });
      return;
    }

    const request: GenerateBriefsRequest = { eventId, platforms };

    try {
      const result = await generateBriefs(request);
      res.status(201).json(result);
    } catch (err) {
      console.error("[POST /api/briefs/generate]", err);
      res.status(500).json({
        error: "Brief generation failed",
        details: String(err),
      });
    }
  }
);

// GET /api/briefs?status=Pending
briefsRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  const status = (req.query.status as string) ?? "Pending";
  const validStatuses = [
    "Pending",
    "Images Selected",
    "Posted",
    "KPIs Tracked",
  ];
  if (!validStatuses.includes(status)) {
    res.status(400).json({
      error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
    });
    return;
  }

  try {
    const briefs = await getBriefsByStatus(
      status as import("../types").ContentBrief["status"]
    );
    res.json({ briefs, count: briefs.length });
  } catch (err) {
    console.error("[GET /api/briefs]", err);
    res.status(500).json({ error: "Failed to fetch briefs", details: String(err) });
  }
});

// PATCH /api/briefs/:id/status
// Body: { status: BriefStatus, postedDate?, postedBy?, notesChanges? }
briefsRouter.patch(
  "/:id/status",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status, postedDate, postedBy, notesChanges } = req.body as {
      status?: string;
      postedDate?: string;
      postedBy?: string;
      notesChanges?: string;
    };

    if (!status) {
      res.status(400).json({ error: "status is required" });
      return;
    }

    try {
      await updateBriefStatus(
        id,
        status as import("../types").ContentBrief["status"],
        { postedDate, postedBy, notesChanges }
      );
      res.json({ success: true, id, status });
    } catch (err) {
      console.error("[PATCH /api/briefs/:id/status]", err);
      res.status(500).json({
        error: "Failed to update brief status",
        details: String(err),
      });
    }
  }
);
