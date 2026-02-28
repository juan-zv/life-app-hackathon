import { z } from "zod"

export const academicSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Please enter a valid date in the format YYYY-MM-DD or similar.",
    }),
})

export type AcademicFormValues = z.infer<typeof academicSchema>
