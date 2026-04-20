"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Send,
  Bell,
  Calendar,
  Users,
  Megaphone,
  AlertCircle,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { notifications as seed } from "@/lib/mock-data"

type NotifType = "Rappel" | "Annonce" | "Événement" | "Urgence"
type Notif = (typeof seed)[number]

const typeConfig: Record<NotifType, { i: React.ElementType; c: string }> = {
  Rappel: { i: Bell, c: "oklch(0.85 0.17 88)" },
  Annonce: { i: Megaphone, c: "oklch(0.52 0.24 265)" },
  Événement: { i: Calendar, c: "oklch(0.65 0.17 155)" },
  Urgence: { i: AlertCircle, c: "oklch(0.68 0.22 20)" },
}

const cibles = [
  { value: "Tous les utilisateurs", count: 12480 },
  { value: "Inscrits ENA", count: 4280 },
  { value: "Inscrits Douane", count: 3120 },
  { value: "Cycle A", count: 6900 },
  { value: "Cycle B", count: 5580 },
  { value: "Inactifs > 7 jours", count: 1240 },
  { value: "Acheteurs récents", count: 340 },
]

export default function NotificationsPage() {
  const [items, setItems] = useState<Notif[]>(seed)
  const [titre, setTitre] = useState("")
  const [message, setMessage] = useState("")
  const [cible, setCible] = useState(cibles[0].value)
  const [type, setType] = useState<NotifType>("Annonce")
  const [sending, setSending] = useState(false)

  function reset() {
    setTitre("")
    setMessage("")
    setType("Annonce")
    setCible(cibles[0].value)
  }

  async function send(programmee: boolean) {
    if (!titre.trim() || !message.trim()) {
      toast.error("Renseignez le titre et le message")
      return
    }
    setSending(true)
    await new Promise((r) => setTimeout(r, 700))
    const target = cibles.find((c) => c.value === cible) ?? cibles[0]
    const now = new Date()
    const formatted = now.toISOString().slice(0, 16).replace("T", " ")
    const next: Notif = {
      id: "n-" + Math.random().toString(36).slice(2, 8),
      titre,
      type,
      cible: cible,
      envoyees: programmee ? 0 : target.count,
      ouvertes: programmee ? 0 : Math.round(target.count * 0.45),
      date: formatted,
      statut: programmee ? "Programmée" : "Envoyée",
    }
    setItems((prev) => [next, ...prev])
    toast.success(
      programmee
        ? `Notification programmée pour ${target.count.toLocaleString("fr-FR")} utilisateurs`
        : `Notification envoyée à ${target.count.toLocaleString("fr-FR")} utilisateurs`,
    )
    reset()
    setSending(false)
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((n) => n.id !== id))
    toast.success("Notification supprimée")
  }

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
      <PageHeader
        badge="Engagement"
        title="Notifications push"
        description="Rappels personnalisés, annonces de packs, alertes de clôture de concours. Ciblage fin par concours, cycle ou comportement utilisateur."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: "Envoyées ce mois", v: "48 240", sub: "+22%" },
          { l: "Taux d'ouverture moyen", v: "62%", sub: "Bon" },
          { l: "Taux de clic", v: "18%", sub: "Excellent" },
          { l: "Désabonnements", v: "0.4%", sub: "Stable" },
        ].map((s) => (
          <div key={s.l} className="bg-card border-border rounded-lg border p-4">
            <div className="text-muted-foreground text-xs uppercase tracking-wider">
              {s.l}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-semibold tabular-nums">
                {s.v}
              </span>
              <span className="text-muted-foreground text-xs">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Composer + History */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Composer */}
        <div className="bg-card border-border rounded-xl border p-5 lg:col-span-1">
          <div className="flex items-center gap-2">
            <Send className="text-primary h-4 w-4" />
            <h3 className="text-foreground text-base font-semibold">Composer</h3>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <div>
              <Label htmlFor="n-titre">Titre</Label>
              <Input
                id="n-titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="Ex : Rappel de révision"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="n-message">Message</Label>
              <Textarea
                id="n-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Votre message..."
                className="mt-1.5 resize-none"
              />
              <div className="text-muted-foreground mt-1 text-right text-[11px] tabular-nums">
                {message.length}/180
              </div>
            </div>

            <div>
              <Label>Cible</Label>
              <Select value={cible} onValueChange={setCible}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cibles.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.value} ({c.count.toLocaleString("fr-FR")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Type</Label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {(Object.keys(typeConfig) as NotifType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={
                      type === t
                        ? "bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium"
                        : "bg-muted/40 hover:bg-accent hover:text-foreground rounded-full px-3 py-1 text-xs font-medium transition-colors"
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => send(true)}
                disabled={sending}
              >
                Programmer
              </Button>
              <Button
                size="sm"
                onClick={() => send(false)}
                disabled={sending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                {sending ? "Envoi..." : "Envoyer"}
              </Button>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-card border-border lg:col-span-2 rounded-xl border">
          <div className="border-border flex items-center justify-between border-b px-5 py-4">
            <div>
              <h3 className="text-foreground text-base font-semibold">Historique</h3>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Notifications envoyées et programmées
              </p>
            </div>
            <span className="text-muted-foreground text-xs">
              {items.length} notifications
            </span>
          </div>
          <div className="divide-border divide-y">
            <AnimatePresence initial={false}>
              {items.map((n) => {
                const cfg = typeConfig[n.type as NotifType] ?? typeConfig.Annonce
                const I = cfg.i
                const ouverture =
                  n.envoyees > 0 ? Math.round((n.ouvertes / n.envoyees) * 100) : 0
                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.28 }}
                    className="group px-5 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: cfg.c + "26", color: cfg.c }}
                      >
                        <I className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-foreground text-sm font-medium">
                            {n.titre}
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge
                              variant="outline"
                              className={
                                n.statut === "Envoyée"
                                  ? "border-success/30 text-success bg-success/5"
                                  : "border-info/30 text-info bg-info/5"
                              }
                            >
                              {n.statut}
                            </Badge>
                            <button
                              onClick={() => remove(n.id)}
                              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex h-7 w-7 items-center justify-center rounded-md opacity-0 transition group-hover:opacity-100"
                              aria-label="Supprimer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs">
                          <span>{n.type}</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {n.cible}
                          </span>
                          <span>·</span>
                          <span>{n.date}</span>
                        </div>

                        {n.statut === "Envoyée" && (
                          <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                            <div>
                              <div className="text-muted-foreground">Envoyées</div>
                              <div className="text-foreground font-semibold tabular-nums">
                                {n.envoyees.toLocaleString("fr-FR")}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Ouvertes</div>
                              <div className="text-foreground font-semibold tabular-nums">
                                {n.ouvertes.toLocaleString("fr-FR")}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Taux</div>
                              <div className="flex items-center gap-2">
                                <span className="text-foreground font-semibold tabular-nums">
                                  {ouverture}%
                                </span>
                                <Progress value={ouverture} className="h-1 flex-1" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
