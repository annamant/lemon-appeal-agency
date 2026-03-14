/**
 * Lemon Appeal — AI Content Calendar API Server
 *
 * Endpoints:
 *   POST   /api/briefs/generate        Generate AI briefs for an event
 *   GET    /api/briefs?status=Pending  List briefs by status
 *   PATCH  /api/briefs/:id/status      Update brief status (agency workflow)
 *   GET    /api/events/pending         List events needing briefs
 *   GET    /api/events/:id             Get a specific event
 *   PATCH  /api/kpis/:id/actuals       Input actual KPIs post-publish (agency)
 *   GET    /health                     Health check
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { briefsRouter } from "./routes/briefs";
import { eventsRouter } from "./routes/events";
import { kpisRouter } from "./routes/kpis";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT ?? "3000", 10);

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/api/briefs", briefsRouter);
app.use("/api/events", eventsRouter);
app.use("/api/kpis", kpisRouter);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Lemon Appeal Content Calendar API",
    timestamp: new Date().toISOString(),
  });
});

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║     🍋  Lemon Appeal Content Calendar API  🍋            ║
╠══════════════════════════════════════════════════════════╣
║  Server running on http://localhost:${PORT}                ║
║                                                          ║
║  Quick start:                                            ║
║  POST /api/briefs/generate  { "eventId": "<id>" }        ║
║  GET  /api/events/pending                                ║
║  GET  /api/briefs?status=Pending                         ║
╚══════════════════════════════════════════════════════════╝
`);
});

export default app;
