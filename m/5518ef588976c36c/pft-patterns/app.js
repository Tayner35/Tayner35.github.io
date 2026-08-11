import { conventions, tables } from './data.js';
import { cellViewModel, filterRows, makeCellId, shuffleRows, validateTables } from './core.js';

const STORAGE_KEY = 'md827-pft-occlusion-v1';
const VERSION = 1;
const tableMap = new Map(tables.map((table) => [table.id, table]));
const allValidCellIds = new Set(
  tables.flatMap((table) =>
    table.rows.flatMap((row) => table.columns.map((column) => makeCellId(table.id, row.id, column.key))),
  ),
);

const elements = {
  tabs: document.querySelector('#table-tabs'),
  search: document.querySelector('#row-search'),
  description: document.querySelector('#table-description'),
  tableContainer: document.querySelector('#table-container'),
  emptyState: document.querySelector('#empty-state'),
  progressLabel: document.querySelector('#progress-label'),
  progressPercent: document.querySelector('#progress-percent'),
  progress: document.querySelector('#reveal-progress'),
  revealRandom: document.querySelector('#reveal-random'),
  revealAll: document.querySelector('#reveal-all'),
  hideAll: document.querySelector('#hide-all'),
  shuffleRows: document.querySelector('#shuffle-rows'),
  resetProgress: document.querySelector('#reset-progress'),
  toast: document.querySelector('#status-toast'),
  dialog: document.querySelector('#explanation-dialog'),
  dialogMetric: document.querySelector('#dialog-metric'),
  dialogTitle: document.querySelector('#dialog-title'),
  dialogAnswer: document.querySelector('#dialog-answer'),
  dialogExplanation: document.querySelector('#dialog-explanation'),
  dialogMechanism: document.querySelector('#dialog-mechanism'),
};

const validationErrors = validateTables(tables);
if (validationErrors.length) {
  throw new Error(`PFT data validation failed:\n${validationErrors.join('\n')}`);
}

const persisted = loadPersistedState();
const state = {
  activeTableId: tableMap.has(persisted.activeTableId) ? persisted.activeTableId : tables[0].id,
  revealed: new Set((persisted.revealed ?? []).filter((id) => allValidCellIds.has(id))),
  query: '',
  rowOrder: Object.fromEntries(tables.map((table) => [table.id, table.rows.map((row) => row.id)])),
};

let toastTimer = null;

function loadPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed?.version === VERSION ? parsed : {};
  } catch {
    return {};
  }
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: VERSION,
        activeTableId: state.activeTableId,
        revealed: [...state.revealed],
      }),
    );
  } catch {
    // The app remains fully usable when storage is unavailable.
  }
}

function activeTable() {
  return tableMap.get(state.activeTableId);
}

function orderedRows(table) {
  const byId = new Map(table.rows.map((row) => [row.id, row]));
  return state.rowOrder[table.id].map((id) => byId.get(id)).filter(Boolean);
}

function visibleRows() {
  return filterRows(orderedRows(activeTable()), state.query);
}

function cellIdsForRows(table, rows) {
  return rows.flatMap((row) => table.columns.map((column) => makeCellId(table.id, row.id, column.key)));
}

