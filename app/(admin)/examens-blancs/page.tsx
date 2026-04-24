"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Plus,
  Clock,
  Users,
  Trophy,
  ListChecks,
  Calendar,
  Play,
  Settings2,
  Pencil,
  Trash2,
  Copy,
  MoreVertical,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { examensBlancs as seed, concours } from "@/lib/mock-data"

type ExamenBlanc = (typeof seed)[number]

type FormState = {
  titre: string
  concours: string
  cycle: "A" | "B"
  duree: number
  questions: number
  statut: "Actif" | "Programmé"
}

const emptyForm: FormState = {
  titre: "",
  concours: "ENA",
  cycle: "B",
  duree: 180,
  questions: 60,
  statut: "Programmé",
}

export default function ExamensBlancsPage() {
  const [items, setItems] = useState<ExamenBlanc[]>(seed)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ExamenBlanc | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [toDelete, setToDelete] = useState<ExamenBlanc | null>(null)
  const [viewingResults, setViewingResults] = useState<ExamenBlanc | null>(null)

  const stats = useMemo(() => {
    const actifs = items.filter((e) => e.statut === "Actif").length
    const participants = items.reduce((a, e) => a + e.participants, 0)
    const score = items.length
      ? Math.round(items.reduce((a, e) => a + e.moyenneScore, 0) / items.length)
      : 0
    const duree = items.length
      ? Math.round(items.reduce((a, e) => a + e.duree, 0) / items.length)
      : 0
    return { actifs, participants, score, duree }
  }, [items])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(e: ExamenBlanc) {
    setEditing(e)
    setForm({
      titre: e.titre,
      concours: e.concours,
      cycle: e.cycle as "A" | "B",
      duree: e.duree,
      questions: e.questions,
      statut: e.statut,
    })
    setDialogOpen(true)
  }

  function duplicate(e: ExamenBlanc) {
    const next: ExamenBlanc = {
      ...e,
      id: "eb-" + Math.random().toString(36).slice(2, 8),
      titre: e.titre + " (copie)",
      participants: 0,
      moyenneScore: 0,
      statut: "Programmé",
      dateCreation: new Date().toISOString().slice(0, 10),
    }
    setItems((prev) => [next, ...prev])
    toast.success(`Examen « ${e.titre} » dupliqué`)
  }

  function submit() {
    if (!form.titre.trim()) {
      toast.error("Le titre est requis")
      return
    }
    if (form.questions <= 0 || form.duree <= 0) {
      toast.error("Durée et nombre de questions doivent être positifs")
      return
    }
    if (editing) {
      setItems((prev) =>
        prev.map((e) =>
          e.id === editing.id ? { ...e, ...form } : e,
        ),
      )
      toast.success(`Examen « ${form.titre} » mis à jour`)
    } else {
      const next: ExamenBlanc = {
        id: "eb-" + Math.random().toString(36).slice(2, 8),
        ...form,
        participants: 0,
        moyenneScore: 0,
        dateCreation: new Date().toISOString().slice(0, 10),
      }
      setItems((prev) => [next, ...prev])
      toast.success(`Examen « ${form.titre} » créé`)
    }
    setDialogOpen(false)
  }

  function confirmDelete() {
    if (!toDelete) return
    setItems((prev) => prev.filter((e) => e.id !== toDelete.id))
    toast.success(`Examen « ${toDelete.titre} » supprimé`)
    setToDelete(null)
  }

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
      <PageHeader
        badge="Évaluation"
        title="Examens blancs"
        description="Simulations chronométrées dans les conditions réelles. Analyse détaillée des résultats par utilisateur, par chapitre et par compétence."
        actions={
          <Button
            size="sm"
            onClick={openCreate}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Créer un examen
          </Button>
        }
      />

      {/* Hero stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { i: ListChecks, l: "Examens actifs", v: String(stats.actifs) },
          { i: Users, l: "Participants total", v: stats.participants.toLocaleString("fr-FR") },
          { i: Trophy, l: "Score moyen", v: `${stats.score}%` },
          {
            i: Clock,
            l: "Durée moyenne",
            v: `${Math.floor(stats.duree / 60)}h ${stats.duree % 60}`,
          },
        ].map((s) => {
          const I = s.i
          return (
            <div
              key={s.l}
              className="bg-card border-border flex items-center gap-3 rounded-lg border p-4"
            >
              <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                <I className="h-4 w-4" />
              </div>
              <div>
                <div className="text-muted-foreground text-xs uppercase tracking-wider">
                  {s.l}
                </div>
                <div className="text-foreground text-xl font-semibold tabular-nums">
                  {s.v}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Exam cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {items.map((e, i) => (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.32, delay: i * 0.04 }}
              className="group bg-card border-border hover:border-primary/40 relative overflow-hidden rounded-xl border p-6 transition-all"
            >
              <div className="bg-primary/5 pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-primary font-semibold">{e.concours}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">Cycle {e.cycle}</span>
                    </div>
                    <h3 className="text-foreground mt-1.5 text-lg font-semibold leading-tight">
                      {e.titre}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className={
                        e.statut === "Actif"
                          ? "border-success/30 text-success bg-success/5"
                          : "border-info/30 text-info bg-info/5"
                      }
                    >
                      {e.statut}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-7 w-7 items-center justify-center rounded-md transition-colors">
                          <MoreVertical className="h-3.5 w-3.5" />
                          <span className="sr-only">Actions</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => openEdit(e)}>
                          <Pencil className="mr-2 h-3.5 w-3.5" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicate(e)}>
                          <Copy className="mr-2 h-3.5 w-3.5" />
                          Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setToDelete(e)}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Clock className="h-3 w-3" />
                      Durée
                    </div>
                    <div className="text-foreground mt-1 text-base font-semibold tabular-nums">
                      {Math.floor(e.duree / 60)}h {e.duree % 60}min
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <ListChecks className="h-3 w-3" />
                      Questions
                    </div>
                    <div className="text-foreground mt-1 text-base font-semibold tabular-nums">
                      {e.questions}
                    </div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Users className="h-3 w-3" />
                      Participants
                    </div>
                    <div className="text-foreground mt-1 text-base font-semibold tabular-nums">
                      {e.participants.toLocaleString("fr-FR")}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Score moyen des participants
                    </span>
                    <span className="text-foreground font-semibold tabular-nums">
                      {e.moyenneScore}%
                    </span>
                  </div>
                  <Progress value={e.moyenneScore} className="mt-2 h-1.5" />
                </div>

                <div className="border-border mt-5 flex items-center justify-between border-t pt-4">
                  <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" />
                    Créé le {new Date(e.dateCreation).toLocaleDateString("fr-FR")}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(e)}>
                      <Settings2 className="mr-1 h-3.5 w-3.5" />
                      Configurer
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setViewingResults(e)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Play className="mr-1 h-3.5 w-3.5" />
                      Résultats
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Modifier : ${editing.titre}` : "Nouvel examen blanc"}
            </DialogTitle>
            <DialogDescription>
              Les participants seront notifiés automatiquement si l&apos;examen est
              programmé.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="e-titre">Titre</Label>
              <Input
                id="e-titre"
                value={form.titre}
                onChange={(ev) => setForm({ ...form, titre: ev.target.value })}
                placeholder="Examen Blanc ENA — Cycle B 2026"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Concours</Label>
              <Select
                value={form.concours}
                onValueChange={(v) => setForm({ ...form, concours: v })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {concours.map((c) => (
                    <SelectItem key={c.id} value={c.abbr}>
                      {c.abbr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cycle</Label>
              <Select
                value={form.cycle}
                onValueChange={(v) => setForm({ ...form, cycle: v as "A" | "B" })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Cycle A</SelectItem>
                  <SelectItem value="B">Cycle B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="e-duree">Durée (minutes)</Label>
              <Input
                id="e-duree"
                type="number"
                min={1}
                value={form.duree}
                onChange={(ev) => setForm({ ...form, duree: Number(ev.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="e-quest">Nombre de questions</Label>
              <Input
                id="e-quest"
                type="number"
                min={1}
                value={form.questions}
                onChange={(ev) =>
                  setForm({ ...form, questions: Number(ev.target.value) })
                }
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Statut</Label>
              <Select
                value={form.statut}
                onValueChange={(v) =>
                  setForm({ ...form, statut: v as FormState["statut"] })
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Programmé">Programmé</SelectItem>
                  <SelectItem value="Actif">Actif</SelectItem>
                </SelectContent>
              </Select>
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
              {editing ? "Enregistrer" : "Créer l'examen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer « {toDelete?.titre} » ?</AlertDialogTitle>
            <AlertDialogDescription>
              Les {toDelete?.participants.toLocaleString("fr-FR")} résultats liés seront
              conservés en archive mais l&apos;examen ne sera plus accessible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Results View */}
      <Dialog open={!!viewingResults} onOpenChange={(o) => !o && setViewingResults(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Résultats : {viewingResults?.titre}</DialogTitle>
            <DialogDescription>
              Aperçu détaillé des performances des participants à cet examen blanc.
            </DialogDescription>
          </DialogHeader>
          {viewingResults && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="bg-muted/30 border-border rounded-lg border p-4">
                  <div className="text-muted-foreground text-xs uppercase tracking-wider">Participants</div>
                  <div className="mt-1 text-2xl font-bold">{viewingResults.participants.toLocaleString("fr-FR")}</div>
                </div>
                <div className="bg-muted/30 border-border rounded-lg border p-4">
                  <div className="text-muted-foreground text-xs uppercase tracking-wider">Score moyen</div>
                  <div className="text-primary mt-1 text-2xl font-bold">{viewingResults.moyenneScore}%</div>
                </div>
                <div className="bg-muted/30 border-border rounded-lg border p-4">
                  <div className="text-muted-foreground text-xs uppercase tracking-wider">Taux de réussite</div>
                  <div className="text-success mt-1 text-2xl font-bold">
                    {Math.round(viewingResults.moyenneScore * 0.85)}%
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 border-border rounded-lg border p-8 text-center">
                <Trophy className="text-muted-foreground mx-auto h-12 w-12 opacity-50" />
                <h4 className="mt-4 font-medium">Tableau de bord complet en développement</h4>
                <p className="text-muted-foreground mt-1 text-sm">L&apos;exportation et les graphiques de progression individuelle seront bientôt disponibles.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewingResults(null)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
