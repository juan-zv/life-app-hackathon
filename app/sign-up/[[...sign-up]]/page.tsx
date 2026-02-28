import { SignUp } from '@clerk/nextjs'
import { CheckCircle2, LayoutDashboard, Zap } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="bg-muted grid flex-1 lg:grid-cols-2">
      <div className="hidden flex-1 flex-col justify-center p-8 md:p-12 lg:flex">
        <div className="max-w-xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Reclaim Your Time
            </h2>
            <blockquote className="border-l-4 pl-4 italic text-muted-foreground">
              &quot;This app is made to save time in your life. It aims to be a
              complete dashboard for your life. You make thousands of
              non-life-changing decisions every day&mdash;the kind that don&apos;t define
              your future but definitely drain your present. From tracking syllabi
              to managing forgotten subscriptions and wondering what&apos;s for
              dinner, the &apos;mental tax&apos; of modern living is real.&quot;
            </blockquote>
          </div>

          <div className="space-y-6">
            <p className="text-lg font-medium">
              We&apos;ve created a centralized ecosystem that doesn&apos;t just &quot;list&quot;
              your tasks&mdash;it starts doing them for you.
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <LayoutDashboard className="h-6 w-6 text-primary" />
                <span>Complete dashboard for your life</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <span>Automated decision making</span>
              </li>
              <li className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary" />
                <span>Zero latency interface</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='flex flex-1 items-center justify-center p-6 md:p-10 lg:justify-start'>
        <SignUp appearance={{
          elements: {
            headerTitle: "hidden",
            headerSubtitle: "hidden",
          }
        }} />
      </div>
    </div>
  );
}
