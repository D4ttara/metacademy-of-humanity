from pathlib import Path
import re
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
DOCS = [
    ("007-mor4mer", "METACADEMY_DOCUMENT_007_MOR4MER_MANIFEST_UA_PRE_ALPHA_v0.1"),
    ("008-intellectual-frame", "METACADEMY_DOCUMENT_008_INTELLECTUAL_FRAME_MANIFEST_UA_PRE_ALPHA_v0.1"),
    ("009-connection-is-process", "METACADEMY_DOCUMENT_009_CONNECTION_IS_PROCESS_MANIFEST_UA_PRE_ALPHA_v0.1"),
    ("010-meta-mood-ps", "METACADEMY_DOCUMENT_010_META_MOOD_PS_MANIFEST_UA_PRE_ALPHA_v0.1"),
    ("011-coexis", "METACADEMY_DOCUMENT_011_COEXIS_MANIFEST_UA_PRE_ALPHA_v0.1"),
]

pdfmetrics.registerFont(TTFont("Academy", r"C:\Windows\Fonts\arial.ttf"))
pdfmetrics.registerFont(TTFont("AcademyBold", r"C:\Windows\Fonts\arialbd.ttf"))


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#b9dcef"))
    canvas.setLineWidth(3)
    canvas.line(13 * mm, 13 * mm, 13 * mm, A4[1] - 13 * mm)
    canvas.setFont("Academy", 7.5)
    canvas.setFillColor(colors.HexColor("#66727a"))
    canvas.drawString(20 * mm, 9 * mm, "MET[Ȧ]CADEMY OF HUMANITY · PRE-ALPHA")
    canvas.drawRightString(A4[0] - 17 * mm, 9 * mm, str(doc.page))
    canvas.restoreState()


def inline_markup(text):
    value = escape(text)
    value = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", value)
    value = re.sub(r"`(.+?)`", r'<font color="#66727a">\1</font>', value)
    return value


def build(folder, stem):
    source = ROOT / "documents" / folder / f"{stem}.md"
    target = ROOT / "documents" / folder / f"{stem}.pdf"
    body = source.read_text(encoding="utf-8").splitlines()
    normal = ParagraphStyle("normal", fontName="Academy", fontSize=9.5, leading=13.5, textColor=colors.HexColor("#1f292f"), spaceAfter=6)
    h1 = ParagraphStyle("h1", parent=normal, fontName="AcademyBold", fontSize=20, leading=24, spaceBefore=12, spaceAfter=9)
    h2 = ParagraphStyle("h2", parent=normal, fontName="AcademyBold", fontSize=13, leading=17, textColor=colors.HexColor("#3f4c54"), spaceBefore=9, spaceAfter=6)
    h3 = ParagraphStyle("h3", parent=normal, fontName="Academy", fontSize=11, leading=15, textColor=colors.HexColor("#66727a"), spaceAfter=8)
    meta = ParagraphStyle("meta", parent=normal, fontSize=8, leading=11, textColor=colors.HexColor("#66727a"))
    right = ParagraphStyle("right", parent=meta, alignment=TA_RIGHT)
    story = [Table([[Paragraph("(MoH)", meta), Paragraph("· (A) · {Ȧ} · <b>[Ả]</b> · {Ã} · (Ā) ·", right)]], colWidths=[35 * mm, 135 * mm], style=TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LINEBELOW", (0, 0), (-1, -1), 0.5, colors.HexColor("#d9e6ec")), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)])), Spacer(1, 4)]
    for line in body:
        stripped = line.strip()
        if not stripped:
            story.append(Spacer(1, 2)); continue
        if stripped.startswith("`(MoH)"):
            continue
        if line.startswith("# "):
            story.append(Paragraph(escape(line[2:]), h1)); continue
        if line.startswith("## "):
            story.append(Paragraph(escape(line[3:]), h2)); continue
        if line.startswith("### "):
            story.append(Paragraph(escape(line[4:]), h3)); continue
        if stripped.startswith("**") and stripped.endswith("**"):
            story.append(Paragraph("<b>" + escape(stripped[2:-2]) + "</b>", normal)); continue
        if stripped.startswith("`") and stripped.endswith("`"):
            story.append(Paragraph(escape(stripped[1:-1]), meta)); continue
        story.append(Paragraph(inline_markup(stripped).replace("  ", "<br/>"), normal))
    doc = SimpleDocTemplate(str(target), pagesize=A4, leftMargin=21 * mm, rightMargin=17 * mm, topMargin=15 * mm, bottomMargin=16 * mm, title=stem, author="Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY")
    doc.build(story, onFirstPage=footer, onLaterPages=footer)


for folder, stem in DOCS:
    build(folder, stem)
