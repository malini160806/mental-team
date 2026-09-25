// Rule-based stress model (baseline, v1).
//
//   answers (letter per question)
//     → feature scores        (shared/surveySpec.js, each 0–4)
//     → category scores       (risk features as-is, protective features inverted: 4 − x)
//     → weighted stress score (0–100)
//     → stress level          (Low / Moderate / High)
//
// Weights and thresholds are project-defined starting points, not clinically
// validated cut-offs. Refine them after EDA on collected data (or replace this
// with a trained model) and bump MODEL_VERSION so stored scores stay traceable.

import { QUESTION_SPEC, SPEC_BY_ID, LETTERS, valuesFor } from './surveySpec.js';

export const MODEL_VERSION = 'rule-v1';
export const FEATURE_MAX = 4;

// Questions kept out of the stress score:
//  - Q1, Q2: life stage / independence — context for segmentation, not stress.
//  - Q8: which activity gets sacrificed — categorical one-hot, not a severity scale.
//  - Q25: self-reported strain — held out as the ground-truth label so the
//    score (and any future ML model) is never built from the answer it predicts.
export const CONTEXT_QUESTIONS = [1, 2, 8];
export const TARGET_QUESTION = 25;

// `risk`: higher value = more stress. `protective`: higher value = less stress.
// `phrase` is how the area is named in the plain-language explanation.
// Multitasking (Q4) and Self_Reliance (Q19) are recorded but not scored: their
// direction relative to stress is ambiguous — a good candidate for EDA.
export const CATEGORIES = [
  {
    key: 'emotional',
    label: 'Emotional Load',
    phrase: 'emotional exhaustion and overthinking',
    weight: 0.2,
    risk: ['Overthinking', 'Rumination', 'Negative_Anticipation', 'Night_Rumination', 'Emotional_Exhaustion', 'Recovery_Difficulty', 'Overwhelm'],
    protective: ['Thought_Control', 'Mental_Energy', 'Resilience', 'Recovery'],
  },
  {
    key: 'work',
    label: 'Work/Academic Pressure',
    phrase: 'workload and time pressure',
    weight: 0.2,
    risk: ['Perceived_Workload', 'Time_Pressure', 'Overload', 'Procrastination', 'Decision_Difficulty', 'Distractibility'],
    protective: ['Planning', 'Deadline_Management', 'Work_Discipline', 'Prioritization', 'Daily_Planning', 'Routine_Stability', 'Concentration'],
  },
  {
    key: 'sleep',
    label: 'Sleep & Recovery',
    phrase: 'sleep and recovery',
    weight: 0.15,
    risk: ['Morning_Fatigue', 'Night_Screen_Risk', 'Sleep_Delay', 'WorkSleep_Conflict', 'Physical_Fatigue'],
    protective: ['Sleep_Adequacy', 'Sleep_Regularity', 'Physical_Activity', 'Meal_Regularity', 'Energy_Level', 'Recovery_Time', 'Hobby_Engagement', 'Mental_Detachment'],
  },
  {
    key: 'social',
    label: 'Social Support',
    phrase: 'feeling supported by others',
    weight: 0.15,
    risk: ['Loneliness', 'Help_Avoidance'],
    protective: ['Social_Connectedness', 'Perceived_Support', 'Support_Availability', 'Help_Seeking', 'HelpSeeking_Confidence', 'Emotional_Openness'],
  },
  {
    key: 'digital',
    label: 'Digital Behaviour',
    phrase: 'digital behaviour',
    weight: 0.1,
    risk: ['Screen_Exposure', 'Habitual_Checking', 'Digital_Dependency', 'Phone_Distraction', 'Compulsive_Checking', 'Social_Comparison', 'Mood_Impact', 'SelfEsteem_Impact'],
    protective: ['Notification_Control'],
  },
  {
    key: 'future',
    label: 'Future & Financial Concerns',
    phrase: 'future and financial concerns',
    weight: 0.1,
    risk: ['Future_Worry', 'Feeling_Behind', 'Financial_Concern', 'Family_Pressure', 'External_Pressure'],
    protective: ['Career_Clarity', 'Future_Confidence'],
  },
  {
    key: 'self',
    label: 'Self-perception',
    phrase: 'self-perception',
    weight: 0.1,
    risk: ['Comparison_Tendency'],
    protective: ['Self_Confidence', 'Achievement_Satisfaction'],
  },
];

