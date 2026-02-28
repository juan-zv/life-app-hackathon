import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground w-full">
      <div className="text-center space-y-6 max-w-2xl px-4 animate-in fade-in zoom-in duration-500">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight lg:text-7xl">
          Welcome to the <span className="text-primary">Life App Hackathon</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-prose mx-auto">
          Manage your life, track your progress, and achieve your goals with ease. Join us nicely and get started today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </div>
  );
}