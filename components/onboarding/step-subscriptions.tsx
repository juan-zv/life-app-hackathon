"use client"

import { useFormContext } from "react-hook-form"
import { CreditCard } from "lucide-react"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Heading } from "./heading"
import { OnboardingData } from "./schema"

export function StepSubscriptions() {
  const { control } = useFormContext<OnboardingData>()

  return (
    <div className="space-y-6">
      <Heading
        title="Subscriptions"
        description="Never miss a renewal again — we'll track payments and remind you before charges hit."
        icon={CreditCard}
      />
      <div className="space-y-4">
        <FormField
          control={control}
          name="subscriptions.bankSync"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How should we find your subscriptions?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose tracking method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="AutoScan">
                    📧 Auto-scan receipts from email
                  </SelectItem>
                  <SelectItem value="Manual">✍️ I'll enter them manually</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Auto-scan detects services like Netflix, Spotify, and more from your inbox.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="subscriptions.forgetfulMetric"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How often do subscriptions slip your mind?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Be honest — no judgment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Never">🧘 Never — I'm on top of it</SelectItem>
                  <SelectItem value="Sometimes">🤔 Sometimes — the odd one slips</SelectItem>
                  <SelectItem value="Often">😅 Often — surprise charges happen</SelectItem>
                  <SelectItem value="Always">🫠 Always — please help me</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>The more forgetful you are, the more aggressively we'll remind you.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