function toneForAnswer(answer) {
  const normalized = answer.trim();
  if (normalized === '↓') return 'low';
  if (normalized === '↑') return 'high';
  if (normalized === 'N' || normalized === 'Usually N') return 'normal';
  if (normalized === 'Var' || normalized.includes('/')) return 'variable';
  return 'text';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderTabs() {
  elements.tabs.innerHTML = tables
    .map(
      (table) => `
        <button
          class="tab-button"
          type="button"
          role="tab"
          aria-selected="${table.id === state.activeTableId}"
          data-table-id="${escapeHtml(table.id)}"
        >${escapeHtml(table.title)}</button>`,
    )
    .join('');
}

function rowIsFullyRevealed(table, row) {
  return table.columns.every((column) => state.revealed.has(makeCellId(table.id, row.id, column.key)));
}

function renderCell(table, row, column) {
  const id = makeCellId(table.id, row.id, column.key);
  const cell = row.cells[column.key];
  const revealed = state.revealed.has(id);
  const model = cellViewModel(cell, revealed);
  const columnClass = ['pattern', 'type', 'insp', 'exp'].includes(column.key)
    ? `${column.key}-column`
    : 'metric-column';

  if (!model.answer) {
    return `
      <td class="answer-cell ${columnClass}">
        <button
          class="occlusion-button"
          type="button"
          data-action="reveal-cell"
          data-cell-id="${escapeHtml(id)}"
          aria-label="Reveal ${escapeHtml(column.label)} for ${escapeHtml(row.disease)}"
        ><span>Reveal</span></button>
      </td>`;
  }

  const tone = toneForAnswer(model.answer);
  return `
    <td class="answer-cell ${columnClass}">
      <div class="revealed-card" data-tone="${tone}">
        <div class="answer-value">${escapeHtml(model.answer)}</div>
        <div class="cell-actions">
          <button
            class="cell-action"
            type="button"
            data-action="explain-cell"
            data-cell-id="${escapeHtml(id)}"
          >Explanation</button>
          <button
            class="cell-action"
            type="button"
            data-action="hide-cell"
            data-cell-id="${escapeHtml(id)}"
            aria-label="Hide ${escapeHtml(column.label)} for ${escapeHtml(row.disease)}"
          >Hide</button>
        </div>
      </div>
    </td>`;
}

function renderTable() {
  const table = activeTable();
  const rows = visibleRows();
  elements.description.textContent = table.description;
  elements.emptyState.hidden = rows.length > 0;

  if (!rows.length) {
    elements.tableContainer.innerHTML = '';
    updateProgress();
    return;
  }

  const headers = table.columns
    .map((column) => {
      const columnClass = ['pattern', 'type', 'insp', 'exp'].includes(column.key)
        ? `${column.key}-column`
        : 'metric-column';
      return `<th scope="col" class="${columnClass}">${escapeHtml(column.label)}</th>`;
    })
    .join('');

  const body = rows
    .map((row) => {
      const fullyRevealed = rowIsFullyRevealed(table, row);
      const cells = table.columns.map((column) => renderCell(table, row, column)).join('');
      return `
        <tr data-row-id="${escapeHtml(row.id)}">
          <th scope="row" class="disease-column">
            <div class="disease-cell">
              <span class="disease-name">${escapeHtml(row.disease)}</span>
              <button
                class="row-action"
                type="button"
                data-action="${fullyRevealed ? 'hide-row' : 'reveal-row'}"
                data-row-id="${escapeHtml(row.id)}"
              >${fullyRevealed ? 'Hide row' : 'Reveal row'}</button>
            </div>
          </th>
          ${cells}
        </tr>`;
    })
    .join('');

  elements.tableContainer.innerHTML = `
    <table class="pft-table">
      <caption>${escapeHtml(table.title)}. Disease names remain visible and answer cells can be revealed independently.</caption>
      <thead>
        <tr>
          <th scope="col" class="disease-column">Disease / condition</th>
          ${headers}
        </tr>
      </thead>
      <tbody>${body}</tbody>
    </table>`;

  updateProgress();
}

function updateProgress() {
  const table = activeTable();
  const allIds = cellIdsForRows(table, table.rows);
  const revealedCount = allIds.filter((id) => state.revealed.has(id)).length;
  const total = allIds.length;
  const percent = total ? Math.round((revealedCount / total) * 100) : 0;
  elements.progressLabel.textContent = `${revealedCount} of ${total} cells revealed`;
  elements.progressPercent.textContent = `${percent}%`;
  elements.progress.value = percent;
  elements.progress.textContent = `${percent}%`;
}

function render() {
  renderTabs();
  renderTable();
  saveState();
}

function findCellContext(cellId) {
  const [tableId, rowId, columnKey] = cellId.split('::');
  const table = tableMap.get(tableId);
  const row = table?.rows.find((candidate) => candidate.id === rowId);
  const column = table?.columns.find((candidate) => candidate.key === columnKey);
  const cell = row?.cells?.[columnKey];
  return table && row && column && cell ? { table, row, column, cell } : null;
}

function revealCell(cellId) {
  if (!allValidCellIds.has(cellId)) return;
  state.revealed.add(cellId);
  renderTable();
  saveState();
}

function hideCell(cellId) {
  state.revealed.delete(cellId);
  renderTable();
  saveState();
}

function setRowRevealed(rowId, reveal) {
  const table = activeTable();
  const row = table.rows.find((candidate) => candidate.id === rowId);
  if (!row) return;
  for (const column of table.columns) {
    const id = makeCellId(table.id, row.id, column.key);
    if (reveal) state.revealed.add(id);
    else state.revealed.delete(id);
  }
  renderTable();
  saveState();
}

function openExplanation(cellId) {
  if (!state.revealed.has(cellId)) return;
  const context = findCellContext(cellId);
  if (!context) return;
  const { row, column, cell } = context;
  elements.dialogMetric.textContent = column.label;
  elements.dialogTitle.textContent = row.disease;
  elements.dialogAnswer.textContent = cell.answer;
  elements.dialogExplanation.textContent = cell.explanation;
  elements.dialogMechanism.textContent = row.mechanism;
  if (typeof elements.dialog.showModal === 'function') elements.dialog.showModal();
  else elements.dialog.setAttribute('open', '');
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove('is-visible'), 1800);
}

