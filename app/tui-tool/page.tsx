import { Info, Terminal, Copy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TuitoolPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Terminal className="h-8 w-8" />
            CommandLine Assistant (TUI)
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            For power users and developers seeking keyboard-first efficiency.
          </p>
        </div>

        <Alert className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle>Developer Preview</AlertTitle>
          <AlertDescription>
            The TUI tool allows you to interact with your data directly from your terminal, ideal for headless environments or scripting workflows.
          </AlertDescription>
        </Alert>

        <Card>
            <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Follow these steps to authenticate your terminal session.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        1. Retrieve your User ID
                    </h3>
                    <p className="text-muted-foreground">
                        The TUI requires your unique User ID to sync with your dashboard.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg border border-dashed flex flex-col gap-2">
                        <p className="text-sm font-medium"> Instructions:</p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-2">
                            <li>Navigate to the <span className="font-semibold text-foreground">Dashboard</span>.</li>
                            <li>Locate the ID badge in the top-right corner (next to the date).</li>
                            <li>Click the <Copy className="inline h-3 w-3 mx-1" /> button to copy your full ID to the clipboard.</li>
                        </ol>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">
                        2. Launch the Application
                    </h3>
                    <div className="bg-black text-green-400 font-mono p-4 rounded-lg overflow-x-auto text-sm">
                        $ ./life-app-tui --user-id="user_2OX..."
                    </div>
                </div>

            </CardContent>
        </Card>
    </div>
  )
}
