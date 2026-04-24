"use client"

import {
  Users,
  CreditCard,
  GraduationCap,
  TrendingUp,
  ArrowUpRight,
  Activity,
  Calendar,
  Sparkles,
} from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import {
  RevenueChart,
  InscriptionsChart,
  RepartitionChart,
  PaiementsRepartition,
} from "@/components/admin/dashboard-charts"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { concours, paiements, fcfa } from "@/lib/mock-data"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"

export default function DashboardPage() {
  const [periode, setPeriode] = useState("30 derniers jours")
  const [liveUsers, setLiveUsers] = useState(12480)
  const [liveTransactions, setLiveTransactions] = useState(paiements.slice(0, 5))
  const [isUpdating, setIsUpdating] = useState(false)

  // KPI Data based on period
  const kpis = useMemo(() => {
    switch (periode) {
      case "Aujourd'hui":
        return { rev: 145000, users: 1240, packs: 12, conv: 28.4, dRev: 5.2, dUsers: 2.1, dPacks: 4.5, dConv: -1.2 }
      case "7 derniers jours":
        return { rev: 1240000, users: 4850, packs: 142, conv: 30.1, dRev: 12.4, dUsers: 5.8, dPacks: 8.2, dConv: 0.5 }
      case "Ce mois":
        return { rev: 4580000, users: 12480, packs: 487, conv: 32.4, dRev: 17.8, dUsers: 8.4, dPacks: 12.1, dConv: -2.3 }
      case "Cette année":
        return { rev: 52400000, users: 84200, packs: 6420, conv: 34.2, dRev: 45.2, dUsers: 24.1, dPacks: 32.8, dConv: 4.1 }
      default: // 30 derniers jours
        return { rev: 4580000, users: 12480, packs: 487, conv: 32.4, dRev: 17.8, dUsers: 8.4, dPacks: 12.1, dConv: -2.3 }
    }
  }, [periode])

  const handlePeriodeChange = (p: string) => {
    setIsUpdating(true)
    setPeriode(p)
    setTimeout(() => setIsUpdating(false), 600)
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1))
      
      if (Math.random() > 0.85) {
        const names = ["Amadou B.", "Sokhna F.", "Cheikh T.", "Mariama D.", "Omar K."]
        const packs = ["Droit Administratif", "ENA Cycle A", "Douane Cycle B", "Anglais Juridique"]
        const methods = ["Orange Money", "Wave", "Carte Bancaire"]
        
        const newTx = {
          id: "tx-" + Math.random().toString(36).slice(2, 7),
          utilisateur: names[Math.floor(Math.random() * names.length)],
          pack: packs[Math.floor(Math.random() * packs.length)],
          methode: methods[Math.floor(Math.random() * methods.length)],
          montant: 5000 + Math.floor(Math.random() * 10) * 1000,
          statut: "Réussi",
          date: "À l'instant"
        }
        
        setLiveTransactions(prev => [newTx, ...prev.slice(0, 4)])
      }
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
      <PageHeader
        badge="Vue d'ensemble"
        title="Bonjour, Admin Tekkil"
        description="Suivez en temps réel l'activité de la plateforme : utilisateurs, ventes de packs, performances aux examens et événements de sécurité."
        actions={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-1.5 h-4 w-4" />
                  {periode}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handlePeriodeChange("Aujourd'hui")}>
                  Aujourd'hui
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePeriodeChange("7 derniers jours")}>
                  7 derniers jours
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePeriodeChange("30 derniers jours")}>
                  30 derniers jours
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePeriodeChange("Ce mois")}>
                  Ce mois
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePeriodeChange("Cette année")}>
                  Cette année
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowUpRight className="mr-1.5 h-4 w-4" />
              Exporter
            </Button>
          </>
        }
      />

      {/* KPI cards */}
      <div className={"grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 transition-opacity duration-300 " + (isUpdating ? "opacity-40" : "opacity-100")}>
        <StatCard
          index={0}
          label={periode === "Cette année" ? "Revenus de l'année" : "Revenus"}
          value={kpis.rev}
          suffix="FCFA"
          delta={kpis.dRev}
          icon={CreditCard}
          format="currency"
        />
        <StatCard
          index={1}
          label="Utilisateurs actifs"
          value={periode === "30 derniers jours" ? liveUsers : kpis.users}
          delta={kpis.dUsers}
          icon={Users}
        />
        <StatCard
          index={2}
          label="Packs vendus"
          value={kpis.packs}
          delta={kpis.dPacks}
          icon={GraduationCap}
        />
        <StatCard
          index={3}
          label="Taux de conversion"
          value={kpis.conv}
          suffix="%"
          delta={kpis.dConv}
          icon={TrendingUp}
          format="percent"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className={"bg-card border-border lg:col-span-2 flex flex-col gap-5 rounded-xl border p-5 transition-opacity duration-300 " + (isUpdating ? "opacity-40" : "opacity-100")}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-foreground text-base font-semibold">
                Évolution des revenus
              </h3>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {periode} · Mobile Money, Wave et Cartes bancaires
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-semibold tabular-nums">
                {periode === "Cette année" ? "52,4M" : "17,06M"}
              </span>
              <span className="text-success text-xs font-medium">+{kpis.dRev}%</span>
            </div>
          </div>
          <RevenueChart />
        </div>

        <div className={"bg-card border-border flex flex-col gap-5 rounded-xl border p-5 transition-opacity duration-300 " + (isUpdating ? "opacity-40" : "opacity-100")}>
          <div>
            <h3 className="text-foreground text-base font-semibold">
              Répartition par concours
            </h3>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {periode} · Inscrits actifs
            </p>
          </div>
          <RepartitionChart key={`rep-${periode}`} />
          <div className="grid grid-cols-2 gap-2 pt-2">
            {[
              { name: "ENA", v: periode === "Aujourd'hui" ? "42" : "4 280", c: "var(--chart-1)" },
              { name: "Douane", v: periode === "Aujourd'hui" ? "31" : "3 120", c: "var(--chart-2)" },
              { name: "BAC", v: periode === "Aujourd'hui" ? "67" : "6 750", c: "var(--chart-3)" },
              { name: "BFEM", v: periode === "Aujourd'hui" ? "53" : "5 320", c: "var(--chart-4)" },
            ].map((it) => (
              <div key={it.name} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: it.c }}
                />
                <span className="text-muted-foreground text-xs">{it.name}</span>
                <span className="text-foreground ml-auto text-xs font-medium tabular-nums">
                  {it.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className={"bg-card border-border flex flex-col gap-5 rounded-xl border p-5 lg:col-span-2 transition-opacity duration-300 " + (isUpdating ? "opacity-40" : "opacity-100")}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-foreground text-base font-semibold">
                Inscriptions vs Conversions
              </h3>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {periode} · Taux de conversion : {kpis.conv}%
              </p>
            </div>
            <Badge className="bg-success/10 text-success border-0 hover:bg-success/15">
              <Activity className="mr-1 h-3 w-3" />
              En temps réel
            </Badge>
          </div>
          <InscriptionsChart key={`insc-${periode}`} />
        </div>

        <div className={"bg-card border-border flex flex-col gap-5 rounded-xl border p-5 transition-opacity duration-300 " + (isUpdating ? "opacity-40" : "opacity-100")}>
          <div>
            <h3 className="text-foreground text-base font-semibold">
              Méthodes de paiement
            </h3>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {periode}
            </p>
          </div>
          <PaiementsRepartition key={`pay-${periode}`} />
          <div className="border-border mt-auto border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">
                {periode === "Aujourd'hui" ? "Flux stable" : "Mobile Money domine"}
              </span>
              <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-[11px] font-medium">
                {periode === "Aujourd'hui" ? "100%" : "80%"} du total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="bg-card border-border lg:col-span-2 rounded-xl border">
          <div className="border-border flex items-center justify-between border-b px-5 py-4">
            <div>
              <h3 className="text-foreground text-base font-semibold">
                Concours actifs
              </h3>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Statut, dates de clôture et inscrits
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Voir tout
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="divide-border divide-y">
            {concours.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="hover:bg-accent/30 flex items-center gap-4 px-5 py-3.5 transition-colors"
              >
                <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-semibold text-xs">
                  {c.abbr.slice(0, 3)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-foreground truncate text-sm font-medium">
                    {c.nom}
                  </div>
                  <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                    <span>{c.type}</span>
                    <span>•</span>
                    <span>Cycle {c.cycles.join(" + ")}</span>
                    <span>•</span>
                    <span>{c.packs} packs</span>
                  </div>
                </div>
                <div className="hidden text-right text-xs sm:block">
                  <div className="text-foreground font-medium tabular-nums">
                    {new Intl.NumberFormat("fr-FR").format(c.inscrits)}
                  </div>
                  <div className="text-muted-foreground">inscrits</div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    c.statut === "Ouvert"
                      ? "border-success/30 text-success bg-success/5"
                      : c.statut === "Bientôt clos"
                        ? "border-primary/30 text-primary bg-primary/5"
                        : "border-destructive/30 text-destructive bg-destructive/5"
                  }
                >
                  {c.statut}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border-border rounded-xl border">
          <div className="border-border flex items-center justify-between border-b px-5 py-4">
            <div>
              <h3 className="text-foreground text-base font-semibold">
                Dernières transactions
              </h3>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Mises à jour en direct
              </p>
            </div>
            <Sparkles className="text-primary h-4 w-4" />
          </div>
          <div className="divide-border divide-y">
            <AnimatePresence initial={false}>
              {liveTransactions.map((p) => (
                <motion.div 
                  key={p.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-5 py-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-foreground truncate text-sm font-medium">
                        {p.utilisateur}
                      </div>
                      <div className="text-muted-foreground mt-0.5 truncate text-xs">
                        {p.pack} • {p.methode}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-foreground text-sm font-semibold tabular-nums">
                        {fcfa(p.montant)}
                      </div>
                      <div
                        className={
                          "mt-0.5 text-[11px] " +
                          (p.statut === "Réussi"
                            ? "text-success"
                            : p.statut === "En attente"
                              ? "text-primary"
                              : p.statut === "Remboursé"
                                ? "text-info"
                                : "text-destructive")
                        }
                      >
                        {p.date === "À l'instant" ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                            {p.statut}
                          </span>
                        ) : p.statut}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
