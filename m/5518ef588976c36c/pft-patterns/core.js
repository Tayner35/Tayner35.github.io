export function makeCellId(tableId, rowId, columnKey) {
  return `${tableId}::${rowId}::${columnKey}`;
}

export function cellViewModel(cell, revealed) {
  return {
    answer: revealed ? cell.answer : null,
    explanationEnabled: Boolean(revealed),
  };
}

export function filterRows(rows, query) {
  const normalized = String(query ?? '').trim().toLocaleLowerCase();
  if (!normalized) return [...rows];

  return rows.filter((row) => {
    const haystack = [row.disease, ...(row.aliases ?? [])]
      .join(' ')
      .toLocaleLowerCase();
    return haystack.includes(normalized);
  });
}

export function shuffleRows(rows, random = Math.random) {
  const copy = [...rows];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function validateTables(tables) {
  const errors = [];
  const tableIds = new Set();

  for (const table of tables) {
    if (!table?.id) {
      errors.push('A table is missing an id.');
      continue;
    }
    if (tableIds.has(table.id)) errors.push(`Duplicate table id: ${table.id}`);
    tableIds.add(table.id);

    if (!Array.isArray(table.columns) || table.columns.length === 0) {
      errors.push(`${table.id} has no columns.`);
      continue;
    }
    if (!Array.isArray(table.rows) || table.rows.length === 0) {
      errors.push(`${table.id} has no rows.`);
      continue;
    }

    const columnKeys = new Set();
    for (const column of table.columns) {
      if (!column?.key) errors.push(`${table.id} has a column without a key.`);
      if (columnKeys.has(column.key)) errors.push(`${table.id} has duplicate column ${column.key}.`);
      columnKeys.add(column.key);
    }

    const rowIds = new Set();
    for (const row of table.rows) {
      if (!row?.id) {
        errors.push(`${table.id} has a row without an id.`);
        continue;
      }
      if (rowIds.has(row.id)) errors.push(`${table.id} has duplicate row id ${row.id}.`);
      rowIds.add(row.id);
      if (!row.disease?.trim()) errors.push(`${table.id}/${row.id} has no disease name.`);
      if (!row.mechanism?.trim()) errors.push(`${table.id}/${row.id} has no mechanism summary.`);

      for (const column of table.columns) {
        const item = row.cells?.[column.key];
        if (!item) {
          errors.push(`${table.id}/${row.id}/${column.key} is missing.`);
          continue;
        }
        if (!item.answer?.trim()) errors.push(`${table.id}/${row.id}/${column.key} has no answer.`);
        if (!item.explanation?.trim()) errors.push(`${table.id}/${row.id}/${column.key} has no explanation.`);
      }
    }
  }

  return errors;
}
