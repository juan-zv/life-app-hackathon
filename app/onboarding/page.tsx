import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function OnboardingPage() {
  const { userId } = await auth()

  if (userId) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <OnboardingWizard />
    </div>
  )
}
