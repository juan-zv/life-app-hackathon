"use client"

import {
  Archive,
  ChevronRight,
  Clock,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import type { SubscriptionItem } from "../food-and-health/data"

interface SubscriptionListProps {
  items: SubscriptionItem[]
}

export function SubscriptionList({ items }: SubscriptionListProps) {
  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-4 p-4 font-medium text-sm text-muted-foreground border-b bg-muted/50">
        <div className="col-span-1">Service</div>
        <div className="col-span-1">Details</div>
        <div className="col-span-1 text-right">Cost</div>
        <div className="col-span-1 text-right">Action</div>
      </div>
      {items.length > 0 ? (
        items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-4 p-4 items-center text-sm border-b last:border-0 hover:bg-muted/50 transition-colors"
          >
            <div className="col-span-1 font-medium flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                {item.name.charAt(0)}
              </div>
              {item.name}
            </div>
            <div className="col-span-1 text-muted-foreground flex flex-col gap-1">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="h-3 w-3" /> {item.cycle}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> Due: {item.dueDate}
              </span>
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
        <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
            <Archive className="h-8 w-8 text-muted-foreground/50" />
            No subscriptions found.
        </div>
      )}
    </div>
  )
}
