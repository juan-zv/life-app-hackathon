"use client"

import { useFormContext } from "react-hook-form"
import {
  FormControl,
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
        description="Help us help you manage recurring payments."
      />
      <div className="space-y-4">
        <FormField
          control={control}
          name="subscriptions.bankSync"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription Tracking Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="AutoScan">
                    Auto-scan receipts (via Email)
                  </SelectItem>
                  <SelectItem value="Manual">Enter manually</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="subscriptions.forgetfulMetric"
          render={({ field }) => (
            <FormItem>
              <FormLabel>The &apos;Forgetful&apos; Metric</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How often do you forget?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Sometimes">Sometimes</SelectItem>
                  <SelectItem value="Often">Often</SelectItem>
                  <SelectItem value="Always">Always</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
