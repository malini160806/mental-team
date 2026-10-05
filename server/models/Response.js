import mongoose from 'mongoose';

const { Schema } = mongoose;

const AnswerSchema = new Schema(
  {
    id: { type: Number, required: true },
    key: { type: String, required: true },
    section: { type: String, required: true },
    letter: { type: String, required: true, enum: ['A', 'B', 'C', 'D', 'E'] },
    label: { type: String },
    values: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const CategorySchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    // weight/score only exist on records scored by the weighted rule-v1 model.
    weight: { type: Number },
    score: { type: Number, min: 0, max: 4 },
    percent: { type: Number, min: 0, max: 100 },
  },
  { _id: false },
);

const ResponseSchema = new Schema(
  {
    sessionId: { type: String, required: true, index: true },
    source: { type: String, enum: ['app', 'google-sheet'], default: 'app' },
    // Legacy on-screen wellbeing gauge (100 = calm); kept for older records.
    score: { type: Number, min: 0, max: 100 },
    answers: { type: [AnswerSchema], required: true },
    // Raw answer → value table, one column per survey value.
    columns: { type: Schema.Types.Mixed, required: true },

    // Scoring pipeline output (shared/stressModel.js).
    lifeStage: { type: String },
    features: { type: Schema.Types.Mixed },
    // Per-feature contribution after reversing protective features.
    adjustedFeatures: { type: Schema.Types.Mixed },
    categories: { type: [CategorySchema] },
    completeness: { type: String, enum: ['complete', 'partial'] },
    missingQuestions: { type: [Number], default: undefined },
    rawStressScore: { type: Number, min: 0 },
    maximumScore: { type: Number, min: 0 },
    stressScore: { type: Number, min: 0, max: 100 },
    stressLevel: { type: String, enum: ['Low', 'Moderate', 'High'], index: true },
    // Q25 strain answer (also part of the score from unweighted-v2 on).
    selfReportedStrain: { type: Number, min: 0, max: 4 },
    modelVersion: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model('Response', ResponseSchema);
