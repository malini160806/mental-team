import { QUESTION_SPEC, LETTERS, valuesFor } from '../shared/surveySpec.js';
import { assess, extractColumns, CATEGORIES } from '../shared/stressModel.js';

// Accepts either the client's answer array ([{ id, letter }]) or a plain
// { [questionId]: letter } map. Returns { answers, errors }.
export function validateAnswers(input) {
  const map = Array.isArray(input)
    ? Object.fromEntries(input.map((a) => [a?.id, a?.letter]))
    : input ?? {};

  const answers = {};
  const errors = [];
  QUESTION_SPEC.forEach((q) => {
    const letter = typeof map[q.id] === 'string' ? map[q.id].trim().toUpperCase() : undefined;
    if (!letter) errors.push(`Q${q.id} (${q.key}) is missing`);
    else if (!LETTERS.includes(letter)) errors.push(`Q${q.id} (${q.key}) has invalid option "${map[q.id]}"`);
    else answers[q.id] = letter;
  });
  return { answers, errors };
}

// Builds the stored document from validated answers. Every value is derived
// server-side from the letter, never taken from the client payload.
export function buildResponseDoc(answers, { sessionId, source = 'app', labels = {} }) {
  const result = assess(answers);
  return {
    sessionId,
    source,
    answers: QUESTION_SPEC.map((q) => ({
      id: q.id,
      key: q.key,
      section: q.section,
      letter: answers[q.id],
      label: labels[q.id],
      values: valuesFor(q.id, answers[q.id]),
    })),
    columns: extractColumns(answers),
    score: result.stressScore === null ? undefined : Math.round(100 - result.stressScore),
    lifeStage: result.lifeStage,
    features: result.features,
    adjustedFeatures: result.adjustedFeatures,
    categories: result.categories.map(({ key, label, percent }) => ({ key, label, percent })),
    completeness: result.completeness,
    missingQuestions: result.missingQuestions,
    rawStressScore: result.rawStressScore,
    maximumScore: result.maximumScore,
    stressScore: result.stressScore,
    stressLevel: result.stressLevel,
    selfReportedStrain: result.selfReportedStrain,
    modelVersion: result.modelVersion,
  };
}

// Flat ML/EDA row, recomputed from the stored letters with the current model
// so direction/threshold changes apply to historical data too.
export function datasetRow(doc) {
  const letters = Object.fromEntries((doc.answers ?? []).map((a) => [a.id, a.letter]));
  const result = assess(letters);
  const row = {
    respondent_id: String(doc._id),
    source: doc.source ?? 'app',
    created_at: doc.createdAt?.toISOString?.() ?? '',
    life_stage: result.lifeStage ?? '',
    ...Object.fromEntries(Object.entries(result.features).map(([k, v]) => [k.toLowerCase(), v])),
  };
  CATEGORIES.forEach((c) => {
    row[`cat_${c.key}_pct`] = result.categories.find((r) => r.key === c.key)?.percent ?? '';
  });
  row.self_reported_strain = result.selfReportedStrain ?? '';
  row.completeness = result.completeness;
  row.raw_stress_score = result.rawStressScore;
  row.maximum_score = result.maximumScore;
  row.calculated_stress_score = result.stressScore;
  row.stress_level = result.stressLevel;
  row.model_version = result.modelVersion;
  return row;
}

export function toCsv(rows) {
  const headerSet = new Set();
  rows.forEach((r) => Object.keys(r).forEach((k) => headerSet.add(k)));
  const headers = Array.from(headerSet);
  const escape = (value) => {
    const str = value === undefined || value === null ? '' : String(value);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  return [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
}
