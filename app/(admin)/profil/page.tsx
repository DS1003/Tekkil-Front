"use client"

import { useState } from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Key,
  Smartphone,
  LogOut,
  Camera,
  Save,
} from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

export default function ProfilPage() {
  const [loading, setLoading] = useState(false)

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success("Profil mis à jour avec succès")
    }, 1000)
  }

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-6">
      <PageHeader
        badge="Mon Compte"
        title="Mon Profil"
        description="Gérez vos informations personnelles, vos préférences de sécurité et vos sessions actives."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Avatar & Summary */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      AT
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">Admin Tekkil</h3>
                <p className="text-muted-foreground text-sm">Super-administrateur</p>
                <Badge className="mt-2 bg-success/10 text-success border-0">Compte vérifié</Badge>
              </div>

              <div className="mt-6 border-t pt-6 flex flex-col gap-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>admin@tekkil.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+221 77 000 00 00</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Dakar, Sénégal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Statut Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Double Auth (2FA)</span>
                <span className="text-success font-medium">Activé</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Dernière connexion</span>
                <span className="text-foreground">Il y a 2h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Appareils actifs</span>
                <span className="text-foreground font-medium">1 seul</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settings Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
              <CardDescription>
                Ces informations seront visibles par les autres administrateurs de la plateforme.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" defaultValue="Admin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" defaultValue="Tekkil" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Adresse Email</Label>
                <Input id="email" type="email" defaultValue="admin@tekkil.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue="+221 77 000 00 00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" defaultValue="Dakar" />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 justify-end gap-3">
              <Button variant="outline">Annuler</Button>
              <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90">
                {loading ? "Enregistrement..." : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mot de passe</CardTitle>
              <CardDescription>
                Modifiez votre mot de passe pour maintenir la sécurité de votre compte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPass">Mot de passe actuel</Label>
                <Input id="currentPass" type="password" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPass">Nouveau mot de passe</Label>
                  <Input id="newPass" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPass">Confirmer le nouveau mot de passe</Label>
                  <Input id="confirmPass" type="password" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 justify-end">
              <Button variant="outline" className="text-primary hover:text-primary hover:bg-primary/5">
                Changer le mot de passe
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
