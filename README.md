# EarnStack

> **Real side cash for Canadians. Verified tasks. Transparent payouts. No hype.**

EarnStack is a Canada-first micro-task marketplace where verified users complete sponsor-funded tasks and earn real cash, paid out via PayPal at a $5 minimum.

🌐 **Marketing:** [EarnStack.ca](https://EarnStack.ca) (Namecheap, WordPress)  
📱 **App:** [app.earnstack.ca](https://app.earnstack.ca) (Cloudflare Pages)  
⚙️ **API:** Zo-hosted backend (always-on via Cloudflare Pages proxy)

---

## 🏗️ Deployment Architecture (2026-07-11 Pivot)

| Layer | Host | Domain |
|---|---|---|
| Marketing site | Namecheap (WordPress) | earnstack.ca |
| App frontend | **Cloudflare Pages** | app.earnstack.ca |
| API backend | Zo | proxied via CF Pages Functions |
| Database | SQLite (Zo filesystem) | — |

**Why the pivot:** Zo Free plan sleeps after inactivity. Zo Free plan allows 1 custom domain — but it's locked to earnstack.ca which is on Namecheap. Splitting to Cloudflare Pages gives the app subdomain `app.earnstack.ca` with 24/7 uptime on CF's CDN, while the backend stays on Zo behind a CF Pages Function proxy that keeps the backend warm.

### How it works

1. **Cloudflare Pages** serves the Vite-built React frontend from `frontend/dist/`
2. **Pages Functions** (`functions/api/[[path]].ts`) proxies `/api/*` requests to the Zo backend
3. The Function has a **wake-retry** — if Zo is asleep the first response is a 503 sleep page, the Function retries 3× over 6s to wake it
4. Backend processes postbacks, auth, earnings — same code, same DB

---

## 🎯 Brand Position

- **Canada-first** — built for Canadians, with local language, payout rules, and compliance in mind
- **Trust-first** — transparent payout ranges, review timelines, and eligibility rules shown upfront
- **No hype** — modest, factual income language; no exaggerated earnings claims
- **Fraud-protected** — device verification, velocity limits, manual payout review
- **Progress with purpose** — users build status through reliability and approval history, not streaks or point ladders

---

## 📦 Task Tiers

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

## 🏅 Reliability Access Model

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

## 🗂️ Project Structure

```
earn-stack-app/
├── frontend/                  # Vite + TypeScript React + Tailwind CSS
│   ├── src/
│   │   ├── components/        # Shared UI components
│   │   │   ├── BottomNav.tsx  # Mobile tab bar (Tasks|Surveys|Rewards|Earnings|Cash Out)
│   │   │   ├── Navbar.tsx     # Desktop navigation + auth-aware links
│   │   │   └── theme-provider.tsx  # Dark/light theme provider
│   │   ├── pages/             # Route-level page components
│   │   │   ├── Home.tsx       # Trust-first landing page
│   │   │   ├── Register.tsx   # Email/name/password signup
│   │   │   ├── Login.tsx      # Email/login sign-in
│   │   │   ├── Verify.tsx     # Email OTP verification gate
│   │   │   ├── TaskFeed.tsx   # Standard + premium task feed
│   │   │   ├── TaskComplete.tsx # Proof submission per task
│   │   │   ├── Surveys.tsx    # TheoremReach survey wall embed
│   │   │   ├── Rewards.tsx    # Canadian rewards stacking guide
│   │   │   ├── Earnings.tsx   # Pending, available, lifetime ledger
│   │   │   ├── Payout.tsx     # PayPal cashout (C min)
│   │   │   └── Admin.tsx      # Task CRUD, completion review, payout approval
│   │   ├── types/index.ts     # TypeScript interfaces (User, Task, etc.)
│   │   ├── utils/
│   │   │   ├── api.ts         # Client-side fetch wrapper with auth header
│   │   │   ├── auth.ts        # Token management helpers
│   │   │   ├── utils.ts       # General helpers
│   │   │   └── zo-theme.ts    # Zo theming bridge
│   │   ├── App.tsx            # React Router — all page routes defined here
│   │   └── main.tsx           # React entry point
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                   # Hono (Bun) REST API
│   ├── src/
│   │   ├── index.ts           # Hono app entry, CORS, route mounting
│   │   ├── routes/
│   │   │   ├── auth.ts        # Register, login, me
│   │   │   ├── tasks.ts       # Feed (tier-gated), detail, submission, status
│   │   │   ├── earnings.ts    # Ledger — manual + sponsor earnings combined
│   │   │   ├── payouts.ts     # Payout request, history (includes sponsor balance)
│   │   │   ├── postback.ts    # TheoremReach + AdGate postback handlers + config
│   │   │   ├── verify.ts      # Email OTP verification (Resend API)
│   │   │   ├── adgate.ts      # AdGate offer feed sync + cache
│   │   │   └── admin.ts       # Admin: task CRUD, completion review, payout approval
│   │   ├── middleware/
│   │   │   ├── auth.ts        # JWT + admin middleware
│   │   │   ├── verified.ts    # Email verification gate
│   │   │   ├── contributor.ts # Level system, decay, reinstatement
│   │   │   └── fraud.ts       # Velocity limits, device checks
│   │   ├── db/
│   │   │   └── schema.ts      # SQLite schema, migration, seed data
│   │   └── lib/
│   │       ├── jwt.ts         # JWT create/verify, bcrypt
│   │       ├── email.ts       # Resend email sender
│   │       └── paypal.ts      # PayPal Payouts API client
│   └── package.json
│
├── data/
│   └── earnstack.db           # SQLite database (auto-created)
├── package.json               # Root deps (Bun workspace)
├── index.tsx                  # Entry — re-exports backend/src/index.ts
├── zosite.json                # Zo Sites deployment config
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | TypeScript React 18 + Vite + Tailwind CSS |
| Backend | Hono on Bun |
| Database | PostgreSQL (or SQLite for local dev) |
| Auth | JWT (email/password + phone verification gate) |
| Hosting | Zo Sites → EarnStack.ca |
| Payouts | PayPal Payouts API |
| Offer Walls | TheoremReach, AdGate Media (postback integration) |
| PWA | Web App Manifest + Service Worker |

---

## 🎨 Design System

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

## 📱 Core Screens

1. **Landing** — trust-first hero, Canada-only messaging, waitlist/signup CTA
2. **Task Feed** — standard and premium task filters, payout, effort, and deadline visible
3. **Surveys** — TheoremReach offer wall embed (standard task source)
4. **Task Detail** — instructions, proof submission, eligibility, and review timing
5. **Earnings Ledger** — pending review, approved, available, and paid states
6. **Payout** — PayPal email entry, $5 minimum, manual review queue
7. **Contributor Status** — level, progress toward premium access, inactivity notice if applicable
8. **Admin Panel** — task management, payout approvals, fraud flags

---

## 🔌 API Endpoints

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

## 💾 Database Schema

### Users
```ts
{
  id: UUID,
  email: string,
  password_hash: string,
  province: string,
  verified: boolean,                    // unlocks task feed
  role: 'user' | 'admin',
  device_fingerprint: string,           // fraud prevention
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
  payout_min: number,                   // CAD
  payout_max: number,                   // CAD
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
  proof: string,                        // URL or text
  status: 'pending' | 'approved' | 'rejected',
  payout_amount: number,                // CAD, set on approval
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
  amount: number,                       // CAD
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
  user_share_pct: number,               // default 70
  api_key?: string
}
```

### Sponsor Earnings
```ts
{
  id: UUID,
  user_id: UUID,
  network: string,
  transaction_id: string,               // dedup key
  amount: number,                       // CAD after share %
  status: 'cleared' | 'reversed',
  created_at: DateTime
}
```

### Postback Log
```ts
{
  id: UUID,
  network: string,
  raw_payload: string,                  // full audit trail
  processed: boolean,
  created_at: DateTime
}
```

---

## 🔄 Sponsor Postback Flow

1. User opens the Surveys page → TheoremReach survey wall loads
2. User completes a survey → TheoremReach sends GET postback to `/api/postback/theoremreach`
3. EarnStack validates (duplicate check, network active check)
4. User's `sponsor_earnings` credited at configured share % (default 70%)
5. Balance immediately available for withdrawal — no manual review required
6. Same flow applies for AdGate offer completions and handles reversals automatically

> Standard offer wall earnings clear automatically. Premium sponsored task earnings go through manual review before release.

---

## 🪙 Virtual Currency (Credits)

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
- Use these states throughout the Earnings Ledger and Payout flow:
  - **Pending review** — Credits held, awaiting validation
  - **Available** — Credits cleared, ready to cash out
  - **Cashed out** — Credits redeemed, PayPal transfer sent
- Minimum cashout label: "Cash out when you reach $5 CAD (500 Credits)"
- Do not use language like "earn coins", "collect rewards", or "spend credits" — Credits are compensation for completed work, not a game currency

### Why Credits Exist

Offer wall networks are built around virtual currency APIs — they credit users in VC, not directly in cash. EarnStack uses Credits as the required in-app accounting layer that satisfies network requirements while keeping the real value (CAD) transparent to users at all times.

Credits are not a loyalty program, a gamification mechanic, or a points ladder. They are an internal unit that represents a defined share of the CAD paid by sponsors — shown clearly and converted honestly.

### App Store / Play Store Notes

- Credits are non-purchasable by users. There is no in-app purchase of Credits for cash.
- Credits are earned only through verified task completions and sponsor postbacks.
- Credits are not directly redeemable for instant cash — a review hold and minimum threshold apply.
- If EarnStack is distributed through the App Store or Play Store in the future, the Credits system and payout flow must comply with Apple and Google billing policies in force at time of submission. Review store guidelines before adding any purchase or redemption flow.

---

## 🔐 Security & Anti-Fraud

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

## 🚀 Deployment (Zo Sites)

This app is deployed via [Zo Sites](https://zo.computer) at [EarnStack.ca](https://EarnStack.ca).

```json
// zosite.json
{
  "name": "earn-stack-app",
  "domain": "EarnStack.ca",
  "build": {
    "command": "bun run build",
    "output": "frontend/dist"
  },
  "services": [
    {
      "name": "backend",
      "command": "bun run backend/src/index.ts",
      "port": 3001
    }
  ]
}
```

### Local Dev
```bash
# Install deps
cd frontend && bun install
cd ../backend && bun install

# Run frontend
cd frontend && bun run dev

# Run backend
cd backend && bun run dev
```

---

## 📲 PWA Support

EarnStack is a Progressive Web App — users on mobile can install it directly from `EarnStack.ca` without the App Store.

- `public/manifest.json` — app name, icons, theme color
- `public/sw.js` — service worker for offline shell
- HTTPS via Zo Sites + custom domain

Future: Capacitor wrapper for App Store + Play Store submission once MVP is validated.

---

## 📋 MVP Launch Checklist

- [ ] Frontend scaffold (Vite + React + Tailwind)
- [ ] Backend scaffold (Hono + Bun)
- [ ] Database schema + migrations
- [ ] Auth (register, login, verify)
- [ ] Landing page (trust-first, waitlist)
- [ ] Task feed with standard and premium task tiers
- [ ] Task submission + proof upload
- [ ] Earnings ledger (manual + sponsor earnings)
- [ ] Payout request flow
- [ ] Contributor status screen with reliability-based access
- [ ] Admin panel (review queue, payout approvals)
- [ ] Anti-fraud middleware
- [ ] PWA manifest + service worker
- [ ] Deploy to Zo Sites → EarnStack.ca
- [ ] TheoremReach postback integration
- [ ] AdGate postback integration
- [ ] CPAGrip postback integration
- [ ] PayPal Payouts API integration
- [ ] Beta user testing (Canadian users only)

---

## 🗺️ Roadmap

### v1 — MVP (Now → September 2026)
- Core task feed with standard (offer wall) and premium (curated sponsor) task tiers
- TheoremReach + AdGate postback integration ✅
- Reliability-based contributor access model
- Inactivity decay with faster reinstatement path
- Manual admin review for premium tasks
- PayPal Payouts
- PWA on EarnStack.ca

### v2 — Growth
- Capacitor iOS + Android builds → App Store / Play Store
- Automated payout processing
- Sponsor self-serve dashboard (premium task creation + budget funding)
- Reliability progress UI and contributor recovery logic
- AdGate offer feed — scheduled pull + task display
- Referral program

### v3 — Scale
- Task API for third-party sponsors
- Higher-value premium task unlocks
- Additional offer wall network integrations
- Regional expansion beyond Canada

---

## ⚖️ Compliance & Disclosures

**Not a lottery or gambling product.** Tasks are sponsor-funded actions; payouts are compensation for completed work, not prizes.

**Tax note:** Earnings may be taxable income under CRA guidelines. Users are responsible for their own tax reporting.

**Not financial advice.** EarnStack provides earning opportunities only.

**Affiliate disclosure:** Some sponsor tasks may include affiliate components disclosed at task level.

---

## 📄 License

MIT License © 2026 Erik Contador

---

**Built for Canadians who want real side cash — clearly earned.**

---

### Current State (2026-07-04)

**✅ Working:**
- Auth (register, login, JWT) — end-to-end tested
- Email OTP verification gate (Resend API)
- Task feed — tier-gated (standard always visible, premium locked by contributor level)
- Task detail, submission with proof upload
- Earnings ledger — manual tasks + sponsor earnings combined
- Payout request flow (C$5 minimum withdrawal)
- Admin panel (task CRUD, completion review, payout approval)
- Anti-fraud middleware (velocity, device, IP checks)
- PayPal Payouts sandbox — tested ✅

**🆕 Sponsor Networks (v0.3):**
- TheoremReach postback — auto-credits users on survey completion
- AdGate Media postback — offer conversions + reversal handling
- AdGate offer feed sync — scheduled pull → upsert into tasks as standard tier
- User share: 70% (configurable per-network via `/api/postback/config`)

**🆕 Contributor Levels (v0.4) — feature/rewards-stacking:**
- Three levels: New → Reliable → Verified Contributor
- First-time thresholds: 5 approved → Reliable, 15 → Verified Contributor
- Reinstatement is faster: 2 approved → Reliable, 5 → Verified Contributor
- Inactivity decay after 60 days — Verified → Reliable, Reliable → New
- Level evaluated on every completion approval; decay checked on every request
- Task feed gating — premium tasks show as locked with reason for under-level users

**⏳ Pending:**
- TheoremReach publisher account signup
- AdGate publisher account signup
- Production postback URLs configured on sponsor dashboards
- Sponsor self-serve dashboard (v2)
- Phone verification (in addition to email)

**🚫 Removed (2026-07-04):**
- n8n service — removed to free up the single Free plan HTTP slot
- Duplicate earn-stack-app service — cleaned up

### Development

```bash
# Start backend
cd backend && bun --hot src/index.ts

# Start frontend
cd frontend && bun run dev

# Production build (Zo Sites)
bun run prod
```

### Deployment

EarnStack runs as a Zo Site at `file 'earn-stack-app'`, accessible at `https://earn-stack-app-lupeys.zo.computer` (private — owner sign-in required).

A single Bun process serves the Hono API and Vite frontend together. The `backend/` / `frontend/` split is for code organization — the live deployment uses root `package.json`.

