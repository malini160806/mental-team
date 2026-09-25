// Single source of truth for how each survey answer converts into feature scores.
// Shared by the React client (src/data/questions.js) and the Express API
// (server/), so the server can re-derive every value from the raw letter
// instead of trusting numbers sent by the browser.
//
// rows[i] holds the values for option LETTERS[i], in the order of `columns`.

export const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export const QUESTION_SPEC = [
  {
    id: 1,
    key: 'life_stage',
    section: 'life',
    columns: ['Life_Stage', 'Academic_Load', 'Work_Load', 'Career_Transition', 'Extra_Responsibility'],
    rows: [
      ['Student', 2, 0, 0, 0],
      ['Student+Work', 2, 2, 1, 2],
      ['Working', 0, 3, 0, 2],
      ['Transition', 1, 1, 3, 1],
      ['Multiple Roles', 1, 2, 1, 3],
    ],
  },
  {
    id: 2,
    key: 'independence',
    section: 'life',
    columns: ['Financial_Independence', 'Personal_Responsibility', 'Family_Responsibility'],
    rows: [
      [0, 1, 0],
      [0, 2, 1],
      [2, 2, 1],
      [3, 3, 1],
      [3, 3, 3],
    ],
  },
  {
    id: 3,
    key: 'deadline_behaviour',
    section: 'life',
    columns: ['Planning', 'Procrastination', 'Deadline_Management', 'Work_Discipline'],
    rows: [
      [4, 0, 4, 4],
      [3, 1, 3, 3],
      [2, 2, 3, 2],
      [1, 3, 1, 1],
      [0, 4, 0, 0],
    ],
  },
  {
    id: 4,
    key: 'multiple_responsibilities',
    section: 'life',
    columns: ['Prioritization', 'Multitasking', 'Decision_Difficulty', 'Overload'],
    rows: [
      [4, 1, 0, 0],
      [3, 1, 1, 1],
      [2, 4, 1, 2],
      [1, 2, 4, 3],
      [0, 1, 4, 4],
    ],
  },
  {
    id: 5,
    key: 'concentration',
    section: 'focus',
    // Previously a copy of Q4's columns/rows, which collided with Q4's features.
    columns: ['Concentration', 'Distractibility'],
    rows: [
      [4, 0],
      [3, 1],
      [2, 2],
      [1, 3],
      [0, 4],
    ],
  },
  {
    id: 6,
    key: 'response_to_failure',
    section: 'mind',
    columns: ['Resilience', 'Rumination', 'Social_Comparison', 'Recovery'],
    rows: [
      [4, 0, 0, 4],
      [3, 1, 0, 4],
      [2, 3, 1, 2],
      [1, 3, 4, 1],
      [0, 4, 2, 0],
    ],
  },
  {
    id: 7,
    key: 'daily_organization',
    section: 'life',
    columns: ['Daily_Planning', 'Routine_Stability', 'Time_Pressure'],
    rows: [
      [4, 4, 0],
      [3, 3, 1],
      [2, 1, 2],
      [1, 1, 4],
      [0, 0, 4],
    ],
  },
  {
    id: 8,
    key: 'sacrifice',
    section: 'body',
    columns: ['Leisure_Sacrifice', 'Social_Sacrifice', 'SelfCare_Sacrifice', 'Sleep_Sacrifice'],
    rows: [
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
  },
  {
    id: 9,
    key: 'daily_workload',
    section: 'life',
    columns: ['Perceived_Workload', 'Time_Pressure', 'Overload'],
    rows: [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
      [3, 4, 3],
      [4, 4, 4],
    ],
  },
  {
    id: 10,
    key: 'phone_usage',
    section: 'digital',
    columns: ['Screen_Exposure', 'Habitual_Checking', 'Digital_Dependency'],
    rows: [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
      [3, 4, 3],
      [4, 4, 4],
    ],
  },
  {
    id: 11,
    key: 'phone_during_work',
    section: 'digital',
    columns: ['Notification_Control', 'Phone_Distraction', 'Compulsive_Checking'],
    rows: [
      [4, 0, 0],
      [4, 1, 0],
      [2, 2, 1],
      [1, 4, 3],
      [0, 4, 4],
    ],
  },
  {
    id: 12,
    key: 'social_media_effect',
    section: 'digital',
    columns: ['Social_Comparison', 'Mood_Impact', 'SelfEsteem_Impact'],
    rows: [
      [0, 0, 0],
      [1, 1, 0],
      [2, 1, 1],
      [4, 3, 3],
      [4, 4, 4],
    ],
  },
  {
    id: 13,
    key: 'sleep_pattern',
    section: 'sleep',
    columns: ['Sleep_Adequacy', 'Sleep_Regularity', 'Morning_Fatigue'],
    rows: [
      [4, 4, 0],
      [3, 3, 1],
      [2, 1, 2],
      [1, 2, 3],
      [0, 0, 4],
    ],
  },
  {
    id: 14,
    key: 'before_sleep_behaviour',
    section: 'sleep',
    columns: ['Night_Screen_Risk', 'Sleep_Delay', 'WorkSleep_Conflict', 'Night_Rumination'],
    rows: [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [2, 2, 0, 0],
      [3, 4, 3, 1],
      [4, 4, 3, 4],
    ],
  },
  {
    id: 15,
    key: 'physical_lifestyle',
    section: 'body',
    columns: ['Physical_Activity', 'Meal_Regularity', 'Energy_Level', 'Physical_Fatigue'],
    rows: [
      [4, 4, 4, 0],
      [3, 3, 3, 1],
      [2, 2, 2, 2],
      [1, 1, 1, 3],
      [0, 0, 0, 4],
    ],
  },
  {
    id: 16,
    key: 'recovery',
    section: 'body',
    columns: ['Recovery_Time', 'Hobby_Engagement', 'Mental_Detachment'],
    rows: [
      [4, 4, 4],
      [3, 3, 3],
      [2, 2, 2],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  {
    id: 17,
    key: 'difficult_day_support',
    section: 'connection',
    columns: ['Help_Seeking', 'Support_Availability', 'Emotional_Openness'],
    rows: [
      [4, 4, 4],
      [3, 4, 3],
      [2, 3, 2],
      [1, 2, 1],
      [0, 0, 0],
    ],
  },
  {
    id: 18,
    key: 'relationships',
    section: 'connection',
    columns: ['Social_Connectedness', 'Perceived_Support', 'Loneliness'],
    rows: [
      [4, 4, 0],
      [3, 4, 1],
      [2, 2, 2],
      [1, 1, 3],
      [0, 0, 4],
    ],
  },
  {
    id: 19,
    key: 'asking_for_help',
    section: 'connection',
    columns: ['HelpSeeking_Confidence', 'Self_Reliance', 'Help_Avoidance'],
    rows: [
      [4, 2, 0],
      [3, 4, 0],
      [2, 3, 1],
      [1, 2, 3],
      [0, 3, 4],
    ],
  },
  {
    id: 20,
    key: 'overthinking',
    section: 'mind',
    columns: ['Overthinking', 'Rumination', 'Negative_Anticipation', 'Thought_Control'],
    rows: [
      [0, 0, 0, 4],
      [1, 1, 1, 3],
      [3, 3, 2, 2],
      [4, 3, 4, 1],
      [4, 4, 4, 0],
    ],
  },
  {
    id: 21,
    key: 'end_of_day',
    section: 'mind',
    columns: ['Emotional_Exhaustion', 'Mental_Energy', 'Recovery_Difficulty', 'Overwhelm'],
    rows: [
      [0, 4, 0, 0],
      [1, 3, 1, 1],
      [2, 2, 2, 2],
      [4, 1, 3, 3],
      [4, 0, 4, 4],
    ],
  },
  {
    id: 22,
    key: 'self_perception',
    section: 'mind',
    columns: ['Self_Confidence', 'Achievement_Satisfaction', 'Comparison_Tendency'],
    rows: [
      [4, 4, 0],
      [3, 3, 1],
      [2, 2, 2],
      [1, 1, 4],
      [0, 0, 3],
    ],
  },
  {
    id: 23,
    key: 'future_career',
    section: 'future',
    columns: ['Career_Clarity', 'Future_Confidence', 'Future_Worry', 'Feeling_Behind'],
    rows: [
      [4, 4, 0, 0],
      [3, 3, 1, 1],
      [2, 2, 1, 1],
      [1, 1, 4, 3],
      [0, 0, 4, 4],
    ],
  },
  {
    id: 24,
    key: 'external_pressure',
    section: 'future',
    columns: ['Financial_Concern', 'Family_Pressure', 'External_Pressure'],
    rows: [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
      [3, 3, 4],
      [4, 4, 4],
    ],
  },
  {
    id: 25,
    key: 'overall_balance',
    section: 'future',
    columns: ['Overall_Balance', 'SelfReported_Strain'],
    rows: [
      [4, 0],
      [3, 1],
      [2, 2],
      [1, 3],
      [0, 4],
    ],
  },
];

export const SPEC_BY_ID = Object.fromEntries(QUESTION_SPEC.map((q) => [q.id, q]));

// Values recorded for one answer, e.g. valuesFor(9, 'D') →
// { Perceived_Workload: 3, Time_Pressure: 4, Overload: 3 }.
export function valuesFor(questionId, letter) {
  const spec = SPEC_BY_ID[questionId];
  const row = spec?.rows[LETTERS.indexOf(letter)];
  if (!row) return null;
  return Object.fromEntries(spec.columns.map((col, i) => [col, row[i]]));
}
