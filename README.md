# Life App Hackathon

A modern web application built with Next.js 16 for the Life App Hackathon. This project focuses on providing a seamless user experience with robust authentication, persistent UI state, and a clean, responsive design.

Live Demo [HERE](https://life-app-hackathon.vercel.app/)

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Library:** [shadcn/ui](https://ui.shadcn.com/) (built on [Radix UI](https://www.radix-ui.com/))
- **Authentication:** [Clerk](https://clerk.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theming:** `next-themes` (Dark/Light mode)
- **Forms:** `react-hook-form` + `zod` validation

## 📂 Project Structure

The project follows a standard Next.js App Router structure, organized for scalability:

```
├── app/                  # Next.js App Router pages and layouts
│   ├── globals.css       # Global styles and Tailwind directives
│   ├── layout.tsx        # Root layout with providers (Clerk, Theme, Sidebar)
│   ├── page.tsx          # Landing page
│   └── sign-in/          # Custom Clerk sign-in page
├── components/           # React components
│   ├── ui/               # Reusable UI primitives (shadcn/ui components)
│   ├── layout/           # Layout-specific components (Sidebar, Navbar)
│   │   ├── app-sidebar.tsx   # Main sidebar navigation component
│   │   ├── mode-toggle.tsx   # Dark/Light mode switcher
│   │   └── theme-provider.tsx # Theme context provider
│   └── ...
├── hooks/                # Custom React hooks
│   └── use-mobile.ts     # Hook to detect mobile viewport
├── lib/                  # Utility functions
│   └── utils.ts          # Class name merging utility (cn)
└── public/               # Static assets
```

## ✨ Key Features

### 1. Robust Authentication
Integrated with **Clerk** for secure user management. The authentication flow includes:
- Protected routes via middleware (implied/standard pattern).
- Custom Sign-in/Sign-up pages styled to match the application's design system.
- User profile management.

### 2. Persistent Sidebar State
The application features a collapsible sidebar that remembers your preference across sessions.
- **Implementation:** Uses a cookie (`sidebar_state`) to store the collapsed/expanded status.
- **Server-Side Rendering:** The `RootLayout` reads the cookie server-side to prevent hydration mismatches (flickering) on initial load.

### 3. Theming
Full support for **Dark** and **Light** modes, respecting system preferences by default. Implemented using `next-themes` to prevent flash of incorrect theme (FOUC).

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
```

Run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.