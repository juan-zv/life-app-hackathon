"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import {
  Plus,
  Search,
} from "lucide-react"
import { API_BASE_URL } from "@/lib/api-config"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  mockDashboardData,
  type DashboardSection,
  type SubscriptionItem,
} from "../food-and-health/data"

import { SubscriptionList } from "./subscription-list"
import { AddSubscriptionSheet } from "./add-subscription-sheet"
import { type SubscriptionFormValues } from "./schema"
import { PlaidBankDashboard } from "./plaid-bank-dashboard"

export function SubscriptionDashboard() {
  const { userId, isLoaded } = useAuth()
  const [data, setData] = useState<DashboardSection[]>(mockDashboardData)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded || !userId) return

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories/${userId}`)
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

  const handleAddSubscription = async (values: SubscriptionFormValues) => {
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

        const response = await fetch(`${API_BASE_URL}/categories`, {
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
            `${API_BASE_URL}/categories/${updatedSection.id}`,
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

      <SubscriptionList items={subscriptionItems} />

      <PlaidBankDashboard />

      <AddSubscriptionSheet 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        onSubmit={handleAddSubscription} 
      />
    </div>
  )
}