# TechRadar — Extension Audit + Evolution Chains + News Digest

**Date:** 2026-07-02
**Status:** Approved design → ready for implementation planning

## Context

Usage showed the **website goes unused**, while the **Chrome extension** (new-tab
override) is the hit. So the extension is the product. This project:

1. Audits and hardens the extension (bugs, weak spots, security/privacy leaks).
2. Improves source handling.
3. Fixes "evolution chains" so they track real change over time (not randomness).
4. Adds a **news digest** section (engineering blogs, translated "to human":
   a hook headline + 3 tweet-style bullets), shown right after the radar.

### Current architecture (as-found)

- `chrome-extension/app.js` (~1400 lines) is **fully standalone**: from the
  browser it fetches GitHub / arXiv / Hacker News directly and translates via
  the free MyMemory API. It does **not** use the website's backend at all.
- The React/TanStack site (`src/server/functions/*`) has a richer server feed
  (8 sources, machine translation, cache) but is unused.
- No git repo yet. No LLM SDK installed. Appwrite is configured but not needed
  for this work.

## Key architectural decision

The extension **stays the primary product** and keeps fetching GitHub/arXiv/HN
live for the radar and feed (fast, fresh) — but hardened. A **thin backend** is
added: a **single daily GitHub Actions cron** that produces two static JSON
files the extension merely reads.

- `digest.json` — news: fetch RSS/Atom of the blogs → Claude Haiku 4.5 →
  `{headline, tweets[3]}` in EN + RU.
- `trends.json` — accumulated daily snapshots → per-topic momentum by week →
  honest evolution chains.

Both JSONs are committed to the **public** repo and served via
`https://raw.githubusercontent.com/<owner>/<repo>/main/public/data/*.json`
(added to `host_permissions`).

### Security invariant (hard requirement)

`ANTHROPIC_API_KEY` is an **encrypted GitHub Actions secret only**. It must
never appear in source, commits, the published JSON artifacts, or the
extension. Verification is part of the plan: `.env` stays git-ignored; the cron
script reads the key from `process.env` at runtime; a CI/self check greps the
committed artifacts for key-shaped strings before publish.

## Scope by phase

The work is four related sub-projects sharing the extension codebase. Ship
Phase 1 independently; Phases 3–4 depend on the backend infra from Phase 2.

### Phase 1 — Audit & hardening (independent, ship first)

- `manifest.json`: add a Content Security Policy (`script-src 'self'`); remove
  unused `host_permissions` (semanticscholar/ncbi/archives-ouvertes/cir.nii —
  currently declared but never called); add the hosts actually used
  (`api.mymemory.translated.net`, `raw.githubusercontent.com`).
- **Self-host fonts**: bundle JetBrains Mono + Space Grotesk woff2 locally so a
  new tab no longer pings Google Fonts (privacy + offline).
- **Remove all fabricated `Math.random()` metrics**: `weeklyGrowth`,
  arXiv `impactScore`, HN growth. Either compute honestly from real signals or
  drop the field. Radar dot jitter → deterministic seed from item id, so the
  radar stops "jumping" on every re-render.
- XSS pass: escape every `innerHTML` interpolation that carries
  externally-sourced text (repo names, HN/arXiv titles, summaries). `escapeHtml`
  exists; apply it consistently (feed, evolution timeline, AI insight).
- Translation cache: bound size + TTL (currently unbounded, grows forever in
  `chrome.storage`); stabilize item ids (some arXiv/CiNii ids use array index /
  `Date.now()` and are unstable across refreshes).
- GitHub rate-limit resilience: fewer requests per refresh; detect 403 /
  rate-limit headers; render an honest empty/error state; wire the Retry
  affordance (strings already exist).

### Phase 2 — Sources

- Reconcile manifest ↔ code: only declare hosts we actually call.
- Fix dedup and keyword categorization; add a reliable extra source
  (Semantic Scholar) if it earns its place, otherwise keep the honest 3.
- Extract pure functions (categorize / maturity / impact) into a small module
  so they are unit-testable.

### Phase 3 — Evolution chains (real, over time)

