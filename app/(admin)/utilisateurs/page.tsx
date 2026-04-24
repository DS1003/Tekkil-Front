"use client"

import { useMemo, useState } from "react"
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Smartphone,
  Globe,
  Apple,
  Pencil,
  Ban,
  ShieldCheck,
  Mail,
  UserPlus,
  Play,
  Pause,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/admin/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  DropdownMenuLabel,
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
import { utilisateurs as seedUsers, fcfa, type Utilisateur } from "@/lib/mock-data"

const statutColors: Record<string, string> = {
  Actif: "border-success/30 text-success bg-success/5",
  Suspendu: "border-warning/60 text-warning-foreground bg-warning/20",
  Bloqué: "border-destructive/30 text-destructive bg-destructive/5",
}

const deviceIcons = {
  Android: Smartphone,
  iOS: Apple,
  Web: Globe,
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

type EditForm = {
  nom: string
  email: string
  telephone: string
  ville: string
  appareil: Utilisateur["appareil"]
  statut: Utilisateur["statut"]
}

type InviteForm = {
  nom: string
  email: string
  telephone: string
  ville: string
}

export default function UtilisateursPage() {
  const [users, setUsers] = useState<Utilisateur[]>(seedUsers)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("Tous")
  const [page, setPage] = useState(1)
  const perPage = 10

  const [editTarget, setEditTarget] = useState<Utilisateur | null>(null)
  const [editForm, setEditForm] = useState<EditForm | null>(null)

  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteForm, setInviteForm] = useState<InviteForm>({
    nom: "",
    email: "",
    telephone: "",
    ville: "",
  })

  const [toDelete, setToDelete] = useState<Utilisateur | null>(null)
  const [toBlock, setToBlock] = useState<Utilisateur | null>(null)

  const filtered = useMemo(() => {
    let result = users
    if (statusFilter !== "Tous") {
      result = result.filter((u) => u.statut === statusFilter)
    }
    const q = search.trim().toLowerCase()
    if (!q) return result
    return result.filter(
      (u) =>
        u.nom.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.telephone.toLowerCase().includes(q) ||
        u.ville.toLowerCase().includes(q),
    )
  }, [users, search, statusFilter])

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / perPage) || 1

  const stats = useMemo(() => {
    const actifs = users.filter((u) => u.statut === "Actif").length
    const suspendus = users.filter((u) => u.statut === "Suspendu").length
    const bloques = users.filter((u) => u.statut === "Bloqué").length
    const premium = users.filter((u) => u.packsAchetes >= 1).length
    return { actifs, suspendus, bloques, premium }
  }, [users])

  function openEdit(u: Utilisateur) {
    setEditTarget(u)
    setEditForm({
      nom: u.nom,
      email: u.email,
      telephone: u.telephone,
      ville: u.ville,
      appareil: u.appareil,
      statut: u.statut,
    })
  }

  function saveEdit() {
    if (!editTarget || !editForm) return
    if (!editForm.nom.trim() || !editForm.email.trim()) {
      toast.error("Nom et email sont requis")
      return
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === editTarget.id ? { ...u, ...editForm } : u)),
    )
    toast.success(`Profil de ${editForm.nom} mis à jour`)
    setEditTarget(null)
    setEditForm(null)
  }

  function setStatus(u: Utilisateur, statut: Utilisateur["statut"]) {
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, statut } : x)))
    toast.success(`${u.nom} → ${statut.toLowerCase()}`)
  }

  function submitInvite() {
    if (!inviteForm.nom.trim() || !inviteForm.email.trim()) {
      toast.error("Nom et email sont requis")
      return
    }
    const next: Utilisateur = {
      id: "usr-" + Math.random().toString(36).slice(2, 8),
      nom: inviteForm.nom,
      email: inviteForm.email,
      telephone: inviteForm.telephone || "—",
      ville: inviteForm.ville || "—",
      inscriptionDate: new Date().toISOString().slice(0, 10),
      packsAchetes: 0,
      totalDepense: 0,
      derniereConnexion: "Invitation envoyée",
      statut: "Actif",
      appareil: "Web",
      scoreMoyen: 0,
    }
    setUsers((prev) => [next, ...prev])
    toast.success(`Invitation envoyée à ${inviteForm.email}`)
    setInviteForm({ nom: "", email: "", telephone: "", ville: "" })
    setInviteOpen(false)
  }

  function confirmDelete() {
    if (!toDelete) return
    setUsers((prev) => prev.filter((u) => u.id !== toDelete.id))
    toast.success(`Compte ${toDelete.nom} supprimé`)
    setToDelete(null)
  }

  function confirmBlock() {
    if (!toBlock) return
    setStatus(toBlock, "Bloqué")
    setToBlock(null)
  }

  function exportExcel() {
    const header = "Nom;Email;Téléphone;Ville;Packs;Total;Statut\n"
    const rows = users
      .map(
        (u) =>
          `"${u.nom}";"${u.email}";"${u.telephone}";"${u.ville}";${u.packsAchetes};${u.totalDepense};"${u.statut}"`,
      )
      .join("\n")
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF])
    const blob = new Blob([bom, header + rows], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tekkil-utilisateurs-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Liste exportée pour Excel")
  }

  return (
    <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6">
      <PageHeader
        badge="Communauté"
        title="Utilisateurs"
        description={`Gérez vos ${users.length.toLocaleString("fr-FR")} utilisateurs : profils, abonnements, sessions actives et conformité (connexion unique par appareil).`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportExcel}>
              <Download className="mr-1.5 h-4 w-4" />
              Exporter Excel
            </Button>
            <Button
              size="sm"
              onClick={() => setInviteOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <UserPlus className="mr-1.5 h-4 w-4" />
              Inviter
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { l: "Actifs", v: stats.actifs, sub: "Comptes sains" },
          { l: "Suspendus", v: stats.suspendus, sub: "Accès limité" },
          { l: "Bloqués (fraude)", v: stats.bloques, sub: "Auto + manuel" },
          { l: "Premium (1+ pack)", v: stats.premium, sub: "Payants" },
        ].map((s) => (
          <div key={s.l} className="bg-card border-border rounded-lg border p-4">
            <div className="text-muted-foreground text-xs uppercase tracking-wider">
              {s.l}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-semibold tabular-nums">
                {s.v.toLocaleString("fr-FR")}
              </span>
              <span className="text-muted-foreground text-xs">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom, email, téléphone, ville..."
            className="h-10 pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-1.5 h-4 w-4" />
              {statusFilter === "Tous" ? "Filtres" : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Statut</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter("Actif")}>
              Actifs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Suspendu")}>
              Suspendus
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Bloqué")}>
              Bloqués
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter("Tous")}>
              Tous les statuts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="bg-card border-border overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-border border-b">
              <tr className="text-muted-foreground text-left text-xs">
                <th className="px-5 py-3 font-medium">Utilisateur</th>
                <th className="px-5 py-3 font-medium">Localisation</th>
                <th className="px-5 py-3 font-medium">Appareil</th>
                <th className="px-5 py-3 font-medium">Packs</th>
                <th className="px-5 py-3 font-medium">Total dépensé</th>
                <th className="px-5 py-3 font-medium">Score moyen</th>
                <th className="px-5 py-3 font-medium">Dernière connexion</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="w-12 px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {paginated.map((u) => {
                const D = deviceIcons[u.appareil]
                return (
                  <tr key={u.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                            {getInitials(u.nom)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="text-foreground truncate font-medium">
                            {u.nom}
                          </div>
                          <div className="text-muted-foreground truncate text-xs">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted-foreground px-5 py-3">{u.ville}</td>
                    <td className="px-5 py-3">
                      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        <D className="h-3.5 w-3.5" />
                        {u.appareil}
                      </div>
                    </td>
                    <td className="text-foreground px-5 py-3 font-medium tabular-nums">
                      {u.packsAchetes}
                    </td>
                    <td className="text-foreground px-5 py-3 font-medium tabular-nums">
                      {fcfa(u.totalDepense)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground text-xs font-medium tabular-nums">
                          {u.scoreMoyen}%
                        </span>
                        <div className="bg-muted h-1.5 w-16 overflow-hidden rounded-full">
                          <div
                            className={
                              "h-full rounded-full " +
                              (u.scoreMoyen >= 70
                                ? "bg-success"
                                : u.scoreMoyen >= 50
                                  ? "bg-primary"
                                  : "bg-destructive")
                            }
                            style={{ width: `${u.scoreMoyen}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="text-muted-foreground px-5 py-3 text-xs">
                      {u.derniereConnexion}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="outline" className={statutColors[u.statut]}>
                        {u.statut}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem onClick={() => openEdit(u)}>
                            <Pencil className="mr-2 h-3.5 w-3.5" />
                            Modifier le profil
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              navigator.clipboard?.writeText(u.email)
                              toast.success("Email copié")
                            }}
                          >
                            <Mail className="mr-2 h-3.5 w-3.5" />
                            Copier l&apos;email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {u.statut !== "Actif" && (
                            <DropdownMenuItem onClick={() => setStatus(u, "Actif")}>
                              <Play className="mr-2 h-3.5 w-3.5" />
                              Réactiver
                            </DropdownMenuItem>
                          )}
                          {u.statut === "Actif" && (
                            <DropdownMenuItem onClick={() => setStatus(u, "Suspendu")}>
                              <Pause className="mr-2 h-3.5 w-3.5" />
                              Suspendre
                            </DropdownMenuItem>
                          )}
                          {u.statut !== "Bloqué" && (
                            <DropdownMenuItem
                              onClick={() => setToBlock(u)}
                              className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Ban className="mr-2 h-3.5 w-3.5" />
                              Bloquer (fraude)
                            </DropdownMenuItem>
                          )}
                          {u.statut === "Bloqué" && (
                            <DropdownMenuItem onClick={() => setStatus(u, "Actif")}>
                              <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                              Débloquer
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setToDelete(u)}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Supprimer le compte
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="border-border text-muted-foreground flex items-center justify-between border-t px-5 py-3 text-xs">
          <span>
            Affichage de {(page - 1) * perPage + 1} à {Math.min(page * perPage, filtered.length)} sur {filtered.length.toLocaleString("fr-FR")} utilisateurs
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-muted/40 hover:bg-muted disabled:opacity-50 rounded px-2.5 py-1"
            >
              Précédent
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={
                  page === i + 1
                    ? "bg-primary text-primary-foreground rounded px-2.5 py-1"
                    : "bg-muted/40 hover:bg-muted rounded px-2.5 py-1"
                }
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="bg-muted/40 hover:bg-muted disabled:opacity-50 rounded px-2.5 py-1"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Edit profile dialog */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(o) => {
          if (!o) {
            setEditTarget(null)
            setEditForm(null)
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier {editTarget?.nom}</DialogTitle>
            <DialogDescription>
              Mettez à jour le profil et le statut de l&apos;utilisateur.
            </DialogDescription>
          </DialogHeader>
          {editForm && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="u-nom">Nom complet</Label>
                <Input
                  id="u-nom"
                  value={editForm.nom}
                  onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="u-email">Email</Label>
                <Input
                  id="u-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="u-tel">Téléphone</Label>
                <Input
                  id="u-tel"
                  value={editForm.telephone}
                  onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="u-ville">Ville</Label>
                <Input
                  id="u-ville"
                  value={editForm.ville}
                  onChange={(e) => setEditForm({ ...editForm, ville: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Appareil</Label>
                <Select
                  value={editForm.appareil}
                  onValueChange={(v) =>
                    setEditForm({ ...editForm, appareil: v as Utilisateur["appareil"] })
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Android">Android</SelectItem>
                    <SelectItem value="iOS">iOS</SelectItem>
                    <SelectItem value="Web">Web</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>Statut</Label>
                <Select
                  value={editForm.statut}
                  onValueChange={(v) =>
                    setEditForm({ ...editForm, statut: v as Utilisateur["statut"] })
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Actif">Actif</SelectItem>
                    <SelectItem value="Suspendu">Suspendu</SelectItem>
                    <SelectItem value="Bloqué">Bloqué</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditTarget(null)
                setEditForm(null)
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={saveEdit}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inviter un utilisateur</DialogTitle>
            <DialogDescription>
              Un email d&apos;invitation sera envoyé avec un lien d&apos;activation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="i-nom">Nom complet</Label>
              <Input
                id="i-nom"
                value={inviteForm.nom}
                onChange={(e) => setInviteForm({ ...inviteForm, nom: e.target.value })}
                placeholder="Ex : Aminata Sène"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="i-email">Email</Label>
              <Input
                id="i-email"
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                placeholder="prenom.nom@email.sn"
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="i-tel">Téléphone</Label>
                <Input
                  id="i-tel"
                  value={inviteForm.telephone}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, telephone: e.target.value })
                  }
                  placeholder="+221 77 000 00 00"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="i-ville">Ville</Label>
                <Input
                  id="i-ville"
                  value={inviteForm.ville}
                  onChange={(e) => setInviteForm({ ...inviteForm, ville: e.target.value })}
                  placeholder="Dakar"
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={submitInvite}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Mail className="mr-1.5 h-4 w-4" />
              Envoyer l&apos;invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block confirm */}
      <AlertDialog open={!!toBlock} onOpenChange={(o) => !o && setToBlock(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bloquer {toBlock?.nom} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Toutes les sessions actives seront révoquées immédiatement. L&apos;utilisateur
              ne pourra plus se connecter jusqu&apos;à un déblocage manuel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBlock}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Bloquer le compte
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirm */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le compte de {toDelete?.nom} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Les données personnelles seront effacées
              conformément au RGPD, mais l&apos;historique de paiement sera conservé pour
              la comptabilité.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
