import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WIDGET_URI = "ui://wohnung-hunter/dashboard.html";
const PORT = Number(process.env.PORT || 8787);

type Status = "new" | "applied" | "documents" | "viewing" | "offer" | "rejected" | "closed";
type Apartment = {
  id: string;
  title: string;
  address: string;
  portal?: string;
  kaltmiete?: number;
  rooms?: number;
  sqm?: number;
  score?: number;
  status: Status;
  nextAction?: string;
  note?: string;
  updatedAt: string;
};

// v0 demo store. Production adapter will replace this with Google Sheets / Supabase.
const apartments = new Map<string, Apartment>();

function dashboardPayload() {
  return {
    apartments: [...apartments.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    counts: [...apartments.values()].reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {}),
    generatedAt: new Date().toISOString(),
  };
}

const server = new McpServer({ name: "wohnung-hunter", version: "0.1.0" });

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
  structuredContent: dashboardPayload(),
}));

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
  apartments.set(row.id, row);
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
  const existing = apartments.get(id);
  if (!existing) {
    return { content: [{ type: "text" as const, text: `Apartment ${id} was not found.` }], isError: true };
  }
  const updated = { ...existing, status, nextAction, note: note ?? existing.note, updatedAt: new Date().toISOString() };
  apartments.set(id, updated);
  return {
    content: [{ type: "text" as const, text: `Updated ${updated.title}: ${status}.` }],
    structuredContent: { apartment: updated },
  };
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.get("/health", (_req, res) => res.json({ ok: true, app: "wohnung-hunter" }));
app.listen(PORT, () => console.log(`Wohnung Hunter MCP listening on :${PORT}/mcp`));
