"use client"

import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react"
import { useEffect, useRef } from "react"
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number
  prefix?: string
  suffix?: string
  delta?: number // percentage
  icon: LucideIcon
  format?: "number" | "currency" | "percent"
  index?: number
}

function formatValue(v: number, format: StatCardProps["format"]) {
  if (format === "currency") return new Intl.NumberFormat("fr-FR").format(Math.round(v))
  if (format === "percent") return v.toFixed(1)
  return new Intl.NumberFormat("fr-FR").format(Math.round(v))
}

function AnimatedNumber({
  value,
  format,
}: {
  value: number
  format: StatCardProps["format"]
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: 1200, bounce: 0 })
  const display = useTransform(spring, (latest) => formatValue(latest, format))

  useEffect(() => {
    if (inView) motionValue.set(value)
  }, [inView, value, motionValue])

  return <motion.span ref={ref}>{display}</motion.span>
}

export function StatCard({
  label,
  value,
  prefix,
  suffix,
  delta,
  icon: Icon,
  format = "number",
  index = 0,
}: StatCardProps) {
  const positive = (delta ?? 0) >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="group bg-card border-border hover:border-primary/30 relative overflow-hidden rounded-xl border p-5 transition-colors"
    >
      <div className="bg-primary/5 absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
            {label}
          </span>
        </div>
        <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <div className="relative mt-4 flex items-baseline gap-1">
        {prefix && <span className="text-muted-foreground text-sm">{prefix}</span>}
        <span className="text-foreground text-3xl font-semibold tabular-nums tracking-tight">
          <AnimatedNumber value={value} format={format} />
        </span>
        {suffix && <span className="text-muted-foreground text-sm">{suffix}</span>}
      </div>

      {delta !== undefined && (
        <div className="relative mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
              positive
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-muted-foreground text-xs">vs mois dernier</span>
        </div>
      )}
    </motion.div>
  )
}
