"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CreditCard,
  Utensils,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Copy,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Dashboard() {
  const { userId, isLoaded } = useAuth()
  const [apiData, setApiData] = useState<any[] | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isLoaded || !userId) return

    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setApiData(data))
      .catch(err => console.error(err))
  }, [isLoaded, userId])

  const copyToClipboard = () => {
    if (userId) {
      navigator.clipboard.writeText(userId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const subscriptions = apiData?.find(c => c.name === "Subscriptions")?.content?.items || []
  const academics = apiData?.find(c => c.name === "Academics")?.content || {}
  const monthlySpend = subscriptions.reduce((acc: number, sub: any) => {
    if (sub.cycle === "Monthly") return acc + sub.price
    if (sub.cycle === "Yearly") return acc + (sub.price / 12)
    if (sub.cycle === "Weekly") return acc + (sub.price * 4.33)
    return acc + sub.price
  }, 0)

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Overview of your daily metrics and tasks.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            <CalendarDays className="h-4 w-4" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          {userId && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border">
             <span className="font-mono" title={userId}>ID: {userId.slice(0, 8)}...{userId.slice(-4)}</span>
              <button 
                className="ml-1 hover:text-foreground transition-colors" 
                onClick={copyToClipboard}
                title="Copy User ID"
              >
                {copied ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Food & Health Card */}
        <Card className="flex flex-col h-full bg-gradient-to-br from-green-50 to-background dark:from-green-950/20 dark:to-background border-green-200/50 dark:border-green-800/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="p-2 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 rounded-lg">
                  <Utensils className="h-5 w-5" />
                </div>
                Food
              </CardTitle>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/food-and-health">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            </div>
            <CardDescription>Pantry Inventory</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 flex-1">
            <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-3 shadow-sm">
              <span className="text-sm font-medium text-muted-foreground block mb-2">
                Items in Stock
              </span>
              <div className="space-y-2">
                {apiData?.find(c => c.name === "Food")?.content?.items?.slice(0, 3).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${item.amount <= item.renewThreshold ? "bg-red-500" : "bg-green-500"}`} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-mono">{item.amount} left</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academics Card */}
        <Card className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20 dark:to-background border-blue-200/50 dark:border-blue-800/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 rounded-lg">
                  <BookOpen className="h-5 w-5" />
                </div>
                Academics
              </CardTitle>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/academics">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            </div>
            <CardDescription>Assignments and study progress</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 flex-1">
            <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-3 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-medium text-red-500 flex items-center gap-1 mb-1">
                    <AlertCircle className="h-3 w-3" /> Due Soon
                  </span>
                  {academics?.assignments?.length > 0 ? (
                    <>
                      <div className="font-semibold text-sm">
                        {academics.assignments[0].title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {academics.assignments[0].dueDate}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No urgent assignments
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Weekly Goal
                </span>
                <span className="text-xs font-mono bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-1.5 rounded">
                  {academics?.studyGoal?.currentHours || 0}/
                  {academics?.studyGoal?.targetHours || 0} hrs
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Study Time</span>
                  <span>
                    {Math.round(
                      ((academics?.studyGoal?.currentHours || 0) /
                        (academics?.studyGoal?.targetHours || 1)) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-500"
                    style={{
                      width: `${((academics?.studyGoal?.currentHours || 0) / (academics?.studyGoal?.targetHours || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Card */}
        <Card className="flex flex-col h-full bg-gradient-to-br from-purple-50 to-background dark:from-purple-950/20 dark:to-background border-purple-200/50 dark:border-purple-800/50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="p-2 bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400 rounded-lg">
                  <CreditCard className="h-5 w-5" />
                </div>
                Subscriptions
              </CardTitle>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/subscriptions">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            </div>
            <CardDescription>Expense tracking and renewals</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 flex-1">
            <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-3 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">
                  Monthly Spend
                </span>
              </div>
              <div className="text-2xl font-bold">
                ${monthlySpend.toFixed(2)}
              </div>
            </div>

            <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-3 shadow-sm">
              <span className="text-sm font-medium text-muted-foreground block mb-2">
                Upcoming Renewals
              </span>
              <div className="space-y-2">
                {subscriptions.slice(0, 3).map((renewal: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full bg-yellow-500"
                      />
                      <span>{renewal.name}</span>
                    </div>
                    <span className="font-mono">
                      ${renewal.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/30 rounded-xl p-6 border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4" /> Quick Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Log Meal
          </Button>
          <Button variant="outline" size="sm">
            Add Assignment
          </Button>
          <Button variant="outline" size="sm">
            Track Expense
          </Button>
          <Button variant="outline" size="sm">
            View Analytics
          </Button>
        </div>
      </div>
    </div>
  )
}