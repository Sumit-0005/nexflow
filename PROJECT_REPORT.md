# Nexflow — SaaS Workflow Automation Platform

## Project Overview

Nexflow is a **visual workflow automation platform** built with Next.js 14 (App Router). It enables users to connect external services (Discord, Slack, Notion, Google Drive) and build automated multi-step workflows via a drag-and-drop editor. Workflows can be triggered by Google Drive file changes and execute actions across connected services.

---

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router), React 18 |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS, shadcn/ui (Radix primitives) |
| **Database** | PostgreSQL (Neon serverless) via Prisma ORM |
| **Authentication** | Clerk (with dev bypass mode) |
| **Payments** | Stripe |
| **State Management** | Zustand, React Context + useReducer |
| **Workflow Editor** | ReactFlow |
| **Animations** | Framer Motion, tsParticles |
| **Forms** | react-hook-form + Zod validation |
| **Integrations** | Google APIs (Drive), Discord, Slack, Notion |
| **Notifications** | Sonner (toast) |
| **File Upload** | UploadCare |
| **Theme** | next-themes (dark/light) |

---

## Directory Structure

```
src/
├── app/
│   ├── (auth)/                    # Auth pages (sign-in, sign-up)
│   ├── (main)/(pages)/            # Main app pages
│   │   ├── billing/               # Subscription management
│   │   ├── connections/           # Service connection management
│   │   ├── dashboard/             # Dashboard (placeholder)
│   │   ├── logs/                  # Logs (placeholder)
│   │   ├── settings/              # User profile settings
│   │   ├── templates/             # Templates (placeholder)
│   │   └── workflows/             # Workflow list + editor
│   │       ├── editor/[editorId]/ # Visual workflow editor
│   │       └── _components/       # Workflow list components
│   └── api/                       # API routes
│       ├── auth/callback/         # Discord, Notion, Slack OAuth callbacks
│       ├── drive/                 # Google Drive file listing
│       ├── drive-activity/        # Drive activity watching + webhook
│       ├── payment/               # Stripe checkout
│       ├── clerk-webhook/         # Clerk user sync
│       └── debug/clerk/           # Auth diagnostics
├── components/
│   ├── ui/                        # shadcn/ui primitives (20 components)
│   ├── global/                    # Landing page + shared components
│   ├── icons/                     # Custom SVG icons (7)
│   ├── sidebar/                   # Sidebar navigation
│   ├── infobar/                   # Top info bar with credits
│   └── forms/                     # Profile & workflow forms
├── lib/
│   ├── auth.ts                    # Clerk auth wrapper (bypass support)
│   ├── db.ts                      # Prisma singleton client
│   ├── constant.ts                # Nav menu, node types, connections
│   ├── editor-utils.ts            # Editor drag-drop, content handlers
│   ├── types.ts                   # TypeScript types + Zod schemas
│   └── utils.ts                   # cn() classname utility
├── providers/
│   ├── theme-provider.tsx         # Dark/light mode
│   ├── modal-provider.tsx         # Dynamic modal system
│   ├── editor-provider.tsx        # Workflow editor state
│   ├── connections-provider.tsx   # Service connection state
│   └── billing-provider.tsx       # Credits & tier state
├── store.tsx                      # Zustand global store
└── middleware.ts                  # Clerk auth middleware
```

---

## Routes & Pages

| Route | Type | Description |
|---|---|---|
| `/` | Page | Landing page with pricing cards |
| `/sign-in` | Page | Clerk sign-in |
| `/sign-up` | Page | Clerk sign-up |
| `/dashboard` | Page | Dashboard (placeholder) |
| `/connections` | Page | Connect Discord, Notion, Slack, Google Drive |
| `/workflows` | Page | List workflows, create new |
| `/workflows/editor/[id]` | Page | Visual workflow editor |
| `/billing` | Page | Subscription plans & credits |
| `/settings` | Page | User profile settings |
| `/templates` | Page | Templates (placeholder) |
| `/logs` | Page | Logs (placeholder) |

---

## API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/callback/discord` | GET | Discord OAuth — exchange code, fetch guild, redirect |
| `/api/auth/callback/notion` | GET | Notion OAuth — exchange code, search databases, redirect |
| `/api/auth/callback/slack` | GET | Slack OAuth — exchange code via OAuth v2, redirect |
| `/api/drive` | GET | List Google Drive files |
| `/api/drive-activity` | GET | Set up Drive change watching (webhook channel) |
| `/api/drive-activity/notification` | POST | Webhook receiver — executes workflows on Drive changes |
| `/api/payment` | GET | List Stripe subscription plans |
| `/api/payment` | POST | Create Stripe checkout session |
| `/api/clerk-webhook` | POST | Sync Clerk users to database |
| `/api/debug/clerk` | GET | Auth diagnostics |
| `/api/clear-clerk-cookies` | GET | Reset Clerk auth state |

