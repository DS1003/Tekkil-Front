"use client"

import { motion } from "motion/react"
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Smartphone,
  Eye,
  Copy,
  Camera,
  AlertTriangle,
  Activity,
} from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { securityEvents } from "@/lib/mock-data"

const severiteColors: Record<string, string> = {
  Haute: "border-destructive/30 text-destructive bg-destructive/5",
  Moyenne: "border-primary/30 text-primary bg-primary/5",
  Faible: "border-info/30 text-info bg-info/5",
}

export default function SecuritePage() {
  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
      <PageHeader
        badge="Protection du contenu"
        title="Sécurité & Anti-fraude"
        description="Mécanismes de protection : connexion unique, anti-capture, désactivation copier-coller, filigrane dynamique et système de pénalités progressives."
      />

      {/* Status */}
      <div className="bg-card border-border relative overflow-hidden rounded-xl border p-6">
        <div className="bg-success/8 absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-success/15 text-success flex h-14 w-14 items-center justify-center rounded-2xl">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-foreground text-2xl font-bold">
                Tous les systèmes sont actifs
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Niveau de protection : Maximum · Dernière analyse : il y a 5 minutes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-success/30 text-success bg-success/5">
              <span className="bg-success mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full" />
              Opérationnel
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { i: AlertTriangle, l: "Événements (7j)", v: "127", c: "var(--chart-1)" },
          { i: Lock, l: "Comptes bloqués", v: "54", c: "var(--chart-5)" },
          { i: Camera, l: "Captures bloquées", v: "892", c: "var(--chart-2)" },
          { i: Activity, l: "Sessions révoquées", v: "243", c: "var(--chart-3)" },
        ].map((s) => {
          const I = s.i
          return (
            <div
              key={s.l}
              className="bg-card border-border flex items-center gap-3 rounded-lg border p-4"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: s.c + "20", color: s.c }}
              >
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Settings */}
        <div className="bg-card border-border lg:col-span-3 rounded-xl border p-6">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-primary h-5 w-5" />
            <h3 className="text-foreground text-lg font-semibold">
              Mécanismes de protection
            </h3>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Activez ou désactivez les protections appliquées sur l&apos;application mobile et web.
          </p>

          <div className="mt-6 flex flex-col gap-5">
            {[
              {
                i: Smartphone,
                title: "Connexion unique par appareil",
                sub: "Toute nouvelle connexion déconnecte automatiquement la session précédente.",
                v: true,
              },
              {
                i: Camera,
                title: "Anti-capture d'écran",
                sub: "Drapeau FLAG_SECURE sur Android/iOS et watermark sur Web.",
                v: true,
              },
              {
                i: Copy,
                title: "Désactivation copier-coller",
                sub: "Empêche l'exfiltration de texte depuis l'application.",
                v: true,
              },
              {
                i: Eye,
                title: "Filigrane dynamique utilisateur",
                sub: "Affiche l'identifiant utilisateur en transparence sur tous les contenus.",
                v: true,
              },
              {
                i: Lock,
                title: "Restriction d'export et téléchargement",
                sub: "Bloque toute tentative d'extraction du contenu pédagogique.",
                v: true,
              },
              {
                i: ShieldAlert,
                title: "Détection automatique de fraude",
                sub: "Analyse comportementale et blocage progressif des comptes suspects.",
                v: true,
              },
            ].map((s) => {
              const I = s.i
              return (
                <div
                  key={s.title}
                  className="border-border flex items-start gap-4 border-b pb-5 last:border-b-0 last:pb-0"
                >
                  <div className="bg-muted text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                    <I className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-foreground text-sm font-medium">
                      {s.title}
                    </Label>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      {s.sub}
                    </p>
                  </div>
                  <Switch defaultChecked={s.v} />
                </div>
              )
            })}

            <div className="bg-background/40 mt-2 rounded-lg p-4">
              <Label className="text-foreground text-sm font-medium">
                Seuil de pénalité avant blocage définitif
              </Label>
              <p className="text-muted-foreground mt-1 text-xs">
                Nombre d&apos;avertissements avant blocage automatique du compte.
              </p>
              <div className="mt-4 flex items-center gap-4">
                <Slider defaultValue={[3]} max={10} step={1} className="flex-1" />
                <div className="bg-primary text-primary-foreground flex h-9 min-w-12 items-center justify-center rounded-md text-sm font-semibold tabular-nums">
                  3
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent events */}
        <div className="bg-card border-border lg:col-span-2 rounded-xl border">
          <div className="border-border flex items-center justify-between border-b px-5 py-4">
            <div>
              <h3 className="text-foreground text-base font-semibold">
                Journal des événements
              </h3>
              <p className="text-muted-foreground mt-0.5 text-xs">
                4 derniers incidents détectés
              </p>
            </div>
            <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/5">
              3 critiques
            </Badge>
          </div>
          <div className="divide-border divide-y">
            {securityEvents.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="hover:bg-accent/30 px-5 py-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-foreground text-sm font-medium">
                    {e.evenement}
                  </div>
                  <Badge variant="outline" className={severiteColors[e.severite]}>
                    {e.severite}
                  </Badge>
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  {e.utilisateur} · {e.date}
                </div>
                <div className="text-primary mt-2 inline-flex items-center gap-1 text-xs font-medium">
                  <ShieldCheck className="h-3 w-3" />
                  {e.action}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
