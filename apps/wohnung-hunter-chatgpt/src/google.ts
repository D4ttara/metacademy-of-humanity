import { google } from "googleapis";

export type Status = "new" | "applied" | "documents" | "viewing" | "offer" | "rejected" | "closed";
export type Apartment = {
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

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "";
const SHEET_NAME = process.env.GOOGLE_SHEETS_SHEET_NAME || "Wohnungen";

function oauthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;
  const client = new google.auth.OAuth2(clientId, clientSecret);
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

export function googleConfigured() {
  return Boolean(oauthClient() && SPREADSHEET_ID);
}

const headers = [
  "id", "title", "address", "portal", "kaltmiete", "rooms", "sqm", "score",
  "status", "nextAction", "note", "updatedAt"
] as const;

function rowToApartment(row: string[]): Apartment | null {
  if (!row[0]) return null;
  return {
    id: row[0], title: row[1] || row[0], address: row[2] || "",
    portal: row[3] || undefined,
    kaltmiete: row[4] ? Number(row[4]) : undefined,
    rooms: row[5] ? Number(row[5]) : undefined,
    sqm: row[6] ? Number(row[6]) : undefined,
    score: row[7] ? Number(row[7]) : undefined,
    status: (row[8] as Status) || "new",
    nextAction: row[9] || undefined,
    note: row[10] || undefined,
    updatedAt: row[11] || new Date(0).toISOString(),
  };
}

function apartmentToRow(a: Apartment) {
  return [
    a.id, a.title, a.address, a.portal || "", a.kaltmiete ?? "", a.rooms ?? "",
    a.sqm ?? "", a.score ?? "", a.status, a.nextAction || "", a.note || "", a.updatedAt,
  ];
}

export async function listApartmentsFromSheet(): Promise<Apartment[]> {
  const auth = oauthClient();
  if (!auth || !SPREADSHEET_ID) return [];
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:L`,
  });
  const rows = (res.data.values || []) as string[][];
  return rows.slice(1).map(rowToApartment).filter((x): x is Apartment => Boolean(x));
}

export async function upsertApartmentToSheet(apartment: Apartment) {
  const auth = oauthClient();
  if (!auth || !SPREADSHEET_ID) return false;
  const sheets = google.sheets({ version: "v4", auth });
  const current = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:A`,
  });
  const ids = (current.data.values || []).map((r) => String(r[0] || ""));
  if (ids.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:L1`,
      valueInputOption: "RAW",
      requestBody: { values: [[...headers]] },
    });
  }
  const index = ids.indexOf(apartment.id);
  if (index >= 1) {
    const row = index + 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${row}:L${row}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [apartmentToRow(apartment)] },
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:L`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [apartmentToRow(apartment)] },
    });
  }
  return true;
}

export type GmailRentalUpdate = {
  messageId: string;
  threadId?: string;
  from: string;
  subject: string;
  snippet: string;
  bodyText: string;
  receivedAt: string;
};

function decodeBody(data?: string | null) {
  if (!data) return "";
  return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
}

function collectText(part: any): string {
  if (!part) return "";
  const own = part.mimeType === "text/plain" ? decodeBody(part.body?.data) : "";
  const children = Array.isArray(part.parts) ? part.parts.map(collectText).join("\n") : "";
  return [own, children].filter(Boolean).join("\n");
}

export async function fetchRentalEmails(afterEpochSeconds?: number): Promise<GmailRentalUpdate[]> {
  const auth = oauthClient();
  if (!auth) return [];
  const gmail = google.gmail({ version: "v1", auth });
  const baseQuery = process.env.GMAIL_RENTAL_QUERY ||
    '(Wohnung OR Miete OR Besichtigung OR ImmoScout OR Immowelt OR Immomio OR Dawonia OR Everreal OR Vermieter OR Makler) -in:spam -in:trash';
  const q = afterEpochSeconds ? `${baseQuery} after:${afterEpochSeconds}` : `${baseQuery} newer_than:3d`;
  const list = await gmail.users.messages.list({ userId: "me", q, maxResults: 50 });
  const ids = list.data.messages || [];
  const out: GmailRentalUpdate[] = [];
  for (const item of ids) {
    if (!item.id) continue;
    const msg = await gmail.users.messages.get({ userId: "me", id: item.id, format: "full" });
    const h = Object.fromEntries((msg.data.payload?.headers || []).map((x) => [String(x.name || "").toLowerCase(), x.value || ""]));
    out.push({
      messageId: item.id,
      threadId: item.threadId || undefined,
      from: h.from || "",
      subject: h.subject || "",
      snippet: msg.data.snippet || "",
      bodyText: collectText(msg.data.payload),
      receivedAt: msg.data.internalDate ? new Date(Number(msg.data.internalDate)).toISOString() : new Date().toISOString(),
    });
  }
  return out.sort((a, b) => a.receivedAt.localeCompare(b.receivedAt));
}
