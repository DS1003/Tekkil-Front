"use client"

import { motion } from "motion/react"
import {
  MessageSquare,
  Sparkles,
  Bot,
  ThumbsUp,
  Settings2,
  Zap,
  ShieldCheck,
} from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const conversations = [
  {
    user: "Aïssatou D.",
    pack: "Droit Administratif",
    messages: 14,
    rating: 5,
    snippet: "Pouvez-vous m'expliquer la différence entre actes administratifs unilatéraux et bilatéraux ?",
  },
  {
    user: "Mamadou S.",
    pack: "Économie Générale",
    messages: 8,
    rating: 4,
    snippet: "Comment calculer l'élasticité-prix de la demande ?",
  },
  {
    user: "Fatou N.",
    pack: "Culture Générale",
    messages: 22,
    rating: 5,
    snippet: "Quelles sont les principales institutions de l'Union Africaine ?",
  },
  {
    user: "Ibrahima F.",
    pack: "Législation Douanière",
    messages: 6,
    rating: 3,
    snippet: "Décrire les régimes douaniers économiques au Sénégal.",
  },
  {
    user: "Awa C.",
    pack: "Mathématiques Financières",
    messages: 11,
    rating: 5,
    snippet: "Calculer la valeur actuelle d'une annuité constante.",
  },
]

export default function ChatbotPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
      <PageHeader
        badge="Intelligence artificielle"
        title="Chatbot Tekkil"
        description="Assistant IA contextuel par pack. Limité à 3 interactions en aperçu, puis illimité après achat. Réponses strictement basées sur le contenu du pack."
        actions={
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Settings2 className="mr-1.5 h-4 w-4" />
            Configurer le modèle
          </Button>
        }
      />

      {/* Hero */}
      <div className="bg-card border-border relative overflow-hidden rounded-xl border p-6">
        <div className="bg-primary/8 absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl" />
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary h-5 w-5" />
              <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                Modèle actif
              </span>
            </div>
            <h2 className="text-foreground mt-2 text-2xl font-bold">
              Tekkil-IA v2.4 · Multilingue (FR/Wolof)
            </h2>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Le chatbot est entraîné exclusivement sur les contenus pédagogiques validés. Il
              refuse poliment toute question hors-contexte du pack acheté pour préserver la
              qualité pédagogique.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="border-success/30 text-success bg-success/5">
                <span className="bg-success mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full" />
                Opérationnel
              </Badge>
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                Réponses en moy. &lt; 1.2s
              </Badge>
              <Badge variant="outline" className="border-info/30 text-info bg-info/5">
                Anti-hallucination activé
              </Badge>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-3">
            {[
              { i: MessageSquare, l: "Conversations", v: "84 230", c: "var(--chart-1)" },
              { i: Bot, l: "Tokens utilisés", v: "12,4M", c: "var(--chart-2)" },
              { i: ThumbsUp, l: "Satisfaction", v: "4.7/5", c: "var(--chart-3)" },
              { i: Zap, l: "Conversion essai", v: "38%", c: "var(--chart-4)" },
            ].map((s) => {
              const I = s.i
              return (
                <div
                  key={s.l}
                  className="bg-background/40 border-border rounded-lg border p-4"
                >
                  <I className="h-4 w-4" style={{ color: s.c }} />
                  <div className="text-foreground mt-3 text-xl font-semibold tabular-nums">
                    {s.v}
                  </div>
                  <div className="text-muted-foreground text-xs">{s.l}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Conversations */}
        <div className="bg-card border-border lg:col-span-2 rounded-xl border">
          <div className="border-border flex items-center justify-between border-b px-5 py-4">
            <div>
              <h3 className="text-foreground text-base font-semibold">
                Conversations récentes
              </h3>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Échantillon anonymisé · Audit qualité
              </p>
            </div>
            <Button variant="outline" size="sm">
              Tout voir
            </Button>
          </div>
          <div className="divide-border divide-y">
            {conversations.map((c, i) => (
              <motion.div
                key={c.user}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="hover:bg-accent/30 flex items-start gap-4 px-5 py-4 transition-colors"
              >
                <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                  {c.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-medium">{c.user}</span>
                    <span className="text-muted-foreground text-xs">·</span>
                    <span className="text-primary text-xs font-medium">{c.pack}</span>
                  </div>
                  <p className="text-muted-foreground mt-1 line-clamp-1 text-sm italic">
                    &ldquo;{c.snippet}&rdquo;
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">{c.messages} messages</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <span
                          key={j}
                          className={
                            j < c.rating
                              ? "text-primary text-xs"
                              : "text-muted-foreground/30 text-xs"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-card border-border rounded-xl border p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary h-4 w-4" />
            <h3 className="text-foreground text-base font-semibold">Paramètres</h3>
          </div>

          <div className="mt-5 flex flex-col gap-5">
            {[
              { l: "Limiter à 3 interactions en aperçu", v: true },
              { l: "Réponses strictement contextuelles", v: true },
              { l: "Filigrane utilisateur dans réponses", v: true },
              { l: "Modération automatique du contenu", v: true },
              { l: "Historique conservé 90 jours", v: false },
              { l: "Rappel d'achat après 3 interactions", v: true },
            ].map((s) => (
              <div key={s.l} className="flex items-center justify-between gap-4">
                <Label className="text-foreground text-sm font-normal leading-snug">
                  {s.l}
                </Label>
                <Switch defaultChecked={s.v} />
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border-primary/20 mt-6 rounded-lg border p-3">
            <div className="text-primary text-xs font-medium">
              Token budget par utilisateur
            </div>
            <div className="text-foreground mt-1 text-2xl font-semibold tabular-nums">
              50 000
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              Renouvelé mensuellement après achat du pack
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
