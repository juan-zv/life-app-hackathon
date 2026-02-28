import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code, BookOpen, Terminal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function PlaidSandboxDocs() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="h-4 w-4" />
          Plaid Sandbox Docs
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[800px] sm:max-w-[800px] sm:w-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Plaid API Sandbox Reference
          </SheetTitle>
          <SheetDescription>
            Documentation for testing scenarios in the Sandbox environment.
            These endpoints are unique to Sandbox and cannot be used in Production.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <div className="space-y-8 pb-10">
            
            {/* Introduction Section */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold tracking-tight">Introduction</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Plaid&apos;s Sandbox environment provides a number of endpoints that can be used to configure testing scenarios. 
                These endpoints allow you to bypass Link flows, trigger webhooks, simulate transfers, and force item error states.
              </p>
              
              <div className="rounded-md border p-4 bg-muted/50">
                <h4 className="text-sm font-medium mb-3">Quick Reference</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="font-mono text-xs">/sandbox/public_token/create</Badge>
                    <span className="text-muted-foreground truncate">Create a test Item without Link</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="font-mono text-xs">/sandbox/item/reset_login</Badge>
                    <span className="text-muted-foreground truncate">Force ITEM_LOGIN_REQUIRED state</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="font-mono text-xs">/sandbox/item/fire_webhook</Badge>
                    <span className="text-muted-foreground truncate">Test webhook handling</span>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            {/* Endpoints List */}
            <section className="space-y-8">
              
              {/* Public Token Create */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge>POST</Badge>
                  <code className="text-sm font-semibold">/sandbox/public_token/create</code>
                </div>
                <h4 className="font-medium">Create a test Item</h4>
                <p className="text-sm text-muted-foreground">
                  Creates a valid public_token for an arbitrary institution ID, initial products, and test credentials.
                  Maps to a new Sandbox Item. Exchange this for an access_token to perform API actions.
                </p>
                <div className="rounded-md bg-stone-950 p-4 text-stone-50 overflow-x-auto">
                  <pre className="text-xs font-mono">
{`const publicTokenRequest = {
  institution_id: institutionID,
  initial_products: initialProducts,
};
const response = await client.sandboxPublicTokenCreate(publicTokenRequest);
const publicToken = response.data.public_token;`}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* Reset Login */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge>POST</Badge>
                  <code className="text-sm font-semibold">/sandbox/item/reset_login</code>
                </div>
                <h4 className="font-medium">Force Item Error State</h4>
                <p className="text-sm text-muted-foreground">
                  Forces an Item into an <code className="bg-muted px-1 rounded">ITEM_LOGIN_REQUIRED</code> state.
                  Useful for testing Link update mode flows.
                </p>
                <div className="rounded-md bg-stone-950 p-4 text-stone-50 overflow-x-auto">
                  <pre className="text-xs font-mono">
{`const request = {
  access_token: accessToken,
};
await client.sandboxItemResetLogin(request);`}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* Fire Webhook */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge>POST</Badge>
                  <code className="text-sm font-semibold">/sandbox/item/fire_webhook</code>
                </div>
                <h4 className="font-medium">Fire Test Webhook</h4>
                <p className="text-sm text-muted-foreground">
                  Triggers a webhook for a given Sandbox Item. Supports multiple webhook types like <code className="bg-muted px-1 rounded">DEFAULT_UPDATE</code>.
                </p>
                <div className="rounded-md bg-stone-950 p-4 text-stone-50 overflow-x-auto">
                  <pre className="text-xs font-mono">
{`const request = {
  access_token: accessToken,
  webhook_code: 'DEFAULT_UPDATE'
};
await plaidClient.sandboxItemFireWebhook(request);`}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* Transfer Simulate */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge>POST</Badge>
                  <code className="text-sm font-semibold">/sandbox/transfer/simulate</code>
                </div>
                <h4 className="font-medium">Simulate Transfer Event</h4>
                <p className="text-sm text-muted-foreground">
                  Simulate a transfer event (posted, settled, failed, etc.) in Sandbox.
                  Funds will not actually move.
                </p>
                <div className="rounded-md bg-stone-950 p-4 text-stone-50 overflow-x-auto">
                  <pre className="text-xs font-mono">
{`const request = {
  transfer_id,
  event_type: 'posted',
  failure_reason: failureReason,
};
await plaidClient.sandboxTransferSimulate(request);`}
                  </pre>
                </div>
              </div>

            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