function revealAllActive() {
  const table = activeTable();
  const ids = cellIdsForRows(table, table.rows);
  ids.forEach((id) => state.revealed.add(id));
  renderTable();
  saveState();
  showToast(`Revealed all ${ids.length} cells in ${table.title}.`);
}

function hideAllActive() {
  const table = activeTable();
  const ids = cellIdsForRows(table, table.rows);
  ids.forEach((id) => state.revealed.delete(id));
  renderTable();
  saveState();
  showToast(`Hidden all cells in ${table.title}.`);
}

function revealRandomVisibleCell() {
  const table = activeTable();
  const candidates = cellIdsForRows(table, visibleRows()).filter((id) => !state.revealed.has(id));
  if (!candidates.length) {
    showToast('Every visible cell is already revealed.');
    return;
  }
  const id = candidates[Math.floor(Math.random() * candidates.length)];
  state.revealed.add(id);
  renderTable();
  saveState();
  const context = findCellContext(id);
  showToast(`Revealed ${context.column.label} for ${context.row.disease}.`);
  requestAnimationFrame(() => {
    document.querySelector(`[data-cell-id="${CSS.escape(id)}"][data-action="explain-cell"]`)?.focus();
  });
}

function resetAllProgress() {
  state.revealed.clear();
  state.query = '';
  elements.search.value = '';
  state.rowOrder = Object.fromEntries(tables.map((table) => [table.id, table.rows.map((row) => row.id)]));
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  render();
  showToast('Saved reveal progress and row order were reset.');
}

elements.tabs.addEventListener('click', (event) => {
  const button = event.target.closest('[data-table-id]');
  if (!button) return;
  state.activeTableId = button.dataset.tableId;
  state.query = '';
  elements.search.value = '';
  render();
});

elements.search.addEventListener('input', () => {
  state.query = elements.search.value;
  renderTable();
});

elements.tableContainer.addEventListener('click', (event) => {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  const action = control.dataset.action;
  if (action === 'reveal-cell') revealCell(control.dataset.cellId);
  if (action === 'hide-cell') hideCell(control.dataset.cellId);
  if (action === 'explain-cell') openExplanation(control.dataset.cellId);
  if (action === 'reveal-row') setRowRevealed(control.dataset.rowId, true);
  if (action === 'hide-row') setRowRevealed(control.dataset.rowId, false);
});

elements.revealRandom.addEventListener('click', revealRandomVisibleCell);
elements.revealAll.addEventListener('click', revealAllActive);
elements.hideAll.addEventListener('click', hideAllActive);
elements.shuffleRows.addEventListener('click', () => {
  const table = activeTable();
  const current = orderedRows(table);
  state.rowOrder[table.id] = shuffleRows(current).map((row) => row.id);
  renderTable();
  showToast(`Shuffled ${table.title}.`);
});
elements.resetProgress.addEventListener('click', resetAllProgress);

elements.dialog.addEventListener('click', (event) => {
  if (event.target !== elements.dialog) return;
  const rect = elements.dialog.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) elements.dialog.close();
});

// Keep the imported convention data part of the runtime integrity check.
if (conventions.length < 4) throw new Error('Answer convention data is incomplete.');

render();
