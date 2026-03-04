# Life App Hackathon

This app is made to save time in your life. It aims to be a complete dashboard for your life. You make thousands of non-life-changing decisions every day-the kind that don't define your future but definitely drain your present. From tracking syllabi to managing forgotten subscriptions and wondering what's for dinner, the 'mental tax' of modern living is real.

We built Life App to reclaim those lost hours. We've created a centralized ecosystem that doesn't just "list" your tasks—it starts doing them for you.

Life App is a modern web application built with Next.js 16 for the USU Hackathon. This project focuses on providing a seamless user experience with robust authentication, persistent UI state, and a clean, responsive design.

Live Demo [HERE](https://life-app-hackathon.vercel.app/)

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Library:** [shadcn/ui](https://ui.shadcn.com/) (built on [Radix UI](https://www.radix-ui.com/))
- **Authentication:** [Clerk](https://clerk.com/)
- **Banking:** [Plaid](https://plaid.com/) (Sandbox integration)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theming:** `next-themes` (Dark/Light mode)
- **Forms:** `react-hook-form` + `zod` validation

## 📂 Project Structure

```
├── app/                          # Next.js App Router pages and layouts
│   ├── globals.css               # Global styles and Tailwind directives
│   ├── layout.tsx                # Root layout with providers (Clerk, Theme, Sidebar)
│   ├── page.tsx                  # Landing page (signed out) / Dashboard (signed in)
│   ├── academics/                # Academic assignments tracker
│   │   └── page.tsx
│   ├── api/                      # Backend API routes
│   │   ├── categories/           # Categories API proxy (prevents CORS)
│   │   │   └── route.ts
│   │   ├── generate-cart/        # Walmart cart generation
│   │   │   └── route.ts
│   │   └── plaid/                # Plaid banking integration
│   │       ├── accounts/
│   │       ├── create-link-token/
│   │       ├── recurring/
│   │       ├── sandbox-connect/
│   │       ├── set-access-token/
│   │       └── transactions/
│   ├── food-and-health/          # Food & pantry management
│   │   └── page.tsx
│   ├── onboarding/               # New user onboarding wizard
│   │   └── page.tsx
│   ├── sign-in/                  # Custom Clerk sign-in page
│   ├── sign-up/                  # Custom Clerk sign-up page
│   ├── subscriptions/            # Subscription & bank tracking
│   │   └── page.tsx
│   ├── tui-tool/                 # Terminal UI documentation
│   │   └── page.tsx
│   └── walmart-cart/             # Smart grocery cart builder
│       ├── index.tsx             # useWalmartCart hook & CartResults component
│       └── page.tsx
├── components/                   # React components
│   ├── landing-page.tsx          # Marketing landing page
│   ├── academics/                # Academic dashboard components
│   │   ├── academics-dashboard.tsx
│   │   ├── assignments-list.tsx
│   │   ├── data.ts
│   │   └── schema.ts
│   ├── dashboard/                # Main dashboard
│   │   ├── dashboard.tsx
│   │   └── data.ts
│   ├── food-and-health/          # Food tracking components
│   │   ├── add-food-item-sheet.tsx
│   │   ├── data.ts
│   │   ├── food-dashboard.tsx
│   │   ├── food-item-list.tsx
│   │   ├── low-stock-alert.tsx
│   │   └── schema.ts
│   ├── layout/                   # Layout components
│   │   ├── app-sidebar.tsx       # Main sidebar navigation
│   │   ├── chat-assistant.tsx    # AI chat assistant
│   │   ├── mode-toggle.tsx       # Dark/Light mode switcher
│   │   ├── nav-user.tsx          # User profile in sidebar
│   │   └── theme-provider.tsx    # Theme context provider
│   ├── onboarding/               # Onboarding wizard steps
│   │   ├── heading.tsx
│   │   ├── onboarding-wizard.tsx
│   │   ├── schema.ts
│   │   ├── step-academics.tsx
│   │   ├── step-food-health.tsx
│   │   └── step-subscriptions.tsx
│   ├── subscriptions/            # Subscription management
│   │   ├── add-subscription-sheet.tsx
│   │   ├── plaid-bank-dashboard.tsx
│   │   ├── plaid-link-button.tsx
│   │   ├── plaid-sandbox-docs.tsx
│   │   ├── schema.ts
│   │   ├── subscription-dashboard.tsx
│   │   └── subscription-list.tsx
│   └── ui/                       # Reusable UI primitives (shadcn/ui)
├── hooks/                        # Custom React hooks
│   └── use-mobile.ts             # Hook to detect mobile viewport
├── lib/                          # Utility functions
│   ├── plaid.ts                  # Plaid client configuration
│   └── utils.ts                  # Class name merging utility (cn)
└── public/                       # Static assets
    └── news.json                 # News feed data
```

## ✨ Features by Page

### Dashboard (`/`)
- Overview of all life metrics (subscriptions, academics, food)
- Quick stats cards with monthly spend, upcoming assignments, and low-stock alerts
- User ID display for TUI tool integration
- Date display and navigation to all sections

### Food & Health (`/food-and-health`)
- **Pantry Inventory:** Track food items with current amounts
- **Low Stock Alerts:** Automatic notifications when items fall below threshold
- **Add Food Items:** Quick-add sheet with name, amount, and restock threshold
- **Search & Filter:** Find items quickly in your inventory

### Walmart Cart (`/walmart-cart`)
- **Smart Cart Generation:** Auto-select low-stock items from your pantry
- **Manual Additions:** Add extra items not in your inventory
- **One-Click Walmart Link:** Generate a direct link to Walmart with all items

### Academics (`/academics`)
- **Canvas Sync:** Pull assignments directly from Canvas LMS
- **Assignment List:** View all upcoming assignments with due dates
- **Progress Tracking:** Monitor completion status

### Subscriptions (`/subscriptions`)
- **Subscription Tracker:** Manage recurring payments (monthly, yearly, weekly)
- **Plaid Integration:** Connect bank accounts via Plaid sandbox
- **Account Balances:** View linked account balances
- **Transaction History:** See recent transactions

### Onboarding (`/onboarding`)
- **Multi-Step Wizard:** Guided setup for new users
- **Food & Health Preferences:** Dietary restrictions, cooking skill, household size
- **Academic Profile:** Education level, major, learning style
- **Subscription Preferences:** Bank sync options

### TUI Tool (`/tui-tool`)
- **Documentation Page:** Instructions for command-line tool usage
- **User ID Retrieval:** Steps to get your ID for terminal authentication

## 🔐 Authentication

Integrated with **Clerk** for secure user management:
- Protected routes via middleware
- Custom Sign-in/Sign-up pages
- User profile management in sidebar

## 🎨 Theming

Full support for **Dark** and **Light** modes, respecting system preferences by default. Implemented using `next-themes`.

## 🛠️ Getting Started

First, install the dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

Set up your environment variables (create a `.env.local` file):

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
```

Run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
