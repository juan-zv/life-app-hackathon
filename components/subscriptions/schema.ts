"use client"

import * as z from "zod"

export const subscriptionFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  cycle: z.enum(["Monthly", "Yearly", "Weekly"], {
    message: "Please select a recurrence cycle.",
  }),
  dueDate: z.string().min(1, {
    message: "Due date is required.",
  }),
})

export type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>
