import { SignIn } from '@clerk/nextjs'
import { BookOpen, CreditCard, Utensils } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="bg-muted grid flex-1 lg:grid-cols-2">
      <div className="hidden flex-1 flex-col justify-center p-8 md:p-12 lg:flex">
        <div className="max-w-xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome Back
            </h2>
            <p className="text-muted-foreground text-lg text-pretty">
              Pick up right where you left off. Your centralized ecosystem is ready to help you save time and reduce the mental tax of modern living.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <BookOpen className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Academic Assistant</h3>
                  <p className="text-muted-foreground text-sm leading-snug">
                    Track syllabi, assignments, and grades without the hassle.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <CreditCard className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Financial Clarity</h3>
                  <p className="text-muted-foreground text-sm leading-snug">
                    Never forget a subscription renewal or lose track of recurring costs.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                  <Utensils className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Health & Pantry</h3>
                  <p className="text-muted-foreground text-sm leading-snug">
                    Stop wondering "what's for dinner" with smart inventory tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-1 items-center justify-center p-6 md:p-10 lg:justify-start'>
        <SignIn
          appearance={{
            elements: {
              headerTitle: 
                'text-foreground text-2xl font-semibold tracking-tight',
              headerSubtitle: 
                'text-muted-foreground text-sm',
              formButtonPrimary: 
                'bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 py-2 rounded-md transition-colors font-medium text-sm',
              card: 
                'bg-card text-card-foreground shadow-sm border border-border rounded-xl w-full max-w-[400px]',
              socialButtonsBlockButton: 
                'bg-background hover:bg-muted text-foreground border border-border h-9 rounded-md transition-colors text-sm font-medium',
              socialButtonsBlockButtonText: 
                'text-foreground font-medium',
              dividerLine: 
                'bg-border',
              dividerText: 
                'text-muted-foreground text-xs uppercase',
              formFieldLabel: 
                'text-foreground text-sm font-medium',
              formFieldInput: 
                'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              footerActionText: 
                'text-muted-foreground text-sm',
              footerActionLink: 
                'text-primary hover:text-primary/90 font-medium hover:underline underline-offset-4',
              identityPreviewText: 
                'text-foreground font-medium',
              identityPreviewEditButton: 
                'text-primary hover:text-primary/90',
            },
            layout: {
              socialButtonsPlacement: 'bottom',
              socialButtonsVariant: 'blockButton',
            }
          }}
        />
      </div>
    </div>
  );
}
