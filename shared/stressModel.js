// Rule-based stress model — unweighted (v2).
//
//   answers (letter per question)
//     → feature scores    (shared/surveySpec.js — exact tables from the survey doc)
//     → adjusted scores   (risk: kept as-is · protective: reversed, max − score)
//     → raw stress score  (plain sum of ALL adjusted features, no weights)
//     → stress score      (raw ÷ maximum possible for the included features × 100)
//     → stress level      (Low / Moderate / High, thresholds in LEVELS)
//
// Feature names produced by more than one question (Rumination: Q6+Q20,
// Social_Comparison: Q6+Q12, Time_Pressure: Q7+Q9, Overload: Q4+Q9) are a
// single feature whose value is the mean of its answered sources, so each is
// counted once in the sum and once in the maximum.
//
// Thresholds are project-defined starting points, not clinical cut-offs. Tune
// them after EDA and bump MODEL_VERSION so stored scores stay traceable.

import { QUESTION_SPEC, SPEC_BY_ID, LETTERS, valuesFor, scaleMaxFor } from './surveySpec.js';

export const MODEL_VERSION = 'unweighted-v2';

// Inclusive upper bounds on the score rounded to a whole number.
export const LEVELS = [
  { level: 'Low', max: 33 },
  { level: 'Moderate', max: 66 },
  { level: 'High', max: 100 },
];

// Columns that carry no numeric score. Life_Stage is a text label; its
// content is already encoded in Q1's four numeric columns.
export const NON_SCORED_COLUMNS = ['Life_Stage'];

// Q25 is scored like every other question and also reported on its own as
// `selfReportedStrain`. Note: validating the score against Q25 is now partly
// circular, since Q25 contributes to the score.
export const TARGET_QUESTION = 25;

