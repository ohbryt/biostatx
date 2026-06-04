# BioStatX

## What This Does
Biomedical statistics web platform (competes with SPSS, GraphPad Prism, SAS).
Target: Korean biomedical researchers. Revenue goal: ₩1M/month.

**Live:** https://biostatx.vercel.app
**GitHub:** git@github.com:ohbryt/biostatx.git

---

## Tech Stack
- Next.js 15 (App Router) + TypeScript + React 19
- Tailwind CSS 4, Recharts 2.15
- Stats: jstat 1.9.6 + custom `/src/lib/statistics.ts`
- Auth: Supabase / Payments: PortOne V2 / AI figures: OpenAI DALL-E 3
- Hosting: Vercel

---

## Architecture
- All statistical computations run **browser-side** — data never leaves user's device (except AI Figure)
- Server clients (Supabase, OpenAI) use **lazy initialization** to avoid build errors
- Client Supabase uses **JS Proxy** for backward-compatible lazy loading

---

## Critical Gotchas
- **NEVER** run `npm run dev` from repo root — always `cd /Users/ocm/apps/biostatx && npm run dev`
- **Stats are browser-side** — never add server-side computation routes without explicit justification
- **PortOne** is pending approval — do NOT hardcode store/channel keys; use env vars only
- **Signup bypasses email confirm** via `/api/auth/signup` server-side admin API

---

## Navigation
```
src/
├── app/
│   ├── page.tsx                        # Homepage
│   ├── auth/                           # Login, signup, callback
│   ├── dashboard/                      # User dashboard
│   ├── pricing/                        # Pricing page (₩0 / ₩12,900 / ₩39,900)
│   ├── examples/                       # Example analyses
│   ├── tools/                          # 10 statistical tools
│   │   ├── t-test/, anova/, chi-square/, correlation/
│   │   ├── mann-whitney/, sample-size/, survival/
│   │   ├── bioplot/, curve-fitting/, rt-pcr/, figure-gen/
│   └── api/                            # Server routes
├── components/                          # Recharts, DataSheet, ChartControls
├── contexts/AuthContext.tsx
└── lib/
    ├── statistics.ts                   # Core stats (640 lines)
    ├── deltaCt.ts                      # RT-PCR computations
    ├── chartUtils.ts                   # Chart config + PNG/SVG download
    ├── supabase.ts / supabase-admin.ts
    └── portone.ts
```

---

## Commands
```bash
cd /Users/ocm/apps/biostatx

npm run dev              # Dev server (localhost:3000)
npx next build           # Production build
npx vercel --prod ...   # Deploy (use token from BIOSTATX-PROJECT.md)
```

---

## Claude Code Dynamic Workflows
Workflows live in `.claude/workflows/`. Run with `/report` or task-specific triggers.

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `stat-report.yaml` | `/report` | Data → stats → figures → decision-ready brief |

---

## Pricing Plans
| Plan | Price | Features |
|------|-------|---------|
| Free | ₩0 | 8 tests, RT-PCR, BioPlot basic |
| Pro | ₩12,900/mo | + Survival, Curve Fitting 9 models, AI Figure 50/mo, SVG export |
| Team | ₩39,900/mo | + 10 members, API, SSO, HIPAA, AI Figure 200/mo |

---

## Pending
- PortOne approval → add Store ID / Channel Key / API Secret to Vercel env vars
- Paired T-Test, Two-Way ANOVA, Logistic Regression, ROC Curve, Batch analysis
