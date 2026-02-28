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
import { Input } from "@/components/ui/input"
import { Heading } from "./heading"
import { OnboardingData } from "./schema"

export function StepAcademics() {
  const { control } = useFormContext<OnboardingData>()

  return (
    <div className="space-y-6">
      <Heading
        title="Academics"
        description="Tell us about your educational background."
      />
      <div className="space-y-4">
        <FormField
          control={control}
          name="academics.currentLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="HighSchool">High School</SelectItem>
                  <SelectItem value="Undergrad">Undergrad</SelectItem>
                  <SelectItem value="GradPhD">Grad / PhD</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="academics.major"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Major / Focus</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Computer Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="academics.learningStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learning Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Visual">Visual</SelectItem>
                  <SelectItem value="TextHeavy">Text Heavy</SelectItem>
                  <SelectItem value="HandsOn">Hands-on / Project-based</SelectItem>
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
