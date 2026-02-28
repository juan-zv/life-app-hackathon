import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground w-full overflow-hidden relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-transparent to-transparent opacity-30 animate-pulse"></div>
      
      <div className="text-center space-y-8 max-w-4xl px-4 animate-in fade-in zoom-in duration-700 slide-in-from-bottom-5">
        
        <div className="flex justify-center mb-6 animate-bounce duration-3000">
           <img src="/logo.png" alt="Life App Hackathon Logo" className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-indigo-600 animate-in slide-in-from-left-10 duration-1000">
          Welcome to the Life App
        </h1>
        
        <p className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-right-10 duration-1000 delay-200">
          Manage your life, track your progress, and achieve your goals with ease. Join us nicely and get started today.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12 animate-in fade-in duration-1000 delay-500">
          <Button asChild size="lg" className="text-xl px-10 py-7 rounded-full shadow-[0_0_30px_-5px_var(--primary)] hover:shadow-[0_0_50px_-5px_var(--primary)] transition-all duration-300 hover:scale-110 active:scale-95 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 border-0">
            <Link href="/onboarding">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-xl px-10 py-7 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm bg-background/50">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-20 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_60%,transparent_100%)]"></div>
      <div className="fixed top-0 left-0 w-full h-full -z-30 bg-gradient-to-b from-background to-background/50"></div>
    </div>
  );
}