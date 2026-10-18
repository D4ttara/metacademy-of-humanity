import { google } from "googleapis";
import { createHash } from "node:crypto";

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
  "Objekt / Titel", "Adresse / Ort", "Portal / Anbieter", "Kaltmiete €", "Zimmer",
  "ÖPNV / Lage", "Status", "Letztes Update", "Nächste Aktion", "Dokumente", "Kontakt",
  "Notizen", "Score", "m²", "ID"
] as const;

function derivedId(title: string, address: string) {
  return `sheet:${createHash("sha1").update(`${title}|${address}`).digest("hex").slice(0, 12)}`;
}

function normalizeStatus(value: string): Status {
  const t = value.toLowerCase();
  if (/abgelehnt|zurückgezogen|geschlossen/.test(t)) return t.includes("abgelehnt") ? "rejected" : "closed";
  if (/mietangebot|zusage|vertrag/.test(t)) return "offer";
  if (/besichtigung/.test(t)) return "viewing";
  if (/unterlagen|zusatzangaben|dokument/.test(t)) return "documents";
  if (/warten|aktiv|prüfung|eingereicht/.test(t)) return "applied";
  return "new";
}

function humanStatus(status: Status) {
  return ({
    new: "Neu",
    applied: "Warten auf Prüfung",
    documents: "Aktiv – Unterlagen angefordert",
    viewing: "Besichtigung",
    offer: "Mietangebot / Zusage",
    rejected: "Abgelehnt",
    closed: "Geschlossen",
  } as const)[status];
}

function rowToApartment(row: string[]): Apartment | null {
  const title = row[0] || "";
  if (!title) return null;
  const address = row[1] || "";
  return {
    id: row[14] || derivedId(title, address),
    title,
    address,
    portal: row[2] || undefined,
    kaltmiete: row[3] ? Number(String(row[3]).replace(",", ".")) : undefined,
    rooms: row[4] ? Number(String(row[4]).replace(",", ".")) : undefined,
    status: normalizeStatus(row[6] || ""),
    updatedAt: row[7] || new Date(0).toISOString(),
    nextAction: row[8] || undefined,
    note: row[11] || undefined,
    score: row[12] ? Number(row[12]) : undefined,
    sqm: row[13] ? Number(String(row[13]).replace(",", ".")) : undefined,
  };
}

function apartmentToRow(a: Apartment, existing?: string[]) {
  return [
    a.title,
    a.address,
    a.portal || existing?.[2] || "",
    a.kaltmiete ?? existing?.[3] ?? "",
    a.rooms ?? existing?.[4] ?? "",
    existing?.[5] || "zu prüfen",
    humanStatus(a.status),
    a.updatedAt.slice(0, 10),
    a.nextAction || "",
    existing?.[9] || "offen",
    existing?.[10] || "",
    a.note || existing?.[11] || "",
    a.score ?? existing?.[12] ?? "",
    a.sqm ?? existing?.[13] ?? "",
    a.id,
  ];
}

export async function listApartmentsFromSheet(): Promise<Apartment[]> {
  const auth = oauthClient();
  if (!auth || !SPREADSHEET_ID) return [];
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:O`,
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
    range: `${SHEET_NAME}!A:O`,
  });
  const rows = (current.data.values || []) as string[][];
  if (rows.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:O1`,
      valueInputOption: "RAW",
      requestBody: { values: [[...headers]] },
    });
  }

  let index = rows.findIndex((row, i) => i > 0 && row[14] === apartment.id);
  if (index < 0) {
    index = rows.findIndex((row, i) => i > 0 && derivedId(row[0] || "", row[1] || "") === apartment.id);
  }

  if (index >= 1) {
    const rowNumber = index + 1;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${rowNumber}:O${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [apartmentToRow(apartment, rows[index])] },
    });
  } else {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:O`,
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
