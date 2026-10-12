// Builds the downloadable wellbeing report as a real PDF (A4, vector text).
// jsPDF is imported lazily so it stays out of the main bundle.

const COLORS = {
  ink: [15, 23, 42],
  body: [71, 85, 105],
  muted: [148, 163, 184],
  line: [226, 232, 240],
  panel: [248, 250, 252],
  brand: [99, 102, 241],
  brandDark: [67, 56, 202],
  Low: [16, 185, 129],
  Moderate: [245, 158, 11],
  High: [225, 29, 72],
};

const barColor = (percent) => (percent <= 33 ? COLORS.Low : percent <= 66 ? COLORS.Moderate : COLORS.High);

export async function downloadPdfReport({ assessment, themes = [], sectionLabels = {}, insightContent = {} }) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  const CW = W - M * 2;

  const score = Math.round(assessment.stressScore);
  const level = assessment.stressLevel;
  const levelColor = COLORS[level] ?? COLORS.brand;
  const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  const fill = (c) => doc.setFillColor(...c);
  const text = (c) => doc.setTextColor(...c);
  const draw = (c) => doc.setDrawColor(...c);

  let y = 0;
  const ensure = (needed) => {
    if (y + needed > H - 60) {
      doc.addPage();
      y = M;
    }
  };

  const heading = (label) => {
    ensure(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    text(COLORS.ink);
    doc.text(label.toUpperCase(), M, y);
    fill(COLORS.brand);
    doc.rect(M, y + 6, 28, 2, 'F');
    y += 26;
  };

  const paragraph = (str, { size = 10, color = COLORS.body, width = CW, x = M, gap = 4 } = {}) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    text(color);
    const lines = doc.splitTextToSize(str, width);
    const lh = size * 1.45;
    ensure(lines.length * lh);
    doc.text(lines, x, y);
    y += lines.length * lh + gap;
  };

  // Header band
  fill(COLORS.brandDark);
  doc.rect(0, 0, W, 96, 'F');
  fill(COLORS.brand);
  doc.rect(W * 0.55, 0, W * 0.45, 96, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  text([255, 255, 255]);
  doc.text('Wellbeing Summary', M, 50);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Aura Sanctuary  |  Personal reflection report', M, 70);
  doc.text(date, W - M, 50, { align: 'right' });
  y = 96 + 34;

  // Score card
  fill(COLORS.panel);
  draw(COLORS.line);
  doc.roundedRect(M, y, CW, 118, 10, 10, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  text(COLORS.muted);
  doc.text('STRESS SCORE', M + 24, y + 28);
  doc.setFontSize(46);
  text(COLORS.ink);
  doc.text(String(score), M + 24, y + 78);
  const scoreWidth = doc.getTextWidth(String(score));
  doc.setFontSize(14);
  text(COLORS.muted);
  doc.text('/ 100', M + 30 + scoreWidth, y + 78);

  // Level pill
  const pillW = 96;
  fill(levelColor);
  doc.roundedRect(M + 24, y + 90, pillW, 18, 9, 9, 'F');
  doc.setFontSize(9);
  text([255, 255, 255]);
  doc.text(`${level.toUpperCase()} LEVEL`, M + 24 + pillW / 2, y + 102, { align: 'center' });

  // Spectrum on the right of the card
  const sx = M + 210;
  const sw = CW - 210 - 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  text(COLORS.muted);
  doc.text('STRESS LEVEL SPECTRUM', sx, y + 28);
  const bands = [COLORS.Low, COLORS.Moderate, COLORS.High];
  bands.forEach((c, i) => {
    fill(c);
    doc.rect(sx + (sw / 3) * i, y + 42, sw / 3, 8, 'F');
  });
  const mx = sx + (sw * Math.min(98, Math.max(2, score))) / 100;
  fill([255, 255, 255]);
  draw(COLORS.ink);
  doc.setLineWidth(2);
  doc.circle(mx, y + 46, 7, 'FD');
  doc.setLineWidth(1);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  text(COLORS.muted);
  doc.text('Low', sx, y + 68);
  doc.text('Moderate', sx + sw / 2, y + 68, { align: 'center' });
  doc.text('High', sx + sw, y + 68, { align: 'right' });
  if (assessment.explanation) {
    doc.setFontSize(9);
    text(COLORS.body);
    doc.text(doc.splitTextToSize(assessment.explanation, sw).slice(0, 3), sx, y + 88);
  }
  y += 118 + 28;

  if (assessment.completeness === 'partial') {
    paragraph(
      `Partial result: based on ${assessment.answeredCount} of ${
        assessment.answeredCount + (assessment.missingQuestions?.length ?? 0)
      } questions, scaled to the questions answered.`,
      { size: 9, color: COLORS.Moderate, gap: 14 },
    );
  }

  // Breakdown
  const categories = [...(assessment.categories ?? [])].sort((a, b) => b.percent - a.percent);
  if (categories.length) {
    heading('Behavioural breakdown');
    paragraph('Reported pressure in each area. Higher means more strain.', { size: 9, color: COLORS.muted, gap: 10 });
    categories.forEach((c) => {
      ensure(30);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      text(COLORS.ink);
      doc.text(c.label, M, y);
      doc.setFont('helvetica', 'bold');
      doc.text(`${c.percent}%`, W - M, y, { align: 'right' });
      fill(COLORS.line);
      doc.roundedRect(M, y + 7, CW, 5, 2.5, 2.5, 'F');
      if (c.percent > 0) {
        fill(barColor(c.percent));
        doc.roundedRect(M, y + 7, Math.max(5, (CW * c.percent) / 100), 5, 2.5, 2.5, 'F');
      }
      y += 30;
    });
    y += 10;
  }

  // Themes
  if (themes.length) {
    heading('Thematic reflections');
    themes.forEach(({ key, tier }) => {
      const content = insightContent[key]?.[tier];
      if (!content) return;
      const tone = tier === 'attention' ? COLORS.Moderate : COLORS.Low;
      const descLines = doc.splitTextToSize(content.desc, CW - 28);
      const sugLines = doc.splitTextToSize(`Suggested: ${content.suggestion}`, CW - 28);
      const boxH = 40 + descLines.length * 14 + sugLines.length * 13 + 8;
      ensure(boxH + 12);
      fill(COLORS.panel);
      draw(COLORS.line);
      doc.roundedRect(M, y, CW, boxH, 8, 8, 'FD');
      fill(tone);
      doc.rect(M, y + 8, 3, boxH - 16, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      text(COLORS.ink);
      doc.text(sectionLabels[key] ?? key, M + 16, y + 22);
      doc.setFontSize(8);
      text(tone);
      doc.text(String(content.badge).toUpperCase(), W - M - 14, y + 22, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      text(COLORS.body);
      doc.text(descLines, M + 16, y + 40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      text(COLORS.brandDark);
      doc.text(sugLines, M + 16, y + 40 + descLines.length * 14 + 4);
      y += boxH + 12;
    });
    y += 6;
  }

  // Disclaimer
  ensure(70);
  paragraph(
    'This is a self-reflection wellbeing score created to support personal insight and mindfulness. It is not a clinical diagnosis. If you are feeling overwhelmed or experiencing acute distress, please reach out to a qualified professional.',
    { size: 8.5, color: COLORS.muted },
  );

  // Footer on every page
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p += 1) {
    doc.setPage(p);
    draw(COLORS.line);
    doc.line(M, H - 40, W - M, H - 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    text(COLORS.muted);
    doc.text('Aura Sanctuary  |  Confidential self-reflection report', M, H - 26);
    doc.text(`Page ${p} of ${pages}`, W - M, H - 26, { align: 'right' });
  }

  const blob = doc.output('blob');
  return { blob, filename: 'wellbeing-report.pdf' };
}

export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
