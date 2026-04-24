"use client"

import { use, useMemo, useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Headphones,
  Video,
  ListChecks,
  Layers,
  MessageSquare,
  Plus,
  MoreHorizontal,
  Eye,
  Lock,
  Clock,
  TrendingUp,
  Trash2,
  Pencil,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Switch } from "@/components/ui/switch"
import { packs, fcfa } from "@/lib/mock-data"
import { ApercuPackDialog } from "@/components/admin/apercu-pack-dialog"

type ContentType = "cours" | "resumes" | "audio" | "video" | "qcm" | "flash"

type ContentItem = {
  id: string
  titre: string
  duree?: string
  chapitres?: number
  taille?: string
  gratuit: boolean
  vues: number
  questions?: number
  taux?: number
  cartes?: number
}

const initialContent: Record<ContentType, ContentItem[]> = {
  cours: [
    { id: "c1", titre: "Introduction et fondements", duree: "45 min", chapitres: 4, gratuit: true, vues: 1240 },
    { id: "c2", titre: "Sources du droit administratif", duree: "1h 10", chapitres: 6, gratuit: true, vues: 980 },
    { id: "c3", titre: "Organisation administrative", duree: "1h 25", chapitres: 5, gratuit: true, vues: 842 },
    { id: "c4", titre: "Actes administratifs unilatéraux", duree: "1h 40", chapitres: 7, gratuit: false, vues: 612 },
    { id: "c5", titre: "Contrats administratifs", duree: "1h 15", chapitres: 5, gratuit: false, vues: 498 },
    { id: "c6", titre: "Police administrative", duree: "55 min", chapitres: 4, gratuit: false, vues: 421 },
  ],
  resumes: [
    { id: "r1", titre: "Fiche mémo — Sources du droit", taille: "8 pages", gratuit: true, vues: 720 },
    { id: "r2", titre: "Synthèse — Organisation territoriale", taille: "12 pages", gratuit: false, vues: 512 },
    { id: "r3", titre: "Carte mentale — Actes admin.", taille: "1 page A3", gratuit: false, vues: 389 },
  ],
  audio: [
    { id: "a1", titre: "Podcast — Intro au droit admin.", duree: "18 min", gratuit: true, vues: 640 },
    { id: "a2", titre: "Leçon audio — Sources formelles", duree: "24 min", gratuit: false, vues: 412 },
  ],
  video: [
    { id: "v1", titre: "Vidéo — Jurisprudence clé", duree: "32 min", gratuit: true, vues: 1120 },
    { id: "v2", titre: "Vidéo — Cas pratiques", duree: "45 min", gratuit: false, vues: 720 },
  ],
  qcm: [
    { id: "q1", titre: "QCM Chapitre 1 — Fondements", questions: 20, taux: 78, vues: 1420, gratuit: true },
    { id: "q2", titre: "QCM Sources du droit", questions: 25, taux: 65, vues: 1180, gratuit: false },
    { id: "q3", titre: "QCM Organisation", questions: 30, taux: 71, vues: 920, gratuit: false },
    { id: "q4", titre: "QCM Actes administratifs", questions: 35, taux: 58, vues: 760, gratuit: false },
  ],
  flash: [
    { id: "f1", titre: "Vocabulaire juridique", cartes: 80, gratuit: true, vues: 540 },
    { id: "f2", titre: "Articles à mémoriser", cartes: 120, gratuit: false, vues: 412 },
  ],
}

const typeMeta: Record<
  ContentType,
  { label: string; I: React.ElementType; singular: string }
> = {
  cours: { label: "Cours", I: BookOpen, singular: "cours" },
  resumes: { label: "Résumés", I: FileText, singular: "résumé" },
  audio: { label: "Audio", I: Headphones, singular: "audio" },
  video: { label: "Vidéo", I: Video, singular: "vidéo" },
  qcm: { label: "QCM", I: ListChecks, singular: "QCM" },
  flash: { label: "Flashcards", I: Layers, singular: "jeu de flashcards" },
}

