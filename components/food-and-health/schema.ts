"use client"

import * as z from "zod"

export const foodFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  amount: z.coerce.number().min(0, {
    message: "Amount must be a positive number.",
  }),
  renewThreshold: z.coerce.number().min(0, {
    message: "Renew threshold must be a positive number.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
})

export type FoodFormValues = z.infer<typeof foodFormSchema>
