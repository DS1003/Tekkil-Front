"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { revenueData, inscriptionsData, concoursRepartition, paiementMethodes } from "@/lib/mock-data"

const revenueConfig = {
  revenus: { label: "Revenus (FCFA)", color: "var(--chart-1)" },
  transactions: { label: "Transactions", color: "var(--chart-2)" },
} satisfies ChartConfig

const inscConfig = {
  inscriptions: { label: "Inscriptions", color: "var(--chart-3)" },
  conversions: { label: "Achats", color: "var(--chart-1)" },
} satisfies ChartConfig

const repConfig = {
  value: { label: "Inscrits" },
  ENA: { label: "ENA", color: "var(--chart-1)" },
  Douane: { label: "Douane", color: "var(--chart-2)" },
  BAC: { label: "BAC", color: "var(--chart-3)" },
  BFEM: { label: "BFEM", color: "var(--chart-4)" },
  Autres: { label: "Autres", color: "var(--chart-5)" },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <ChartContainer config={revenueConfig} className="aspect-auto h-[280px] w-full">
      <AreaChart data={revenueData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="fillRevenus" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-revenus)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--color-revenus)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="mois"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={60}
          fontSize={11}
          tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, name) => {
                if (name === "revenus") {
                  return [
                    new Intl.NumberFormat("fr-FR").format(Number(value)) + " FCFA",
                    " Revenus",
                  ]
                }
                return [String(value), " " + String(name)]
              }}
            />
          }
        />
        <Area
          dataKey="revenus"
          type="monotone"
          fill="url(#fillRevenus)"
          stroke="var(--color-revenus)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function InscriptionsChart() {
  return (
    <ChartContainer config={inscConfig} className="aspect-auto h-[260px] w-full">
      <BarChart data={inscriptionsData} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis dataKey="jour" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
        <YAxis tickLine={false} axisLine={false} width={32} fontSize={11} />
        <ChartTooltip cursor={{ fill: "var(--accent)" }} content={<ChartTooltipContent />} />
        <Bar dataKey="inscriptions" fill="var(--color-inscriptions)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="conversions" fill="var(--color-conversions)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export function RepartitionChart() {
  return (
    <ChartContainer config={repConfig} className="aspect-auto h-[260px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={concoursRepartition}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={3}
          strokeWidth={0}
        >
          {concoursRepartition.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

const methodColors: Record<string, string> = {
  "Orange Money": "oklch(0.85 0.17 88)", // Tekkil yellow
  Wave: "oklch(0.52 0.24 265)",          // Tekkil blue
  "Carte Bancaire": "oklch(0.68 0.22 20)", // Tekkil coral
  "Free Money": "oklch(0.65 0.17 155)",   // green
}

export function PaiementsRepartition() {
  return (
    <div className="flex flex-col gap-3">
      {paiementMethodes.map((m) => (
        <div key={m.methode} className="flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: methodColors[m.methode] }}
          />
          <span className="text-foreground flex-1 text-sm">{m.methode}</span>
          <span className="text-muted-foreground w-10 text-right text-xs tabular-nums">
            {m.value}%
          </span>
          <div className="bg-muted h-1.5 w-24 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${m.value}%`,
                backgroundColor: methodColors[m.methode],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
