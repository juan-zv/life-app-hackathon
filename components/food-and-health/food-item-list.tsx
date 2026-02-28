"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import type { FoodItem } from "./data"

interface FoodItemListProps {
  items: FoodItem[]
  onUpdateAmount: (itemIndex: number, delta: number) => void
  onAddItem: () => void
}

export function FoodItemList({ items, onUpdateAmount, onAddItem }: FoodItemListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
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
                  onClick={() => onUpdateAmount(index, -1)}
                  disabled={item.amount === 0}
                >
                  <span className="sr-only">Decrease</span>
                  <span aria-hidden="true">-</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateAmount(index, 1)}
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
        onClick={onAddItem}
      >
        <Plus className="h-8 w-8 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Add Custom Item</span>
      </Button>
    </div>
  )
}