export default function PackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const pack = packs.find((p) => p.id === id)
  if (!pack) notFound()

  const [content, setContent] =
    useState<Record<ContentType, ContentItem[]>>(initialContent)

  const [addType, setAddType] = useState<ContentType | null>(null)
  const [addForm, setAddForm] = useState({
    titre: "",
    duree: "",
    chapitres: 1,
    taille: "",
    questions: 10,
    cartes: 20,
    gratuit: false,
    description: "",
  })

  const [toDelete, setToDelete] = useState<{ type: ContentType; item: ContentItem } | null>(null)
  const [editPackOpen, setEditPackOpen] = useState(false)
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false)
  const [chatConfigOpen, setChatConfigOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  function openAdd(type: ContentType) {
    setAddType(type)
    setAddForm({
      titre: "",
      duree: "",
      chapitres: 1,
      taille: "",
      questions: 10,
      cartes: 20,
      gratuit: false,
      description: "",
    })
  }

  function submitAdd() {
    if (!addType) return
    if (!addForm.titre.trim()) {
      toast.error("Le titre est requis")
      return
    }
    const item: ContentItem = {
      id: Math.random().toString(36).slice(2, 10),
      titre: addForm.titre,
      gratuit: addForm.gratuit,
      vues: 0,
      ...(addType === "cours" && {
        duree: addForm.duree || "0 min",
        chapitres: addForm.chapitres,
      }),
      ...(addType === "resumes" && { taille: addForm.taille || "1 page" }),
      ...(addType === "audio" && { duree: addForm.duree || "0 min" }),
      ...(addType === "video" && { duree: addForm.duree || "0 min" }),
      ...(addType === "qcm" && { questions: addForm.questions, taux: 0 }),
      ...(addType === "flash" && { cartes: addForm.cartes }),
    }
    setContent((prev) => ({ ...prev, [addType]: [item, ...prev[addType]] }))
    toast.success(`${typeMeta[addType].singular} ajouté(e)`)
    setAddType(null)
  }

  function removeItem() {
    if (!toDelete) return
    setContent((prev) => ({
      ...prev,
      [toDelete.type]: prev[toDelete.type].filter((i) => i.id !== toDelete.item.id),
    }))
    toast.success("Contenu supprimé")
    setToDelete(null)
  }

  function toggleFree(type: ContentType, item: ContentItem) {
    setContent((prev) => ({
      ...prev,
      [type]: prev[type].map((i) =>
        i.id === item.id ? { ...i, gratuit: !i.gratuit } : i,
      ),
    }))
    toast.success(
      !item.gratuit ? "Marqué comme aperçu gratuit" : "Retiré de l'aperçu gratuit",
    )
  }

  const totals = useMemo(
    () => ({
      cours: content.cours.length,
      resumes: content.resumes.length,
      audio: content.audio.length,
      video: content.video.length,
      qcm: content.qcm.length,
      flash: content.flash.length,
    }),
    [content],
  )

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
      {/* Back */}
      <Link
        href="/packs"
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux packs
      </Link>

      {/* Hero */}
      <div className="bg-card border-border relative overflow-hidden rounded-xl border p-6 md:p-8">
        <div className="bg-primary/8 pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 font-semibold">
                {pack.concours}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">Cycle {pack.cycle}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{pack.matiere}</span>
              <Badge
                variant="outline"
                className="border-success/30 text-success bg-success/5 ml-1"
              >
                {pack.statut}
              </Badge>
            </div>
            <h1 className="text-foreground mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              {pack.titre}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
              Pack pédagogique complet incluant cours, résumés, audios, vidéos, QCM et flashcards.
              L&apos;achat débloque l&apos;ensemble du contenu et l&apos;accès au chatbot
              contextuel jusqu&apos;à la date de clôture du concours.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm">
              <div className="flex items-center gap-2">
                <Eye className="text-primary h-4 w-4" />
                <span className="text-muted-foreground">Acheteurs :</span>
                <span className="text-foreground font-semibold tabular-nums">
                  {pack.acheteurs.toLocaleString("fr-FR")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="text-success h-4 w-4" />
                <span className="text-muted-foreground">Progression moy :</span>
                <span className="text-foreground font-semibold tabular-nums">
                  {pack.progression}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-info h-4 w-4" />
                <span className="text-muted-foreground">MAJ :</span>
                <span className="text-foreground font-semibold">{pack.miseAJour}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="bg-background/80 border-border rounded-lg border px-5 py-3 text-right backdrop-blur">
              <div className="text-muted-foreground text-xs uppercase tracking-wider">
                Prix du pack
              </div>
              <div className="text-foreground mt-1 text-3xl font-bold tabular-nums">
                {fcfa(pack.prix)}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewOpen(true)}
              >
                <Eye className="mr-1.5 h-4 w-4" />
                Aperçu
              </Button>
              <Button
                size="sm"
                onClick={() => setEditPackOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Pencil className="mr-1.5 h-4 w-4" />
                Modifier le pack
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="cours" className="w-full">
        <TabsList className="bg-card border-border h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg border p-1">
          {(
            [
              { v: "cours", count: totals.cours },
              { v: "resumes", count: totals.resumes },
              { v: "audio", count: totals.audio },
              { v: "video", count: totals.video },
              { v: "qcm", count: totals.qcm },
              { v: "flash", count: totals.flash },
              { v: "chatbot", count: null },
            ] as const
          ).map((t) => {
            const meta =
              t.v === "chatbot"
                ? { label: "Chatbot", I: MessageSquare }
                : typeMeta[t.v as ContentType]
            const I = meta.I
            return (
              <TabsTrigger
                key={t.v}
                value={t.v}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <I className="h-3.5 w-3.5" />
                <span>{meta.label}</span>
                {t.count !== null && (
                  <span className="bg-muted-foreground/20 rounded px-1.5 text-[10px] font-medium tabular-nums">
                    {t.count}
                  </span>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {(["cours", "resumes", "audio", "video", "qcm", "flash"] as ContentType[]).map(
          (tab) => (
            <TabsContent key={tab} value={tab} className="mt-5">
              <ContentList
                type={tab}
                items={content[tab]}
                onAdd={() => openAdd(tab)}
                onDelete={(item) => setToDelete({ type: tab, item })}
                onToggleFree={(item) => toggleFree(tab, item)}
              />
            </TabsContent>
          ),
        )}

        {/* CHATBOT */}
        <TabsContent value="chatbot" className="mt-5">
          <div className="bg-card border-border rounded-xl border p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-foreground text-lg font-semibold">
                  Chatbot contextuel — {pack.titre}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  Limité à 3 interactions avant l&apos;achat, puis accès illimité après
                  acquisition du pack. Le contexte est strictement limité au contenu
                  pédagogique de ce pack.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="bg-muted/30 border-border rounded-lg border p-3">
                    <div className="text-muted-foreground text-xs">Interactions / mois</div>
                    <div className="text-foreground mt-1 text-xl font-semibold tabular-nums">
                      18 420
                    </div>
                  </div>
                  <div className="bg-muted/30 border-border rounded-lg border p-3">
                    <div className="text-muted-foreground text-xs">Note moyenne</div>
                    <div className="text-foreground mt-1 text-xl font-semibold tabular-nums">
                      4,7 / 5
                    </div>
                  </div>
                  <div className="bg-muted/30 border-border rounded-lg border p-3">
                    <div className="text-muted-foreground text-xs">
                      Conversion essai → achat
                    </div>
                    <div className="text-success mt-1 text-xl font-semibold tabular-nums">
                      38%
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setChatHistoryOpen(true)}
                  >
                    Voir les conversations
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setChatConfigOpen(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Configurer le contexte
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add content dialog */}
      <Dialog open={!!addType} onOpenChange={(o) => !o && setAddType(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {addType && `Ajouter : ${typeMeta[addType].label}`}
            </DialogTitle>
            <DialogDescription>
              Le contenu sera ajouté au pack « {pack.titre} » et disponible après
              publication.
            </DialogDescription>
          </DialogHeader>

          {addType && (
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="c-titre">Titre</Label>
                <Input
                  id="c-titre"
                  value={addForm.titre}
                  onChange={(e) => setAddForm({ ...addForm, titre: e.target.value })}
                  placeholder={`Titre du ${typeMeta[addType].singular}`}
                  className="mt-1.5"
                />
              </div>

              {(addType === "cours" || addType === "audio" || addType === "video") && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="c-duree">Durée</Label>
                    <Input
                      id="c-duree"
                      value={addForm.duree}
                      onChange={(e) => setAddForm({ ...addForm, duree: e.target.value })}
                      placeholder="45 min"
                      className="mt-1.5"
                    />
                  </div>
                  {addType === "cours" && (
                    <div>
                      <Label htmlFor="c-chap">Chapitres</Label>
                      <Input
                        id="c-chap"
                        type="number"
                        min={1}
                        value={addForm.chapitres}
                        onChange={(e) =>
                          setAddForm({ ...addForm, chapitres: Number(e.target.value) })
                        }
                        className="mt-1.5"
                      />
                    </div>
                  )}
                </div>
              )}

              {addType === "resumes" && (
                <div>
                  <Label htmlFor="c-taille">Taille</Label>
                  <Input
                    id="c-taille"
                    value={addForm.taille}
                    onChange={(e) => setAddForm({ ...addForm, taille: e.target.value })}
                    placeholder="8 pages"
                    className="mt-1.5"
                  />
                </div>
              )}

              {addType === "qcm" && (
                <div>
                  <Label htmlFor="c-qst">Nombre de questions</Label>
                  <Input
                    id="c-qst"
                    type="number"
                    min={1}
                    value={addForm.questions}
                    onChange={(e) =>
                      setAddForm({ ...addForm, questions: Number(e.target.value) })
                    }
                    className="mt-1.5"
                  />
                </div>
              )}

              {addType === "flash" && (
                <div>
                  <Label htmlFor="c-cards">Nombre de cartes</Label>
                  <Input
                    id="c-cards"
                    type="number"
                    min={1}
                    value={addForm.cartes}
                    onChange={(e) =>
                      setAddForm({ ...addForm, cartes: Number(e.target.value) })
                    }
                    className="mt-1.5"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="c-file">Fichier joint</Label>
                  <Input id="c-file" type="file" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="c-link">Lien externe</Label>
                  <Input id="c-link" type="url" placeholder="https://..." className="mt-1.5" />
                </div>
              </div>

              <div>
                <Label htmlFor="c-desc">Description (optionnelle)</Label>
                <Textarea
                  id="c-desc"
                  rows={3}
                  value={addForm.description}
                  onChange={(e) =>
                    setAddForm({ ...addForm, description: e.target.value })
                  }
                  placeholder="Objectifs pédagogiques, prérequis..."
                  className="mt-1.5 resize-none"
                />
              </div>

              <div className="bg-muted/30 border-border flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label className="text-sm font-normal">Accessible en aperçu gratuit</Label>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    L&apos;apprenant peut consulter sans acheter le pack.
                  </p>
                </div>
                <Switch
                  checked={addForm.gratuit}
                  onCheckedChange={(v) => setAddForm({ ...addForm, gratuit: v })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddType(null)}>
              Annuler
            </Button>
            <Button
              onClick={submitAdd}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit pack (quick) */}
      <Dialog open={editPackOpen} onOpenChange={setEditPackOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier « {pack.titre} »</DialogTitle>
            <DialogDescription>
              Ajustez rapidement les infos générales. Pour une édition complète, utilisez la
              page Packs.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <Label>Statut</Label>
              <Select
                defaultValue={pack.statut}
                onValueChange={(v) =>
                  toast.success(`Statut mis à jour : ${v}`)
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Publié">Publié</SelectItem>
                  <SelectItem value="Brouillon">Brouillon</SelectItem>
                  <SelectItem value="Archivé">Archivé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="p-prix">Prix (FCFA)</Label>
              <Input
                id="p-prix"
                type="number"
                defaultValue={pack.prix}
                className="mt-1.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPackOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => {
                toast.success("Pack mis à jour")
                setEditPackOpen(false)
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete content */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce contenu ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {toDelete?.item.titre} » sera retiré du pack. Les apprenants qui l&apos;ont
              déjà consulté conservent leur progression.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={removeItem}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Chat History Dialog */}
      <Dialog open={chatHistoryOpen} onOpenChange={setChatHistoryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Historique des conversations</DialogTitle>
            <DialogDescription>
              Conversations récentes des apprenants avec le chatbot sur ce pack.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/30 border-border rounded-lg border p-12 text-center">
            <MessageSquare className="text-muted-foreground mx-auto h-12 w-12 opacity-50" />
            <h4 className="mt-4 font-medium">Historique bientôt disponible</h4>
            <p className="text-muted-foreground mt-1 text-sm">Les logs des conversations seront affichés ici pour améliorer la pertinence du bot.</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setChatHistoryOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Config Dialog */}
      <Dialog open={chatConfigOpen} onOpenChange={setChatConfigOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurer le chatbot</DialogTitle>
            <DialogDescription>
              Ajustez le comportement et le contexte du chatbot pour ce pack.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="bot-prompt">Prompt système (instructions spécifiques)</Label>
              <Textarea id="bot-prompt" rows={4} placeholder="Ex: Tu es un expert en Droit Administratif..." className="mt-1.5 resize-none" defaultValue={"Tu es un tuteur spécialisé dans le contenu de ce pack. Réponds uniquement aux questions liées à cette matière. Si l'apprenant dévie, redirige-le vers le cours."} />
            </div>
            <div className="bg-muted/30 border-border flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm font-normal">Mode strict (Contexte uniquement)</Label>
                <p className="text-muted-foreground mt-0.5 text-xs">Le bot refusera de répondre hors de la matière fournie.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChatConfigOpen(false)}>Annuler</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { toast.success("Configuration sauvegardée"); setChatConfigOpen(false); }}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pack preview dialog */}
      <ApercuPackDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        pack={pack}
      />
    </div>
  )
}

function ContentList({
  type,
  items,
  onAdd,
  onDelete,
  onToggleFree,
}: {
  type: ContentType
  items: ContentItem[]
  onAdd: () => void
  onDelete: (item: ContentItem) => void
  onToggleFree: (item: ContentItem) => void
}) {
  const meta = typeMeta[type]
  const I = meta.I

  return (
    <div className="bg-card border-border overflow-hidden rounded-xl border">
      <div className="border-border flex items-center justify-between border-b px-5 py-4">
        <div>
          <h3 className="text-foreground text-base font-semibold">{meta.label}</h3>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {items.length} élément{items.length > 1 ? "s" : ""} — les éléments marqués
            « aperçu » sont accessibles gratuitement.
          </p>
        </div>
        <Button
          size="sm"
          onClick={onAdd}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Ajouter
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="p-10 text-center">
          <div className="bg-primary/10 text-primary mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
            <I className="h-7 w-7" />
          </div>
          <h3 className="text-foreground mt-4 text-base font-semibold">
            Aucun {meta.singular} pour l&apos;instant
          </h3>
          <p className="text-muted-foreground mx-auto mt-1 max-w-md text-sm">
            Ajoutez votre premier contenu pour enrichir l&apos;expérience
            d&apos;apprentissage.
          </p>
          <Button
            size="sm"
            onClick={onAdd}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-5"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Ajouter du contenu
          </Button>
        </div>
      ) : (
        <div className="divide-border divide-y">
          <AnimatePresence initial={false}>
            {items.map((c, i) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.22 }}
                className="hover:bg-accent/30 flex items-center gap-4 px-5 py-3.5 transition-colors"
              >
                <div className="bg-muted text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xs font-semibold tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-foreground flex items-center gap-2 text-sm font-medium">
                    {c.titre}
                    {c.gratuit ? (
                      <Badge
                        variant="outline"
                        className="border-success/30 text-success bg-success/5 h-5 text-[10px]"
                      >
                        Aperçu
                      </Badge>
                    ) : (
                      <Lock className="text-muted-foreground h-3 w-3" />
                    )}
                  </div>
                  <div className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                    {c.chapitres && <span>{c.chapitres} chapitres</span>}
                    {c.duree && <span>{c.duree}</span>}
                    {c.taille && <span>{c.taille}</span>}
                    {c.questions && <span>{c.questions} questions</span>}
                    {c.cartes && <span>{c.cartes} cartes</span>}
                    {typeof c.taux === "number" && (
                      <span>· {c.taux}% de réussite</span>
                    )}
                    <span>·</span>
                    <span>{c.vues.toLocaleString("fr-FR")} vues</span>
                  </div>
                  {type === "qcm" && typeof c.taux === "number" && (
                    <Progress value={c.taux} className="mt-2 h-1" />
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onToggleFree(c)}>
                      <Eye className="mr-2 h-3.5 w-3.5" />
                      {c.gratuit ? "Retirer de l'aperçu" : "Marquer en aperçu"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(c)}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
