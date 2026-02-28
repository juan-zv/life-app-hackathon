"use client"

import { AlertTriangle, ShoppingCart } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import type { FoodItem } from "./data"

interface LowStockAlertProps {
  items: FoodItem[]
}

export function LowStockAlert({ items }: LowStockAlertProps) {
  if (items.length === 0) return null

  return (
    <Card className="bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-semibold">
          <AlertTriangle className="h-5 w-5" />
          <span>Low Stock Alert</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
            You are running low on {items.length} item(s). Consider restocking soon.
        </p>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
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
  )
}
