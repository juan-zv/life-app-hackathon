import type { LucideIcon } from "lucide-react"

export function Heading({
  title,
  description,
  icon: Icon,
  className,
}: {
  title: string
  description?: string
  icon?: LucideIcon
  className?: string
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-muted-foreground text-sm mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
