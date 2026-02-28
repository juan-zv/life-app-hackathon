"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  ChevronRight,
  Clock,
  Loader2,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  mockDashboardData,
  type DashboardSection,
  type SubscriptionItem,
} from "../food-and-health/data"

const subscriptionFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  cycle: z.enum(["Monthly", "Yearly", "Weekly"], {
    errorMap: () => ({ message: "Please select a recurrence cycle." }),
  }),
  dueDate: z.string().min(1, {
    message: "Due date is required.",
  }),
})

export function SubscriptionDashboard() {
  const { userId, isLoaded } = useAuth()
  const [data, setData] = useState<DashboardSection[]>(mockDashboardData)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded || !userId) return

    const fetchData = async () => {
      try {
        const response = await fetch(`https://backend1.study-with-me.org/categories/${userId}`)
        if (response.ok) {
          const result = await response.json()
          setData(result)
        } else {
          console.error("Failed to fetch data")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [isLoaded, userId])

  const subscriptionSection = data.find(
    (section) => section.name === "Subscriptions"
  )

  const subscriptionItems =
    (subscriptionSection?.content.items as SubscriptionItem[]) || []

  const form = useForm<z.infer<typeof subscriptionFormSchema>>({
    // @ts-ignore
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      name: "",
      price: 0,
      cycle: "Monthly",
      dueDate: "",
    },
  })

  async function onSubmit(values: z.infer<typeof subscriptionFormSchema>) {
    setIsSubmitting(true)
    try {
      const newItem: SubscriptionItem = {
        name: values.name,
        price: values.price,
        cycle: values.cycle,
        dueDate: values.dueDate,
      }

      const sectionIndex = data.findIndex((s) => s.name === "Subscriptions")

      if (sectionIndex === -1) {
        // Create new section
        const newSection: DashboardSection = {
          id: crypto.randomUUID(),
          user_id: userId || "",
          name: "Subscriptions",
          content: {
            items: [newItem],
          },
        }

        const response = await fetch("https://backend1.study-with-me.org/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSection),
        })

        if (!response.ok) {
          throw new Error("Failed to create subscription section")
        }

        const createdSection = await response.json()
        setData([...data, createdSection])
      } else {
        // Update existing section
        const currentSection = data[sectionIndex]
        const updatedItems = [
            ...(currentSection.content.items as SubscriptionItem[]),
            newItem,
        ]

        const updatedSection: DashboardSection = {
            ...currentSection,
            content: {
                ...currentSection.content,
                items: updatedItems,
            },
        }

        const response = await fetch(
            `https://backend1.study-with-me.org/categories/${updatedSection.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedSection),
            }
        )

        if (!response.ok) {
            throw new Error("Failed to update data")
        }
        
        const newData = [...data]
        newData[sectionIndex] = updatedSection
        setData(newData)
      }
      
      form.reset()
      setIsSheetOpen(false)
    } catch (error) {
      console.error("Error adding subscription:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
          <p className="text-muted-foreground mt-1">
            Manage your recurring service subscriptions.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search subscriptions..."
                className="w-full md:w-[200px] lg:w-[300px] pl-8 bg-background"
                />
            </div>
            <Button size="icon" onClick={() => setIsSheetOpen(true)}>
                <Plus className="h-4 w-4" />
            </Button>
        </div>
      </div>

      <div className="rounded-md border">
            <div className="grid grid-cols-4 p-4 font-medium text-sm text-muted-foreground border-b bg-muted/50">
                <div className="col-span-1">Service</div>
                <div className="col-span-1">Details</div>
                <div className="col-span-1 text-right">Cost</div>
                <div className="col-span-1 text-right">Action</div>
            </div>
            {subscriptionItems.length > 0 ? (
            subscriptionItems.map((item, index) => (
                <div key={index} className="grid grid-cols-4 p-4 items-center text-sm border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <div className="col-span-1 font-medium flex items-center gap-2">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                            {item.name.charAt(0)}
                        </div>
                        {item.name}
                    </div>
                    <div className="col-span-1 text-muted-foreground flex flex-col gap-1">
                        <span className="flex items-center gap-1.5"><RefreshCw className="h-3 w-3" /> {item.cycle}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Due: {item.dueDate}</span>
                    </div>
                    <div className="col-span-1 text-right font-medium">
                        ${item.price.toFixed(2)}
                    </div>
                    <div className="col-span-1 text-right">
                        <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))
            ) : (
            <div className="p-8 text-center text-muted-foreground">
                No subscriptions found.
            </div>
            )}
        </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add Subscription</SheetTitle>
            <SheetDescription>
              Add a new recurring subscription.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Netflix" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cycle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Cycle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a cycle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Next Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Subscription"
                )}
              </Button>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
