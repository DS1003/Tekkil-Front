import { MonitorSmartphone, Play, Lock, FileText, BookOpen, Headphones, Video, ListChecks, Layers, MessageSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fcfa, type Pack } from "@/lib/mock-data"

export function ApercuPackDialog({
  open,
  onOpenChange,
  pack,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  pack: Pack | null
}) {
  if (!pack) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl overflow-hidden border-border bg-background p-0">
        <DialogTitle className="sr-only">Aperçu Apprenant — {pack.titre}</DialogTitle>
        <DialogDescription className="sr-only">
          Prévisualisation du pack tel que le verra l&apos;étudiant avant et après l&apos;achat.
        </DialogDescription>
        {/* Top bar simulating student app */}
        <div className="flex h-12 items-center gap-3 border-b border-border bg-muted/30 px-5">
          <MonitorSmartphone className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-primary">Aperçu Apprenant</span>
          <span className="text-xs text-muted-foreground">— Ce que verra l&apos;étudiant avant et après l&apos;achat</span>
        </div>

        <div className="flex max-h-[70vh] flex-col overflow-auto md:flex-row">
          {/* Sidebar — table of contents */}
          <div className="w-full shrink-0 border-b border-border bg-muted/20 p-5 md:w-64 md:border-b-0 md:border-r">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Sommaire du pack
            </div>
            <div className="flex flex-col gap-1">
              {[
                { label: "Introduction et fondements", free: true },
                { label: "Sources du droit", free: true },
                { label: "Organisation administrative", free: false },
                { label: "Actes administratifs", free: false },
                { label: "Contrats administratifs", free: false },
                { label: "QCM — Chapitre 1", free: true },
                { label: "QCM — Chapitres 2-5", free: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={
                    "flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors " +
                    (item.free
                      ? "bg-primary/5 font-medium text-foreground"
                      : "text-muted-foreground")
                  }
                >
                  {item.free ? (
                    <Play className="h-3 w-3 shrink-0 text-primary" />
                  ) : (
                    <Lock className="h-3 w-3 shrink-0" />
                  )}
                  <span className="truncate">{item.label}</span>
                  {item.free && (
                    <Badge
                      variant="outline"
                      className="ml-auto h-4 shrink-0 border-success/30 bg-success/5 px-1 text-[9px] text-success"
                    >
                      Gratuit
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main preview area */}
          <div className="flex-1 p-6">
            {/* Pack header */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
                {pack.concours}
              </Badge>
              <span className="text-muted-foreground">Cycle {pack.cycle}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{pack.matiere}</span>
            </div>

            <h2 className="mt-3 text-2xl font-bold text-foreground">{pack.titre}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Pack complet incluant cours, résumés, audios, vidéos, QCM et flashcards.
              L&apos;achat débloque l&apos;intégralité du contenu et le chatbot contextuel.
            </p>

            {/* Content overview tabs */}
            <Tabs defaultValue="cours" className="mt-6">
              <TabsList className="h-auto w-full justify-start gap-0.5 bg-muted/30 p-0.5">
                {[
                  { v: "cours", I: BookOpen, n: pack.contenus.cours },
                  { v: "resumes", I: FileText, n: pack.contenus.resumes },
                  { v: "audio", I: Headphones, n: pack.contenus.audios },
                  { v: "video", I: Video, n: pack.contenus.videos },
                  { v: "qcm", I: ListChecks, n: pack.contenus.qcm },
                  { v: "flash", I: Layers, n: pack.contenus.flashcards },
                  { v: "chatbot", I: MessageSquare, n: null },
                ].map((t) => (
                  <TabsTrigger
                    key={t.v}
                    value={t.v}
                    className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <t.I className="h-3 w-3" />
                    {t.n !== null && (
                      <span className="tabular-nums">{t.n}</span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="cours" className="mt-4">
                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                  <Play className="h-12 w-12 text-muted-foreground opacity-40" />
                  <Badge className="absolute left-3 top-3 border-border bg-background/80 text-foreground backdrop-blur">
                    Extrait gratuit
                  </Badge>
                </div>
              </TabsContent>

              {["resumes", "audio", "video", "qcm", "flash", "chatbot"].map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-4">
                  <div className="flex aspect-[3/1] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
                    <Lock className="h-8 w-8 text-muted-foreground opacity-40" />
                    <p className="mt-3 text-sm font-medium text-muted-foreground">
                      Contenu verrouillé
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Achetez le pack pour accéder à cette section.
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Purchase CTA */}
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
              <Lock className="mx-auto h-7 w-7 text-primary" />
              <h3 className="mt-3 text-lg font-semibold text-foreground">
                Débloquer le pack complet
              </h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                Accédez à l&apos;intégralité des {pack.contenus.cours} cours,{" "}
                {pack.contenus.qcm} QCM, {pack.contenus.flashcards} flashcards et au chatbot IA contextuel.
              </p>
              <Button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                Acheter pour {fcfa(pack.prix)}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
