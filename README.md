<div align="center">

<img src="images/logo.png" alt="Nexflow Logo" width="80" />

# Nexflow

**Visual SaaS Workflow Automation — connect your apps, automate your work.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-Private-red?style=flat-square)](#license)

</div>

---

## What is Nexflow?

Nexflow is a **full-stack SaaS automation platform** that lets you visually connect your favourite apps — Google Drive, Discord, Slack, and Notion — and build powerful multi-step workflows using a drag-and-drop editor. Think of it as a lightweight Zapier built with the modern Next.js 14 App Router stack.

---

## Screenshots

<div align="center">

### Landing Page
<img src="images/landing.png" alt="Nexflow Landing Page" width="100%" />

### Workflow Editor
<img src="images/editor.png" alt="Visual Workflow Editor powered by React Flow" width="100%" />

### Connections Dashboard
<img src="images/connections.png" alt="Service Connections — Google Drive, Discord, Slack, Notion" width="100%" />

### Billing & Credits
<img src="images/billing.png" alt="Stripe-powered Billing & Credits System" width="100%" />

</div>

---

## ✨ Features

- **Visual Workflow Editor** — Drag-and-drop canvas powered by React Flow; design multi-step automations with ease
- **Google Drive Integration** — Listen for file changes and trigger workflows via Google Drive webhooks
- **Discord Integration** — Post messages to Discord channels using configured webhooks
- **Slack Integration** — Connect your Slack workspace via OAuth 2.0 and post to any channel
- **Notion Integration** — Automatically create and update entries in Notion databases
- **Authentication** — Secure sign-in and sign-up powered by Clerk
- **Billing & Credits** — Stripe-powered subscription tiers (Free / Pro) with a per-execution credits system
- **Profile Settings** — Upload and manage your profile picture via Uploadcare
- **Dark Mode** — Full light/dark theme support via `next-themes`
- **Scheduled Workflows** — Cron-based automation scheduling via cron-job.org

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui + Radix UI |
| Authentication | Clerk |
| Database | PostgreSQL (Neon serverless) via Prisma ORM |
| Payments | Stripe |
| File Upload | Uploadcare |
| Workflow Canvas | React Flow |
| Animations | Framer Motion + tsParticles |
| State Management | Zustand + React Context |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |
| Package Manager | Bun |

---

## 🏗️ Architecture Overview

```
Google Drive Change
       │
       ▼
/api/drive-activity/notification  ←── Webhook
       │
       ▼
 Load published workflows
       │
       ▼
  Iterate flowPath[]
       │
  ┌────┴────────────────────────┐
  │  Discord  Slack  Notion  Wait│
  └─────────────────────────────┘
       │
       ▼
 Deduct 1 credit per execution
```

Nexflow uses a server-side **workflow engine** that:
1. Receives a push notification from Google Drive via a registered webhook channel
2. Looks up all published workflows belonging to the triggering user
3. Executes each step in the stored `flowPath` array (Discord → Slack → Notion → Wait)
4. Deducts one credit per workflow run and updates the user's tier accordingly

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Clerk sign-in / sign-up pages
│   ├── (main)/(pages)/
│   │   ├── dashboard/             # Overview dashboard
│   │   ├── workflows/             # Workflow list + visual editor
│   │   ├── connections/           # OAuth service connections
│   │   ├── billing/               # Stripe subscription & credits
│   │   └── settings/              # User profile settings
│   └── api/
│       ├── auth/callback/         # OAuth callbacks (Discord, Slack, Notion)
│       ├── clerk-webhook/         # Clerk → DB user sync
│       ├── drive/                 # Google Drive file listing
│       ├── drive-activity/        # Drive webhook setup + handler
│       └── payment/               # Stripe checkout
├── components/
│   ├── ui/                        # shadcn/ui primitives
│   ├── global/                    # Shared layout & landing components
│   ├── sidebar/                   # Navigation sidebar
│   └── forms/                     # Profile & workflow forms
├── lib/
│   ├── auth.ts                    # Clerk auth wrapper
│   ├── db.ts                      # Prisma singleton
│   ├── constant.ts                # Node types, nav menu, connections
│   ├── editor-utils.ts            # Drag-drop & content helpers
│   └── types.ts                   # TypeScript types + Zod schemas
├── providers/                     # Theme, Modal, Editor, Billing, Connections
└── store.tsx                      # Zustand global store
prisma/
└── schema.prisma                  # Database schema
```

---

## 🗄️ Database Schema

The app uses PostgreSQL (Neon serverless) with the following core models:

| Model | Description |
|---|---|
| `User` | Profile, tier (`Free`/`Pro`), credits balance |
| `Workflows` | Node graph JSON, templates, cron schedule, publish state |
| `LocalGoogleCredential` | Google Drive OAuth tokens per user |
| `DiscordWebhook` | Saved Discord webhook configurations |
| `Slack` | Slack OAuth tokens and workspace info |
| `Notion` | Notion OAuth tokens and database connections |
| `Connections` | Links a user's active integration connections |

---

## 🔗 Integrations

| Service | Auth Method | Capabilities |
|---|---|---|
| Google Drive | Clerk OAuth (`oauth_google`) | List files, watch for changes via webhook |
| Discord | OAuth2 + Bot token | Connect webhook, send channel messages |
| Slack | OAuth v2 | List channels, post messages via bot |
| Notion | OAuth (Notion Integration) | Search databases, create/update pages |
| Stripe | Secret key | Subscription checkout, tier management |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/)
- A PostgreSQL database (e.g. [Neon](https://neon.tech))
- Accounts on: Clerk, Stripe, Discord, Slack, Notion, Google Cloud Console, Uploadcare
- An [ngrok](https://ngrok.com/) or similar tunnel for local webhook testing

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Sumit-0005/nexflow.git
cd nexflow
```

**2. Install dependencies**

```bash
bun install
# or
npm install
```

**3. Set up environment variables**

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local` — see the [Environment Variables](#-environment-variables) section below.

**4. Set up the database**

```bash
npx prisma generate
npx prisma db push
```

**5. Start the development server**

```bash
bun dev
# or
npm run dev
```

> **Note:** The dev script runs with `--experimental-https`. Open [https://localhost:3000](https://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create `.env.local` at the project root with the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_BYPASS=false            # Set to true to skip Clerk auth locally

# Database (Neon PostgreSQL)
DATABASE_URL=

# App URLs
NEXT_PUBLIC_URL=https://localhost:3000
NEXT_PUBLIC_DOMAIN=localhost:3000
NEXT_PUBLIC_SCHEME=https://

# Google OAuth & Drive
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
OAUTH2_REDIRECT_URI=
NEXT_PUBLIC_GOOGLE_SCOPES=https://www.googleapis.com/auth/drive
NEXT_PUBLIC_OAUTH2_ENDPOINT=https://accounts.google.com/o/oauth2/v2/auth

# Discord
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_TOKEN=
DISCORD_PUBLICK_KEY=
NEXT_PUBLIC_DISCORD_REDIRECT=

# Notion
NOTION_API_SECRET=
NOTION_CLIENT_ID=
NOTION_REDIRECT_URI=https://localhost:3000/api/auth/callback/notion
NEXT_PUBLIC_NOTION_AUTH_URL=

# Slack
SLACK_SIGNING_SECRET=
SLACK_BOT_TOKEN=
SLACK_APP_TOKEN=
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_REDIRECT_URI=https://localhost:3000/api/auth/callback/slack
NEXT_PUBLIC_SLACK_REDIRECT=

# Stripe
STRIPE_SECRET=

# Uploadcare
NEXT_PUBLIC_UPLOAD_CARE_CSS_SRC=https://cdn.jsdelivr.net/npm/@uploadcare/blocks@
NEXT_PUBLIC_UPLOAD_CARE_SRC_PACKAGE=/web/lr-file-uploader-regular.min.css

# Webhooks & Cron
NGROK_URI=
CRON_JOB_KEY=
```

---

## 📦 Available Scripts

```bash
bun dev       # Start dev server (HTTPS, experimental)
bun build     # Production build
bun start     # Start production server
bun lint      # Run ESLint
```

---

## 🚢 Deployment

The recommended deployment target is [Vercel](https://vercel.com):

1. Push your repo to GitHub
2. Import it in Vercel and set all environment variables from `.env.local`
3. Deploy

> **Important:** After deploying, update all OAuth redirect URIs in your Google Cloud Console, Discord App, Slack App, and Notion Integration settings to point to your production domain instead of `localhost:3000`.

---

## 🐛 Common Issues

| Issue | Cause | Fix |
|---|---|---|
| `Can't reach database server` | Neon DB paused after inactivity | Wake via [Neon Console](https://console.neon.tech) |
| `Cannot read properties of undefined (reading '0')` | API response missing expected data | Check your OAuth provider credentials |
| `Domains, protocols and ports must match` | OAuth redirect mismatch | Use `http://localhost:3000` in dev (already configured) |
| Google Drive API fails | Empty `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET` | Set both values in `.env.local` |

---

## 📄 License

This project is private. All rights reserved © Sumit-0005.
