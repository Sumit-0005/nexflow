# Nexflow 🔗

**Nexflow** is a full-stack SaaS automation platform that lets users connect their favorite services — Google Drive, Discord, Slack, and Notion — and build custom workflows using a visual drag-and-drop editor. Think of it as a lightweight Zapier built with the modern Next.js stack.

---

## ✨ Features

- **Visual Workflow Editor** — Drag-and-drop canvas powered by React Flow to design multi-step automations
- **Google Drive Integration** — Listen for file changes and trigger workflows on drive activity via webhooks
- **Discord Integration** — Send messages to Discord channels using webhooks
- **Slack Integration** — Post messages to Slack channels with OAuth 2.0
- **Notion Integration** — Create and update Notion database entries automatically
- **Authentication** — Secure sign-in/sign-up with Clerk
- **Billing & Credits** — Stripe-powered subscription management with a free tier and credits system
- **Profile Settings** — Upload and manage profile pictures via Uploadcare
- **Dark Mode** — Full theme support with `next-themes`
- **Cron Jobs** — Schedule and automate workflow execution

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui + Radix UI |
| Auth | Clerk |
| Database | PostgreSQL via Prisma ORM |
| Payments | Stripe |
| File Upload | Uploadcare |
| Workflow Canvas | React Flow |
| Animations | Framer Motion + tsparticles |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| Package Manager | Bun |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/)
- PostgreSQL database
- Accounts on: Clerk, Stripe, Discord, Slack, Notion, Google Cloud, Uploadcare

### Installation

1. **Clone the repository**

   ```bash
git clone https://github.com/your-username/nexflow.git
cd nexflow
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**

   ```bash
   bun dev
   # or
   npm run dev
   ```

   > Note: The dev script uses `--experimental-https`. Open [https://localhost:3000](https://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env.local` file at the root with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
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

# Misc
NGROK_URI=
CRON_JOB_KEY=
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/               # Sign-in and sign-up pages (Clerk)
│   ├── (main)/
│   │   └── (pages)/
│   │       ├── dashboard/    # Home dashboard
│   │       ├── workflows/    # Workflow list + visual editor
│   │       ├── connections/  # OAuth connections (Discord, Slack, Notion, Google)
│   │       ├── billing/      # Stripe subscription & credits
│   │       └── settings/     # Profile settings
│   └── api/
│       ├── auth/             # OAuth callbacks (Discord, Slack, Notion)
│       ├── clerk-webhook/    # Clerk user sync webhook
│       ├── drive/            # Google Drive API integration
│       ├── drive-activity/   # Google Drive push notification handler
│       └── payment/          # Stripe webhook handler
├── components/               # Shared UI components
├── lib/                      # Utility functions and helpers
└── providers/                # React context providers
prisma/
└── schema.prisma             # Database schema
```

---

## 🗄️ Database Schema

The app uses PostgreSQL with the following core models:

- **User** — Stores user profile, tier (`Free`/`Pro`), and credits
- **LocalGoogleCredential** — OAuth tokens for Google Drive per user
- **DiscordWebhook** — Saved Discord webhook configurations
- **Slack** — Slack OAuth tokens and workspace info
- **Notion** — Notion OAuth tokens and database connections
- **Connections** — Links a user's active integration connections
- **Workflows** — Stores the node graph, templates, cron schedules, and publish state

---

## 📦 Available Scripts

```bash
bun dev       # Start dev server (HTTPS)
bun build     # Production build
bun start     # Start production server
bun lint      # Run ESLint
```

---

## 🚢 Deployment

The easiest way to deploy Nexflow is on [Vercel](https://vercel.com):

1. Push your repository to GitHub
2. Import it on Vercel
3. Add all environment variables from `.env.local` to your Vercel project settings
4. Deploy

Make sure to update all redirect URIs in your OAuth app settings (Discord, Slack, Notion, Google Cloud Console) to point to your production domain instead of `localhost:3000`.

---

## 📄 License

This project is private. All rights reserved.