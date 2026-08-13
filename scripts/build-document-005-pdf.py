from pathlib import Path
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
DOC = ROOT / "documents" / "005-when-time-becomes-relational"
pdfmetrics.registerFont(TTFont("Academy", r"C:\Windows\Fonts\arial.ttf"))
pdfmetrics.registerFont(TTFont("AcademyBold", r"C:\Windows\Fonts\arialbd.ttf"))

def build(language):
    source = DOC / f"METACADEMY_DOCUMENT_005_WHEN_TIME_BECOMES_RELATIONAL_{language}_v1.0.md"
    target = DOC / f"METACADEMY_DOCUMENT_005_WHEN_TIME_BECOMES_RELATIONAL_{language}_v1.0.pdf"
    body = source.read_text(encoding="utf-8").splitlines()
    normal = ParagraphStyle("normal", fontName="Academy", fontSize=9.4, leading=13, spaceAfter=6, alignment=TA_LEFT)
    head = ParagraphStyle("head", parent=normal, fontName="AcademyBold", fontSize=15, leading=19, spaceBefore=9, spaceAfter=8)
    sub = ParagraphStyle("sub", parent=normal, fontName="AcademyBold", fontSize=11.5, leading=15, spaceBefore=7, spaceAfter=5)
    story = []
    for line in body:
        if not line.strip():
            story.append(Spacer(1, 2)); continue
        if line.startswith("# "):
            story.append(Paragraph(escape(line[2:]), head)); continue
        if line.startswith("## ") or line.startswith("### "):
            story.append(Paragraph(escape(line.lstrip('#').strip()), sub)); continue
        if line.startswith("- "):
            story.append(Paragraph("• " + escape(line[2:]), normal)); continue
        story.append(Paragraph(escape(line).replace("  ", "<br/>"), normal))
    SimpleDocTemplate(str(target), pagesize=A4, leftMargin=18*mm, rightMargin=18*mm, topMargin=16*mm, bottomMargin=16*mm, title=f"MET[Ȧ]CADEMY Document 005 {language}").build(story)

for language in ("EN", "UA"):
    build(language)
