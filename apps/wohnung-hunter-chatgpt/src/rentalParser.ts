import type { Apartment, GmailRentalUpdate, Status } from "./google.js";

function textOf(m: GmailRentalUpdate) {
  return `${m.subject}\n${m.snippet}\n${m.bodyText}`.replace(/\s+/g, " ").trim();
}

function statusFromText(subject: string, body: string): { status: Status; nextAction?: string } {
  const s = subject.toLowerCase();
  const b = body.toLowerCase();
  const t = `${s} ${b}`;

  if (/anderweitig vergeben|objekt.{0,80}vergeben|leider.{0,120}(absage|nicht berücksichtigen|nicht ausgewählt)|nicht in die engere auswahl|abgelehnt|absage/.test(t)) {
    return { status: "rejected", nextAction: "Keine Aktion" };
  }
  if (/mietangebot|mietvertrag|zusage|angebot zur anmietung|wir freuen uns.{0,120}(ihnen|dir).{0,80}vermieten/.test(t)) {
    return { status: "offer", nextAction: "Mietangebot prüfen und Jobcenter-Zusicherung klären" };
  }

  // Missing-data requests must be checked before viewing. Everreal/Immomio often
  // mention a future viewing while actually asking the applicant to complete data.
  if (/\[aktion erforderlich\]|aktion erforderlich|weitere angaben benötigt|weitere informationen über sie|angaben vervollständigen|anfrage abschließen|formular ausfüllen|selbstauskunft|schufa|einkommensnachweis|gehaltsnachweis|unterlagen (?:hochladen|einreichen|senden)|dokumente (?:hochladen|einreichen|senden)|fragebogen/.test(t)) {
    return { status: "documents", nextAction: "Geforderte Angaben/Dokumente vervollständigen" };
  }

  if (/einladung.{0,80}besichtigung|zur besichtigung eingeladen|wir möchten sie.{0,100}besichtigung|wir laden sie.{0,100}besichtigung|besichtigungstermin (?:am|ist|findet|wurde|bestätigen|auswählen|buchen)|termin zur besichtigung|besichtigung.{0,60}(bestätigen|auswählen|buchen)|termin auswählen/.test(t)) {
    return { status: "viewing", nextAction: "Besichtigungstermin prüfen / bestätigen" };
  }

  if (/kontaktaufnahme wurde erfolgreich verschickt|kontaktanfrage wurde erfolgreich versendet|der anbieter hat deine anfrage erhalten|anbieter hat ihre anfrage erhalten|vielen dank für (?:ihre|deine) anfrage|bewerbungseingang|anfrage erhalten|wird geprüft|prüfung ihrer anfrage|anfrage erfolgreich (?:versendet|übermittelt|eingereicht)/.test(t)) {
    return { status: "applied", nextAction: "Auf Antwort warten" };
  }

  if (/neue nachricht|hat ihnen geantwortet|hat dir geantwortet|nachricht von/.test(`${s} ${b.slice(0, 500)}`)) {
    return { status: "new", nextAction: "Antwort des Anbieters prüfen" };
  }

  return { status: "new", nextAction: "Nachricht prüfen" };
}

function portalFromText(text: string, from: string) {
  const all = `${text} ${from}`.toLowerCase();
  if (all.includes("dawonia") && all.includes("immomio")) return "Dawonia / Immomio";
  if (all.includes("immomio")) return "Immomio";
  if (all.includes("everreal")) return "Everreal";
  if (all.includes("immobilienscout") || all.includes("immoscout")) return "ImmoScout24";
  if (all.includes("immowelt")) return "Immowelt";
  if (all.includes("dawonia")) return "Dawonia";
  return "E-Mail";
}

function listingSection(body: string, portal: string) {
  if (/immoscout/i.test(portal)) return body.split(/Sehr geehrte|Kontaktdaten des Anbieters/i)[0];
  if (/immowelt/i.test(portal)) return body.split(/\nFirma:\s*\n|\nAngaben an den Anbieter:|\nDeine Angaben/i)[0];
  return body.slice(0, 3000);
}

function numberDE(value: string) {
  return Number(value.replace(/\./g, "").replace(",", "."));
}

function euro(body: string, portal: string) {
  const section = listingSection(body, portal);
  let m: RegExpMatchArray | null = null;
  if (/immoscout/i.test(portal)) m = section.match(/Kaltmiete:\s*\n*\s*([\d.]+(?:,\d{1,2})?)\s*€/i);
  if (!m && /immowelt/i.test(portal)) m = section.match(/\n([\d.]+(?:,\d{1,2})?)\s*(?:Euro|€)\s*\n/i) || section.match(/\[([\d.]+(?:,\d{1,2})?)\s*€\]/i);
  if (!m) m = section.match(/(?:kaltmiete|nettokaltmiete)\s*:?\s*\n*\s*([\d.]+(?:,\d{1,2})?)\s*€/i);
  return m ? numberDE(m[1]) : undefined;
}

function sqm(body: string, portal: string) {
  const section = listingSection(body, portal);
  const m = section.match(/Wohnfläche:\s*\n*\s*([\d.,]+)\s*m(?:²|2)/i)
    || section.match(/ca\.\s*([\d.,]+)\s*m(?:²|2)/i)
    || section.match(/([1-9]\d{1,2}(?:[.,]\d+)?)\s*m(?:²|2)/i);
  return m ? numberDE(m[1]) : undefined;
}

