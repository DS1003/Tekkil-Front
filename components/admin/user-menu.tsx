"use client"

import { LogOut, Settings, User, ShieldCheck, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"

export function UserMenu() {
  const router = useRouter()

  const handleLogout = () => {
    toast.success("Déconnexion réussie")
    router.push("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 outline-none">
          <div className="hidden text-right text-xs leading-tight md:block">
            <div className="text-foreground font-semibold">Admin Tekkil</div>
            <div className="text-muted-foreground">Super-administrateur</div>
          </div>
          <Avatar className="ring-primary/20 h-9 w-9 ring-2 transition-all hover:ring-primary/40">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              AT
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/parametres")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/paiements")}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Facturation</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/parametres")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/securite")}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>Sécurité</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
