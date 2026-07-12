# EarnStack

> **Real side cash for Canadians. Verified tasks. Transparent payouts. No hype.**

EarnStack is a Canada-first micro-task marketplace where verified users complete sponsor-funded tasks and earn real cash, paid out via PayPal at a $5 minimum. The platform combines a broad wall of standard verified tasks with premium sponsored tasks, giving reliable contributors something meaningful to work toward — without turning earnings into a game. No fake point ladders, no penny grind, no sketchy promises.

🌐 **Live:** [app.EarnStack.ca](https://app.EarnStack.ca)

---

## Brand Position

- **Canada-first** — built for Canadians, with local language, payout rules, and compliance in mind
- **Trust-first** — transparent payout ranges, review timelines, and eligibility rules shown upfront
- **No hype** — modest, factual income language; no exaggerated earnings claims
- **Fraud-protected** — device verification, velocity limits, manual payout review
- **Progress with purpose** — users build status through reliability and approval history, not streaks or point ladders

---

## Task Tiers

EarnStack uses two distinct task tiers. Together they give the feed consistent volume while rewarding reliable contributors with access to higher-value work.

### Standard Tasks — Offer Wall

Standard tasks are powered by integrated offer wall networks (TheoremReach, AdGate Media). These are broadly available to all verified users and keep the feed active from day one without manual task entry.

- Survey completions and offer conversions are credited automatically via postback
- Earnings are posted at the configured user share (default 70%)
- No manual review required — postback validation handles duplicate and reversal checks
- Available to all verified users regardless of contributor level

Each standard task card shows:
- Payout amount or estimated range
- Estimated effort time
- Task type (survey, offer, app action)
- Eligibility requirements

### Premium Sponsored Tasks — Curated Campaigns

Premium tasks are higher-value curated campaigns sourced directly from sponsors. These have stricter eligibility, clear proof requirements, and manual review before earnings clear. Access is earned through the Reliability Access Model — not available to all users by default.

- Created and managed via the admin panel or future sponsor self-serve dashboard
- Manual proof review before payout is released
- Higher payout range than standard offer wall tasks
- Locked behind minimum contributor level (Reliable or Verified Contributor)

Each premium task card also shows:
- Minimum contributor level required
- Sponsor-specific eligibility rules
- Manual review notice
- Limited availability when applicable

---

## Reliability Access Model

EarnStack rewards consistency without streaks, spins, or point ladders. Status comes from approved work, a clean review history, and recent participation — giving users something real to work toward and feel proud of.

### Contributor Levels

| Level | How Earned | Access |
|---|---|---|
| **New** | Default after account verification | Standard offer wall tasks |
| **Reliable** | Initial run of approved submissions with clean review history | Standard tasks + improved feed priority |
| **Verified Contributor** | Sustained approved work and review record | Standard + premium sponsored tasks |

### Progress Principles

- Progress should feel practical and earned, not game-like
- Use labels such as **approved tasks**, **review record**, **contributor level**, and **premium access**
- Avoid language like streak, spin, bonus wheel, or points
- Keep criteria visible so users always know what they are working toward

### Inactivity Decay

Contributor status can decay after long inactivity so premium access continues to reflect current trust and engagement.

**Recovery is faster than first-time qualification.** Returning users with a prior good history regain status after a shorter run of approved tasks than they needed initially.

Rule structure:
- **New → Reliable** — full qualification path
- **Reliable → Verified Contributor** — full qualification path
- **Verified Contributor** after long inactivity → temporary downgrade to Reliable (not all the way back to New)
- **Reliable** after long inactivity → temporary downgrade based on inactivity length and recent history
- **Reinstatement path** — shorter than first-time qualification, provided the user returns with clean submissions

### UX Writing Rules

- ✅ "You're currently a Reliable contributor."
- ✅ "Two more approved tasks can restore Verified Contributor access."
- ✅ "Premium sponsored tasks require a stronger recent review record."
- ✅ "Status can reduce after long inactivity, but returning contributors regain access faster than first-time qualification."
- ❌ Never use: streak, grind, spin, unlock bonus, rewards ladder

---

## Project Structure

```text
earn-stack-app/
├── frontend/                  # Vite + TypeScript React + Tailwind CSS
│   ├── src/
│   │   ├── components/        # Shared UI components
│   │   ├── pages/             # Route-level page components
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # API wrapper, auth helpers, general utilities
│   │   ├── App.tsx            # React Router routes
│   │   └── main.tsx           # React entry point
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                   # Hono (Bun) REST API
│   ├── src/
│   │   ├── index.ts           # Hono app entry, CORS, route mounting
│   │   ├── routes/            # Auth, tasks, earnings, payouts, postbacks, admin
│   │   ├── middleware/        # Auth, verified gate, contributor rules, fraud controls
│   │   ├── db/                # Schema, migrations, seed logic
│   │   └── lib/               # JWT, email, PayPal helpers
│   └── package.json
│
├── data/
│   └── earnstack.db           # SQLite database (local dev or mounted persistent volume)
├── package.json               # Root workspace deps
├── Procfile                   # Railway process entry
├── README.md
└── .env.example               # Shared environment variable reference
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | TypeScript React 18 + Vite + Tailwind CSS |
| Backend | Hono on Bun |
| Database | PostgreSQL (future) or SQLite for MVP / local dev |
| Auth | JWT (email/password + verification gate) |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |
| Payouts | PayPal Payouts API |
| Offer Walls | TheoremReach, AdGate Media (postback integration) |
| PWA | Web App Manifest + Service Worker |
| Coding Support | Zo used as a coding assistant only |

---

## Design System

### Brand Colors

| Role | Hex | Use |
|---|---|---|
| Background | `#F5F7F4` | Main surfaces |
| Surface | `#FFFFFF` | Cards, forms |
| Primary text | `#18302B` | Headlines, body |
| Secondary text | `#5F6F69` | Labels, helper text |
| Primary accent | `#4E8F7C` | Buttons, active states |
| Accent dark | `#2F6757` | Hover states |
| Border | `#DDE6E1` | Dividers, inputs |
| Success | `#3E7A43` | Verified, completed |
| Warning | `#A36A2B` | Review pending |

### Typography
- **Body/UI:** Inter or Manrope
- **Display:** Instrument Serif (marketing surfaces only)
- **Scale:** Body 16px, Buttons 14px, Labels 12px min

### Design Rules
- ✅ Light-first, clean, editorial
- ✅ Left-aligned body text
- ✅ No neon gradients or gamified noise
- ✅ Proof elements visible: task value, review time, cashout min
- ✅ Mobile-first, touch targets ≥ 44px
- ✅ Dark mode supported

---

## Core Screens

1. **Landing** — trust-first hero, Canada-only messaging, signup CTA
2. **Task Feed** — standard and premium task filters, payout, effort, and deadline visible
3. **Surveys** — TheoremReach offer wall embed (standard task source)
4. **Task Detail** — instructions, proof submission, eligibility, and review timing
5. **Earnings Ledger** — pending review, approved, available, and paid states
6. **Payout** — PayPal email entry, $5 minimum, manual review queue
7. **Contributor Status** — level, progress toward premium access, inactivity notice if applicable
8. **Admin Panel** — task management, payout approvals, fraud flags

---

## API Endpoints

### Auth
- `POST /api/auth/register` — register with email + password
- `POST /api/auth/login` — login, returns JWT
- `POST /api/auth/verify` — email OTP verification to unlock tasks
- `GET /api/auth/me` — current user (protected)

### Tasks
- `GET /api/tasks` — task feed with standard and premium filters (protected + verified)
- `GET /api/tasks/:id` — task detail
- `POST /api/tasks/:id/submit` — submit proof of completion
- `GET /api/tasks/status` — contributor reliability, unlock level, inactivity state

### Earnings
- `GET /api/earnings` — full ledger (manual + sponsor earnings combined)
- `GET /api/earnings/summary` — available balance, pending, lifetime total

### Payouts
- `POST /api/payouts/request` — request PayPal payout ($5 min)
- `GET /api/payouts` — payout history

### Postbacks (Sponsor Networks)
- `GET /api/postback/theoremreach` — TheoremReach survey completion postback
- `GET /api/postback/adgate` — AdGate offer conversion + reversal postback
- `PUT /api/postback/config` — update network share % and active toggle (admin)

### Admin (protected, admin role)
- `GET /api/admin/submissions` — review queue
- `PUT /api/admin/submissions/:id` — approve or reject
- `GET /api/admin/payouts` — pending payout queue
- `PUT /api/admin/payouts/:id` — approve or flag
- `POST /api/admin/tasks` — create new task
- `PUT /api/admin/tasks/:id` — edit task

---

## Database Schema

### Users
```ts
{
  id: UUID,
  email: string,
  password_hash: string,
  province: string,
  verified: boolean,
  role: 'user' | 'admin',
  device_fingerprint: string,
  contributor_level: 'new' | 'reliable' | 'verified_contributor',
  reliability_score: number,
  last_approved_at?: DateTime,
  status_decays_at?: DateTime,
  created_at: DateTime
}
```

### Tasks
```ts
{
  id: UUID,
  title: string,
  type: 'survey' | 'app_test' | 'sponsor_action',
  tier: 'standard' | 'premium',
  description: string,
  effort_minutes: number,
  payout_min: number,
  payout_max: number,
  expires_at: DateTime,
  max_completions: number,
  active: boolean,
  min_contributor_level?: 'new' | 'reliable' | 'verified_contributor'
}
```

### Completions
```ts
{
  id: UUID,
  user_id: UUID,
  task_id: UUID,
  proof: string,
  status: 'pending' | 'approved' | 'rejected',
  payout_amount: number,
  submitted_at: DateTime,
  reviewed_at: DateTime
}
```

### Payouts
```ts
{
  id: UUID,
  user_id: UUID,
  paypal_email: string,
  amount: number,
  status: 'pending' | 'sent' | 'failed',
  requested_at: DateTime,
  processed_at: DateTime
}
```

### Sponsor Config
```ts
{
  network: 'theoremreach' | 'adgate',
  active: boolean,
  user_share_pct: number,
  api_key?: string
}
```

### Sponsor Earnings
```ts
{
  id: UUID,
  user_id: UUID,
  network: string,
  transaction_id: string,
  amount: number,
  status: 'cleared' | 'reversed',
  created_at: DateTime
}
```

### Postback Log
```ts
{
  id: UUID,
  network: string,
  raw_payload: string,
  processed: boolean,
  created_at: DateTime
}
```

---

## Sponsor Postback Flow

1. User opens the Surveys page → TheoremReach survey wall loads
2. User completes a survey → TheoremReach sends GET postback to `/api/postback/theoremreach`
3. EarnStack validates (duplicate check, network active check)
4. User's `sponsor_earnings` credited at configured share % (default 70%)
5. Balance immediately available for withdrawal — no manual review required
6. Same flow applies for AdGate offer completions and handles reversals automatically

> Standard offer wall earnings clear automatically. Premium sponsored task earnings go through manual review before release.

---

## Virtual Currency (Credits)

Offer wall networks (TheoremReach, AdGate) require a **virtual currency (VC)** configuration to operate. EarnStack uses **Credits** as its internal VC — a transparent in-app accounting unit that maps directly to CAD.

### VC Configuration

| Field | Value |
|---|---|
| **VC Name** | Credits |
| **VC Value** | 100 Credits per $1 CAD paid by sponsor |
| **VC Type** | Non-transferable in-app credit |
| **Conversion** | 100 Credits = $1 CAD |
| **Minimum cashout** | 500 Credits ($5 CAD equivalent) |
| **Payout method** | PayPal in CAD |
| **Payout review** | Manual review required before transfer |

### How Credits Work

1. A sponsor pays EarnStack in CAD for a completed task or survey conversion.
2. EarnStack credits the user in Credits at the published rate (100 Credits per $1 CAD sponsor pays).
3. EarnStack retains its margin — the user share (default 70%) is reflected in the Credits balance displayed.
4. Credits appear as **Pending** during the review hold period.
5. After fraud checks and review, Credits move to **Available**.
6. Once the balance reaches 500 Credits ($5 CAD), the user can request a PayPal cashout.

> Standard offer wall Credits clear automatically after postback validation. Premium sponsored task Credits require manual admin review before moving to Available.

### UX Display Rules

- Always show both Credits **and** the CAD equivalent side by side: `125 Credits ($1.25 CAD)`
- Never show Credits as a standalone number without the CAD value nearby
- States used throughout the Earnings Ledger and Payout flow:
  - **Pending review** — Credits held, awaiting validation
  - **Available** — Credits cleared, ready to cash out
  - **Cashed out** — Credits redeemed, PayPal transfer sent
- Minimum cashout label: "Cash out when you reach $5 CAD (500 Credits)"
- Do not use language like "earn coins", "collect rewards", or "spend credits" — Credits are compensation for completed work, not a game currency

---

## Security & Anti-Fraud

- ✅ Passwords hashed with bcrypt
- ✅ JWT authentication with expiry
- ✅ Email OTP verification gate before task access
- ✅ Device fingerprint stored on registration
- ✅ Velocity limits — max submissions per user per day
- ✅ VPN/proxy detection (flag for manual review)
- ✅ Manual payout review before every PayPal transfer
- ✅ Duplicate account detection by device + email
- ✅ Delayed payouts — balance only clears after review window
- ✅ Postback dedup — transaction ID prevents duplicate credits
- ✅ Postback audit log — full trail of all incoming network callbacks

---

## Hosting

EarnStack is no longer deployed on Zo Sites. Zo now supports the project as a **coding assistant only**.

### Frontend — Vercel

The React app is hosted on **Vercel**.

- Connect the GitHub repository (`Lupeys/Earn-Stack-App`) to Vercel
- Root directory: `frontend`
- Framework preset: **Vite**
- Build command: `bun run build`
- Output directory: `dist`
- Set `VITE_API_URL` in Vercel project environment variables
- Custom domain: `EarnStack.ca` (or `app.earnstack.ca` if splitting from marketing site)

### Backend — Railway

The Hono + Bun API is hosted on **Railway**.

- Deploy the repository to Railway
- Railway runs the backend via the root `Procfile`
- Attach persistent storage volume if SQLite stays in production
- Add all backend environment variables in Railway project settings
- Backend URL used as `VITE_API_URL` in the Vercel frontend config

### Domain

- `EarnStack.ca` → Vercel frontend
- Backend accessible via Railway service URL or `api.earnstack.ca` subdomain
- HTTPS provided automatically by both platforms

---

## Procfile

```text
web: cd backend && bun run src/index.ts
```

---

## Environment Variables

`.env.example`:

```bash
# Frontend (set in Vercel project settings)
VITE_API_URL=https://api.earnstack.ca

# Backend (set in Railway project settings)
PORT=3001
JWT_SECRET=change_me
RESEND_API_KEY=change_me
PAYPAL_CLIENT_ID=change_me
PAYPAL_CLIENT_SECRET=change_me
PAYPAL_ENV=sandbox
DATABASE_URL=./data/earnstack.db
THEOREMREACH_API_KEY=change_me
ADGATE_API_KEY=change_me
APP_ORIGIN=https://earnstack.ca
```

---

## Deployment

### Frontend (Vercel)

```bash
cd frontend
bun install
bun run build
```

Vercel project settings:
- Framework preset: **Vite**
- Root directory: `frontend`
- Build command: `bun run build`
- Output directory: `dist`

### Backend (Railway)

```bash
cd backend
bun install
bun run src/index.ts
```

Railway setup:
- Uses root `Procfile` to start the backend
- Attach persistent storage if keeping SQLite in production
- Move to PostgreSQL once live traffic becomes steady

### Local Development

```bash
# Backend
cd backend && bun --hot src/index.ts

# Frontend
cd frontend && bun run dev
```

---

## PWA Support

EarnStack is a Progressive Web App — users on mobile can install it directly from `EarnStack.ca` without the App Store.

- `public/manifest.json` — app name, icons, theme color
- `public/sw.js` — service worker for offline shell
- HTTPS via Vercel + custom domain

Future: Capacitor wrapper for App Store + Play Store submission once MVP is validated.

---

## MVP Launch Checklist

- [ ] Frontend scaffold (Vite + React + Tailwind)
- [ ] Backend scaffold (Hono + Bun)
- [ ] Database schema + migrations
- [ ] Auth (register, login, verify)
- [ ] Landing page (trust-first)
- [ ] Task feed with standard and premium task tiers
- [ ] Task submission + proof upload
- [ ] Earnings ledger (manual + sponsor earnings)
- [ ] Payout request flow
- [ ] Contributor status screen with reliability-based access
- [ ] Admin panel (review queue, payout approvals)
- [ ] Anti-fraud middleware
- [ ] PWA manifest + service worker
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway
- [ ] TheoremReach postback integration
- [ ] AdGate postback integration
- [ ] PayPal Payouts API integration
- [ ] Beta user testing (Canadian users only)

---

## Roadmap

### v1 — MVP
- Core task feed with standard offer wall and premium curated sponsor tasks
- TheoremReach + AdGate postback integration
- Reliability-based contributor access model
- Inactivity decay with faster reinstatement path
- Manual admin review for premium tasks
- PayPal payouts
- PWA on EarnStack.ca

### v2 — Growth
- Capacitor iOS + Android builds
- Automated payout processing
- Sponsor self-serve dashboard
- Reliability progress UI and contributor recovery logic
- AdGate offer feed scheduled sync
- Referral program

### v3 — Scale
- Task API for third-party sponsors
- Higher-value premium task unlocks
- Additional offer wall network integrations
- Regional expansion beyond Canada

---

## Compliance & Disclosures

**Not a lottery or gambling product.** Tasks are sponsor-funded actions; payouts are compensation for completed work, not prizes.

**Tax note:** Earnings may be taxable income under CRA guidelines. Users are responsible for their own tax reporting.

**Not financial advice.** EarnStack provides earning opportunities only.

**Affiliate disclosure:** Some sponsor tasks may include affiliate components disclosed at task level.

---

## Current State (July 2026)

**✅ Working:**
- Auth (register, login, JWT) — end-to-end tested
- Email OTP verification gate (Resend API)
- Task feed — tier-gated (standard always visible, premium locked by contributor level)
- Task detail, submission with proof upload
- Earnings ledger — manual tasks + sponsor earnings combined
- Payout request flow ($5 CAD minimum withdrawal)
- Admin panel (task CRUD, completion review, payout approval)
- Anti-fraud middleware (velocity, device, IP checks)
- PayPal Payouts sandbox — tested ✅

**🆕 Sponsor Networks (v0.3):**
- TheoremReach postback — auto-credits users on survey completion
- AdGate Media postback — offer conversions + reversal handling
- AdGate offer feed sync — scheduled pull → upsert into tasks as standard tier
- User share: 70% (configurable per-network via `/api/postback/config`)

**🆕 Contributor Levels (v0.4):**
- Three levels: New → Reliable → Verified Contributor
- First-time thresholds: 5 approved → Reliable, 15 → Verified Contributor
- Reinstatement is faster: 2 approved → Reliable, 5 → Verified Contributor
- Inactivity decay after 60 days — Verified → Reliable, Reliable → New
- Task feed gating — premium tasks show as locked with reason for under-level users

**⏳ Pending:**
- TheoremReach publisher account signup
- AdGate publisher account signup
- Production postback URLs configured on sponsor dashboards
- Sponsor self-serve dashboard (v2)
- Phone verification (in addition to email)

**🚫 Removed:**
- Zo Sites deployment — replaced by Vercel (frontend) + Railway (backend)
- `zosite.json` — no longer needed
- `index.tsx` root entry — no longer needed (Railway runs `backend/src/index.ts` via Procfile)
- `frontend/src/utils/zo-theme.ts` — Zo theming bridge removed

---

## License

MIT License © 2026 Erik Contador

---

**Built for Canadians who want real side cash — clearly earned.**
