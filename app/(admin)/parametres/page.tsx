"use client"

import { Save, User, Building2, CreditCard, Globe, Webhook } from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export default function ParametresPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
      <PageHeader
        badge="Configuration"
        title="Paramètres"
        description="Gérez votre organisation, les passerelles de paiement, les intégrations et la facturation."
        actions={
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="mr-1.5 h-4 w-4" />
            Enregistrer
          </Button>
        }
      />

      <Tabs defaultValue="organisation" className="w-full">
        <TabsList className="bg-card border-border h-auto w-full justify-start gap-1 rounded-lg border p-1">
          <TabsTrigger
            value="organisation"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
          >
            <Building2 className="h-3.5 w-3.5" />
            Organisation
          </TabsTrigger>
          <TabsTrigger
            value="profil"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
          >
            <User className="h-3.5 w-3.5" />
            Profil admin
          </TabsTrigger>
          <TabsTrigger
            value="paiement"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Passerelles
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
          >
            <Webhook className="h-3.5 w-3.5" />
            Intégrations
          </TabsTrigger>
          <TabsTrigger
            value="localisation"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
          >
            <Globe className="h-3.5 w-3.5" />
            Localisation
          </TabsTrigger>
        </TabsList>

        {/* Organisation */}
        <TabsContent value="organisation" className="mt-5">
          <div className="bg-card border-border rounded-xl border p-6">
            <h3 className="text-foreground text-lg font-semibold">
              Informations générales
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Ces informations apparaissent sur les factures et reçus envoyés aux utilisateurs.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Nom de l'organisation" defaultValue="Tekkil SARL" />
              <Field label="Email de contact" defaultValue="contact@tekkil.sn" />
              <Field label="Téléphone" defaultValue="+221 33 869 12 34" />
              <Field label="NINEA" defaultValue="009852140" />
              <Field
                label="Adresse"
                defaultValue="Sacré-Cœur 3, Pyrotechnie, Dakar"
                full
              />
              <Field label="Site web" defaultValue="https://tekkil.sn" />
              <Field label="Pays" defaultValue="Sénégal" />
            </div>
          </div>
        </TabsContent>

        {/* Profil */}
        <TabsContent value="profil" className="mt-5">
          <div className="bg-card border-border rounded-xl border p-6">
            <h3 className="text-foreground text-lg font-semibold">Profil administrateur</h3>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Nom complet" defaultValue="Admin Tekkil" />
              <Field label="Email" defaultValue="admin@tekkil.sn" />
              <Field label="Rôle" defaultValue="Super-administrateur" />
              <Field label="Téléphone" defaultValue="+221 77 000 00 00" />
            </div>

            <div className="border-border mt-6 flex items-center justify-between border-t pt-6">
              <div>
                <Label className="text-foreground text-sm font-medium">
                  Authentification à deux facteurs
                </Label>
                <p className="text-muted-foreground mt-1 text-xs">
                  Sécurisez votre compte avec une vérification supplémentaire.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </TabsContent>

        {/* Passerelles */}
        <TabsContent value="paiement" className="mt-5">
          <div className="bg-card border-border rounded-xl border">
            <div className="border-border border-b px-6 py-5">
              <h3 className="text-foreground text-lg font-semibold">
                Passerelles de paiement
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Configurez vos méthodes Mobile Money et bancaires.
              </p>
            </div>
            <div className="divide-border divide-y">
              {[
                { n: "Orange Money", desc: "API Orange Money Sénégal", actif: true, status: "Connecté" },
                { n: "Wave", desc: "Wave Money Sénégal", actif: true, status: "Connecté" },
                { n: "Free Money", desc: "Free Money Sénégal", actif: true, status: "Connecté" },
                { n: "Stripe (Carte bancaire)", desc: "Visa, Mastercard, Amex", actif: true, status: "Connecté" },
                { n: "PayDunya", desc: "Agrégateur multi-méthodes", actif: false, status: "Désactivé" },
              ].map((p) => (
                <div key={p.n} className="flex items-center gap-4 px-6 py-4">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-foreground text-sm font-medium">{p.n}</div>
                    <div className="text-muted-foreground text-xs">{p.desc}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      p.actif
                        ? "border-success/30 text-success bg-success/5"
                        : "border-muted-foreground/30 text-muted-foreground"
                    }
                  >
                    {p.status}
                  </Badge>
                  <Switch defaultChecked={p.actif} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Intégrations */}
        <TabsContent value="integrations" className="mt-5">
          <div className="bg-card border-border rounded-xl border p-6">
            <h3 className="text-foreground text-lg font-semibold">Webhooks & API</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Connectez Tekkil à vos outils externes via webhook ou API.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <Field
                label="URL de webhook (paiements)"
                defaultValue="https://api.tekkil.sn/webhooks/payments"
                full
              />
              <Field
                label="Clé API publique"
                defaultValue="pk_live_xxxxxxxxxxxxxxxx"
                full
              />
              <Field
                label="Clé secrète"
                defaultValue="sk_live_••••••••••••••••"
                full
              />
            </div>

            <div className="bg-primary/5 border-primary/20 mt-6 flex items-start gap-3 rounded-lg border p-4">
              <Webhook className="text-primary mt-0.5 h-4 w-4 shrink-0" />
              <div className="text-foreground text-xs leading-relaxed">
                Les événements <code className="bg-muted/40 rounded px-1 text-[11px]">payment.success</code>,{" "}
                <code className="bg-muted/40 rounded px-1 text-[11px]">user.signup</code> et{" "}
                <code className="bg-muted/40 rounded px-1 text-[11px]">pack.purchased</code> sont
                envoyés au webhook configuré.
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Localisation */}
        <TabsContent value="localisation" className="mt-5">
          <div className="bg-card border-border rounded-xl border p-6">
            <h3 className="text-foreground text-lg font-semibold">
              Langue & devise
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  Langue par défaut
                </Label>
                <select className="bg-background border-border mt-1.5 h-10 w-full rounded-md border px-3 text-sm">
                  <option>Français (Sénégal)</option>
                  <option>Wolof</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  Devise
                </Label>
                <select className="bg-background border-border mt-1.5 h-10 w-full rounded-md border px-3 text-sm">
                  <option>FCFA (XOF)</option>
                  <option>EUR (€)</option>
                  <option>USD ($)</option>
                </select>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  Fuseau horaire
                </Label>
                <select className="bg-background border-border mt-1.5 h-10 w-full rounded-md border px-3 text-sm">
                  <option>GMT+0 — Afrique/Dakar</option>
                  <option>GMT+1 — Europe/Paris</option>
                </select>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  Format des dates
                </Label>
                <select className="bg-background border-border mt-1.5 h-10 w-full rounded-md border px-3 text-sm">
                  <option>JJ/MM/AAAA</option>
                  <option>AAAA-MM-JJ</option>
                </select>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Field({
  label,
  defaultValue,
  full,
}: {
  label: string
  defaultValue: string
  full?: boolean
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
        {label}
      </Label>
      <input
        defaultValue={defaultValue}
        className="bg-background border-border focus:border-primary/50 focus:ring-primary/20 mt-1.5 h-10 w-full rounded-md border px-3 text-sm outline-none focus:ring-2"
      />
    </div>
  )
}
