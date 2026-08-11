export const cell = (answer, explanation) => Object.freeze({ answer, explanation });

export const diseaseColumns = Object.freeze([
  { key: 'pattern', label: 'Pattern', shortLabel: 'Pattern' },
  { key: 'ratio', label: 'FEV₁/FVC', shortLabel: 'FEV₁/FVC' },
  { key: 'fev1', label: 'FEV₁', shortLabel: 'FEV₁' },
  { key: 'fvc', label: 'FVC', shortLabel: 'FVC' },
  { key: 'tlc', label: 'TLC', shortLabel: 'TLC' },
  { key: 'rv', label: 'RV', shortLabel: 'RV' },
  { key: 'dlco', label: 'DLCO', shortLabel: 'DLCO' },
]);

export const airwayColumns = Object.freeze([
  { key: 'type', label: 'Type of obstruction', shortLabel: 'Type' },
  { key: 'insp', label: 'Inspiratory limb', shortLabel: 'Inspiration' },
  { key: 'exp', label: 'Expiratory limb', shortLabel: 'Expiration' },
  { key: 'ratio', label: 'FEV₁/FVC', shortLabel: 'FEV₁/FVC' },
  { key: 'tlc', label: 'TLC', shortLabel: 'TLC' },
  { key: 'rv', label: 'RV', shortLabel: 'RV' },
  { key: 'dlco', label: 'DLCO', shortLabel: 'DLCO' },
]);
