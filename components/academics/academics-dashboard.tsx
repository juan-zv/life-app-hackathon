"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import {
  ListChecks,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { AssignmentsList } from "./assignments-list"

import {
  mockDashboardData,
  type DashboardSection,
  type AssignmentItem,
} from "./data"

export function AcademicsDashboard() {
  const { userId, isLoaded } = useAuth()
  const [data, setData] = useState<DashboardSection[]>(mockDashboardData)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

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

  const handleSyncCanvas = async () => {
    if (!userId) return

    setIsSyncing(true)
    try {
      const response = await fetch(`https://backend1.study-with-me.org/scrapers/canvas?user_id=${userId}`, {
        method: "POST",
      })

      if (response.ok) {
        const result = await response.json()
        const newItems = result.items || []

        setData((prevData) => {
          const academicSectionIndex = prevData.findIndex((s) => s.name === "Academics")
          
          if (academicSectionIndex >= 0) {
            const newData = [...prevData]
            newData[academicSectionIndex] = {
              ...newData[academicSectionIndex],
              content: {
                items: newItems
              }
            }
            return newData
          } else {
            return [
              ...prevData,
              {
                id: Date.now().toString(),
                user_id: userId,
                name: "Academics",
                content: {
                  items: newItems
                }
              }
            ]
          }
        })
      }
    } catch (error) {
      console.error("Error syncing Canvas:", error)
    } finally {
      setIsSyncing(false)
    }
  }

  const academicsSection = data.filter((section) => section.name === "Academics")
  // Flatten all items from all "Academics" sections found, with safe navigation
  const assignments = academicsSection.flatMap(section => section.content?.items || []) as AssignmentItem[]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Academics</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleSyncCanvas} disabled={isSyncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            Sync Canvas
          </Button>
        </div>
      </div>
      
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="flex flex-col space-y-1.5 p-6 pb-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold leading-none tracking-tight">Your Assignments</h3>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {assignments.length} {assignments.length === 1 ? 'task' : 'tasks'} due soon
          </p>
        </div>
        <div className="p-6 pt-0">
          <AssignmentsList items={assignments} />
        </div>
      </div>
    </div>
  )
}