---

## Database Schema (Prisma + PostgreSQL)

### Models

**User**
- `clerkId` (unique), `email` (unique), `name`, `profileImage`
- `tier`: Free (default) / Pro / Unlimited
- `credits`: default "10"
- `googleResourceId`, `localGoogleId`

**Workflows**
- `name`, `description`, `nodes`, `edges` (JSON strings)
- `discordTemplate`, `slackTemplate`, `notionTemplate`
- `slackChannels` (JSON array string), `slackAccessToken`
- `notionAccessToken`, `notionDbId`
- `flowPath`, `cronPath` — execution plan
- `publish` (boolean, default false)

**DiscordWebhook** — Linked to User via `clerkId`
**Slack** — Linked to User via `clerkId`
**Notion** — Linked to User via `clerkId`
**Connections** — Junction table linking users to webhook/service connections
**LocalGoogleCredential** — Google Drive access token storage

---

## Authentication

- **Clerk** with email/password or OAuth
- **Dev bypass mode**: Set `CLERK_BYPASS=true` in `.env` to skip authentication locally, returning a mock user
- Middleware protects all `/(main)` routes and allows public routes (`, `/api/clerk-webhook`, `/api/drive-activity/notification`)
- OAuth callbacks are excluded from middleware auth checks

---

## Workflow Engine

### Architecture
1. User builds a workflow visually using **ReactFlow** drag-and-drop editor
2. Each node represents a **Trigger** (Google Drive) or **Action** (Discord, Slack, Notion, Wait, AI, Email, Condition)
3. Nodes are connected via edges to define execution order
4. The workflow stores `flowPath` — an ordered array of action types to execute sequentially

### Execution Flow
1. **Trigger**: Google Drive file change → webhook sent to `/api/drive-activity/notification`
2. **Orchestrator**: The notification route iterates through all published workflows for the user
3. **Step Execution**: For each step in `flowPath`:
   - `Discord` → sends message via webhook URL
   - `Slack` → posts to selected Slack channels
   - `Notion` → creates a new database page
   - `Wait` → schedules via cron-job.org API
4. **Credits**: Each workflow execution deducts 1 credit

---

## Integrated Services

| Service | Auth Method | Capabilities |
|---|---|---|
| **Google Drive** | Clerk OAuth (`oauth_google`) | List files, watch for changes (webhook) |
| **Discord** | OAuth2 + Bot token | Connect webhook, send messages |
| **Slack** | OAuth v2 (Slack App) | List channels, post messages via bot |
| **Notion** | OAuth (Notion Integration) | Search databases, create pages |
| **Stripe** | Secret key | Subscription checkout, tier management |

---

## Environment Variables

Key configuration in `.env`:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_URL` | Base URL (`http://localhost:3000` in dev) |
| `DATABASE_URL` | PostgreSQL connection (Neon) |
| `CLERK_BYPASS` | Skip Clerk auth in development |
| `DISCORD_*` | Discord OAuth credentials |
| `SLACK_*` | Slack OAuth credentials |
| `NOTION_*` | Notion OAuth credentials |
| `GOOGLE_CLIENT_*` | Google OAuth credentials |
| `STRIPE_SECRET` | Stripe API key |
| `NGROK_URI` | Public tunnel URL for webhooks |
| `CRON_JOB_KEY` | cron-job.org API key |

---

## Providers (State Management)

| Provider | Scope | State |
|---|---|---|
| **ThemeProvider** | Global | Dark/light mode |
| **ModalProvider** | Global | Dynamic modal rendering |
| **BillingProvider** | Global | Credits, tier |
| **ConnectionsProvider** | Editor | Discord/Google/Notion/Slack connection state, workflow template, loading |
| **EditorProvider** | Editor | Nodes, edges, selected element, undo/redo history |

---

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env   # or use existing .env

# Run database migrations
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

> **Note**: The Neon database may pause after inactivity. Visit the [Neon Console](https://console.neon.tech) to wake it up if you see "Can't reach database server" errors.

---

## Common Issues

| Issue | Cause | Fix |
|---|---|---|
| `Can't reach database server` | Neon database paused | Wake via Neon Console |
| `Cannot read properties of undefined (reading '0')` | API response missing expected data | Check provider credentials |
| `Domains, protocols and ports must match` | OAuth redirect uses HTTPS but dev server is HTTP | Use `http://localhost:3000` in dev (already configured) |
| Google Drive API fails | Empty `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` | Set values in `.env` |
