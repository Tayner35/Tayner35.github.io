import test from 'node:test';
import assert from 'node:assert/strict';

import { tables } from '../data.js';
import {
  cellViewModel,
  filterRows,
  makeCellId,
  shuffleRows,
  validateTables,
} from '../core.js';

test('all tables contain unique rows and complete explained cells', () => {
  const errors = validateTables(tables);
  assert.deepEqual(errors, []);

  for (const table of tables) {
    const ids = table.rows.map((row) => row.id);
    assert.equal(new Set(ids).size, ids.length, `${table.id} row IDs must be unique`);

    for (const row of table.rows) {
      for (const column of table.columns) {
        const cell = row.cells[column.key];
        assert.ok(cell, `${table.id}/${row.id}/${column.key} is missing`);
        assert.ok(cell.answer.trim().length > 0, `${table.id}/${row.id}/${column.key} answer is blank`);
        assert.ok(
          cell.explanation.trim().length >= 40,
          `${table.id}/${row.id}/${column.key} explanation is too short`,
        );
      }
    }
  }
});

test('cell IDs are stable and table scoped', () => {
  assert.equal(makeCellId('diseases', 'asthma', 'ratio'), 'diseases::asthma::ratio');
  assert.notEqual(
    makeCellId('diseases', 'asthma', 'ratio'),
    makeCellId('airway', 'asthma', 'ratio'),
  );
});

test('explanation access is gated by reveal state', () => {
  const cell = {
    answer: '↓',
    explanation: 'Airway narrowing lowers FEV₁ more than FVC, reducing the ratio.',
  };

  assert.deepEqual(cellViewModel(cell, false), {
    answer: null,
    explanationEnabled: false,
  });
  assert.deepEqual(cellViewModel(cell, true), {
    answer: '↓',
    explanationEnabled: true,
  });
});

test('filterRows searches disease names and aliases without mutating input', () => {
  const rows = [
    { id: 'ild', disease: 'Interstitial lung disease / pulmonary fibrosis', aliases: ['ILD'] },
    { id: 'asthma', disease: 'Asthma', aliases: [] },
  ];
  const snapshot = structuredClone(rows);

  assert.deepEqual(filterRows(rows, 'fibrosis').map((row) => row.id), ['ild']);
  assert.deepEqual(filterRows(rows, 'ild').map((row) => row.id), ['ild']);
  assert.deepEqual(filterRows(rows, '').map((row) => row.id), ['ild', 'asthma']);
  assert.deepEqual(rows, snapshot);
});

test('shuffleRows is immutable and supports deterministic random input', () => {
  const rows = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const sequence = [0.1, 0.9];
  let index = 0;
  const shuffled = shuffleRows(rows, () => sequence[index++]);

  assert.deepEqual(rows.map((row) => row.id), ['a', 'b', 'c']);
  assert.deepEqual(shuffled.map((row) => row.id), ['c', 'b', 'a']);
});
