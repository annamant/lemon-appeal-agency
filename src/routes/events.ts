import { Router, Request, Response } from "express";
import { getPendingEvents, getEvent } from "../airtable/tables";

export const eventsRouter = Router();

// GET /api/events/pending
eventsRouter.get(
  "/pending",
  async (_req: Request, res: Response): Promise<void> => {
    try {
      const events = await getPendingEvents();
      res.json({ events, count: events.length });
    } catch (err) {
      console.error("[GET /api/events/pending]", err);
      res
        .status(500)
        .json({ error: "Failed to fetch events", details: String(err) });
    }
  }
);

// GET /api/events/:id
eventsRouter.get(
  "/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const event = await getEvent(id);
      res.json(event);
    } catch (err) {
      console.error("[GET /api/events/:id]", err);
      res
        .status(500)
        .json({ error: "Failed to fetch event", details: String(err) });
    }
  }
);
