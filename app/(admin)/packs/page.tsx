"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  FileText,
  Headphones,
  Video,
  ListChecks,
  Layers,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
  Archive,
  Eye,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { packs as seedPacks, concours, fcfa, type Pack } from "@/lib/mock-data"

const statutColors: Record<string, string> = {
  Publié: "border-success/30 text-success bg-success/5",
  Brouillon: "border-warning/60 text-warning-foreground bg-warning/20",
  Archivé: "border-muted-foreground/30 text-muted-foreground bg-muted/40",
}

type FormState = {
  titre: string
  concours: string
  cycle: "A" | "B"
  matiere: string
  prix: number
  statut: Pack["statut"]
  cours: number
  resumes: number
  audios: number
  videos: number
  qcm: number
  flashcards: number
}

const emptyForm: FormState = {
  titre: "",
  concours: "ENA",
  cycle: "A",
  matiere: "",
  prix: 10000,
  statut: "Brouillon",
  cours: 0,
  resumes: 0,
  audios: 0,
  videos: 0,
  qcm: 0,
  flashcards: 0,
}

export default function PacksPage() {
  const [items, setItems] = useState<Pack[]>(seedPacks)
  const [search, setSearch] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Pack | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [toDelete, setToDelete] = useState<Pack | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (p) =>
        p.titre.toLowerCase().includes(q) ||
        p.matiere.toLowerCase().includes(q) ||
        p.concours.toLowerCase().includes(q),
    )
  }, [items, search])

  const stats = useMemo(() => {
    const total = items.length
    const publies = items.filter((p) => p.statut === "Publié").length
    const brouillons = items.filter((p) => p.statut === "Brouillon").length
    const revenus = items.reduce((acc, p) => acc + p.prix * p.acheteurs, 0)
    return { total, publies, brouillons, revenus }
  }, [items])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(p: Pack) {
    setEditing(p)
    setForm({
      titre: p.titre,
      concours: p.concours,
      cycle: p.cycle,
      matiere: p.matiere,
      prix: p.prix,
      statut: p.statut,
      cours: p.contenus.cours,
      resumes: p.contenus.resumes,
      audios: p.contenus.audios,
      videos: p.contenus.videos,
      qcm: p.contenus.qcm,
      flashcards: p.contenus.flashcards,
    })
    setDialogOpen(true)
  }

  function archivePack(p: Pack) {
    setItems((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, statut: "Archivé" } : x)),
    )
    toast.success(`Pack « ${p.titre} » archivé`)
  }

  function submit() {
    if (!form.titre.trim() || !form.matiere.trim()) {
      toast.error("Renseignez le titre et la matière")
      return
    }
    if (form.prix < 0) {
      toast.error("Le prix ne peut pas être négatif")
      return
    }

    const contenus = {
      cours: form.cours,
      resumes: form.resumes,
      audios: form.audios,
      videos: form.videos,
      qcm: form.qcm,
      flashcards: form.flashcards,
    }

    if (editing) {
      setItems((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                titre: form.titre,
                concours: form.concours,
                cycle: form.cycle,
                matiere: form.matiere,
                prix: form.prix,
                statut: form.statut,
                contenus,
                miseAJour: "À l'instant",
              }
            : p,
        ),
      )
      toast.success(`Pack « ${form.titre} » mis à jour`)
    } else {
      const next: Pack = {
        id: "pack-" + Math.random().toString(36).slice(2, 8),
        titre: form.titre,
        concours: form.concours,
        cycle: form.cycle,
        matiere: form.matiere,
        prix: form.prix,
        acheteurs: 0,
        contenus,
        statut: form.statut,
        miseAJour: "À l'instant",
        progression: 0,
      }
      setItems((prev) => [next, ...prev])
      toast.success(`Pack « ${form.titre} » créé`)
    }
    setDialogOpen(false)
  }

  function confirmDelete() {
    if (!toDelete) return
    setItems((prev) => prev.filter((p) => p.id !== toDelete.id))
    toast.success(`Pack « ${toDelete.titre} » supprimé`)
    setToDelete(null)
  }

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
      <PageHeader
        badge="Contenu pédagogique"
        title="Packs & Matières"
        description="Chaque pack regroupe Cours, Résumés, Audio, Vidéo, QCM et Flashcards. L'achat débloque le pack et son chatbot contextuel."
        actions={
          <Button
            size="sm"
            onClick={openCreate}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Créer un pack
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un pack par titre, matière, concours..."
            className="h-10 pl-9"
          />
        </div>
        <Button variant="outline" size="default" onClick={() => toast.info("Panneau de filtres à venir")}>
          <Filter className="mr-1.5 h-4 w-4" />
          Filtres
        </Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: "Total packs", v: String(stats.total), c: "var(--chart-1)" },
          { l: "Publiés", v: String(stats.publies), c: "var(--chart-4)" },
          { l: "Brouillons", v: String(stats.brouillons), c: "var(--chart-2)" },
          { l: "Revenus packs", v: fcfa(stats.revenus), c: "var(--chart-3)" },
        ].map((s) => (
          <div
            key={s.l}
            className="bg-card border-border flex items-center gap-3 rounded-lg border p-3"
          >
            <span className="h-8 w-1 rounded-full" style={{ backgroundColor: s.c }} />
            <div>
              <div className="text-muted-foreground text-[11px] uppercase tracking-wider">
                {s.l}
              </div>
              <div className="text-foreground text-lg font-semibold tabular-nums">
                {s.v}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pack cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="group bg-card border-border hover:border-primary/40 relative overflow-hidden rounded-xl border transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Action menu */}
              <div className="absolute right-3 top-3 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="bg-background/80 text-muted-foreground hover:bg-accent hover:text-foreground flex h-7 w-7 items-center justify-center rounded-md border border-border backdrop-blur-sm transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">Actions</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem asChild>
                      <Link href={`/packs/${p.id}`}>
                        <Eye className="mr-2 h-3.5 w-3.5" />
                        Ouvrir
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEdit(p)}>
                      <Pencil className="mr-2 h-3.5 w-3.5" />
                      Modifier
                    </DropdownMenuItem>
                    {p.statut !== "Archivé" && (
                      <DropdownMenuItem onClick={() => archivePack(p)}>
                        <Archive className="mr-2 h-3.5 w-3.5" />
                        Archiver
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setToDelete(p)}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Link href={`/packs/${p.id}`} className="block">
                {/* Header strip */}
                <div className="border-border relative flex items-center justify-between border-b px-5 py-3 pr-12">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-primary font-semibold">{p.concours}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">Cycle {p.cycle}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{p.matiere}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-foreground group-hover:text-primary text-lg font-semibold leading-tight transition-colors">
                      {p.titre}
                    </h3>
                    <Badge variant="outline" className={statutColors[p.statut]}>
                      {p.statut}
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-foreground text-2xl font-bold tabular-nums">
                      {fcfa(p.prix)}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      · {p.acheteurs.toLocaleString("fr-FR")} acheteurs
                    </span>
                  </div>

                  {/* Content icons */}
                  <div className="mt-5 grid grid-cols-6 gap-1.5">
                    {[
                      { icon: BookOpen, n: p.contenus.cours, l: "Cours" },
                      { icon: FileText, n: p.contenus.resumes, l: "Résumés" },
                      { icon: Headphones, n: p.contenus.audios, l: "Audio" },
                      { icon: Video, n: p.contenus.videos, l: "Vidéo" },
                      { icon: ListChecks, n: p.contenus.qcm, l: "QCM" },
                      { icon: Layers, n: p.contenus.flashcards, l: "Flash" },
                    ].map((ct) => {
                      const I = ct.icon
                      return (
                        <div
                          key={ct.l}
                          title={`${ct.n} ${ct.l}`}
                          className="bg-muted/40 hover:bg-primary/10 hover:text-primary flex flex-col items-center justify-center rounded-md py-2 transition-colors"
                        >
                          <I className="text-muted-foreground h-3.5 w-3.5" />
                          <span className="text-foreground mt-1 text-[11px] font-semibold tabular-nums">
                            {ct.n}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Progress */}
                  {p.statut === "Publié" && (
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progression moyenne</span>
                        <span className="text-foreground font-medium tabular-nums">
                          {p.progression}%
                        </span>
                      </div>
                      <Progress value={p.progression} className="mt-2 h-1.5" />
                    </div>
                  )}

                  <div className="border-border mt-5 flex items-center justify-between border-t pt-3">
                    <span className="text-muted-foreground text-xs">MAJ : {p.miseAJour}</span>
                    <span className="text-primary inline-flex items-center text-xs font-medium">
                      Gérer
                      <ChevronRight className="ml-0.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="bg-card border-border rounded-xl border border-dashed p-12 text-center">
          <BookOpen className="text-muted-foreground mx-auto h-10 w-10" />
          <h3 className="text-foreground mt-3 text-base font-semibold">
            Aucun pack trouvé
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Essayez une autre recherche ou créez un nouveau pack.
          </p>
        </div>
      )}

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Modifier : ${editing.titre}` : "Nouveau pack pédagogique"}
            </DialogTitle>
            <DialogDescription>
              Définissez le contenu et le prix. Vous pourrez ajouter cours, QCM et autres
              médias depuis la fiche du pack.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="titre">Titre du pack</Label>
              <Input
                id="titre"
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
                placeholder="Ex : Droit Administratif"
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
                      {c.abbr} — {c.nom}
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
              <Label htmlFor="matiere">Matière</Label>
              <Input
                id="matiere"
                value={form.matiere}
                onChange={(e) => setForm({ ...form, matiere: e.target.value })}
                placeholder="Droit, Économie..."
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="prix">Prix (FCFA)</Label>
              <Input
                id="prix"
                type="number"
                min={0}
                step={500}
                value={form.prix}
                onChange={(e) => setForm({ ...form, prix: Number(e.target.value) })}
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Statut</Label>
              <Select
                value={form.statut}
                onValueChange={(v) =>
                  setForm({ ...form, statut: v as Pack["statut"] })
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Brouillon">Brouillon</SelectItem>
                  <SelectItem value="Publié">Publié</SelectItem>
                  <SelectItem value="Archivé">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="sm:col-span-2">
              <Label className="mb-2 block">Contenu initial</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { k: "cours", l: "Cours", I: BookOpen },
                  { k: "resumes", l: "Résumés", I: FileText },
                  { k: "audios", l: "Audios", I: Headphones },
                  { k: "videos", l: "Vidéos", I: Video },
                  { k: "qcm", l: "QCM", I: ListChecks },
                  { k: "flashcards", l: "Flashcards", I: Layers },
                ].map(({ k, l, I }) => (
                  <div key={k} className="bg-muted/30 rounded-md border border-border px-3 py-2">
                    <div className="text-muted-foreground flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                      <I className="h-3 w-3" />
                      {l}
                    </div>
                    <Input
                      type="number"
                      min={0}
                      value={(form as unknown as Record<string, number>)[k]}
                      onChange={(e) =>
                        setForm({ ...form, [k]: Number(e.target.value) } as FormState)
                      }
                      className="mt-1 h-8 border-0 bg-transparent px-0 text-base font-semibold shadow-none focus-visible:ring-0"
                    />
                  </div>
                ))}
              </div>
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
              {editing ? "Enregistrer" : "Créer le pack"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer « {toDelete?.titre} » ?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete?.acheteurs.toLocaleString("fr-FR")} acheteurs possèdent ce pack.
              La suppression révoque immédiatement leur accès. Action irréversible.
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
