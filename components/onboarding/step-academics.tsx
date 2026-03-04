"use client"

import { useFormContext } from "react-hook-form"
import { GraduationCap } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Heading } from "./heading"
import { OnboardingData } from "./schema"

export function StepAcademics() {
  const { control } = useFormContext<OnboardingData>()

  return (
    <div className="space-y-6">
      <Heading
        title="Academics"
        description="Help us tailor study tools, schedules, and resources to your academic life."
        icon={GraduationCap}
      />
      <div className="space-y-4">
        <FormField
          control={control}
          name="academics.currentLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Where are you in your academic journey?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="HighSchool">🎒 High School</SelectItem>
                  <SelectItem value="Undergrad">🎓 Undergraduate</SelectItem>
                  <SelectItem value="GradPhD">🔬 Graduate / PhD</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>We'll adjust deadline trackers and workload estimates.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="academics.major"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What are you studying?</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Computer Science, Biology, Undecided" {...field} />
              </FormControl>
              <FormDescription>Powers smarter course recommendations and study tips.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="academics.learningStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How do you learn best?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pick what clicks for you" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Visual">🎨 Visual — diagrams & videos</SelectItem>
                  <SelectItem value="TextHeavy">📖 Text — reading & notes</SelectItem>
                  <SelectItem value="HandsOn">🛠️ Hands-on — projects & labs</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Study materials and summaries will match your preferred format.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
