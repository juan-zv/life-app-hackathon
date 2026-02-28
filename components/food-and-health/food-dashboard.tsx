"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  AlertTriangle,
  Plus,
  Search,
  ShoppingCart,
  Loader2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Progress } from "@/components/ui/progress"

import {
  mockDashboardData,
  type DashboardSection,
  type ContentItems,
  type FoodItem,
  type SubscriptionItem,
} from "./data"

const foodFormSchema = z.object({
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

type FoodFormValues = z.infer<typeof foodFormSchema>

// Create a version of the schema that can handle form inputs (which are often strings)
// but validates them as numbers according to our rules
const formSchema = foodFormSchema as unknown as z.ZodType<
  FoodFormValues,
  any,
  unknown
>

export function FoodDashboard() {
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

  const foodSection = data.find((section) => section.name === "Food")
  const foodItems = (foodSection?.content.items as FoodItem[]) || []

  const lowStockItems = foodItems.filter(
    (item) => item.amount <= item.renewThreshold
  )

  const form = useForm<FoodFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 1,
      renewThreshold: 1,
      price: 0,
    },
  })

  const onSubmit: SubmitHandler<FoodFormValues> = async (values) => {
    setIsSubmitting(true)
    try {
      const newItem: FoodItem = {
        name: values.name,
        amount: values.amount,
        renewThreshold: values.renewThreshold,
        price: values.price,
      }

      const sectionIndex = data.findIndex((s) => s.name === "Food")

      if (sectionIndex === -1) {
        // Create new section
        const newSection: DashboardSection = {
          id: crypto.randomUUID(),
          user_id: userId || "",
          name: "Food",
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
          throw new Error("Failed to create food section")
        }

        const createdSection = await response.json()
        setData([...data, createdSection])
      } else {
        // Update existing section
        const currentSection = data[sectionIndex]
        const updatedItems = [
          ...(currentSection.content.items as FoodItem[]),
          newItem,
        ]

        const updatedSection = {
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
      console.error("Error adding food item:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateAmount = (sectionName: string, index: number, value: number) => {
    setData((prevData) => {
      const newData = [...prevData]
      const sectionIndex = newData.findIndex((section) => section.name === sectionName)
      if (sectionIndex === -1) return prevData

      const section = { ...newData[sectionIndex] }
      
      // Specifically for food items
      if (sectionName === "Food") {
         const items = [...section.content.items] as FoodItem[]
         items[index] = { ...items[index], amount: Math.max(0, items[index].amount + value) }
         section.content = { ...section.content, items }
         newData[sectionIndex] = section
      }
      return newData
    })
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pantry & Services</h2>
          <p className="text-muted-foreground mt-1">
            Manage your food inventory and related subscriptions.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                type="search"
                placeholder="Search items..."
                className="w-full md:w-[200px] lg:w-[300px] pl-8 bg-background"
                />
            </div>
            <Button size="icon">
                <Plus className="h-4 w-4" />
            </Button>
        </div>
      </div>

      {/* Alert for Low Stock */}
      {lowStockItems.length > 0 && (
        <Card className="bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-semibold">
              <AlertTriangle className="h-5 w-5" />
              <span>Low Stock Alert</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You are running low on {lowStockItems.length} item(s). Consider restocking soon.
            </p>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map((item) => (
                <Badge key={item.name} variant="outline" className="bg-background">
                  {item.name} ({item.amount} left)
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline" className="gap-2">
              <ShoppingCart className="h-4 w-4" /> Add to Shopping List
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {foodItems.map((item, index) => (
              <Card key={index} className={item.amount <= item.renewThreshold ? "border-yellow-200 dark:border-yellow-800" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.name}
                  </CardTitle>
                  {item.amount <= item.renewThreshold && (
                     <Badge variant="destructive" className="text-[10px] px-1 py-0 h-5">Low</Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.amount} <span className="text-sm font-normal text-muted-foreground">units</span></div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Should renew at: {item.renewThreshold} units
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                     <div className="text-sm font-medium">
                        ${item.price.toFixed(2)} / unit
                     </div>
                     <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateAmount("Food", index, -1)}
                            disabled={item.amount === 0}
                        >
                            <span className="sr-only">Decrease</span>
                            <span aria-hidden="true">-</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleUpdateAmount("Food", index, 1)}
                        >
                            <span className="sr-only">Increase</span>
                            <span aria-hidden="true">+</span>
                        </Button>
                     </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add New Item Card Placeholder */}
            <Button 
                variant="outline" 
                className="h-auto min-h-[140px] flex flex-col items-center justify-center gap-2 border-dashed"
                onClick={() => setIsSheetOpen(true)}
            >
                <Plus className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Add Custom Item</span>
            </Button>
          </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add Food Item</SheetTitle>
            <SheetDescription>
              Add a new item to your pantry inventory.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
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
    </div>
  )
}
