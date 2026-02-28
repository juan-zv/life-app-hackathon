import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export const metadata: Metadata = {
  title: "Life App Hackathon",
  description: "Gabe, Juan and Sebas Life App Hackathon project",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <SignedIn>
                <AppSidebar />
              </SignedIn>
              <main className="w-full">
                <SignedIn>
                  <SidebarTrigger />
                </SignedIn>
                <div className="flex justify-end p-4">
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
                {children}
              </main>
            </SidebarProvider>

          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}