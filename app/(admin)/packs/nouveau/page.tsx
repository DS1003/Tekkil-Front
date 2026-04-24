"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Headphones,
  Video,
  ListChecks,
  Layers,
  Save,
  Plus,
} from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { concours } from "@/lib/mock-data"

export default function NouveauPackPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCreate = () => {
    setLoading(true)
    setTimeout(() => {
      toast.success("Pack créé avec succès !")
      router.push("/packs")
    }, 1500)
  }

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="w-fit text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <PageHeader
        badge="Nouveau Contenu"
        title="Créer un pack pédagogique"
        description="Définissez la structure de base du pack. Vous pourrez ajouter les fichiers et configurer le chatbot après la création."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Détails principaux visibles par les étudiants.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre du pack</Label>
                <Input id="titre" placeholder="Ex: Droit Administratif — Fondamentaux" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Concours ciblé</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un concours" />
                    </SelectTrigger>
                    <SelectContent>
                      {concours.map(c => (
                        <SelectItem key={c.id} value={c.abbr}>{c.abbr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cycle</Label>
                  <Select defaultValue="A">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Cycle A</SelectItem>
                      <SelectItem value="B">Cycle B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description courte</Label>
                <Textarea id="desc" placeholder="Une brève introduction au contenu du pack..." className="resize-none" rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tarification</CardTitle>
              <CardDescription>Définissez le prix de vente du pack.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prix">Prix (FCFA)</Label>
                <Input id="prix" type="number" defaultValue={5000} />
              </div>
              <div className="space-y-2">
                <Label>Statut initial</Label>
                <Select defaultValue="brouillon">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brouillon">Brouillon</SelectItem>
                    <SelectItem value="publie">Publié</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Structure prévue</CardTitle>
              <CardDescription>Estimation des volumes de contenu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { l: "Cours", i: BookOpen },
                { l: "Résumés", i: FileText },
                { l: "Audios", i: Headphones },
                { l: "Vidéos", i: Video },
                { l: "QCM", i: ListChecks },
                { l: "Flashcards", i: Layers },
              ].map(item => (
                <div key={item.l} className="flex items-center gap-3">
                  <div className="bg-muted p-2 rounded-lg">
                    <item.i className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs font-medium">{item.l}</Label>
                    <Input type="number" defaultValue={0} className="h-8 mt-1" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button onClick={handleCreate} disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-bold">
              {loading ? "Création..." : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Créer le pack
                </>
              )}
            </Button>
            <Button variant="outline" className="w-full h-12" onClick={() => router.back()}>
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