// Direction of every scored column in the survey doc.
//   risk:       higher = more stress  → adjusted = score
//   protective: higher = less stress  → adjusted = max − score
// The build below throws if a column is missing here or listed but unused.
export const FEATURE_DIRECTIONS = {
  // Q1 Life stage (0–3)
  Academic_Load: ['risk', 'Study demands are a source of load'],
  Work_Load: ['risk', 'Job demands are a source of load'],
  Career_Transition: ['risk', 'Job search / exam preparation adds uncertainty'],
  Extra_Responsibility: ['risk', 'Additional roles add load'],
  // Q2 Independence & responsibility (0–3)
  Financial_Independence: ['protective', 'Own income reduces financial dependence (ambiguous: co-varies with responsibility — review after EDA)'],
  Personal_Responsibility: ['risk', 'More responsibilities to manage'],
  Family_Responsibility: ['risk', 'Supporting family adds load'],
  // Q3 Task starting & deadlines
  Planning: ['protective', 'Planning early is a healthy work habit'],
  Procrastination: ['risk', 'Delay leads to rushing and deadline pressure'],
  Deadline_Management: ['protective', 'Finishing on time indicates control'],
  Work_Discipline: ['protective', 'Discipline indicates control over work'],
  // Q4 Multiple responsibilities
  Prioritization: ['protective', 'Prioritising is an effective coping strategy'],
  Multitasking: ['risk', 'Juggling tasks at once splits attention (non-monotonic: peaks at option C — review after EDA)'],
  Decision_Difficulty: ['risk', 'Not knowing where to start signals overwhelm'],
  Overload: ['risk', 'Directly measures feeling overloaded'],
  // Q5 Concentration
  Concentration: ['protective', 'Sustained focus indicates good mental bandwidth'],
  Distractibility: ['risk', 'Frequent interruption signals strain'],
  // Q6 Response to failure
  Resilience: ['protective', 'Bouncing back from setbacks'],
  Rumination: ['risk', 'Dwelling on setbacks / repetitive negative thinking'],
  Social_Comparison: ['risk', 'Comparing oneself with others lowers confidence'],
  Recovery: ['protective', 'Ability to move forward after a setback'],
  // Q7 Daily organisation
  Daily_Planning: ['protective', 'A planned day indicates control'],
  Routine_Stability: ['protective', 'A stable routine is a healthy structure'],
  Time_Pressure: ['risk', 'Rushing between tasks / not enough time'],
  // Q8 What gets sacrificed (binary 0/1)
  Leisure_Sacrifice: ['risk', 'Giving up leisure under load (option A, nothing sacrificed, scores 0)'],
  Social_Sacrifice: ['risk', 'Giving up family/friend time under load'],
  SelfCare_Sacrifice: ['risk', 'Giving up exercise/meals/self-care under load'],
  Sleep_Sacrifice: ['risk', 'Giving up sleep under load'],
  // Q9 Daily workload
  Perceived_Workload: ['risk', 'Higher perceived workload'],
  // Q10 Phone usage
  Screen_Exposure: ['risk', 'More uncontrolled screen time'],
  Habitual_Checking: ['risk', 'Automatic scrolling/checking'],
  Digital_Dependency: ['risk', 'Difficulty controlling phone use'],
  // Q11 Phone during work/study
  Notification_Control: ['protective', 'Keeping the phone away protects focus'],
  Phone_Distraction: ['risk', 'Phone interrupts work'],
  Compulsive_Checking: ['risk', 'Repeated compulsive checking'],
  // Q12 Social-media effect
  Mood_Impact: ['risk', 'Social media worsens mood'],
  SelfEsteem_Impact: ['risk', 'Social media lowers confidence'],
  // Q13 Sleep pattern
  Sleep_Adequacy: ['protective', 'Enough sleep supports wellbeing'],
  Sleep_Regularity: ['protective', 'Regular sleep supports wellbeing'],
  Morning_Fatigue: ['risk', 'Waking up tired'],
  // Q14 Before-sleep behaviour
  Night_Screen_Risk: ['risk', 'Device use before sleep'],
  Sleep_Delay: ['risk', 'Going to sleep later than intended'],
  WorkSleep_Conflict: ['risk', 'Work/study cutting into sleep'],
  Night_Rumination: ['risk', 'Thoughts keeping one awake'],
  // Q15 Physical lifestyle
  Physical_Activity: ['protective', 'Exercise buffers stress'],
  Meal_Regularity: ['protective', 'Regular meals support wellbeing'],
  Energy_Level: ['protective', 'Good physical energy'],
  Physical_Fatigue: ['risk', 'Frequent exhaustion'],
  // Q16 Recovery
  Recovery_Time: ['protective', 'Time to rest and recharge'],
  Hobby_Engagement: ['protective', 'Hobbies help restore'],
  Mental_Detachment: ['protective', 'Switching off from work'],
  // Q17 Difficult-day support
  Help_Seeking: ['protective', 'Talking to others on hard days'],
  Support_Availability: ['protective', 'Having someone to approach'],
  Emotional_Openness: ['protective', 'Comfort sharing feelings'],
  // Q18 Relationships
  Social_Connectedness: ['protective', 'Feeling connected to others'],
  Perceived_Support: ['protective', 'Feeling supported'],
  Loneliness: ['risk', 'Feeling lonely or disconnected'],
  // Q19 Asking for help
  HelpSeeking_Confidence: ['protective', 'Comfort asking for help'],
  Self_Reliance: ['protective', 'Trying to solve problems oneself is a coping skill (non-monotonic: option E also scores 3 — review after EDA)'],
  Help_Avoidance: ['risk', 'Avoiding help / struggling alone'],
  // Q20 Overthinking
  Overthinking: ['risk', 'Replaying situations at length'],
  Negative_Anticipation: ['risk', 'Imagining negative outcomes'],
  Thought_Control: ['protective', 'Ability to redirect thoughts'],
  // Q21 End-of-day condition
  Emotional_Exhaustion: ['risk', 'Feeling emotionally drained'],
  Mental_Energy: ['protective', 'Mentally energetic at day end'],
  Recovery_Difficulty: ['risk', 'Needing long recovery'],
  Overwhelm: ['risk', 'Feeling completely overwhelmed'],
  // Q22 Self-perception
  Self_Confidence: ['protective', 'Confidence in oneself'],
  Achievement_Satisfaction: ['protective', 'Satisfaction with progress'],
  Comparison_Tendency: ['risk', 'Frequent self-doubt / comparison'],
  // Q23 Future & career
  Career_Clarity: ['protective', 'Clear career direction'],
  Future_Confidence: ['protective', 'Optimism about the future'],
  Future_Worry: ['risk', 'Worry about the future'],
  Feeling_Behind: ['risk', 'Feeling behind or lost'],
  // Q24 Financial/family expectations
  Financial_Concern: ['risk', 'Worry about money'],
  Family_Pressure: ['risk', 'Family expectations'],
  External_Pressure: ['risk', 'Outside expectations influencing decisions'],
  // Q25 Overall balance
  Overall_Balance: ['protective', 'Life feels balanced'],
  SelfReported_Strain: ['risk', 'Self-reported strain'],
};

// Unweighted groupings for the on-screen breakdown and explanation only —
// they do not feed the stress score. One per survey section.
export const CATEGORIES = [
  { key: 'life', label: 'Life & Responsibility', phrase: 'workload and responsibilities' },
  { key: 'focus', label: 'Focus & Mental Bandwidth', phrase: 'concentration' },
  { key: 'digital', label: 'Digital Habits', phrase: 'digital habits' },
  { key: 'sleep', label: 'Sleep & Restoration', phrase: 'sleep' },
  { key: 'body', label: 'Body & Recovery', phrase: 'physical recovery' },
  { key: 'connection', label: 'Emotional Connection', phrase: 'feeling supported by others' },
  { key: 'mind', label: 'Mind & Self-Perception', phrase: 'emotional load and overthinking' },
  { key: 'future', label: 'Future & Balance', phrase: 'future and financial concerns' },
];

