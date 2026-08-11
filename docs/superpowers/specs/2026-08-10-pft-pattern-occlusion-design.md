# MD827 PFT Pattern Occlusion Site — Design

## Purpose
Create a standalone, unlisted GitHub Pages study tool that converts the printable MD827 PFT disease-pattern table into an image-occlusion-style grid. Disease names and metric headers remain visible; every answer cell starts masked and can be revealed independently. After a cell is revealed, that same cell exposes an Explanation button describing the disease-specific physiology responsible for the displayed pattern.

## Scope
- Main disease matrix: Pattern, FEV₁/FVC, FEV₁, FVC, TLC, RV, and DLCO.
- Central-airway matrix: obstruction type, inspiratory limb, expiratory limb, FEV₁/FVC, TLC, RV, and DLCO.
- Cell-by-cell reveal and hide.
- Explanation access only after reveal.
- Reveal row, reveal random cell, reveal all, hide all, row shuffle, search/filter, tab switching, and progress display.
- Reveal state persists locally in the browser and can be reset.
- No external libraries, accounts, analytics, or network calls.
- `noindex`, `nofollow`, `noarchive`, and referrer suppression for minimally discoverable public hosting.

## Data and teaching rules
- Answers reproduce the previously generated MD827 Exam 1 PFT answer key.
- Explanations use the original Spirometry slide deck/transcript as the primary framework, cross-checked against the course material on compliance and structural lung disease.
- Patterns are typical and simplified for exam recognition, not absolute clinical rules.
- Assume active/untreated physiology and hemoglobin-adjusted DLCO.
- TLC confirms restriction; FEV₁/FVC defines obstruction.

## Architecture
The page is a dependency-free ES-module application:
- `index.html`: semantic shell, controls, tables, and explanation dialog.
- `styles.css`: responsive layout and occlusion-cell appearance.
- `data.js`: course-aligned answers and per-cell explanations.
- `core.js`: pure state/data helpers suitable for Node tests.
- `app.js`: browser rendering, events, persistence, filtering, and dialog behavior.
- `tests/core.test.mjs`: data-integrity and interaction-state tests using Node's built-in test runner.

## Accessibility and behavior
- Every covered cell is a real button with a specific accessible label.
- Answers are not inserted into the DOM until revealed.
- Explanation buttons are not inserted until the answer is revealed.
- Sticky headers and disease labels preserve context while scrolling.
- All controls are keyboard operable; a native dialog presents explanations.
- Direction indicators combine symbols and text labels rather than relying on color alone.

## Deployment
Publish under the existing unlisted MD827/PFT GitHub Pages path:
`m/5518ef588976c36c/pft-patterns/`