- Backend cron appends a daily snapshot of the signal feed and computes topic /
  cluster momentum over a rolling window → `trends.json`.
- Extension renders real trajectory (current stage + week-over-week movement +
  momentum), replacing the random `trajectory` logic and the category-only
  bucketing. Chains warm up after the first several daily cron runs.
- Empty/warming state is shown honestly until enough history exists.

### Phase 4 — News digest

- New section rendered **after the radar/chains grid, before Live Feed**.
- Card shape (approved):
  ```
  🧠 Anthropic · 2d ago
  Why it matters: <one-line hook>
  • tweet-style bullet 1
  • tweet-style bullet 2
  • tweet-style bullet 3
  [Read original ↗]
  ```
- Language follows the existing EN/RU switcher (backend generates both).
- Blogs: Anthropic, OpenAI, Latent Space, Google DeepMind, Simon Willison,
  Hugging Face, Meta AI, Mistral. Show ~6–10 freshest overall, newest on top.
- Cache `digest.json` in `chrome.storage` with TTL; graceful offline fallback.

## Data contracts

```jsonc
// digest.json
{
  "generatedAt": "ISO",
  "items": [{
    "id": "stable-hash",
    "source": "anthropic|openai|latent-space|deepmind|simonw|hf|meta|mistral",
    "sourceUrl": "https://...",
    "publishedAt": "ISO",
    "category": "ai|...",
    "en": { "headline": "Why it matters: ...", "tweets": ["...", "...", "..."] },
    "ru": { "headline": "Почему важно: ...", "tweets": ["...", "...", "..."] }
  }]
}

// trends.json
{
  "generatedAt": "ISO",
  "window": "rolling-Nd",
  "topics": [{
    "id": "llm-agents",
    "label": "LLM Agents",
    "category": "ai",
    "stage": "research|prototype|early-adopter|mass-market",
    "trajectory": "rising|stable|cooling",
    "momentum": 0.0,
    "weeklyCounts": [/* per-week signal counts */],
    "signals": [/* representative recent items */]
  }]
}
```

## Backend pipeline (GitHub Actions, daily)

- One scheduled workflow (`cron`, ~daily) running a Node/Bun script:
  1. **News**: fetch each blog's RSS/Atom (per-source parsing; skip sources
     without a feed gracefully) → pick freshest N, dedupe by URL/id → for each,
     one Claude Haiku 4.5 call returning a **zod-validated** structured object
     with EN+RU `{headline, tweets[3]}` → assemble `digest.json`.
  2. **Trends**: fetch the signal sources → append today's snapshot to a
     committed history file → compute momentum → write `trends.json`.
- Commit `public/data/digest.json` + `public/data/trends.json` (and the trend
  history) back to the repo. Cost is a handful of Claude calls per day.
- Secrets via `${{ secrets.ANTHROPIC_API_KEY }}`.

## Testing

- Backend: unit-test RSS/Atom parsing and validate Claude output against the zod
  schema (Claude mocked in CI — no network, no key needed for tests).
- Momentum computation: pure-function unit tests on synthetic snapshot history.
- Extension: extract pure helpers into testable modules; QA checklist for the
  new-tab render, EN/RU toggle, offline fallback, and rate-limit empty state.

## Sequencing

1. Phase 1 — audit & hardening (independent).
2. Backend skeleton — `git init` + push public repo, Actions workflow,
   `digest.json` + Claude, secret wiring, artifact key-leak check.
3. Phase 4 — news section in the extension (depends on 2).
4. Trends pipeline + Phase 3 — evolution chains rewrite (on Phase-2 infra).
   Phase 2 (sources) is woven into 1–2.

## Confirmed choices

- Feed source of digest/trends: thin backend (daily GitHub Actions cron).
- LLM: Claude Haiku 4.5, key as encrypted Actions secret.
- Repo: **public**; keys never public.
- Card: hook headline + 3 tweet-style bullets; EN/RU by switcher.
- Chains: real evolution over time, history stored **backend-side**.
- Cadence: news + trend snapshot together, **once daily**.

## Out of scope

- Reviving the website UI.
- Realtime/streaming updates (daily cadence is sufficient).
- User-provided LLM keys / client-side LLM calls.
