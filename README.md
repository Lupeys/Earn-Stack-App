# EarnStack

> **Real side cash for Canadians. Verified tasks. Transparent payouts. No hype.**

EarnStack is a Canada-first micro-task marketplace where verified users complete short sponsor-funded tasks and earn real cash, paid out via PayPal at a $5 minimum. No fake point ladders, no penny grind, no sketchy promises.

🌐 **Live:** [EarnStack.ca](https://EarnStack.ca)

---

## 🎯 Brand Position

- **Canada-first** — built for Canadians, with local language, payout rules, and compliance in mind
- **Trust-first** — transparent payout ranges, review timelines, and eligibility rules shown upfront
- **No hype** — modest, factual income language; no exaggerated earnings claims
- **Fraud-protected** — device verification, velocity limits, manual payout review

---

## 🗂️ Project Structure

```
earn-stack-app/
├── frontend/                  # Vite + TypeScript React + Tailwind CSS
│   ├── public/
│   │   ├── manifest.json      # PWA manifest
│   │   ├── sw.js              # Service worker (offline shell)
│   │   └── icons/            # PWA icons (192x192, 512x512)
│   ├── src/
│   │   ├── components/        # Shared UI components
│   │   ├── pages/             # Route-level page components
│   │   │   ├── Landing.tsx    # Trust-first landing page
│   │   │   ├── TaskFeed.tsx   # Available tasks
│   │   │   ├── TaskDetail.tsx # Task completion + proof submission
│   │   │   ├── Earnings.tsx   # Ledger: pending review, available balance
│   │   │   ├── Payout.tsx     # PayPal cashout ($5 min)
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
2. **Task Feed** — verified tasks showing effort time, payout range, deadline
3. **Task Detail** — completion form + proof submission
4. **Earnings Ledger** — completed tasks, pending review balance, available balance
5. **Payout** — PayPal email entry, $5 minimum, manual review queue
6. **Admin Panel** — task management, payout approvals, fraud flags

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` — register with email + password
- `POST /api/auth/login` — login, returns JWT
- `POST /api/auth/verify` — phone/email verification to unlock tasks
- `GET /api/auth/me` — current user (protected)

### Tasks
- `GET /api/tasks` — available task feed (protected + verified)
- `GET /api/tasks/:id` — task detail
- `POST /api/tasks/:id/submit` — submit proof of completion

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
  verified: boolean,         // unlocks task feed
  role: 'user' | 'admin',
  device_fingerprint: string, // fraud prevention
  created_at: DateTime
}
```

### Tasks
```ts
{
  id: UUID,
  title: string,
  type: 'survey' | 'app_test' | 'sponsor_action',
  description: string,
  effort_minutes: number,
  payout_min: number,        // CAD
  payout_max: number,        // CAD
  expires_at: DateTime,
  max_completions: number,
  active: boolean
}
```

### Completions
```ts
{
  id: UUID,
  user_id: UUID,
  task_id: UUID,
  proof: string,             // URL or text
  status: 'pending' | 'approved' | 'rejected',
  payout_amount: number,     // CAD, set on approval
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
  amount: number,            // CAD
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
- [ ] Task feed (3 task types)
- [ ] Task submission + proof upload
- [ ] Earnings ledger
- [ ] Payout request flow
- [ ] Admin panel (review queue, payout approvals)
- [ ] Anti-fraud middleware
- [ ] PWA manifest + service worker
- [ ] Deploy to Zo Sites → EarnStack.ca
- [ ] PayPal Payouts API integration
- [ ] Beta user testing (Canadian users only)

---

## 🗺️ Roadmap

### v1 — MVP (Now → September 2026)
- Core task feed, earnings ledger, PayPal payouts
- Manual admin review
- PWA on EarnStack.ca

### v2 — Growth
- Capacitor iOS + Android builds → App Store / Play Store
- Automated payout processing
- Sponsor self-serve dashboard
- Referral program

### v3 — Scale
- Task API for third-party sponsors
- Reputation/trust score system
- Higher-value task unlocks
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
