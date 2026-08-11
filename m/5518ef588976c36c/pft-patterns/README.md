# MD827 PFT Pattern Occlusion Lab

Static GitHub Pages study tool for the MD827 Exam 1 PFT disease-pattern matrix.

## Features
- Individual answer-cell occlusion and reveal
- Per-cell physiology explanation available only after reveal
- Disease and central-airway tables
- Row reveal/hide, random reveal, reveal all, hide all, search, shuffle, and local progress persistence
- No external dependencies or network calls
- Search-engine indexing disabled through page metadata

## Local verification

```bash
npm test
npm run check
python -m http.server 8765
```

Open `http://127.0.0.1:8765/`.

## Course sources
- `E1W1_g_Spirometry.pdf`
- `2026-08-04_g_Spirometry.txt`
- Cross-check: Surface Tension & Compliance and Lung Defense & Structure sessions
