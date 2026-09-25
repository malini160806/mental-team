// Imports Google Form responses exported from Google Sheets
// (File → Download → Comma-separated values) into MongoDB, running each row
// through the same validation + scoring pipeline as the in-app survey.
//
//   npm run import:sheet -- path/to/responses.csv [--dry-run]
//
// Expected layout: "Timestamp" (and optionally "Email Address") followed by the
// 25 question columns in survey order. Each answer cell may be the option text
// or start with its letter ("A", "A.", "A) ...").
// Re-running on the same file is safe: rows already imported are skipped.

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import mongoose from 'mongoose';
import { connectDB } from '../db.js';
import Response from '../models/Response.js';
import { validateAnswers, buildResponseDoc } from '../scoring.js';
import { questions } from '../../src/data/questions.js';

const SKIP_HEADERS = ['timestamp', 'email address', 'email', 'score'];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += ch;
  }
  if (field || row.length) rows.push([...row, field]);
  return rows.filter((r) => r.some((c) => c.trim()));
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

function toLetter(question, cell) {
  const value = cell.trim();
  const option = question.options.find((o) => norm(o.label) === norm(value));
  if (option) return option.letter;
  const prefixed = value.match(/^([A-Ea-e])(?:[.)\s:-]|$)/);
  return prefixed ? prefixed[1].toUpperCase() : value;
}

async function main() {
  const [file, ...flags] = process.argv.slice(2);
  const dryRun = flags.includes('--dry-run');
  if (!file) {
    console.error('Usage: npm run import:sheet -- <responses.csv> [--dry-run]');
    process.exit(1);
  }

  const [header, ...rows] = parseCsv(readFileSync(file, 'utf8').replace(/^﻿/, ''));
  const answerCols = header
    .map((h, i) => ({ h: h.trim().toLowerCase(), i }))
    .filter(({ h }) => !SKIP_HEADERS.includes(h))
    .slice(0, questions.length)
    .map(({ i }) => i);
  const tsCol = header.findIndex((h) => h.trim().toLowerCase() === 'timestamp');

  if (answerCols.length < questions.length) {
    console.error(`Expected ${questions.length} question columns, found ${answerCols.length}.`);
    process.exit(1);
  }

  if (!dryRun) await connectDB();

  let imported = 0;
  let skipped = 0;
  let invalid = 0;

  for (const [n, row] of rows.entries()) {
    const raw = {};
    const labels = {};
    questions.forEach((q, qi) => {
      const cell = row[answerCols[qi]] ?? '';
      raw[q.id] = toLetter(q, cell);
      labels[q.id] = cell.trim();
    });

    const { answers, errors } = validateAnswers(raw);
    if (errors.length) {
      invalid++;
      console.warn(`Row ${n + 2}: skipped — ${errors.join('; ')}`);
      continue;
    }

    const fingerprint = [row[tsCol] ?? '', ...questions.map((q) => answers[q.id])].join('|');
    const sessionId = `sheet-${createHash('sha1').update(fingerprint).digest('hex').slice(0, 16)}`;
    const doc = buildResponseDoc(answers, { sessionId, source: 'google-sheet', labels });

    if (dryRun) {
      console.log(`Row ${n + 2}: ${doc.stressScore} → ${doc.stressLevel}`);
      imported++;
      continue;
    }
    if (await Response.exists({ sessionId })) {
      skipped++;
      continue;
    }
    await Response.create(doc);
    imported++;
  }

  console.log(`${dryRun ? 'Scored' : 'Imported'} ${imported}, already present ${skipped}, invalid ${invalid}.`);
  if (!dryRun) await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
