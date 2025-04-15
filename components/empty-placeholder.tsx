import type React from "react"
import type { LucideIcon } from "lucide-react"

interface EmptyPlaceholderProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyPlaceholder({ icon: Icon, title, description, action }: EmptyPlaceholderProps) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      {Icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-10 w-10 text-primary" />
        </div>
      )}
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
