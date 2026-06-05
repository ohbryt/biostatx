# Contributing to BioStatX

Welcome! This guide covers everything you need to know to contribute effectively.

---

## Getting Started

```bash
# Clone
git clone git@github.com:ohbryt/biostatx.git
cd biostatx

# Install dependencies
npm install

# Start dev server
cd /Users/ocm/apps/biostatx && npm run dev
```

---

## Development Standards

### Claude Code Workflows (Required)

All contributors **must** use Claude Code workflows for the following tasks:

| Task | Command | When |
|------|---------|------|
| Statistical analysis | `claude /report` | Any stats-related work |
| Code review | `claude /review` | Before opening PR |
| Test generation | `claude /test <path>` | New components |
| Pre-deploy check | `claude /deploy` | Before deployment |

### Workflow Details

#### `/report` — Statistical Report
Input: Raw data (CSV or tab-separated)  
Output: Decision-ready brief with stats, figures, Korean interpretation

```
claude /report
# → Paste your data when prompted
# → Get: validation → analysis → chart → Notion-ready brief
```

#### `/review` — Code Review
Input: `git diff` or PR number  
Output: Inline review comments + approval/revision list

```
claude /review
# → Reviewer mode activates
# → All src/lib/ changes require this before PR
```

#### `/test` — Test Generation
Input: File path to component or function  
Output: Jest/Vitest test cases with coverage

```
claude /test src/components/MyChart.tsx
# → Generates: unit tests, edge cases, coverage report
```

#### `/deploy` — Pre-Deploy QA
Input: None (reads current state)  
Output: Build verify, env var check, broken link scan

```
claude /deploy
# → Must pass before any Vercel deployment
```

---

## Code Standards

### Stats Are Browser-Side
- All statistical computations in `/src/lib/statistics.ts`
- No server-side computation routes without explicit justification
- jstat for p-values and distribution functions

### Security
- API keys → `.env.local` only, never hardcoded
- `settings.local.json` → `.gitignore`
- Supabase keys use lazy initialization

### TypeScript
- Strict mode enabled
- No `any` types for function parameters
- Prefer `interface` over `type` for object shapes

### React/Next.js
- Server Components by default; add `'use client'` only when needed
- Recharts v2.15 API — use `ResponsiveContainer`, `XAxis`, `YAxis`, `Tooltip`
- All charts must support PNG + SVG export

---

## Pull Request Checklist

Before opening a PR:

- [ ] `claude /review` — code review passed
- [ ] `claude /test <changed-files>` — tests generated
- [ ] `npm run build` — production build succeeds
- [ ] No `console.log` left in production code
- [ ] `.env.local.example` updated if new env vars added

---

## Statistical Tools Coverage

| Tool | Status | Priority |
|------|--------|----------|
| t-test | ✅ Done | — |
| ANOVA | ✅ Done | — |
| Chi-square | ✅ Done | — |
| Correlation | ✅ Done | — |
| Mann-Whitney | ✅ Done | — |
| Sample Size | ✅ Done | — |
| Survival Analysis | ✅ Done | — |
| RT-PCR (ΔCt) | ✅ Done | — |
| BioPlot | ✅ Done | — |
| Curve Fitting | ✅ Done | — |
| Paired T-Test | ❌ Pending | P1 |
| Two-Way ANOVA | ❌ Pending | P1 |
| Logistic Regression | ❌ Pending | P2 |
| ROC Curve | ❌ Pending | P2 |
| Batch Analysis | ❌ Pending | P3 |

---

## Questions?

Open an issue or contact the Brown Biotech AI Team.
