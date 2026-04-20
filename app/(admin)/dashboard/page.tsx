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
import { concours, paiements, fcfa } from "@/lib/mock-data"

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
      <PageHeader
        badge="Vue d'ensemble"
        title="Bonjour, Admin Tekkil"
        description="Suivez en temps réel l'activité de la plateforme : utilisateurs, ventes de packs, performances aux examens et événements de sécurité."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Calendar className="mr-1.5 h-4 w-4" />
              30 derniers jours
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowUpRight className="mr-1.5 h-4 w-4" />
              Exporter
            </Button>
          </>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          index={0}
          label="Revenus du mois"
          value={4580000}
          suffix="FCFA"
          delta={17.8}
          icon={CreditCard}
          format="currency"
        />
        <StatCard
          index={1}
          label="Utilisateurs actifs"
          value={12480}
          delta={8.4}
          icon={Users}
        />
        <StatCard
          index={2}
          label="Packs vendus"
          value={487}
          delta={12.1}
          icon={GraduationCap}
        />
        <StatCard
          index={3}
          label="Taux de conversion"
          value={32.4}
          suffix="%"
          delta={-2.3}
          icon={TrendingUp}
          format="percent"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="bg-card border-border lg:col-span-2 flex flex-col gap-5 rounded-xl border p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-foreground text-base font-semibold">
                Évolution des revenus
              </h3>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Mobile Money, Wave et Cartes bancaires confondus
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-semibold tabular-nums">
                17,06M
              </span>
              <span className="text-success text-xs font-medium">+27.4%</span>
            </div>
          </div>
          <RevenueChart />
        </div>

        <div className="bg-card border-border flex flex-col gap-5 rounded-xl border p-5">
          <div>
            <h3 className="text-foreground text-base font-semibold">
              Répartition par concours
            </h3>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Inscrits actifs par catégorie
            </p>
          </div>
          <RepartitionChart />
          <div className="grid grid-cols-2 gap-2 pt-2">
            {[
              { name: "ENA", v: "4 280", c: "var(--chart-1)" },
              { name: "Douane", v: "3 120", c: "var(--chart-2)" },
              { name: "BAC", v: "6 750", c: "var(--chart-3)" },
              { name: "BFEM", v: "5 320", c: "var(--chart-4)" },
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
        <div className="bg-card border-border flex flex-col gap-5 rounded-xl border p-5 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-foreground text-base font-semibold">
                Inscriptions vs Conversions (7 derniers jours)
              </h3>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Taux de conversion moyen : 32,4%
              </p>
            </div>
            <Badge className="bg-success/10 text-success border-0 hover:bg-success/15">
              <Activity className="mr-1 h-3 w-3" />
              En temps réel
            </Badge>
          </div>
          <InscriptionsChart />
        </div>

        <div className="bg-card border-border flex flex-col gap-5 rounded-xl border p-5">
          <div>
            <h3 className="text-foreground text-base font-semibold">
              Méthodes de paiement
            </h3>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Sur les 30 derniers jours
            </p>
          </div>
          <PaiementsRepartition />
          <div className="border-border mt-auto border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">
                Mobile Money domine
              </span>
              <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-[11px] font-medium">
                80% du total
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
            {paiements.slice(0, 5).map((p) => (
              <div key={p.id} className="px-5 py-3">
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
                      {p.statut}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
