import { SignIn } from '@clerk/nextjs';
import { LayoutDashboard, Lock, PieChart, Zap } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className='bg-muted grid flex-1 lg:grid-cols-2'>
      <div className='hidden flex-1 items-center justify-end p-6 md:p-10 lg:flex'>
        <ul className='max-w-sm space-y-8'>
          <li>
            <div className='flex items-center gap-2'>
              <LayoutDashboard className='size-4' />
              <p className='font-semibold'>Access your dashboard</p>
            </div>
            <p className='text-muted-foreground mt-2 text-sm'>
              View all your metrics, news, and updates in one centralized place.
            </p>
          </li>
          <li>
            <div className='flex items-center gap-2'>
              <PieChart className='size-4' />
              <p className='font-semibold'>Track your progress</p>
            </div>
            <p className='text-muted-foreground mt-2 text-sm'>
              Visualize your goals and achievements with interactive charts.
            </p>
          </li>
          <li>
            <div className='flex items-center gap-2'>
              <Lock className='size-4' />
              <p className='font-semibold'>Secure authentication</p>
            </div>
            <p className='text-muted-foreground mt-2 text-sm'>
              Your data is protected with enterprise-grade security standards.
            </p>
          </li>
          <li>
            <div className='flex items-center gap-2'>
              <Zap className='size-4' />
              <p className='font-semibold'>Lightning fast</p>
            </div>
            <p className='text-muted-foreground mt-2 text-sm'>
              Experience zero latency as you navigate through your daily tasks.
            </p>
          </li>
        </ul>
      </div>
      <div className='flex flex-1 items-center justify-center p-6 md:p-10 lg:justify-start'>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 
                'bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 py-2 rounded-md transition-colors font-medium text-sm',
              card: 
                'bg-card text-card-foreground shadow-sm border border-border rounded-xl w-full max-w-[400px]',
              headerTitle: 
                'text-foreground text-2xl font-semibold tracking-tight',
              headerSubtitle: 
                'text-muted-foreground text-sm',
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
