import { airwayRows } from './data-airway.js';
import { diseaseRowsA } from './data-diseases-a.js';
import { diseaseRowsB } from './data-diseases-b.js';
import { airwayColumns, diseaseColumns } from './data-shared.js';

const diseaseRows = Object.freeze([...diseaseRowsA, ...diseaseRowsB]);

export const tables = Object.freeze([
  {
    id: 'diseases',
    title: 'Disease PFT Matrix',
    description: 'Reveal the typical pattern and direction of each PFT metric.',
    columns: diseaseColumns,
    rows: diseaseRows,
  },
  {
    id: 'airway',
    title: 'Central-Airway Flow-Volume Patterns',
    description: 'These lesions are identified primarily by which loop limb is flattened.',
    columns: airwayColumns,
    rows: airwayRows,
  },
]);

export const conventions = Object.freeze([
  { symbol: '↓', label: 'Low' },
  { symbol: 'N', label: 'Normal' },
  { symbol: '↑', label: 'High' },
  { symbol: 'N/↓ or N/↑', label: 'Varies with severity or activity' },
  { symbol: 'Var', label: 'Depends on the component diseases' },
]);
