# MD827 PFT Pattern Occlusion Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy a responsive, unlisted GitHub Pages tool that reveals MD827 PFT table cells one at a time and provides a disease-specific explanation after each answer is revealed.

**Architecture:** A static ES-module application separates course data, pure state helpers, browser rendering, and styling. Node's built-in test runner validates data completeness and reveal/explanation gating before deployment.

**Tech Stack:** HTML5, CSS, vanilla JavaScript ES modules, Node 22 built-in `node:test`, GitHub Pages.

## Global Constraints
- Preserve every answer from the generated MD827 PFT answer key.
- Every answer cell must have a nonempty, disease-specific explanation.
- Explanation controls must not appear before answer reveal.
- Do not use external libraries, tracking, analytics, or remote assets.
- Add `noindex`, `nofollow`, `noarchive`, `nosnippet`, and `no-referrer` protections.
- Deploy at `m/5518ef588976c36c/pft-patterns/`.

---

### Task 1: Define tested data and state contracts

**Files:**
- Create: `tests/core.test.mjs`
- Create: `package.json`
- Create: `data.js`
- Create: `core.js`

**Interfaces:**
- `validateTables(tables): string[]`
- `makeCellId(tableId, rowId, columnKey): string`
- `cellViewModel(cell, revealed): { answer: string|null, explanationEnabled: boolean }`
- `filterRows(rows, query): Row[]`
- `shuffleRows(rows, random): Row[]`

- [ ] Write tests asserting complete explanations, unique row IDs, stable cell IDs, explanation gating, filtering, and immutable shuffle.
- [ ] Run `npm test` and verify failure because `data.js` and `core.js` do not exist.
- [ ] Implement the complete answer/explanation dataset and minimal pure helpers.
- [ ] Run `npm test` and verify all tests pass.

### Task 2: Implement browser interface

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `app.js`

**Interfaces:**
- Consumes `tables`, `makeCellId`, `cellViewModel`, `filterRows`, and `shuffleRows`.
- Produces a responsive grid with per-cell reveal and explanation dialog behavior.

- [ ] Add the semantic page shell, noindex metadata, toolbar, tabs, progress display, table region, and explanation dialog.
- [ ] Render masked answer buttons without inserting answer text into the DOM.
- [ ] Render the answer and Explanation button only after reveal.
- [ ] Add row reveal/hide, random reveal, reveal all, hide all, search, shuffle, local persistence, and reset.
- [ ] Add responsive sticky-table styling and clear low/normal/high/variable answer badges.
- [ ] Run `npm run check` and `npm test`.

### Task 3: Browser verification and deployment

**Files:**
- Create: `README.md`
- Publish all files under `m/5518ef588976c36c/pft-patterns/` in `Tayner35/Tayner35.github.io`.

- [ ] Serve locally with `python -m http.server 8765`.
- [ ] Capture desktop and mobile screenshots with headless Chromium.
- [ ] Verify masked cells, independent reveal, post-reveal Explanation button, modal copy, sticky layout, filtering, and progress updates.
- [ ] Run final `npm test`, `npm run check`, and an HTML validation script.
- [ ] Create a feature branch, upload files, open and merge a pull request.
- [ ] Verify the deployed GitHub Pages URL returns HTTP 200 and the live DOM contains the expected title and controls.
