import { z } from "zod"

export const foodHealthSchema = z.object({
  dietaryRestrictions: z.enum(["Vegan", "Keto", "GF", "NoRestrictions"], {
    message: "Please select a dietary preference.",
  }),
  cookingSkill: z.enum(["None", "Basic", "HomeChef"], {
    message: "Please select your cooking skill level.",
  }),
  householdSize: z.coerce.number().min(1, {
    message: "Household size must be at least 1.",
  }),
})

export const academicsSchema = z.object({
  currentLevel: z.enum(["HighSchool", "Undergrad", "GradPhD"], {
    message: "Please select your current academic level.",
  }),
  major: z.string().min(2, {
    message: "Major must be at least 2 characters.",
  }),
  learningStyle: z.enum(["Visual", "TextHeavy", "HandsOn"], {
    message: "Please select your preferred learning style.",
  }),
})

export const subscriptionsSchema = z.object({
  bankSync: z.enum(["AutoScan", "Manual"], {
    message: "Please select a subscription tracking method.",
  }),
  forgetfulMetric: z.enum(["Never", "Sometimes", "Often", "Always"], {
    message: "Please select how often you forget to cancel trials.",
  }),
})

export const onboardingSchema = z.object({
  foodHealth: foodHealthSchema.optional(),
  academics: academicsSchema.optional(),
  subscriptions: subscriptionsSchema.optional(),
})

export type OnboardingData = z.infer<typeof onboardingSchema>
