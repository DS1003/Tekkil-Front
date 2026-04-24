"use client"

import {
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  FileText,
  Mail,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HelpPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
      <PageHeader
        badge="Support"
        title="Centre d'aide & Documentation"
        description="Trouvez des réponses à vos questions techniques ou contactez notre équipe de support."
      />

      {/* Search Section */}
      <div className="bg-primary/5 border-primary/10 relative overflow-hidden rounded-2xl border p-12 text-center">
        <div className="bg-primary/10 absolute -left-20 -top-20 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute -right-20 -bottom-20 h-64 w-64 rounded-full blur-3xl" />
        
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-foreground">Comment pouvons-nous vous aider ?</h2>
          <p className="mt-3 text-muted-foreground">
            Recherchez dans notre base de connaissances pour des solutions instantanées.
          </p>
          <div className="relative mt-8">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input 
              className="h-14 pl-12 pr-4 text-lg shadow-xl border-primary/20 bg-background focus-visible:ring-primary/20" 
              placeholder="Rechercher un article, un guide, un tutoriel..."
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:border-primary/40 transition-colors cursor-pointer group">
          <CardHeader>
            <Book className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Guides d'utilisation</CardTitle>
            <CardDescription>Apprenez à gérer les concours, les packs et les utilisateurs.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardContent>
        </Card>
        <Card className="hover:border-primary/40 transition-colors cursor-pointer group">
          <CardHeader>
            <FileText className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Documentation API</CardTitle>
            <CardDescription>Intégrez Tekkil à vos systèmes externes via nos webhooks.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardContent>
        </Card>
        <Card className="hover:border-primary/40 transition-colors cursor-pointer group">
          <CardHeader>
            <MessageCircle className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Support Direct</CardTitle>
            <CardDescription>Contactez un technicien pour une assistance personnalisée.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Questions Fréquentes
          </h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Comment valider un paiement en attente ?</AccordionTrigger>
              <AccordionContent>
                Rendez-vous dans l'onglet "Paiements", trouvez la transaction concernée, cliquez sur les trois points (actions) et sélectionnez "Valider manuellement". Assurez-vous d'avoir vérifié la réception effective des fonds sur votre dashboard opérateur.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Puis-je archiver un concours sans le supprimer ?</AccordionTrigger>
              <AccordionContent>
                Oui, vous pouvez modifier le statut d'un concours en "Archivé". Cela empêchera les nouveaux utilisateurs de s'y inscrire tout en conservant l'accès pour les utilisateurs déjà inscrits et en gardant toutes les statistiques historiques.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Comment configurer le chatbot pour un nouveau pack ?</AccordionTrigger>
              <AccordionContent>
                Le chatbot est automatiquement actif pour tout nouveau pack. Il utilise le contenu pédagogique (cours, résumés) que vous téléchargez dans le pack comme base de connaissances. Vous pouvez configurer les limites de tokens dans les paramètres du pack.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Comment exporter la liste des utilisateurs ?</AccordionTrigger>
              <AccordionContent>
                Dans la page "Utilisateurs", utilisez le bouton "Exporter" en haut à droite. Vous pouvez filtrer la liste par concours ou par statut avant l'exportation pour obtenir un fichier CSV ciblé.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Contact Support Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Besoin d'aide ?
          </h3>
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Équipe Support</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Notre équipe est disponible du Lundi au Vendredi, de 9h à 18h.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="secondary" className="w-full">
                Ouvrir un ticket
              </Button>
              <Button variant="outline" className="w-full border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/20">
                <ExternalLink className="mr-2 h-4 w-4" />
                Rejoindre le Slack
              </Button>
            </CardContent>
          </Card>

          <div className="bg-card border rounded-xl p-6">
            <h4 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Nouveautés v2.4
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                Amélioration de la vitesse du chatbot (temps de réponse &lt; 1s).
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                Nouveau système de filigrane dynamique sur les PDF.
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                Exportation CSV enrichie avec les données de progression.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
