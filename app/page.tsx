import { SignedIn, SignedOut } from "@clerk/nextjs";
import { LandingPage } from "@/components/landing-page";
import { Dashboard } from "@/components/dashboard/dashboard";

export default function Home() {
  return (
    <>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
  );
}
