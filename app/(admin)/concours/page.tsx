"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
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
  "Bientôt clos": "border-warning/60 text-warning-foreground bg-warning/20",
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

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Concours | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)

  const [toDelete, setToDelete] = useState<Concours | null>(null)

  const filtered = useMemo(() => {
    return items.filter((c) => {
      if (filter !== "Tous" && c.type !== filter) return false
      if (cycleFilter !== "all" && !c.cycles.includes(cycleFilter)) return false
      return true
    })
  }, [items, filter, cycleFilter])

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
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
      <PageHeader
        badge="Catalogue"
        title="Concours & Cycles"
        description="Gérez les concours nationaux (ENA, Douane), les cycles A/B et leur date de clôture. Le contenu est automatiquement révoqué à la clôture."
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

      {/* Type filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(["Tous", "Direct", "Indirect", "Libre"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={
              filter === t
                ? "bg-primary text-primary-foreground rounded-full px-3.5 py-1.5 text-xs font-medium"
                : "bg-card border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors"
            }
          >
            {t}
          </button>
        ))}
        <div className="bg-border mx-2 h-4 w-px" />
        {(["A", "B"] as const).map((cy) => (
          <button
            key={cy}
            onClick={() => setCycleFilter((c) => (c === cy ? "all" : cy))}
            className={
              cycleFilter === cy
                ? "bg-foreground text-background rounded-full px-3.5 py-1.5 text-xs font-medium"
                : "bg-card border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors"
            }
          >
            Cycle {cy}
          </button>
        ))}
        <span className="text-muted-foreground ml-auto text-xs">
          {filtered.length} concours
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((c, i) => (
            <motion.article
              key={c.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group bg-card border-border hover:border-primary/30 relative overflow-hidden rounded-xl border p-5 transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="bg-primary/5 pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-foreground text-base font-semibold leading-tight">
                        {c.abbr}
                      </div>
                      <div className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                        {c.nom}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => openEdit(c)}>
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/packs">
                          <Eye className="mr-2 h-3.5 w-3.5" />
                          Voir les packs
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setToDelete(c)}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  <Badge variant="outline" className={typeColors[c.type]}>
                    {c.type}
                  </Badge>
                  {c.cycles.map((cy) => (
                    <Badge
                      key={cy}
                      variant="outline"
                      className="border-border bg-muted/40 text-muted-foreground"
                    >
                      Cycle {cy}
                    </Badge>
                  ))}
                  <Badge variant="outline" className={statutColors[c.statut]}>
                    {c.statut}
                  </Badge>
                </div>

                <div className="border-border mt-5 grid grid-cols-3 gap-3 border-t pt-4">
                  <div>
                    <div className="text-muted-foreground flex items-center gap-1 text-[11px] uppercase tracking-wider">
                      <Layers className="h-3 w-3" />
                      Packs
                    </div>
                    <div className="text-foreground mt-1 text-lg font-semibold tabular-nums">
                      {c.packs}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground flex items-center gap-1 text-[11px] uppercase tracking-wider">
                      <Users className="h-3 w-3" />
                      Inscrits
                    </div>
                    <div className="text-foreground mt-1 text-lg font-semibold tabular-nums">
                      {c.inscrits.toLocaleString("fr-FR")}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground flex items-center gap-1 text-[11px] uppercase tracking-wider">
                      <Calendar className="h-3 w-3" />
                      Clôture
                    </div>
                    <div className="text-foreground mt-1 text-lg font-semibold tabular-nums">
                      {new Date(c.dateCloture).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link href="/packs">
                      Voir packs
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => openEdit(c)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
                  >
                    Modifier
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="bg-card border-border rounded-xl border border-dashed p-12 text-center">
          <GraduationCap className="text-muted-foreground mx-auto h-10 w-10" />
          <h3 className="text-foreground mt-3 text-base font-semibold">
            Aucun concours pour ce filtre
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Essayez de retirer les filtres ou créez un nouveau concours.
          </p>
          <Button size="sm" onClick={openCreate} className="mt-4">
            <Plus className="mr-1.5 h-4 w-4" />
            Créer un concours
          </Button>
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Modifier ${editing.abbr}` : "Nouveau concours"}
            </DialogTitle>
            <DialogDescription>
              Les modifications seront appliquées immédiatement au catalogue des apprenants.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="nom">Nom complet</Label>
              <Input
                id="nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                placeholder="Ex : École Nationale d'Administration"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="abbr">Abréviation</Label>
              <Input
                id="abbr"
                value={form.abbr}
                onChange={(e) => setForm({ ...form, abbr: e.target.value.toUpperCase() })}
                placeholder="ENA"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v as Concours["type"] })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Direct">Direct</SelectItem>
                  <SelectItem value="Indirect">Indirect</SelectItem>
                  <SelectItem value="Libre">Libre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cycles proposés</Label>
              <div className="bg-muted/30 mt-1.5 flex items-center gap-5 rounded-md border border-border px-3 py-2.5">
                {(["A", "B"] as const).map((cy) => (
                  <label
                    key={cy}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <Checkbox
                      checked={form.cycles.includes(cy)}
                      onCheckedChange={() => toggleCycle(cy)}
                    />
                    Cycle {cy}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>Statut</Label>
              <Select
                value={form.statut}
                onValueChange={(v) =>
                  setForm({ ...form, statut: v as Concours["statut"] })
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ouvert">Ouvert</SelectItem>
                  <SelectItem value="Bientôt clos">Bientôt clos</SelectItem>
                  <SelectItem value="Fermé">Fermé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cloture">Date de clôture</Label>
              <Input
                id="cloture"
                type="date"
                value={form.dateCloture}
                onChange={(e) => setForm({ ...form, dateCloture: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="packs">Packs liés</Label>
              <Input
                id="packs"
                type="number"
                min={0}
                value={form.packs}
                onChange={(e) => setForm({ ...form, packs: Number(e.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="inscrits">Inscrits</Label>
              <Input
                id="inscrits"
                type="number"
                min={0}
                value={form.inscrits}
                onChange={(e) => setForm({ ...form, inscrits: Number(e.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="description">Description (interne)</Label>
              <Textarea
                id="description"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Note interne sur ce concours..."
                className="mt-1.5 resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={submit}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {editing ? "Enregistrer" : "Créer le concours"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Supprimer le concours {toDelete?.abbr} ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Les {toDelete?.packs ?? 0} packs liés devront
              être réassignés et les {toDelete?.inscrits?.toLocaleString("fr-FR") ?? 0}{" "}
              inscrits seront notifiés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
