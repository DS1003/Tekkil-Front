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
  TrendingUp,
  CreditCard,
  ArrowUpDown,
  X,
  Users,
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
  Brouillon: "border-warning/60 text-warning bg-warning/10",
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
  const [filterConcours, setFilterConcours] = useState<string>("all")
  const [filterStatut, setFilterStatut] = useState<string>("all")
  const [sortField, setSortField] = useState<"prix" | "acheteurs" | "titre">("acheteurs")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Pack | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [toDelete, setToDelete] = useState<Pack | null>(null)

  const stats = useMemo(() => {
    const totalPacks = items.length
    const totalAcheteurs = items.reduce((a, b) => a + b.acheteurs, 0)
    const totalRevenue = items.reduce((a, b) => a + b.prix * b.acheteurs, 0)
    const avgProgression = Math.round(items.reduce((a, b) => a + b.progression, 0) / items.length)
    return { totalPacks, totalAcheteurs, totalRevenue, avgProgression }
  }, [items])

  const filtered = useMemo(() => {
    return items
      .filter((p) => {
        const matchesSearch = 
          p.titre.toLowerCase().includes(search.toLowerCase()) ||
          p.matiere.toLowerCase().includes(search.toLowerCase()) ||
          p.concours.toLowerCase().includes(search.toLowerCase())
        
        const matchesConcours = filterConcours === "all" || p.concours === filterConcours
        const matchesStatut = filterStatut === "all" || p.statut === filterStatut

        return matchesSearch && matchesConcours && matchesStatut
      })
      .sort((a, b) => {
        if (sortField === "prix") return b.prix - a.prix
        if (sortField === "acheteurs") return b.acheteurs - a.acheteurs
        return a.titre.localeCompare(b.titre)
      })
  }, [items, search, filterConcours, filterStatut, sortField])

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
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 pb-12">
      <PageHeader
        badge="Catalogue Pédagogique"
        title="Packs & Matières"
        description="Gérez les unités pédagogiques de Tekkil. Un pack regroupe 6 piliers de contenu et un agent conversationnel IA dédié à la matière."
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

      {/* KPI Stats Header */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { i: Layers, l: "Packs actifs", v: stats.totalPacks, c: "primary" },
          { i: TrendingUp, l: "Progression Moy.", v: `${stats.avgProgression}%`, c: "success" },
          { i: CreditCard, l: "CA Estimé", v: fcfa(stats.totalRevenue), c: "info" },
          { i: Users, l: "Ventes totales", v: stats.totalAcheteurs.toLocaleString("fr-FR"), c: "warning" },
        ].map((s) => {
          const I = s.i
          return (
            <div key={s.l} className="bg-card border-border flex items-center gap-3 rounded-lg border p-4">
              <div className={`bg-${s.c}/10 text-${s.c} flex h-9 w-9 shrink-0 items-center justify-center rounded-lg`}>
                <I className="h-4 w-4" />
              </div>
              <div>
                <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">{s.l}</div>
                <div className="text-foreground text-lg font-bold tabular-nums">{s.v}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Advanced Filter Bar */}
      <div className="bg-card border-border flex flex-col gap-4 rounded-xl border p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Chercher titre, concours..."
              className="bg-muted/30 h-9 pl-9 text-xs"
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <Select value={filterConcours} onValueChange={setFilterConcours}>
            <SelectTrigger className="h-9 w-[130px] text-xs">
              <SelectValue placeholder="Concours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous concours</SelectItem>
              {concours.map(c => <SelectItem key={c.id} value={c.abbr}>{c.abbr}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatut} onValueChange={setFilterStatut}>
            <SelectTrigger className="h-9 w-[130px] text-xs">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              <SelectItem value="Publié">Publiés</SelectItem>
              <SelectItem value="Brouillon">Brouillons</SelectItem>
              <SelectItem value="Archivé">Archivés</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortField} onValueChange={(v) => setSortField(v as any)}>
            <SelectTrigger className="h-9 w-[140px] text-xs">
              <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acheteurs">Plus vendus</SelectItem>
              <SelectItem value="prix">Par prix</SelectItem>
              <SelectItem value="titre">Par nom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="group bg-card border-border hover:border-primary/40 relative flex flex-col overflow-hidden rounded-2xl border transition-all hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Image / Header Simulation */}
              <div className="bg-primary/5 relative h-32 w-full overflow-hidden border-b border-border">
                <div className="bg-primary/20 absolute inset-0 flex items-center justify-center opacity-40 mix-blend-overlay transition-transform group-hover:scale-110">
                   <Layers className="h-16 w-16 text-primary" />
                </div>
                <div className="absolute left-4 top-4">
                  <Badge className="bg-white/90 text-primary border-0 font-bold backdrop-blur-md">
                    {p.concours}
                  </Badge>
                </div>
                <div className="absolute right-3 top-3 z-20">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="bg-white/80 text-muted-foreground hover:bg-white hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg shadow-sm transition-colors border border-border/50">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem asChild>
                        <Link href={`/packs/${p.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ouvrir la fiche
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(p)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.success("Rapport de ventes généré")}>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Stats de ventes
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setToDelete(p)}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer définitivement
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tight">
                      Cycle {p.cycle} · {p.matiere}
                    </div>
                    <Link href={`/packs/${p.id}`} className="hover:text-primary transition-colors">
                      <h3 className="text-foreground mt-1 text-lg font-bold leading-tight truncate">
                        {p.titre}
                      </h3>
                    </Link>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                   <div className="text-foreground text-2xl font-bold tabular-nums">
                    {fcfa(p.prix)}
                   </div>
                   <Badge variant="outline" className={statutColors[p.statut]}>
                      {p.statut}
                   </Badge>
                </div>

                {/* Content Analysis */}
                <div className="mt-6 flex items-center justify-between gap-1">
                  {[
                    { i: BookOpen, n: p.contenus.cours, c: "primary" },
                    { i: FileText, n: p.contenus.resumes, c: "primary" },
                    { i: Headphones, n: p.contenus.audios, c: "primary" },
                    { i: Video, n: p.contenus.videos, c: "primary" },
                    { i: ListChecks, n: p.contenus.qcm, c: "primary" },
                    { i: Layers, n: p.contenus.flashcards, c: "primary" },
                  ].map((ct, idx) => (
                    <div 
                      key={idx} 
                      className="bg-muted/40 flex flex-1 flex-col items-center justify-center rounded-lg py-2 border border-border/20 transition-colors hover:bg-muted"
                    >
                      <ct.i className="text-muted-foreground h-3 w-3" />
                      <span className="text-foreground mt-1 text-[10px] font-bold tabular-nums">{ct.n}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-medium uppercase">Buyer Engagement</span>
                    <span className="text-foreground font-bold">{p.progression}%</span>
                  </div>
                  <Progress value={p.progression} className="mt-2 h-1.5" />
                </div>
              </div>

              <div className="border-border flex items-center justify-between border-t bg-muted/20 px-5 py-4">
                <div className="text-muted-foreground text-[10px] font-bold uppercase">
                  {p.acheteurs.toLocaleString("fr-FR")} inscrits
                </div>
                <Link 
                  href={`/packs/${p.id}`} 
                  className="text-primary hover:bg-primary/10 flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold transition-colors"
                >
                  Configurer
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="bg-card border-border rounded-xl border border-dashed p-16 text-center">
          <Layers className="text-muted-foreground mx-auto h-12 w-12" />
          <h3 className="text-foreground mt-4 text-base font-bold">Aucun pack correspondant</h3>
          <p className="text-muted-foreground mt-1 text-sm">Modifiez vos filtres ou créez une nouvelle unité pédagogique.</p>
          <Button size="sm" onClick={() => { setSearch(""); setFilterConcours("all"); setFilterStatut("all"); }} className="mt-6">
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* Create/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editing ? `Édition : ${editing.titre}` : "Nouveau pack pédagogique"}
            </DialogTitle>
            <DialogDescription>
              Une unité pédagogique débloque l'accès aux cours, médias et au chatbot IA contextuel.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-1 space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Titre du pack</Label>
              <Input
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
                placeholder="Ex : Droit Administratif"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Concours de référence</Label>
              <Select value={form.concours} onValueChange={(v) => setForm({ ...form, concours: v })}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {concours.map((c) => (
                    <SelectItem key={c.id} value={c.abbr}>{c.abbr} — {c.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Matière</Label>
              <Input
                value={form.matiere}
                onChange={(e) => setForm({ ...form, matiere: e.target.value })}
                placeholder="Droit, Économie..."
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Tarif unitaire (FCFA)</Label>
              <Input
                type="number"
                value={form.prix}
                onChange={(e) => setForm({ ...form, prix: Number(e.target.value) })}
                className="h-10"
              />
            </div>
            
            <div className="sm:col-span-2 space-y-4 pt-4 border-t border-border">
              <Label className="text-xs font-bold uppercase text-muted-foreground block">Allocation de contenu initiale</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { k: "cours", l: "Cours", I: BookOpen },
                  { k: "resumes", l: "Résumés", I: FileText },
                  { k: "audios", l: "Audios", I: Headphones },
                  { k: "videos", l: "Vidéos", I: Video },
                  { k: "qcm", l: "QCM", I: ListChecks },
                  { k: "flashcards", l: "Cards", I: Layers },
                ].map(({ k, l, I }) => (
                  <div key={k} className="bg-muted/30 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50">
                    <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-bold uppercase">
                      <I className="h-3 w-3" />
                      {l}
                    </div>
                    <Input
                      type="number"
                      value={(form as any)[k]}
                      onChange={(e) => setForm({ ...form, [k]: Number(e.target.value) } as any)}
                      className="mt-1 h-8 border-0 bg-transparent px-0 text-base font-bold shadow-none focus-visible:ring-0"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="font-bold">
              Annuler
            </Button>
            <Button
              onClick={submit}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
            >
              {editing ? "Enregistrer les modifications" : "Valider la création"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive font-bold text-xl">Action Irréversible</AlertDialogTitle>
            <AlertDialogDescription className="text-balance">
              Voulez-vous supprimer le pack **{toDelete?.titre}** ?<br />
              Les {toDelete?.acheteurs} utilisateurs l'ayant acheté perdront immédiatement l'accès à l'intégralité du contenu pédagogique.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
            >
              Exécuter la suppression
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
