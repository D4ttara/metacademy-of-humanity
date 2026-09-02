import type { Apartment, GmailRentalUpdate, Status } from "./google.js";

function textOf(m: GmailRentalUpdate) {
  return `${m.subject}\n${m.snippet}\n${m.bodyText}`.replace(/\s+/g, " ").trim();
}

function statusFromText(text: string): { status: Status; nextAction?: string } {
  const t = text.toLowerCase();
  if (/anderweitig vergeben|leider.*absage|nicht berücksichtigen|nicht in die engere auswahl|abgelehnt|absage/.test(t)) {
    return { status: "rejected", nextAction: "Keine Aktion" };
  }
  if (/mietangebot|mietvertrag|zusage|wir freuen uns.*vermieten|angebot zur anmietung/.test(t)) {
    return { status: "offer", nextAction: "Mietangebot prüfen und Jobcenter-Zusicherung klären" };
  }
  if (/besichtigungstermin|besichtigung|termin vereinbaren|einladen.*besichtigung/.test(t)) {
    return { status: "viewing", nextAction: "Besichtigungstermin bestätigen" };
  }
  if (/selbstauskunft|schufa|einkommensnachweis|gehaltsnachweis|unterlagen|dokumente|anfrage abschließen|fragebogen/.test(t)) {
    return { status: "documents", nextAction: "Geforderte Angaben/Dokumente vervollständigen" };
  }
  if (/bewerbungseingang|anfrage erhalten|vielen dank für ihre anfrage|wird geprüft|prüfung ihrer anfrage/.test(t)) {
    return { status: "applied", nextAction: "Auf Antwort warten" };
  }
  return { status: "new", nextAction: "Nachricht prüfen" };
}

function portalFromText(text: string, from: string) {
  const all = `${text} ${from}`.toLowerCase();
  if (all.includes("immobilienscout") || all.includes("immoscout")) return "ImmoScout24";
  if (all.includes("immowelt")) return "Immowelt";
  if (all.includes("immomio")) return "Immomio";
  if (all.includes("dawonia")) return "Dawonia";
  if (all.includes("everreal")) return "Everreal";
  return "E-Mail";
}

function euro(text: string) {
  const m = text.match(/(?:kaltmiete|nettokaltmiete|miete)\D{0,18}(\d{3,4}(?:[.,]\d{1,2})?)\s*€/i)
    || text.match(/(\d{3,4}(?:[.,]\d{1,2})?)\s*€\s*(?:kaltmiete|nettokaltmiete)/i);
  return m ? Number(m[1].replace(".", "").replace(",", ".")) : undefined;
}

function sqm(text: string) {
  const m = text.match(/(\d{2,3}(?:[.,]\d+)?)\s*m(?:²|2)/i);
  return m ? Number(m[1].replace(",", ".")) : undefined;
}

function rooms(text: string) {
  const m = text.match(/(\d(?:[.,]\d)?)\s*[- ]?zimmer/i);
  return m ? Number(m[1].replace(",", ".")) : undefined;
}

function address(text: string) {
  const street = text.match(/\b([A-ZÄÖÜ][A-Za-zÄÖÜäöüß.-]+(?:straße|str\.|weg|allee|ring|platz|gasse|straße)\s+\d+[a-zA-Z]?)\b/);
  const city = text.match(/\b(80\d{3}|81\d{3}|82\d{3}|85\d{3})\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß -]+)/);
  if (street && city) return `${street[1]}, ${city[1]} ${city[2].trim()}`;
  if (street) return street[1];
  if (city) return `${city[1]} ${city[2].trim()}`;
  return "Adresse aus E-Mail prüfen";
}

function titleFromMessage(m: GmailRentalUpdate) {
  return m.subject
    .replace(/^Neue Nachricht:\s*/i, "")
    .replace(/^Vielen Dank für (?:Ihre|deine) Anfrage[: ]*/i, "")
    .replace(/^Bewerbungseingang erfolgreich[: ]*/i, "")
    .trim() || "Wohnungsanfrage";
}

export function rentalEmailToApartment(m: GmailRentalUpdate): Apartment {
  const text = textOf(m);
  const detected = statusFromText(text);
  return {
    id: `gmail:${m.messageId}`,
    title: titleFromMessage(m),
    address: address(text),
    portal: portalFromText(text, m.from),
    kaltmiete: euro(text),
    rooms: rooms(text),
    sqm: sqm(text),
    status: detected.status,
    nextAction: detected.nextAction,
    note: `Von: ${m.from} | ${m.snippet}`.slice(0, 700),
    updatedAt: m.receivedAt,
  };
}
