"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Plus,
  MoreHorizontal,
  GraduationCap,
  Calendar,
  Layers,
  Users,
  Pencil,
  Trash2,
  Eye,
  Search,
  ArrowUpDown,
  Clock,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Checkbox } from "@/components/ui/checkbox"
import { concours as seedConcours, type Concours } from "@/lib/mock-data"

const typeColors: Record<string, string> = {
  Direct: "border-primary/30 text-primary bg-primary/5",
  Indirect: "border-info/30 text-info bg-info/5",
  Libre: "border-success/30 text-success bg-success/5",
}

const statutColors: Record<string, string> = {
  Ouvert: "border-success/30 text-success bg-success/5",
  "Bientôt clos": "border-warning/60 text-warning bg-warning/10",
  Fermé: "border-destructive/30 text-destructive bg-destructive/5",
}

type FormState = {
  nom: string
  abbr: string
  type: Concours["type"]
  cycles: ("A" | "B")[]
  dateCloture: string
  statut: Concours["statut"]
  packs: number
  inscrits: number
  description: string
}

const emptyForm: FormState = {
  nom: "",
  abbr: "",
  type: "Direct",
  cycles: ["A"],
  dateCloture: new Date().toISOString().slice(0, 10),
  statut: "Ouvert",
  packs: 0,
  inscrits: 0,
  description: "",
}

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export default function ConcoursPage() {
  const [items, setItems] = useState<Concours[]>(seedConcours)
  const [filter, setFilter] = useState<"Tous" | "Direct" | "Indirect" | "Libre">("Tous")
  const [cycleFilter, setCycleFilter] = useState<"all" | "A" | "B">("all")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<"cloture" | "inscrits" | "nom">("cloture")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Concours | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const [toDelete, setToDelete] = useState<Concours | null>(null)

  const stats = useMemo(() => {
    const totalInscrits = items.reduce((a, b) => a + b.inscrits, 0)
    const bientotClos = items.filter((c) => c.statut === "Bientôt clos").length
    const totalPacks = items.reduce((a, b) => a + b.packs, 0)
    return { totalInscrits, bientotClos, totalPacks }
  }, [items])

  const filtered = useMemo(() => {
    return items
      .filter((c) => {
        if (filter !== "Tous" && c.type !== filter) return false
        if (cycleFilter !== "all" && !c.cycles.includes(cycleFilter)) return false
        if (
          search &&
          !c.nom.toLowerCase().includes(search.toLowerCase()) &&
          !c.abbr.toLowerCase().includes(search.toLowerCase())
        )
          return false
        return true
      })
      .sort((a, b) => {
        if (sort === "cloture") return new Date(a.dateCloture).getTime() - new Date(b.dateCloture).getTime()
        if (sort === "inscrits") return b.inscrits - a.inscrits
        return a.nom.localeCompare(b.nom)
      })
  }, [items, filter, cycleFilter, search, sort])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(c: Concours) {
    setEditing(c)
    setForm({
      nom: c.nom,
      abbr: c.abbr,
      type: c.type,
      cycles: c.cycles,
      dateCloture: c.dateCloture,
      statut: c.statut,
      packs: c.packs,
      inscrits: c.inscrits,
      description: "",
    })
    setDialogOpen(true)
  }

  function toggleCycle(cy: "A" | "B") {
    setForm((f) => ({
      ...f,
      cycles: f.cycles.includes(cy) ? f.cycles.filter((x) => x !== cy) : [...f.cycles, cy],
    }))
  }

  function submit() {
    if (!form.nom.trim() || !form.abbr.trim()) {
      toast.error("Veuillez renseigner le nom et l'abréviation")
      return
    }
    if (form.cycles.length === 0) {
      toast.error("Sélectionnez au moins un cycle")
      return
    }

    if (editing) {
      setItems((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? {
                ...c,
                nom: form.nom,
                abbr: form.abbr,
                type: form.type,
                cycles: form.cycles,
                dateCloture: form.dateCloture,
                statut: form.statut,
                packs: form.packs,
                inscrits: form.inscrits,
              }
            : c,
        ),
      )
      toast.success(`Concours « ${form.abbr} » mis à jour`)
    } else {
      const next: Concours = {
        id: slug(form.abbr) + "-" + Math.random().toString(36).slice(2, 6),
        nom: form.nom,
        abbr: form.abbr,
        type: form.type,
        cycles: form.cycles,
        dateCloture: form.dateCloture,
        statut: form.statut,
        packs: form.packs,
        inscrits: form.inscrits,
      }
      setItems((prev) => [next, ...prev])
      toast.success(`Concours « ${form.abbr} » créé`)
    }
    setDialogOpen(false)
  }

  function confirmDelete() {
    if (!toDelete) return
    setItems((prev) => prev.filter((c) => c.id !== toDelete.id))
    toast.success(`Concours « ${toDelete.abbr} » supprimé`)
    setToDelete(null)
  }

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 pb-12">
      <PageHeader
        badge="Catalogue Pédagogique"
        title="Concours & Cycles"
        description="Pilotez l'offre de formation nationale. Définissez les dates de clôture pour la révocation automatique des accès et gérez les cycles A (Bac+3) et B (Bac)."
        actions={
          <Button
            size="sm"
            onClick={openCreate}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Nouveau concours
          </Button>
        }
      />

      {/* Global Stats Table */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { i: Users, l: "Inscrits globaux", v: stats.totalInscrits.toLocaleString("fr-FR"), c: "primary" },
          { i: Layers, l: "Total Packs", v: stats.totalPacks, c: "info" },
          { i: Clock, l: "Bientôt clos", v: stats.bientotClos, c: "warning" },
          { i: TrendingUp, l: "Concours actifs", v: items.length, c: "success" },
        ].map((s) => {
          const I = s.i
          return (
            <div key={s.l} className="bg-card border-border flex items-center gap-3 rounded-lg border p-4">
              <div className={`bg-${s.c}/10 text-${s.c} flex h-9 w-9 shrink-0 items-center justify-center rounded-lg`}>
                <I className="h-4 w-4" />
              </div>
              <div>
                <div className="text-muted-foreground text-xs uppercase tracking-wider">{s.l}</div>
                <div className="text-foreground text-xl font-semibold tabular-nums">{s.v}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls Bar */}
      <div className="bg-card border-border flex flex-col gap-4 rounded-xl border p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(["Tous", "Direct", "Indirect", "Libre"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={
                filter === t
                  ? "bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-xs font-medium"
                  : "bg-muted/40 text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              }
            >
              {t}
            </button>
          ))}
          <div className="bg-border mx-2 hidden h-4 w-px lg:block" />
          {(["A", "B"] as const).map((cy) => (
            <button
              key={cy}
              onClick={() => setCycleFilter((c) => (c === cy ? "all" : cy))}
              className={
                cycleFilter === cy
                  ? "bg-foreground text-background rounded-lg px-3 py-1.5 text-xs font-medium"
                  : "bg-muted/40 text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              }
            >
              Cycle {cy}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 lg:min-w-[280px]">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
            <Input
              placeholder="Rechercher un concours..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-muted/30 h-9 pl-9 text-xs"
            />
          </div>
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as any)}
          >
            <SelectTrigger className="h-9 w-[140px] text-xs">
              <ArrowUpDown className="mr-2 h-3 w-3" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cloture">Par clôture</SelectItem>
              <SelectItem value="inscrits">Par inscrits</SelectItem>
              <SelectItem value="nom">Par nom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((c, i) => (
            <motion.article
              key={c.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group bg-card border-border hover:border-primary/40 relative flex flex-col overflow-hidden rounded-2xl border transition-all hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Header Gradient */}
              <div 
                className="absolute inset-x-0 top-0 h-1" 
                style={{ background: `linear-gradient(90deg, var(--primary), ${c.type === 'Direct' ? '#0ea5e9' : '#10b981'})` }}
              />

              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-foreground text-lg font-bold leading-tight truncate">
                        {c.abbr}
                      </h3>
                      <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                        {c.nom}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem onClick={() => openEdit(c)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Éditer les paramètres
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info(`Exportation PDF pour ${c.abbr}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Télécharger rapport
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setToDelete(c)}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer du système
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge variant="secondary" className={typeColors[c.type] + " border-0"}>
                    {c.type}
                  </Badge>
                  <Badge variant="outline" className={statutColors[c.statut]}>
                    {c.statut}
                  </Badge>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Progress Simulé - Remplissage des packs */}
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground uppercase font-medium">Contenu disponible</span>
                      <span className="text-foreground font-bold">85%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-muted overflow-hidden rounded-full">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-primary rounded-full" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
                      <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-tight">Cycles</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        {c.cycles.map(cy => (
                          <span key={cy} className="bg-primary/20 text-primary flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold">
                            {cy}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
                      <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-tight">Clôture</div>
                      <div className="text-foreground mt-1 text-sm font-bold">
                        {new Date(c.dateCloture).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-border mt-auto flex items-center justify-between border-t bg-muted/20 px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] font-bold uppercase">Packs</span>
                    <span className="text-foreground text-sm font-bold tabular-nums">{c.packs}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] font-bold uppercase">Inscrits</span>
                    <span className="text-foreground text-sm font-bold tabular-nums">{c.inscrits.toLocaleString("fr-FR")}</span>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="bg-primary/10 text-primary hover:bg-primary/20 h-8 font-bold text-xs"
                  onClick={() => toast.info(`Accès aux packs de ${c.abbr}`)}
                >
                  Gérer
                </Button>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {/* Dialogs remain similar but with slightly refined styles */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Paramètres : ${editing.abbr}` : "Création d'un nouveau concours"}
            </DialogTitle>
            <DialogDescription>
              Configurez les cycles disponibles et les dates clés du concours. Toute modification est répercutée en temps réel.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Nom officiel de l'examen</Label>
              <Input
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                placeholder="Ex : Concours d'entrée à l'ENA"
                className="mt-1.5 focus:ring-primary/20"
              />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-muted-foreground">Abréviation / Code</Label>
              <Input
                value={form.abbr}
                onChange={(e) => setForm({ ...form, abbr: e.target.value.toUpperCase() })}
                placeholder="ENA"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-muted-foreground">Mode d'accès</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v as Concours["type"] })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Direct">Concours Direct</SelectItem>
                  <SelectItem value="Indirect">Concours Indirect</SelectItem>
                  <SelectItem value="Libre">Candidature Libre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Cycles de formation</Label>
                <div className="bg-muted/30 flex items-center gap-6 rounded-lg border border-border px-4 py-3">
                  {(["A", "B"] as const).map((cy) => (
                    <label key={cy} className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                      <Checkbox
                        checked={form.cycles.includes(cy)}
                        onCheckedChange={() => toggleCycle(cy)}
                      />
                      Cycle {cy}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Statut actuel</Label>
                <Select
                  value={form.statut}
                  onValueChange={(v) => setForm({ ...form, statut: v as Concours["statut"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ouvert">🔴 Ouvert</SelectItem>
                    <SelectItem value="Bientôt clos">🕒 Bientôt clos</SelectItem>
                    <SelectItem value="Fermé">🔒 Fermé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-muted-foreground">Date de clôture effective</Label>
              <Input
                type="date"
                value={form.dateCloture}
                onChange={(e) => setForm({ ...form, dateCloture: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-muted-foreground">Allocation initiale packs</Label>
              <Input
                type="number"
                value={form.packs}
                onChange={(e) => setForm({ ...form, packs: Number(e.target.value) })}
                className="mt-1.5"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="font-bold">
              Annuler
            </Button>
            <Button
              onClick={submit}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            >
              {editing ? "Sauvegarder les changements" : "Valider la création"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive font-bold">Action irréversible</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer le concours **{toDelete?.abbr}** ? 
              Cela révoquera l'accès pour les {toDelete?.inscrits} inscrits et déplacera les {toDelete?.packs} packs vers les archives.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
            >
              Confirmer la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