// Inclusive upper bounds on the rounded 0–100 score.
export const LEVELS = [
  { level: 'Low', max: 33 },
  { level: 'Moderate', max: 66 },
  { level: 'High', max: 100 },
];

const SCORED_QUESTIONS = QUESTION_SPEC.filter(
  (q) => !CONTEXT_QUESTIONS.includes(q.id) && q.id !== TARGET_QUESTION,
).map((q) => q.id);

// Accepts { [questionId]: 'A'..'E' } and drops anything invalid.
export function normalizeAnswers(raw) {
  const clean = {};
  Object.entries(raw ?? {}).forEach(([id, letter]) => {
    const qid = Number(id);
    if (SPEC_BY_ID[qid] && LETTERS.includes(letter)) clean[qid] = letter;
  });
  return clean;
}

// Raw column table for the dataset: one entry per answered column. Columns
// that appear in more than one question are suffixed with the later question id.
export function extractColumns(answers) {
  const columns = {};
  QUESTION_SPEC.forEach((q) => {
    const values = answers[q.id] && valuesFor(q.id, answers[q.id]);
    if (!values) return;
    Object.entries(values).forEach(([col, val]) => {
      columns[col in columns ? `${col}__q${q.id}` : col] = val;
    });
  });
  return columns;
}

// Behavioural feature profile from the scored questions. A feature measured by
// several questions (e.g. Time_Pressure in Q7 and Q9) is averaged.
export function extractFeatures(answers) {
  const sums = {};
  SCORED_QUESTIONS.forEach((qid) => {
    const values = answers[qid] && valuesFor(qid, answers[qid]);
    if (!values) return;
    Object.entries(values).forEach(([col, val]) => {
      sums[col] ??= { total: 0, count: 0 };
      sums[col].total += val;
      sums[col].count += 1;
    });
  });
  return Object.fromEntries(
    Object.entries(sums).map(([col, { total, count }]) => [col, round(total / count)]),
  );
}

export function classify(score) {
  const rounded = Math.round(score);
  return LEVELS.find((l) => rounded <= l.max)?.level ?? 'High';
}

export function scoreFeatures(features) {
  const categories = [];

  CATEGORIES.forEach((cat) => {
    const contributions = [
      ...cat.risk.filter((f) => f in features).map((f) => features[f]),
      ...cat.protective.filter((f) => f in features).map((f) => FEATURE_MAX - features[f]),
    ];
    if (!contributions.length) return;
    const avg = contributions.reduce((a, b) => a + b, 0) / contributions.length;
    categories.push({
      key: cat.key,
      label: cat.label,
      phrase: cat.phrase,
      weight: cat.weight,
      score: round(avg),
      percent: Math.round((avg / FEATURE_MAX) * 100),
    });
  });

  // Renormalise over the categories that actually have answers.
  const totalWeight = categories.reduce((a, c) => a + c.weight, 0);
  const weighted = totalWeight
    ? categories.reduce((a, c) => a + c.weight * c.score, 0) / totalWeight
    : 0;
  const stressScore = round((weighted / FEATURE_MAX) * 100);

  return { stressScore, stressLevel: classify(stressScore), categories };
}

// Neutral, non-diagnostic summary of the highest-pressure areas.
export function explain(categories) {
  const elevated = categories
    .filter((c) => c.percent >= 50)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3)
    .map((c) => c.phrase);

  if (!elevated.length) {
    return 'Your responses indicate relatively low reported pressure across the areas measured.';
  }
  const list =
    elevated.length === 1
      ? elevated[0]
      : `${elevated.slice(0, -1).join(', ')} and ${elevated[elevated.length - 1]}`;
  return `Your responses indicate higher reported pressure in areas such as ${list}.`;
}

// Full pipeline. `answers` is { [questionId]: 'A'..'E' }.
export function assess(rawAnswers) {
  const answers = normalizeAnswers(rawAnswers);
  const features = extractFeatures(answers);
  const { stressScore, stressLevel, categories } = scoreFeatures(features);
  const target = answers[TARGET_QUESTION] && valuesFor(TARGET_QUESTION, answers[TARGET_QUESTION]);
  const context = answers[1] && valuesFor(1, answers[1]);

  return {
    modelVersion: MODEL_VERSION,
    answeredCount: Object.keys(answers).length,
    lifeStage: context?.Life_Stage ?? null,
    features,
    categories,
    stressScore,
    stressLevel,
    selfReportedStrain: target?.SelfReported_Strain ?? null,
    explanation: explain(categories),
  };
}

function round(n) {
  return Math.round(n * 100) / 100;
}
