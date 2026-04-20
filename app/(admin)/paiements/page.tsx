"use client"

import { useMemo, useState } from "react"
import {
  Search,
  Download,
  RefreshCcw,
  Smartphone,
  CreditCard,
  Wallet,
  MoreHorizontal,
  CheckCircle2,
  RotateCcw,
  XCircle,
  Eye,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { paiements as seedPaiements, fcfa, type Paiement } from "@/lib/mock-data"
import { PaiementsRepartition } from "@/components/admin/dashboard-charts"

const statutColors: Record<string, string> = {
  Réussi: "border-success/30 text-success bg-success/5",
  "En attente": "border-warning/60 text-warning-foreground bg-warning/20",
  Échoué: "border-destructive/30 text-destructive bg-destructive/5",
  Remboursé: "border-info/30 text-info bg-info/5",
}

const methodIcons: Record<string, React.ElementType> = {
  "Orange Money": Smartphone,
  Wave: Wallet,
  "Carte Bancaire": CreditCard,
  "Free Money": Smartphone,
}

const methodColors: Record<string, string> = {
  "Orange Money": "oklch(0.85 0.17 88)",
  Wave: "oklch(0.52 0.24 265)",
  "Carte Bancaire": "oklch(0.68 0.22 20)",
  "Free Money": "oklch(0.65 0.17 155)",
}

export default function PaiementsPage() {
  const [items, setItems] = useState<Paiement[]>(seedPaiements)
  const [search, setSearch] = useState("")
  const [syncing, setSyncing] = useState(false)
  const [detail, setDetail] = useState<Paiement | null>(null)
  const [toRefund, setToRefund] = useState<Paiement | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (p) =>
        p.reference.toLowerCase().includes(q) ||
        p.utilisateur.toLowerCase().includes(q) ||
        p.pack.toLowerCase().includes(q),
    )
  }, [items, search])

  const totals = useMemo(() => {
    const total = items.reduce(
      (acc, p) => (p.statut === "Réussi" ? acc + p.montant : acc),
      0,
    )
    const count = items.length
    const successCount = items.filter((p) => p.statut === "Réussi").length
    const refunded = items
      .filter((p) => p.statut === "Remboursé")
      .reduce((a, p) => a + p.montant, 0)
    return {
      dayVolume: total,
      count,
      rate: count > 0 ? Math.round((successCount / count) * 100) : 0,
      refunded,
    }
  }, [items])

  function validatePayment(p: Paiement) {
    setItems((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, statut: "Réussi" } : x)),
    )
    toast.success(`Paiement ${p.reference} validé manuellement`)
  }

  function failPayment(p: Paiement) {
    setItems((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, statut: "Échoué" } : x)),
    )
    toast.success(`Paiement ${p.reference} marqué comme échoué`)
  }

  function confirmRefund() {
    if (!toRefund) return
    setItems((prev) =>
      prev.map((x) => (x.id === toRefund.id ? { ...x, statut: "Remboursé" } : x)),
    )
    toast.success(`Remboursement de ${fcfa(toRefund.montant)} effectué`)
    setToRefund(null)
  }

  async function syncGateways() {
    setSyncing(true)
    toast.info("Synchronisation avec Orange Money, Wave...")
    await new Promise((r) => setTimeout(r, 1200))
    setSyncing(false)
    toast.success("Passerelles synchronisées · 0 écart détecté")
  }

  function downloadReport() {
    const header = "Reference;Utilisateur;Pack;Methode;Montant;Statut;Date\n"
    const rows = items
      .map(
        (p) =>
          `${p.reference};"${p.utilisateur}";"${p.pack}";${p.methode};${p.montant};${p.statut};${p.date}`,
      )
      .join("\n")
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tekkil-rapport-paiements-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Rapport mensuel téléchargé")
  }

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
      <PageHeader
        badge="Finances"
        title="Paiements & Transactions"
        description="Suivi des transactions Orange Money, Wave, Free Money et cartes bancaires. Réconciliation automatique avec les passerelles de paiement."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={syncGateways} disabled={syncing}>
              <RefreshCcw
                className={"mr-1.5 h-4 w-4 " + (syncing ? "animate-spin" : "")}
              />
              {syncing ? "Sync..." : "Synchroniser"}
            </Button>
            <Button
              size="sm"
              onClick={downloadReport}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Download className="mr-1.5 h-4 w-4" />
              Rapport mensuel
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { l: "Volume validé", v: fcfa(totals.dayVolume), sub: `${totals.count} transactions` },
          { l: "Volume du mois", v: "4 580 000 FCFA", sub: "+17.8%" },
          { l: "Taux de succès", v: `${totals.rate}%`, sub: "Stable" },
          { l: "Remboursements", v: fcfa(totals.refunded), sub: "Ce mois" },
        ].map((s) => (
          <div key={s.l} className="bg-card border-border rounded-lg border p-4">
            <div className="text-muted-foreground text-xs uppercase tracking-wider">
              {s.l}
            </div>
            <div className="text-foreground mt-2 text-2xl font-semibold tabular-nums">
              {s.v}
            </div>
            <div className="text-muted-foreground mt-1 text-xs">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Methods + performance */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="bg-card border-border rounded-xl border p-5 lg:col-span-1">
          <h3 className="text-foreground text-sm font-semibold">Répartition par méthode</h3>
          <p className="text-muted-foreground mt-0.5 text-xs">30 derniers jours</p>
          <div className="mt-5">
            <PaiementsRepartition />
          </div>
          <div className="border-border mt-5 border-t pt-4 text-xs">
            <div className="text-muted-foreground">
              <span className="text-warning-foreground font-medium">Orange Money</span>{" "}
              reste la méthode privilégiée avec{" "}
              <span className="text-foreground font-semibold">48%</span> des paiements.
            </div>
          </div>
        </div>

        <div className="bg-card border-border lg:col-span-2 flex flex-col gap-4 rounded-xl border p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-foreground text-sm font-semibold">
              Performance des passerelles
            </h3>
            <span className="text-success bg-success/10 rounded-md px-2 py-0.5 text-[11px] font-medium">
              Tous opérationnels
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { n: "Orange Money", taux: 96, vol: "2,2M", c: methodColors["Orange Money"] },
              { n: "Wave", taux: 98, vol: "1,4M", c: methodColors["Wave"] },
              { n: "Carte Bancaire", taux: 91, vol: "640k", c: methodColors["Carte Bancaire"] },
              { n: "Free Money", taux: 89, vol: "320k", c: methodColors["Free Money"] },
            ].map((p) => (
              <div
                key={p.n}
                className="bg-muted/30 border-border relative overflow-hidden rounded-lg border p-3"
              >
                <span
                  className="absolute left-0 top-0 h-full w-0.5"
                  style={{ background: p.c }}
                />
                <div className="text-muted-foreground text-[11px] uppercase tracking-wider">
                  {p.n}
                </div>
                <div className="text-foreground mt-1 text-lg font-semibold tabular-nums">
                  {p.vol}
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="bg-muted h-1 flex-1 overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${p.taux}%`, backgroundColor: p.c }}
                    />
                  </div>
                  <span className="text-muted-foreground text-[10px] tabular-nums">
                    {p.taux}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par référence, utilisateur, pack..."
          className="h-10 pl-9"
        />
      </div>

      {/* Transactions table */}
      <div className="bg-card border-border overflow-hidden rounded-xl border">
        <div className="border-border flex items-center justify-between border-b px-5 py-4">
          <div>
            <h3 className="text-foreground text-base font-semibold">
              Transactions récentes
            </h3>
            <p className="text-muted-foreground mt-0.5 text-xs">
              Dernières 24 heures · Mise à jour automatique
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-border border-b">
              <tr className="text-muted-foreground text-left text-xs">
                <th className="px-5 py-3 font-medium">Référence</th>
                <th className="px-5 py-3 font-medium">Utilisateur</th>
                <th className="px-5 py-3 font-medium">Pack</th>
                <th className="px-5 py-3 font-medium">Méthode</th>
                <th className="px-5 py-3 font-medium">Montant</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="w-12 px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {filtered.map((p) => {
                const I = methodIcons[p.methode]
                return (
                  <tr key={p.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs">{p.reference}</td>
                    <td className="text-foreground px-5 py-3 font-medium">
                      {p.utilisateur}
                    </td>
                    <td className="text-muted-foreground px-5 py-3">{p.pack}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-md"
                          style={{
                            backgroundColor: methodColors[p.methode] + "26",
                            color: methodColors[p.methode],
                          }}
                        >
                          <I className="h-3 w-3" />
                        </span>
                        <span className="text-foreground text-xs">{p.methode}</span>
                      </div>
                    </td>
                    <td className="text-foreground px-5 py-3 font-semibold tabular-nums">
                      {fcfa(p.montant)}
                    </td>
                    <td className="text-muted-foreground px-5 py-3 text-xs">{p.date}</td>
                    <td className="px-5 py-3">
                      <Badge variant="outline" className={statutColors[p.statut]}>
                        {p.statut}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem onClick={() => setDetail(p)}>
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            Voir les détails
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {p.statut === "En attente" && (
                            <>
                              <DropdownMenuItem onClick={() => validatePayment(p)}>
                                <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                                Valider manuellement
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => failPayment(p)}
                                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                              >
                                <XCircle className="mr-2 h-3.5 w-3.5" />
                                Marquer échoué
                              </DropdownMenuItem>
                            </>
                          )}
                          {p.statut === "Réussi" && (
                            <DropdownMenuItem
                              onClick={() => setToRefund(p)}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <RotateCcw className="mr-2 h-3.5 w-3.5" />
                              Rembourser
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Transaction {detail?.reference}</DialogTitle>
            <DialogDescription>
              Détails complets de la transaction et traces de la passerelle.
            </DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/30 border-border rounded-lg border p-3">
                  <div className="text-muted-foreground text-[11px] uppercase tracking-wider">
                    Utilisateur
                  </div>
                  <div className="text-foreground mt-1 font-medium">
                    {detail.utilisateur}
                  </div>
                </div>
                <div className="bg-muted/30 border-border rounded-lg border p-3">
                  <div className="text-muted-foreground text-[11px] uppercase tracking-wider">
                    Pack
                  </div>
                  <div className="text-foreground mt-1 font-medium">{detail.pack}</div>
                </div>
                <div className="bg-muted/30 border-border rounded-lg border p-3">
                  <div className="text-muted-foreground text-[11px] uppercase tracking-wider">
                    Méthode
                  </div>
                  <div className="text-foreground mt-1 font-medium">{detail.methode}</div>
                </div>
                <div className="bg-muted/30 border-border rounded-lg border p-3">
                  <div className="text-muted-foreground text-[11px] uppercase tracking-wider">
                    Montant
                  </div>
                  <div className="text-foreground mt-1 text-lg font-semibold tabular-nums">
                    {fcfa(detail.montant)}
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 border-border rounded-lg border p-3">
                <div className="text-muted-foreground text-[11px] uppercase tracking-wider">
                  Date
                </div>
                <div className="text-foreground mt-1 font-medium">{detail.date}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-xs font-medium">
                  Journal passerelle
                </div>
                <pre className="bg-muted/30 border-border text-muted-foreground mt-2 overflow-auto rounded-lg border p-3 font-mono text-[11px] leading-relaxed">
{`> ${detail.date} — INIT ${detail.reference}
> gateway=${detail.methode} amount=${detail.montant}
> status=${detail.statut}
> user="${detail.utilisateur}"
> settled=${detail.statut === "Réussi" ? "true" : "false"}`}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Refund confirm */}
      <AlertDialog open={!!toRefund} onOpenChange={(o) => !o && setToRefund(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Rembourser {toRefund && fcfa(toRefund.montant)} ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Le montant sera retourné à {toRefund?.utilisateur} via {toRefund?.methode}.
              L&apos;accès au pack « {toRefund?.pack} » sera révoqué immédiatement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRefund}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmer le remboursement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
