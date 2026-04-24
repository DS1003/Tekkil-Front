"use client"

import * as React from "react"
import Image from "next/image"
import { Search, Command, Plus, LogOut, User, Settings, Shield, HelpCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { SearchCommand } from "./search-command"
import { NotificationsDropdown } from "./notifications-dropdown"
import { useRouter } from "next/navigation"

export function AdminTopbar() {
  const [searchOpen, setSearchOpen] = React.useState(false)
  const router = useRouter()

  return (
    <header className="bg-background/80 border-border sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 backdrop-blur-md md:px-6">
      {/* Mobile logo */}
      <Image
        src="/tekkil-logo.png"
        alt="Tekkil"
        width={100}
        height={40}
        className="h-8 w-auto object-contain lg:hidden"
      />

      {/* Search Bar - Clickable to open Command Palette */}
      <div 
        className="relative max-w-md flex-1 cursor-pointer group" 
        onClick={() => setSearchOpen(true)}
      >
        <Search className="text-muted-foreground group-hover:text-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors" />
        <div className="bg-muted/60 border-transparent group-hover:bg-muted group-hover:border-border flex h-9 w-full items-center rounded-lg border pl-9 pr-16 text-sm text-muted-foreground transition-all">
          Rechercher concours, packs, utilisateurs...
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <Kbd className="text-muted-foreground bg-background/80 text-[10px]">
            <Command className="mr-0.5 inline h-2.5 w-2.5" />K
          </Kbd>
        </div>
      </div>

      <SearchCommand open={searchOpen} setOpen={setSearchOpen} />

      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 hidden font-semibold md:inline-flex"
          onClick={() => router.push("/packs/nouveau")}
        >
          <Plus className="mr-1 h-4 w-4" />
          Nouveau pack
        </Button>

        <NotificationsDropdown />

        <div className="bg-border mx-1 h-6 w-px" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-muted/80 flex items-center gap-2.5 rounded-lg p-1 pr-2 text-left outline-none transition-colors">
              <div className="hidden text-right text-xs leading-tight md:block">
                <div className="text-foreground font-semibold">Admin Tekkil</div>
                <div className="text-muted-foreground">Super-administrateur</div>
              </div>
              <Avatar className="ring-primary/20 h-9 w-9 ring-2 transition-all hover:ring-4">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  AT
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-1">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-semibold leading-none text-foreground">Admin Tekkil</p>
                <p className="text-muted-foreground text-xs leading-none">admin@tekkil.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => router.push("/profil")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Mon Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => router.push("/parametres")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres du compte</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => router.push("/securite")}
              >
                <Shield className="mr-2 h-4 w-4" />
                <span>Sécurité & Accès</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() => router.push("/help")}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Aide & Centre de support</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-medium"
              onClick={() => {
                // Logic for logout would go here
                console.log("Déconnexion...")
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
