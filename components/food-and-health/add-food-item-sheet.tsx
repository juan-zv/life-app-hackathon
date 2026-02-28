"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { foodFormSchema, type FoodFormValues } from "./schema"

interface AddFoodItemSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: FoodFormValues) => Promise<void>
}

export function AddFoodItemSheet({ open, onOpenChange, onSubmit }: AddFoodItemSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FoodFormValues>({
    resolver: zodResolver(foodFormSchema as any),
    defaultValues: {
      name: "",
      amount: 1,
      renewThreshold: 1,
      price: 0,
    },
  })

  // Wrapper to handle submission state reset and form reset
  const handleSubmit = async (values: FoodFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting form", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add Food Item</SheetTitle>
            <SheetDescription>
              Add a new item to your pantry inventory.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Rice" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="renewThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Threshold</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price/Unit ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Item"
                )}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
  )
}
