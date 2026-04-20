import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  badge?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, badge, actions }: PageHeaderProps) {
  return (
    <div className="border-border flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-2">
        {badge && (
          <span className="bg-primary/10 text-primary inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider">
            {badge}
          </span>
        )}
        <h1 className="text-foreground text-2xl font-semibold tracking-tight md:text-3xl text-balance">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed text-pretty">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
