// Plain-text wellbeing summary used by Export Report and Share.
export function buildReportText(assessment) {
  const score = Math.round(assessment.stressScore);
  const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const lines = [
    'Aura Sanctuary - Wellbeing Summary',
    `Date: ${date}`,
    '',
    `Stress score: ${score}/100`,
    `Stress level: ${assessment.stressLevel}`,
  ];
  if (assessment.completeness === 'partial') {
    lines.push('Note: partial result, scaled to the questions answered.');
  }
  if (assessment.explanation) lines.push('', assessment.explanation);
  if (assessment.categories?.length) {
    lines.push('', 'Behavioural breakdown (higher = more strain):');
    [...assessment.categories]
      .sort((a, b) => b.percent - a.percent)
      .forEach((c) => lines.push(`- ${c.label}: ${c.percent}%`));
  }
  lines.push(
    '',
    'This is a self-reflection score, not a clinical diagnosis. If you are feeling overwhelmed, please reach out to a qualified professional.',
  );
  return lines.join('\n');
}

export function downloadTextFile(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Returns 'shared' | 'copied' | 'cancelled'. Throws if neither path is available.
export async function shareText(title, text) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return 'shared';
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled';
    }
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return 'copied';
  }
  throw new Error('Sharing is not supported in this browser.');
}
