"use client"

import { useFormContext } from "react-hook-form"
import { UtensilsCrossed } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import type { OnboardingData } from "./schema"

export function StepFoodHealth() {
  const { control } = useFormContext<OnboardingData>()

  return (
    <div className="space-y-6">
      <Heading
        title="Food & Health"
        description="We'll personalize meal plans, grocery lists, and nutrition tips based on your answers."
        icon={UtensilsCrossed}
      />
      <div className="space-y-4">
        <FormField
          control={control}
          name="foodHealth.dietaryRestrictions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Preference</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your diet style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Vegan">🌱 Vegan</SelectItem>
                  <SelectItem value="Keto">🥑 Keto</SelectItem>
                  <SelectItem value="GF">🌾 Gluten Free</SelectItem>
                  <SelectItem value="NoRestrictions">🍽️ No Restrictions</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Filters recipes and grocery suggestions to match your diet.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="foodHealth.cookingSkill"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cooking Comfort Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="How comfortable are you in the kitchen?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="None">Microwave only</SelectItem>
                  <SelectItem value="Basic">I can follow a recipe</SelectItem>
                  <SelectItem value="HomeChef">Home Chef — I improvise</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>We'll match recipe complexity to your skill level.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="foodHealth.householdSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How many people are you cooking for?</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  placeholder="e.g. 2"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Adjusts portion sizes and grocery quantities automatically.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
