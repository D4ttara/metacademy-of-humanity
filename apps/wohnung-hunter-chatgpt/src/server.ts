import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import {
  type Apartment,
  type Status,
  fetchRentalEmails,
  googleConfigured,
  listApartmentsFromSheet,
  upsertApartmentToSheet,
} from "./google.js";
import { rentalEmailToApartment } from "./rentalParser.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WIDGET_URI = "ui://wohnung-hunter/dashboard.html";
const PORT = Number(process.env.PORT || 8787);

const fallbackApartments = new Map<string, Apartment>();
let lastGmailSyncEpoch = Math.floor(Date.now() / 1000) - 3 * 24 * 3600;

async function listApartments() {
  if (googleConfigured()) {
    try {
      return await listApartmentsFromSheet();
    } catch (error) {
      console.error("Sheets read failed; using fallback store", error);
    }
  }
  return [...fallbackApartments.values()];
}

async function saveApartment(apartment: Apartment) {
  if (googleConfigured()) {
    try {
      await upsertApartmentToSheet(apartment);
      return;
    } catch (error) {
      console.error("Sheets write failed; using fallback store", error);
    }
  }
  fallbackApartments.set(apartment.id, apartment);
}

async function dashboardPayload() {
  const apartments = (await listApartments()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return {
    apartments,
    counts: apartments.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {}),
    storage: googleConfigured() ? "google-sheets" : "memory",
    generatedAt: new Date().toISOString(),
  };
}

async function syncGmail() {
  if (!googleConfigured()) {
    return { synced: 0, actionable: 0, configured: false, updates: [] as Apartment[] };
  }
  const emails = await fetchRentalEmails(lastGmailSyncEpoch);
  const updates: Apartment[] = [];
  for (const email of emails) {
    const apartment = rentalEmailToApartment(email);
    await saveApartment(apartment);
    updates.push(apartment);
  }
  if (emails.length) {
    lastGmailSyncEpoch = Math.floor(new Date(emails[emails.length - 1].receivedAt).getTime() / 1000) + 1;
  }
  return {
    synced: updates.length,
    actionable: updates.filter((u) => ["documents", "viewing", "offer"].includes(u.status)).length,
    configured: true,
    updates,
  };
}

const server = new McpServer({ name: "wohnung-hunter", version: "0.2.0" });

registerAppResource(
  server,
  "Wohnung Hunter Dashboard",
  WIDGET_URI,
  { mimeType: RESOURCE_MIME_TYPE },
  async () => ({
    contents: [{
      uri: WIDGET_URI,
      mimeType: RESOURCE_MIME_TYPE,
      text: fs.readFileSync(path.join(ROOT, "assets", "dashboard.html"), "utf8"),
      _meta: {
        ui: {
          prefersBorder: true,
          csp: { connectDomains: [], resourceDomains: [] },
        },
        "openai/widgetDescription": "Dashboard for apartment applications, statuses and next actions.",
      },
    }],
  }),
);

registerAppTool(server, "wohnung_dashboard", {
  title: "Wohnung Hunter dashboard",
  description: "Use this when the user wants to see current apartment applications, scores, statuses, or next actions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
  _meta: { ui: { resourceUri: WIDGET_URI } },
}, async () => ({
  content: [{ type: "text" as const, text: "Wohnung Hunter dashboard loaded." }],
  structuredContent: await dashboardPayload(),
}));

registerAppTool(server, "wohnung_sync_gmail", {
  title: "Sync rental Gmail",
  description: "Use this when the user wants Wohnung Hunter to scan recent rental-related Gmail messages and store new application updates.",
  inputSchema: {},
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
}, async () => {
  try {
    const result = await syncGmail();
    const text = result.configured
      ? `Gmail sync complete: ${result.synced} rental updates, ${result.actionable} actionable.`
      : "Google OAuth/Sheets is not configured yet.";
    return { content: [{ type: "text" as const, text }], structuredContent: result };
  } catch (error) {
    return {
      content: [{ type: "text" as const, text: `Gmail sync failed: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true,
    };
  }
});

registerAppTool(server, "wohnung_upsert", {
  title: "Add or update apartment",
  description: "Use this when an apartment listing or rental-email update should be stored in Wohnung Hunter.",
  inputSchema: {
    id: z.string().min(1),
    title: z.string().min(1),
    address: z.string().min(1),
    portal: z.string().optional(),
    kaltmiete: z.number().nonnegative().optional(),
    rooms: z.number().positive().optional(),
    sqm: z.number().positive().optional(),
    score: z.number().min(0).max(100).optional(),
    status: z.enum(["new", "applied", "documents", "viewing", "offer", "rejected", "closed"]),
    nextAction: z.string().optional(),
    note: z.string().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
}, async (input) => {
  const row: Apartment = { ...input, updatedAt: new Date().toISOString() };
  await saveApartment(row);
  return {
    content: [{ type: "text" as const, text: `Saved ${row.title}: ${row.status}.` }],
    structuredContent: { apartment: row },
  };
});

registerAppTool(server, "wohnung_set_status", {
  title: "Set apartment status",
  description: "Use this when a landlord or agent reply changes an existing application's status or next action.",
  inputSchema: {
    id: z.string().min(1),
    status: z.enum(["new", "applied", "documents", "viewing", "offer", "rejected", "closed"]),
    nextAction: z.string().optional(),
    note: z.string().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
}, async ({ id, status, nextAction, note }) => {
  const existing = (await listApartments()).find((a) => a.id === id);
  if (!existing) {
    return { content: [{ type: "text" as const, text: `Apartment ${id} was not found.` }], isError: true };
  }
  const updated: Apartment = {
    ...existing,
    status: status as Status,
    nextAction,
    note: note ?? existing.note,
    updatedAt: new Date().toISOString(),
  };
  await saveApartment(updated);
  return {
    content: [{ type: "text" as const, text: `Updated ${updated.title}: ${status}.` }],
    structuredContent: { apartment: updated },
  };
});

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.get("/health", (_req, res) => res.json({
  ok: true,
  app: "wohnung-hunter",
  version: "0.2.0",
  googleConfigured: googleConfigured(),
}));

app.listen(PORT, () => console.log(`Wohnung Hunter MCP listening on :${PORT}/mcp`));