// One entry per distinct feature: { name, direction, reason, max, section, sources }.
// A feature takes the section of the first question that produces it.
export const FEATURES = buildFeatures();

function buildFeatures() {
  const byName = new Map();
  QUESTION_SPEC.forEach((q) => {
    q.columns.forEach((col) => {
      if (NON_SCORED_COLUMNS.includes(col)) return;
      const def = FEATURE_DIRECTIONS[col];
      if (!def) throw new Error(`No risk/protective direction defined for ${col} (Q${q.id})`);
      const max = scaleMaxFor(q.id);
      const existing = byName.get(col);
      if (existing) {
        if (existing.max !== max) throw new Error(`${col} has different score ranges across questions`);
        existing.sources.push(q.id);
        return;
      }
      const [direction, reason] = def;
      byName.set(col, { name: col, direction, reason, max, section: q.section, sources: [q.id] });
    });
  });
  const unused = Object.keys(FEATURE_DIRECTIONS).filter((name) => !byName.has(name));
  if (unused.length) throw new Error(`Directions defined for unknown features: ${unused.join(', ')}`);
  return [...byName.values()];
}

// Accepts { [questionId]: 'A'..'E' } and drops anything invalid.
export function normalizeAnswers(raw) {
  const clean = {};
  Object.entries(raw ?? {}).forEach(([id, letter]) => {
    const qid = Number(id);
    if (SPEC_BY_ID[qid] && LETTERS.includes(letter)) clean[qid] = letter;
  });
  return clean;
}

export function missingQuestions(answers) {
  return QUESTION_SPEC.filter((q) => !answers[q.id]).map((q) => q.id);
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

// Original (unadjusted) score of every feature with at least one answered
// source. Unanswered questions are left out — never treated as 0.
export function extractFeatures(answers) {
  const features = {};
  FEATURES.forEach(({ name, sources }) => {
    const values = sources
      .filter((qid) => answers[qid])
      .map((qid) => valuesFor(qid, answers[qid])[name]);
    if (values.length) features[name] = round(values.reduce((a, b) => a + b, 0) / values.length);
  });
  return features;
}

export function adjust(feature, value) {
  return feature.direction === 'protective' ? feature.max - value : value;
}

export function classify(score) {
  if (score === null) return null;
  const rounded = Math.round(score);
  return LEVELS.find((l) => rounded <= l.max)?.level ?? LEVELS[LEVELS.length - 1].level;
}

export function scoreFeatures(features) {
  const adjustedFeatures = {};
  const bySection = {};
  let raw = 0;
  let maximum = 0;

  FEATURES.forEach((f) => {
    if (!(f.name in features)) return;
    const adjusted = adjust(f, features[f.name]);
    adjustedFeatures[f.name] = round(adjusted);
    raw += adjusted;
    maximum += f.max;
    bySection[f.section] ??= { raw: 0, maximum: 0 };
    bySection[f.section].raw += adjusted;
    bySection[f.section].maximum += f.max;
  });

  const stressScore = maximum ? round((raw / maximum) * 100) : null;

  const categories = CATEGORIES.filter((c) => bySection[c.key]).map((c) => ({
    ...c,
    percent: Math.round((bySection[c.key].raw / bySection[c.key].maximum) * 100),
  }));

  return {
    rawStressScore: round(raw),
    maximumScore: maximum,
    stressScore,
    stressLevel: classify(stressScore),
    includedFeatureCount: Object.keys(adjustedFeatures).length,
    adjustedFeatures,
    categories,
  };
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

// Full pipeline. `answers` is { [questionId]: 'A'..'E' }. Partial answers are
// scored against the maximum for the answered features only and flagged.
export function assess(rawAnswers) {
  const answers = normalizeAnswers(rawAnswers);
  const missing = missingQuestions(answers);
  const features = extractFeatures(answers);
  const scored = scoreFeatures(features);
  const target = answers[TARGET_QUESTION] && valuesFor(TARGET_QUESTION, answers[TARGET_QUESTION]);
  const context = answers[1] && valuesFor(1, answers[1]);

  return {
    modelVersion: MODEL_VERSION,
    completeness: missing.length ? 'partial' : 'complete',
    answeredCount: QUESTION_SPEC.length - missing.length,
    missingQuestions: missing,
    lifeStage: context?.Life_Stage ?? null,
    features,
    ...scored,
    selfReportedStrain: target?.SelfReported_Strain ?? null,
    explanation: explain(scored.categories),
  };
}

function round(n) {
  return Math.round(n * 100) / 100;
}
