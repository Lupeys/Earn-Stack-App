# EarnStack

> **Real side cash for Canadians. Verified tasks. Transparent payouts. No hype.**

EarnStack is a Canada-first micro-task marketplace where verified users complete sponsor-funded tasks and earn real cash, paid out via PayPal at a $5 minimum. The platform combines a broad wall of standard verified tasks with premium sponsored tasks, giving reliable contributors something meaningful to work toward — without turning earnings into a game. No fake point ladders, no penny grind, no sketchy promises.

🌐 **Live:** [EarnStack.ca](https://EarnStack.ca)

---

## 🎯 Brand Position

- **Canada-first** — built for Canadians, with local language, payout rules, and compliance in mind
- **Trust-first** — transparent payout ranges, review timelines, and eligibility rules shown upfront
- **No hype** — modest, factual income language; no exaggerated earnings claims
- **Fraud-protected** — device verification, velocity limits, manual payout review
- **Progress with purpose** — users build status through reliability and approval history, not streaks or point ladders

---

## 📦 Task Tiers

### Standard Tasks

A broad wall of verified tasks that keeps the feed active and gives all verified users regular access to sponsor-funded work. These tasks should be clearly explained and consistently available so the app feels useful from day one.

Each standard task card shows:
- Payout amount or range
- Estimated effort time
- Deadline or expiry
- Eligibility requirements
- Expected review timing
- Proof requirement

### Premium Sponsored Tasks

Higher-value campaigns with stricter eligibility, clearer proof standards, and stronger review controls. Premium tasks are access-earned opportunities for reliable contributors — not random bonuses or prize-style rewards.

Each premium task card also shows:
- Minimum contributor level required
- Any sponsor-specific eligibility rules
- Manual review requirement before earnings clear
- Limited completion availability when applicable

---

## 🏅 Reliability Access Model

EarnStack rewards consistency without streaks, spins, or point ladders. Status comes from approved work, a clean review history, and recent participation — giving users something real to work toward and feel proud of.

### Contributor Levels

| Level | How Earned | Access |
|---|---|---|
| **New** | Default after account verification | Standard verified tasks |
| **Reliable** | Initial run of approved submissions with clean review history | Standard tasks + improved priority |
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
│   ├── public/
│   │   ├── manifest.json      # PWA manifest
│   │   ├── sw.js              # Service worker (offline shell)
│   │   └── icons/             # PWA icons (192x192, 512x512)
│   ├── src/
│   │   ├── components/        # Shared UI components
│   │   ├── pages/             # Route-level page components
│   │   │   ├── Landing.tsx    # Trust-first landing page
│   │   │   ├── TaskFeed.tsx   # Available tasks (standard + premium)
│   │   │   ├── TaskDetail.tsx # Task completion + proof submission
│   │   │   ├── Earnings.tsx   # Ledger: pending review, available balance
│   │   │   ├── Payout.tsx     # PayPal cashout ($5 min)
│   │   │   ├── Status.tsx     # Contributor level, progress, inactivity notice
│   │   │   └── Admin.tsx      # Task mgmt, payout approval, fraud flags
│   │   ├── context/           # Auth context
│   │   ├── utils/             # API client, constants
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                   # Hono (Bun) REST API
│   ├── src/
│   │   ├── index.ts           # Hono app entry
│   │   ├── routes/
│   │   │   ├── auth.ts        # Register, login, verify
│   │   │   ├── tasks.ts       # Task feed, submission, proof upload
│   │   │   ├── earnings.ts    # Ledger, balance
│   │   │   ├── payouts.ts     # Payout requests, PayPal integration
│   │   │   └── admin.ts       # Admin-only: approve, flag, manage
│   │   ├── middleware/
│   │   │   ├── auth.ts        # JWT middleware
│   │   │   └── fraud.ts       # Velocity limits, device checks
│   │   ├── db/
│   │   │   ├── schema.ts      # Database schema
│   │   │   └── seed.ts        # Seed tasks + admin user
│   │   └── lib/
│   │       ├── jwt.ts
│   │       └── paypal.ts      # PayPal Payouts API client
│   ├── package.json
│   └── .env.example
│
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
3. **Task Detail** — instructions, proof submission, eligibility, and review timing
4. **Earnings Ledger** — pending review, approved, available, and paid states
5. **Payout** — PayPal email entry, $5 minimum, manual review queue
6. **Contributor Status** — level, progress toward premium access, inactivity notice if applicable
7. **Admin Panel** — task management, payout approvals, fraud flags

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` — register with email + password
- `POST /api/auth/login` — login, returns JWT
- `POST /api/auth/verify` — phone/email verification to unlock tasks
- `GET /api/auth/me` — current user (protected)

### Tasks
- `GET /api/tasks` — task feed with standard and premium filters (protected + verified)
- `GET /api/tasks/:id` — task detail
- `POST /api/tasks/:id/submit` — submit proof of completion
- `GET /api/tasks/status` — contributor reliability, unlock level, inactivity state

### Earnings
- `GET /api/earnings` — full ledger for current user
- `GET /api/earnings/summary` — available balance, pending, lifetime total

### Payouts
- `POST /api/payouts/request` — request PayPal payout ($5 min)
- `GET /api/payouts` — payout history

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

---

## 🔐 Security & Anti-Fraud

- ✅ Passwords hashed with bcrypt
- ✅ JWT authentication with expiry
- ✅ Phone/email verification gate before task access
- ✅ Device fingerprint stored on registration
- ✅ Velocity limits — max submissions per user per day
- ✅ VPN/proxy detection (flag for manual review)
- ✅ Manual payout review before every PayPal transfer
- ✅ Duplicate account detection by device + email
- ✅ Delayed payouts — balance only clears after review window

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
- [ ] Earnings ledger
- [ ] Payout request flow
- [ ] Contributor status screen with reliability-based access
- [ ] Admin panel (review queue, payout approvals)
- [ ] Anti-fraud middleware
- [ ] PWA manifest + service worker
- [ ] Deploy to Zo Sites → EarnStack.ca
- [ ] PayPal Payouts API integration
- [ ] Beta user testing (Canadian users only)

---

## 🗺️ Roadmap

### v1 — MVP (Now → September 2026)
- Core task feed with standard and premium task tiers
- Reliability-based contributor access
- Manual admin review
- PWA on EarnStack.ca

### v2 — Growth
- Capacitor iOS + Android builds → App Store / Play Store
- Automated payout processing
- Sponsor self-serve dashboard
- Reliability progress UI and contributor recovery logic
- Referral program

### v3 — Scale
- Task API for third-party sponsors
- Reliability and trust score system
- Higher-value premium task unlocks
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

### Current Implementation Status (2026-07-04)

**✅ Working:**
- Auth (register, login, JWT) — verified end-to-end
- Task feed, detail, submission with proof upload
- Earnings ledger with pending/cleared/paid status
- Payout request flow ($5 min withdrawal)
- Admin panel (task CRUD, completion review, payout approval)
- Email OTP verification gate (Resend API)
- Anti-fraud middleware (velocity, device, IP checks)
- PayPal Payouts sandbox integration — tested ✅
- SQLite database with auto-creation + seed data

**🆕 Sponsor Networks (v0.3):**
- TheoremReach postback endpoint — receives survey completions, auto-credits users ✅
- AdGate Media postback endpoint — receives offer conversions, handles reversals ✅
- `sponsor_config` table — per-network share %, active toggle, API keys
- `sponsor_earnings` table — separate ledger for network earnings (auto-cleared)
- `postback_log` table — full audit trail of all incoming postbacks
- Earnings + Payout routes include sponsor earnings in balance calculations
- Frontend `/surveys` page with TheoremReach survey wall embed
- User share default: 70% (EarnStack keeps 30% margin)

**⏳ Pending:**
- AdGate offer feed — scheduled pull + task display
- Sponsor self-serve dashboard (v2)
- Contributor level + reliability score logic
- Standard/premium task tier support

### Architecture (Updated)
├── index.ts
├── routes/
│   ├── auth.ts           # Register, login, me
│   ├── tasks.ts          # Task feed, detail, submission
│   ├── earnings.ts       # Ledger + sponsor earnings
│   ├── payouts.ts        # Payout request, history (includes sponsor balance)
│   ├── postback.ts       # TheoremReach + AdGate postback handlers + config
│   ├── verify.ts         # Email OTP verification
│   └── admin.ts          # Task mgmt, review, payout approval
├── middleware/
│   ├── auth.ts           # JWT auth + admin middleware
│   ├── verified.ts       # Email verification gate
│   └── fraud.ts          # Anti-fraud checks
├── db/
│   └── schema.ts         # SQLite schema + sponsor config + seed data
└── lib/
    └── jwt.ts            # JWT create/verify, bcrypt, user helpers
```

### Sponsor Postback Flow
1. User clicks "Surveys" → TheoremReach survey wall opens (iframe/redirect)
2. User completes survey → TheoremReach sends GET postback to `/api/postback/theoremreach`
3. EarnStack validates (duplicate check, config active check)
4. User's `sponsor_earnings` credited at configured share % (default 70%)
5. Balance immediately available for withdrawal (no manual review needed)

### Sponsor Config
```bash
# Enable theoremreach
curl -X PUT http://localhost:3001/api/postback/config \
  -H "Content-Type: application/json" \
  -H "x-postback-secret: earnstack-postback-dev-secret" \
  -d '{"network":"theoremreach","active":true,"user_share_pct":70}'

# Enable adgate
curl -X PUT http://localhost:3001/api/postback/config \
  -H "Content-Type: application/json" \
  -H "x-postback-secret: earnstack-postback-dev-secret" \
  -d '{"network":"adgate","active":true,"user_share_pct":70}'
```

### Running Locally
```bash
cd backend && bun install && cd ..
cd frontend && bun install && cd ..
cd backend && bun --hot src/index.ts    # port 3001
cd frontend && bun run dev              # port 5173
```


The Zo-managed deployment at `file 'earn-stack-app'` uses a single-process architecture (Hono + Vite in one Bun server). This GitHub repo preserves the cleaner frontend/backend split for code organization. See [Zo Sites docs](/?t=sites) for deployment options.
