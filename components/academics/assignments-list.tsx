import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CalendarDays, BookOpen, Clock } from "lucide-react"

import type { AssignmentItem } from "./data"

interface AssignmentsListProps {
  items: AssignmentItem[]
}

export function AssignmentsList({ items }: AssignmentsListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border-dashed border-2 rounded-lg">
        <div className="bg-muted/50 p-4 rounded-full mb-3">
          <BookOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No assignments due</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          You're all caught up! Check back later or add new assignments.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <Card key={index} className="overflow-hidden transition-all hover:shadow-md border-l-4 border-l-primary/50 group">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium line-clamp-2 leading-tight min-h-[2.5rem]">
              {item.name}
            </CardTitle>
            <div className="bg-primary/10 p-1.5 rounded-md text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0 ml-2">
             <CalendarDays className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Clock className="mr-1 h-3.5 w-3.5" />
              <span>Due: {item.dueDate}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
