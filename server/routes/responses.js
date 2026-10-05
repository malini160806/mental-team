import { Router } from 'express';
import Response from '../models/Response.js';
import { validateAnswers, buildResponseDoc, datasetRow, toCsv } from '../scoring.js';
import { CATEGORIES } from '../../shared/stressModel.js';

const router = Router();

router.post('/', async (req, res) => {
  const { sessionId, answers: rawAnswers } = req.body ?? {};

  if (!sessionId || !rawAnswers || typeof rawAnswers !== 'object') {
    return res.status(400).json({ error: 'sessionId and answers are required.' });
  }

  const { answers, errors } = validateAnswers(rawAnswers);
  if (errors.length) {
    return res.status(400).json({ error: 'Invalid survey response.', details: errors });
  }

  const labels = Array.isArray(rawAnswers)
    ? Object.fromEntries(rawAnswers.map((a) => [a.id, a.label]))
    : {};

  try {
    const doc = await Response.create(buildResponseDoc(answers, { sessionId, labels }));
    res.status(201).json({
      id: doc._id,
      createdAt: doc.createdAt,
      completeness: doc.completeness,
      rawStressScore: doc.rawStressScore,
      maximumScore: doc.maximumScore,
      stressScore: doc.stressScore,
      stressLevel: doc.stressLevel,
      features: doc.adjustedFeatures,
      categories: doc.categories,
      modelVersion: doc.modelVersion,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 500);
  const docs = await Response.find().sort({ createdAt: -1 }).limit(limit).lean();
  res.json(docs);
});

// Aggregate view for monitoring the score distribution before tuning thresholds.
router.get('/stats', async (_req, res) => {
  const docs = await Response.find().lean();
  const rows = docs.map(datasetRow);
  const count = rows.length;
  const mean = (key) =>
    count ? Math.round((rows.reduce((a, r) => a + (Number(r[key]) || 0), 0) / count) * 100) / 100 : null;

  const levels = { Low: 0, Moderate: 0, High: 0 };
  rows.forEach((r) => {
    levels[r.stress_level] += 1;
  });

  res.json({
    count,
    meanStressScore: mean('calculated_stress_score'),
    meanSelfReportedStrain: mean('self_reported_strain'),
    levels,
    categories: CATEGORIES.map((c) => ({ key: c.key, label: c.label, meanPercent: mean(`cat_${c.key}_pct`) })),
  });
});

// Raw answer columns + stored stress output.
router.get('/export.csv', async (_req, res) => {
  const docs = await Response.find().sort({ createdAt: 1 }).lean();
  const rows = docs.map((doc) => ({
    sessionId: doc.sessionId,
    source: doc.source ?? 'app',
    createdAt: doc.createdAt?.toISOString?.() ?? '',
    rawStressScore: doc.rawStressScore,
    maximumScore: doc.maximumScore,
    stressScore: doc.stressScore,
    stressLevel: doc.stressLevel,
    selfReportedStrain: doc.selfReportedStrain,
    modelVersion: doc.modelVersion,
    ...doc.columns,
  }));
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="survey-responses.csv"');
  res.send(toCsv(rows));
});

// One row per respondent: behavioural features, category scores, the
// self-reported strain answer and the current model's score — ready for EDA/ML.
router.get('/dataset.csv', async (_req, res) => {
  const docs = await Response.find().sort({ createdAt: 1 }).lean();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="stress-dataset.csv"');
  res.send(toCsv(docs.map(datasetRow)));
});

export default router;
