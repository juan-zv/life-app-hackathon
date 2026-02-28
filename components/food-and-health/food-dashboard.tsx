"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import {
  Plus,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LowStockAlert } from "./low-stock-alert"
import { FoodItemList } from "./food-item-list"
import { AddFoodItemSheet } from "./add-food-item-sheet"
import { type FoodFormValues } from "./schema"

import {
  mockDashboardData,
  type DashboardSection,
  type FoodItem,
} from "./data"

export function FoodDashboard() {
  const { userId, isLoaded } = useAuth()
  const [data, setData] = useState<DashboardSection[]>(mockDashboardData)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
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

  const handleAddItem = async (values: FoodFormValues) => {
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
  }

  const handleUpdateAmount = (index: number, value: number) => {
    setData((prevData) => {
      const newData = [...prevData]
      const sectionIndex = newData.findIndex((section) => section.name === "Food")
      if (sectionIndex === -1) return prevData

      const section = { ...newData[sectionIndex] }
      
      const items = [...section.content.items] as FoodItem[]
      items[index] = { ...items[index], amount: Math.max(0, items[index].amount + value) }
      section.content = { ...section.content, items }
      newData[sectionIndex] = section
      
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

      <LowStockAlert items={lowStockItems} />

      <div className="space-y-4">
          <FoodItemList 
            items={foodItems} 
            onUpdateAmount={handleUpdateAmount}
            onAddItem={() => setIsSheetOpen(true)}
          />
      </div>

      <AddFoodItemSheet 
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSubmit={handleAddItem}
      />
    </div>
  )
}