function rooms(body: string, portal: string) {
  const section = listingSection(body, portal);
  const m = section.match(/Zimmer:\s*\n*\s*([\d.,]+)/i) || section.match(/([1-9](?:[.,]\d)?)\s*Zimmer\b/i);
  return m ? numberDE(m[1]) : undefined;
}

function address(body: string, title: string, portal: string) {
  const section = listingSection(body, portal);
  let m: RegExpMatchArray | null = null;

  if (/immoscout/i.test(portal)) {
    m = section.match(/Adresse:\s*\n*\s*([^\n,]{2,100})\s*,?\s*\n*\s*(\d{5})\s+([^\n]{2,80})/i);
    if (m) return `${m[1].replace(/,$/, "").trim()}, ${m[2]} ${m[3].trim()}`;
  }

  if (/immowelt/i.test(portal)) {
    m = section.match(/\n(\d{5})\s+([A-ZÄÖÜ][^\n]{1,70})\s*\n+\s*([A-ZÄÖÜ][^\n]{1,100}(?:str\.|straße|strasse|weg|allee|ring|platz|gasse)\s+\d+[a-zA-Z]?)\s*\n/i);
    if (m) return `${m[3].trim()}, ${m[1]} ${m[2].trim()}`;
    m = section.match(/\[([^\]\n]{2,80}),\s*\n*\s*([^\]\n]{2,80})\s*\n*\s*\((\d{5})\)\]/i);
    if (m) return `${m[1].trim()}, ${m[3]} ${m[2].trim()}`;
  }

  if (/everreal/i.test(portal)) {
    m = title.match(/\bin\s+([^,"]+),\s*([^,"]+)$/i);
    if (m) return `${m[2].trim()}, ${m[1].trim()}`;
  }

  const banned = /(Invalidenstraße 65|Ostendstraße 113|Otto-Wagner-Str\. 30)/i;
  const generic = /([A-ZÄÖÜ][A-Za-zÄÖÜäöüß.\- ]{2,55}(?:straße|str\.|strasse|weg|allee|ring|platz|gasse)\s+\d+[a-zA-Z]?)\s*,?\s*\n?\s*(\d{5})\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß.\- ]{2,45})/gi;
  while ((m = generic.exec(section)) !== null) {
    const candidate = `${m[1].trim()}, ${m[2]} ${m[3].trim()}`;
    if (!banned.test(candidate)) return candidate;
  }

  return "Adresse aus E-Mail prüfen";
}

function titleFromMessage(m: GmailRentalUpdate, portal: string) {
  const b = m.bodyText;
  let match: RegExpMatchArray | null = null;

  if (/immoscout/i.test(portal)) {
    match = b.match(/Daten zur Immobilie\s*\n+\s*\[([^\]\n]{5,180})\]\(/i);
    if (match) return match[1].trim();
  }
  if (/immowelt/i.test(portal)) {
    match = b.match(/wird sich mit dir in verbindung setzen:\s*\n+\s*\[([^\]\n]{5,180})\]\(/i);
    if (match) return match[1].trim();
  }
  if (/everreal/i.test(portal)) {
    match = b.match(/Interesse am Objekt\s+"([^"]{5,180})"/i);
    if (match) return match[1].trim();
  }
  if (/immomio|dawonia/i.test(portal)) {
    match = m.subject.match(/Ihre Anfrage zu\s+(.+?)(?:!|$)/i);
    if (match) return match[1].trim();
  }

  return m.subject
    .replace(/^Neue Nachricht:\s*/i, "")
    .replace(/^Vielen Dank für (?:Ihre|deine) Anfrage[: ]*/i, "")
    .replace(/^Bewerbungseingang erfolgreich[: ]*/i, "")
    .trim() || "Wohnungsanfrage";
}

function objectId(text: string, portal: string) {
  let m: RegExpMatchArray | null = null;
  if (/immoscout/i.test(portal)) m = text.match(/Scout-ID\s*:?\s*(\d{7,12})/i) || text.match(/\/expose\/(\d{7,12})/i) || text.match(/\(Objekt\s+(\d{7,12})\)/i);
  if (/immowelt/i.test(portal)) m = text.match(/Online-ID\s*:?\s*\[?([a-z0-9-]{5,20})\]?/i) || text.match(/\/expose\/([a-z0-9-]{5,20})/i);
  return m ? m[1] : undefined;
}

function portalId(portal: string, id?: string) {
  if (!id) return undefined;
  if (/immoscout/i.test(portal)) return `is24:${id}`;
  if (/immowelt/i.test(portal)) return `immowelt:${id}`;
  return undefined;
}

export function rentalEmailToApartment(m: GmailRentalUpdate): Apartment {
  const text = textOf(m);
  const portal = portalFromText(text, m.from);
  const title = titleFromMessage(m, portal);
  const detected = statusFromText(m.subject, m.bodyText);
  const id = objectId(`${m.subject}\n${m.bodyText}`, portal);
  return {
    id: portalId(portal, id) || `gmail:${m.threadId || m.messageId}`,
    title,
    address: address(m.bodyText, title, portal),
    portal,
    kaltmiete: euro(m.bodyText, portal),
    rooms: rooms(m.bodyText, portal),
    sqm: sqm(m.bodyText, portal),
    status: detected.status,
    nextAction: detected.nextAction,
    note: `Von: ${m.from} | ${m.snippet}`.slice(0, 700),
    updatedAt: m.receivedAt,
  };
}
