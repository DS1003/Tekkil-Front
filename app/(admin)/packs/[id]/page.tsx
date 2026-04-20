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
  Zap,
  ShieldCheck,
  Download,
  Settings2,
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

  const [chatbotSettings, setChatbotSettings] = useState({
    tone: "Académique",
    contextDepth: "Maximum",
    allowFreeSample: true,
  })

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
    setContent((prev) => ({ ...prev, [type]: prev[type].map((i) => i.id === item.id ? { ...i, gratuit: !i.gratuit } : i) }))
    toast.success(!item.gratuit ? "Marqué comme aperçu gratuit" : "Retiré de l'aperçu gratuit")
  }

  const totals = useMemo(() => ({
    cours: content.cours.length,
    resumes: content.resumes.length,
    audio: content.audio.length,
    video: content.video.length,
    qcm: content.qcm.length,
    flash: content.flash.length,
  }), [content])

  const globalVues = useMemo(() => {
    return Object.values(content).flat().reduce((a, b) => a + b.vues, 0)
  }, [content])

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 pb-20">
      {/* Back & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Link href="/packs" className="bg-background border-border hover:bg-muted flex h-9 w-9 items-center justify-center rounded-lg border transition-colors shadow-sm">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
          <span>Catalogue</span>
          <span>/</span>
          <span>Packs</span>
          <span>/</span>
          <span className="text-foreground">{pack.titre}</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-8 shadow-sm">
        <div className="bg-primary/5 absolute right-0 top-0 h-64 w-64 rounded-full blur-[100px]" />
        
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-bold uppercase tracking-wider text-[10px]">
                {pack.concours} · Cycle {pack.cycle}
              </Badge>
              <Badge variant="outline" className="border-success/30 text-success bg-success/5 font-bold uppercase text-[10px]">
                Statut: {pack.statut}
              </Badge>
            </div>
            
            <h1 className="text-foreground text-4xl font-extrabold tracking-tight">
              {pack.titre}
            </h1>
            
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
              Gestion centralisée de l&apos;unité pédagogique <strong>{pack.matiere}</strong>. 
              Paramétrez les accès gratuits pour maximiser la conversion et surveillez l&apos;engagement des {pack.acheteurs.toLocaleString()} apprenants actifs.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">Vues totales</span>
                <span className="text-foreground text-lg font-bold tabular-nums">{globalVues.toLocaleString()}</span>
              </div>
              <div className="bg-border h-8 w-px" />
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">Engagement Apprenant</span>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-foreground text-lg font-bold tabular-nums">{pack.progression}%</span>
                  <div className="h-1.5 w-16 bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-success rounded-full" style={{ width: `${pack.progression}%` }} />
                  </div>
                </div>
              </div>
              <div className="bg-border h-8 w-px" />
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-tighter">Date de Mise à jour</span>
                <span className="text-foreground text-lg font-bold">{pack.miseAJour}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
             <div className="bg-muted/30 border-border flex flex-col items-end rounded-2xl border p-6 backdrop-blur">
                <span className="text-muted-foreground text-xs uppercase font-extrabold tracking-widest">Valeur Marchande</span>
                <span className="text-foreground text-4xl font-black tabular-nums">{fcfa(pack.prix)}</span>
                <div className="mt-3 flex items-center gap-2">
                   <Button variant="outline" size="sm" onClick={() => toast.info("Exportation rapport PDF")}>
                      <Download className="mr-1 h-3.5 w-3.5" />
                      Rapport
                   </Button>
                   <Button size="sm" className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" onClick={() => setEditPackOpen(true)}>
                      <Settings2 className="mr-1 h-3.5 w-3.5" />
                      Paramètres
                   </Button>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Tabs UI */}
      <Tabs defaultValue="cours" className="w-full">
        <div className="bg-card border-border sticky top-20 z-20 flex items-center justify-between border-b pb-1 pt-4 backdrop-blur-xl">
           <TabsList className="bg-transparent h-auto gap-6 p-0">
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
              const meta = t.v === "chatbot" ? { label: "Chatbot IA", I: MessageSquare } : typeMeta[t.v as ContentType]
              return (
                <TabsTrigger
                  key={t.v}
                  value={t.v}
                  className="data-[state=active]:text-primary border-b-2 border-transparent px-0 pb-3 text-sm font-bold transition-all data-[state=active]:border-primary rounded-none shadow-none"
                >
                  <meta.I className="mr-2 h-4 w-4" />
                  {meta.label}
                  {t.count !== null && (
                    <span className="ml-2 bg-muted-foreground/10 text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-bold">
                      {t.count}
                    </span>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {(["cours", "resumes", "audio", "video", "qcm", "flash"] as ContentType[]).map(
          (tab) => (
            <TabsContent key={tab} value={tab} className="mt-8">
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

        {/* CHATBOT SPECIALIZED CONFIG */}
        <TabsContent value="chatbot" className="mt-8 space-y-6">
           <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="bg-card border-border lg:col-span-2 rounded-2xl border p-8 shadow-sm">
                 <div className="flex items-start gap-5">
                    <div className="bg-primary/10 text-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-inner">
                       <Zap className="h-8 w-8" />
                    </div>
                    <div>
                       <h3 className="text-foreground text-xl font-bold">Base de connaissances IA</h3>
                       <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                          Le chatbot est automatiquement entraîné sur les {Object.values(totals).reduce((a, b) => a + (b || 0), 0)} fichiers indexés dans ce pack. 
                          Il répond de manière contextuelle uniquement pour aider l&apos;apprenant dans sa préparation au concours.
                       </p>
                    </div>
                 </div>

                 <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-4">
                       <div className="bg-muted/30 border-border rounded-xl border p-5">
                          <Label className="text-xs font-bold uppercase tracking-widest">Tonalité de réponse</Label>
                          <Select value={chatbotSettings.tone} onValueChange={(v) => setChatbotSettings({...chatbotSettings, tone: v})}>
                             <SelectTrigger className="mt-3 bg-background font-medium">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="Académique">Professeur Académique</SelectItem>
                                <SelectItem value="Coaching">Coach Motivationnel</SelectItem>
                                <SelectItem value="Direct">Direct & Synthétique</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                       <div className="bg-muted/30 border-border rounded-xl border p-5">
                          <Label className="text-xs font-bold uppercase tracking-widest">Niveau de Contexte</Label>
                          <Select value={chatbotSettings.contextDepth} onValueChange={(v) => setChatbotSettings({...chatbotSettings, contextDepth: v})}>
                             <SelectTrigger className="mt-3 bg-background font-medium">
                                <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                                <SelectItem value="Maximum">Contenu du pack uniquement</SelectItem>
                                <SelectItem value="Hybrid">Pack + Culture Générale</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                    </div>
                    <div className="bg-primary/5 border-primary/20 rounded-xl border p-6 flex flex-col justify-between">
                       <div>
                          <Label className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                             <ShieldCheck className="h-3 w-3" />
                             Sécurité IA
                          </Label>
                          <p className="text-foreground mt-3 text-sm font-medium">
                             L&apos;IA est configurée pour refuser d&apos;extraire le texte intégral des cours (protection contre le dump de contenu).
                          </p>
                       </div>
                       <Button size="sm" className="bg-primary mt-4 w-full font-bold">Tester le chatbot</Button>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-card border-border rounded-2xl border p-6 shadow-sm">
                    <h4 className="text-foreground font-bold">Performances IA</h4>
                    <div className="mt-5 space-y-4">
                       <div>
                          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
                             <span>Qualité des réponses</span>
                             <span className="text-foreground">4.8/5</span>
                          </div>
                          <Progress value={96} className="mt-2 h-1.5" />
                       </div>
                       <div>
                          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase">
                             <span>Temps de réponse</span>
                             <span className="text-foreground">1.2s</span>
                          </div>
                          <Progress value={85} className="mt-2 h-1.5" />
                       </div>
                    </div>
                 </div>
                 <div className="bg-warning/5 border-warning/20 rounded-2xl border p-6">
                    <div className="flex items-center gap-3">
                       <Switch checked={chatbotSettings.allowFreeSample} onCheckedChange={(v) => setChatbotSettings({...chatbotSettings, allowFreeSample: v})} />
                       <span className="text-sm font-bold">Essai Gratuit Actif</span>
                    </div>
                    <p className="text-muted-foreground mt-2 text-[11px] leading-relaxed">
                       Autorise 3 messages gratuits aux non-acheteurs pour tester le pack. Forte conversion constatée.
                    </p>
                 </div>
              </div>
           </div>
        </TabsContent>
      </Tabs>

      {/* MODALS */}
      <Dialog open={!!addType} onOpenChange={(o) => !o && setAddType(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {addType && `Contribution : ${typeMeta[addType].label}`}
            </DialogTitle>
            <DialogDescription>
              Ajout de nouveau matériel pédagogique à l&apos;unité {pack.titre}.
            </DialogDescription>
          </DialogHeader>

          {addType && (
            <div className="flex flex-col gap-5 py-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Titre de la ressource</Label>
                <Input
                  value={addForm.titre}
                  onChange={(e) => setAddForm({ ...addForm, titre: e.target.value })}
                  placeholder={`Nom du/de la ${typeMeta[addType].singular}`}
                />
              </div>

              {(addType === "cours" || addType === "audio" || addType === "video") && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Volume / Durée</Label>
                    <Input
                      value={addForm.duree}
                      onChange={(e) => setAddForm({ ...addForm, duree: e.target.value })}
                      placeholder="Ex: 45 min"
                    />
                  </div>
                  {addType === "cours" && (
                    <div className="space-y-2">
                       <Label className="text-xs font-bold uppercase text-muted-foreground">Chapitres</Label>
                      <Input
                        type="number"
                        value={addForm.chapitres}
                        onChange={(e) => setAddForm({ ...addForm, chapitres: Number(e.target.value) })}
                      />
                    </div>
                  )}
                </div>
              )}

              {addType === "qcm" && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Questions (Auto-correction)</Label>
                  <Input
                    type="number"
                    value={addForm.questions}
                    onChange={(e) => setAddForm({ ...addForm, questions: Number(e.target.value) })}
                  />
                </div>
              )}

              <div className="bg-muted/30 border-border flex items-center justify-between rounded-xl border p-4">
                <div>
                  <Label className="text-sm font-bold">Inclure dans la version démo</Label>
                  <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-tight">Gratuit pour tous</p>
                </div>
                <Switch
                  checked={addForm.gratuit}
                  onCheckedChange={(v) => setAddForm({ ...addForm, gratuit: v })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddType(null)} className="font-bold">Annuler</Button>
            <Button onClick={submitAdd} className="bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20">
               Valider l&apos;ajout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editPackOpen} onOpenChange={setEditPackOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Réglages du Pack</DialogTitle>
            <DialogDescription>Structure tarifaire et visibilité globale.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Disponibilité Marché</Label>
              <Select defaultValue={pack.statut}>
                <SelectTrigger className="h-11 font-bold"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Publié">✅ Actif (Vente en cours)</SelectItem>
                  <SelectItem value="Brouillon">📝 Préparation (Masqué)</SelectItem>
                  <SelectItem value="Archivé">📦 Archivé (Fin d&apos;accès)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-muted-foreground">Ajustement du Prix (FCFA)</Label>
              <Input type="number" defaultValue={pack.prix} className="h-11 text-lg font-bold" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPackOpen(false)} className="font-bold">Fermer</Button>
            <Button onClick={() => { toast.success("Paramètres sauvegardés"); setEditPackOpen(false); }} className="bg-primary text-primary-foreground font-bold">Appliquer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive font-bold text-xl">Retrait de Contenu</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer **{toDelete?.item.titre}** ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold">Conserver</AlertDialogCancel>
            <AlertDialogAction onClick={removeItem} className="bg-destructive text-destructive-foreground font-bold">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
    <div className="bg-card border-border overflow-hidden rounded-2xl border shadow-sm">
      <div className="border-border flex items-center justify-between border-b bg-muted/10 px-6 py-5">
        <div>
          <h3 className="text-foreground flex items-center gap-2 text-lg font-bold">
             {meta.label}
             <Badge variant="outline" className="bg-background ml-1 font-bold tabular-nums">{items.length}</Badge>
          </h3>
          <p className="text-muted-foreground mt-1 text-xs font-medium">Gestion du matériel de type {meta.singular}.</p>
        </div>
        <Button size="sm" onClick={onAdd} className="bg-primary text-primary-foreground font-bold">
          <Plus className="mr-1 h-3.5 w-3.5" />
          Ajouter
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="p-16 text-center">
          <div className="bg-primary/10 text-primary mx-auto flex h-20 w-20 items-center justify-center rounded-3xl shadow-inner mb-6">
            <I className="h-10 w-10" />
          </div>
          <h3 className="text-foreground text-xl font-bold">Aucune ressource indexée</h3>
          <p className="text-muted-foreground mx-auto mt-2 max-w-sm text-sm">Préparez vos fichiers pour enrichir l&apos;apprentissage.</p>
          <Button size="sm" onClick={onAdd} className="bg-primary text-primary-foreground mt-8 font-bold px-8">Charger du contenu</Button>
        </div>
      ) : (
        <div className="divide-border divide-y">
          <AnimatePresence initial={false}>
            {items.map((c, i) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="hover:bg-accent/30 flex items-center gap-4 px-6 py-4 transition-colors"
              >
                <div className="bg-muted text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black tabular-nums border border-border/50">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-foreground text-base font-bold truncate tracking-tight">{c.titre}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                       {c.gratuit ? (
                        <Badge variant="secondary" className="bg-success/10 text-success border-0 font-bold text-[9px] uppercase tracking-widest px-2">DÉMO</Badge>
                       ) : (
                        <Badge variant="outline" className="border-border text-muted-foreground font-bold text-[9px] uppercase tracking-widest px-2"><Lock className="mr-1 h-2 w-2" />PAYANT</Badge>
                       )}
                    </div>
                  </div>
                  <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] font-bold uppercase tracking-tight">
                    {c.chapitres && <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{c.chapitres} Chap.</span>}
                    {c.duree && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.duree}</span>}
                    {c.taille && <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{c.taille}</span>}
                    {c.questions && <span className="flex items-center gap-1"><ListChecks className="h-3 w-3" />{c.questions} Qust.</span>}
                    {c.cartes && <span className="flex items-center gap-1"><Layers className="h-3 w-3" />{c.cartes} Cartes</span>}
                    <span className="text-primary flex items-center gap-1"><Eye className="h-3 w-3" />{c.vues.toLocaleString()} Vues</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-9 w-9 items-center justify-center rounded-xl transition-all border border-transparent hover:border-border">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => onToggleFree(c)} className="font-semibold">
                      <Zap className="mr-2 h-4 w-4 text-warning" />
                      {c.gratuit ? "Masquer la démo" : "Activer l'aperçu gratuit"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(c)} className="text-destructive font-semibold focus:bg-destructive/10 focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer du pack
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
