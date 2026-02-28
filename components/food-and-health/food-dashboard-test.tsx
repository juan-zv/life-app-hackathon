"use client"

import { useState } from "react"
import {
  Apple,
  ArrowRight,
  Beef,
  ChevronRight,
  Droplets,
  Flame,
  GlassWater,
  Leaf,
  Minus,
  Plus,
  Scale,
  Utensils,
  Wheat,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { mockFoodHealthData, type Meal } from "./data-test"

export function FoodDashboard() {
  const [data, setData] = useState(mockFoodHealthData)

  const handleAddWater = () => {
    setData((prev) => ({
      ...prev,
      dailySummary: {
        ...prev.dailySummary,
        hydration: {
          ...prev.dailySummary.hydration,
          current: Math.min(
            prev.dailySummary.hydration.current + 1,
            prev.dailySummary.hydration.goal + 4 // Allow exceeding goal slightly
          ),
        },
      },
    }))
  }

  const handleRemoveWater = () => {
    setData((prev) => ({
      ...prev,
      dailySummary: {
        ...prev.dailySummary,
        hydration: {
          ...prev.dailySummary.hydration,
          current: Math.max(0, prev.dailySummary.hydration.current - 1),
        },
      },
    }))
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Food & Health</h2>
          <p className="text-muted-foreground mt-1">
            Track your nutrition, hydration, and wellness goals.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Log Meal
          </Button>
          <Button variant="outline">
            <Scale className="mr-2 h-4 w-4" /> Update Weight
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Calorie Summary */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Daily Nutrition</CardTitle>
            <CardDescription>
              {data.dailySummary.calories.goal - data.dailySummary.calories.current}{" "}
              calories remaining
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Calories Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Calories</span>
                  </div>
                  <span className="text-muted-foreground">
                    {data.dailySummary.calories.current} /{" "}
                    {data.dailySummary.calories.goal} kcal
                  </span>
                </div>
                <Progress
                  value={
                    (data.dailySummary.calories.current /
                      data.dailySummary.calories.goal) *
                    100
                  }
                  className="h-3"
                //   indicatorClassName="bg-gradient-to-r from-orange-400 to-red-500" // Custom class if supported
                />
              </div>

              {/* Macros Grid */}
              <div className="grid grid-cols-3 gap-4">
                {data.dailySummary.macros.map((macro) => (
                  <div key={macro.name} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {macro.name === "Protein" && (
                        <Beef className="h-4 w-4 text-blue-500" />
                      )}
                      {macro.name === "Carbs" && (
                        <Wheat className="h-4 w-4 text-green-500" />
                      )}
                      {macro.name === "Fats" && (
                        <Droplets className="h-4 w-4 text-yellow-500" />
                      )}
                      {macro.name}
                    </div>
                    <Progress
                      value={(macro.current / macro.total) * 100}
                      className="h-2"
                    //   indicatorClassName={macro.color.replace("text-", "bg-")}
                    />
                    <div className="text-xs text-muted-foreground">
                      {macro.current}g / {macro.total}g
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hydration Tracker */}
        <Card className="flex flex-col justify-between bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 rounded-lg">
                <GlassWater className="h-5 w-5" />
              </div>
              Hydration
            </CardTitle>
            <CardDescription>Daily water intake goal: {data.dailySummary.hydration.goal} glasses</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-6">
            <div className="relative flex items-center justify-center">
                 <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                    {data.dailySummary.hydration.current}
                 </div>
                 <span className="absolute -bottom-4 text-sm text-muted-foreground">glasses</span>
            </div>
            
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={handleRemoveWater} disabled={data.dailySummary.hydration.current <= 0}>
                    <Minus className="h-4 w-4" />
                </Button>
                <Button size="icon" className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600" onClick={handleAddWater}>
                    <Plus className="h-6 w-6" />
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Meal Log */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Today's Meals</h3>
          </div>

          <Tabs defaultValue="breakfast" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
              <TabsTrigger value="lunch">Lunch</TabsTrigger>
              <TabsTrigger value="dinner">Dinner</TabsTrigger>
              <TabsTrigger value="snacks">Snacks</TabsTrigger>
            </TabsList>
            {Object.entries(data.meals).map(([mealType, meals]) => (
              <TabsContent key={mealType} value={mealType} className="mt-4 space-y-4">
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="capitalize text-lg">{mealType}</CardTitle>
                            <span className="text-sm text-muted-foreground">
                                {meals.reduce((acc: number, meal: Meal) => acc + meal.calories, 0)} kcal
                            </span>
                        </div>
                    </CardHeader>
                  <CardContent className="grid gap-4">
                    {meals.length > 0 ? (
                      meals.map((meal: Meal) => (
                        <div
                          key={meal.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="space-y-1">
                            <p className="font-medium leading-none">{meal.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <span>{meal.calories} kcal</span>
                                <span>•</span>
                                <span>{meal.protein}g P</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">{meal.time}</span>
                             <Button variant="ghost" size="icon">
                                 <ChevronRight className="h-4 w-4 text-muted-foreground" />
                             </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-sm text-muted-foreground border-dashed border-2 rounded-lg">
                        No meals logged yet.
                        <div className="mt-2">
                           <Button variant="link" size="sm" className="h-auto p-0">Log {mealType}</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Side Panel: Suggestions / Weight */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Scale className="h-4 w-4" /> Weight Goal
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-baseline justify-between">
                         <span className="text-3xl font-bold">{data.weight.current} <span className="text-sm font-normal text-muted-foreground">lbs</span></span>
                         <Badge variant="outline" className="text-green-600 bg-green-50 dark:bg-green-950/20 border-green-200">
                            On Track
                         </Badge>
                    </div>
                    <Progress value={((data.weight.history[0].value - data.weight.current) / (data.weight.history[0].value - data.weight.goal)) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Start: {data.weight.history[0].value}</span>
                        <span>Goal: {data.weight.goal}</span>
                    </div>
                </CardContent>
            </Card>

             <Card className="bg-orange-50/50 dark:bg-orange-950/10 border-orange-200/50 dark:border-orange-800/50">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Leaf className="h-4 w-4 text-orange-500" /> Meal Suggestion
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <h4 className="font-semibold">Quinoa Power Bowl</h4>
                        <p className="text-sm text-muted-foreground">
                            High fiber, rich in antioxidants. Perfect for your post-workout dinner.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">450 kcal</Badge>
                            <Badge variant="secondary">25m prep</Badge>
                        </div>
                         <Button className="w-full mt-4" size="sm" variant="outline">View Recipe</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
