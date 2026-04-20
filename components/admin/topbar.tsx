"use client"

import Image from "next/image"
import { Search, Bell, Command, Plus } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"

export function AdminTopbar() {
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

      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher concours, packs, utilisateurs..."
          className="bg-muted/60 border-transparent focus:bg-card focus:border-primary/40 focus:ring-primary/20 h-9 w-full rounded-lg border pl-9 pr-16 text-sm outline-none transition-colors focus:ring-2"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Kbd className="text-muted-foreground bg-background/80 text-[10px]">
            <Command className="mr-0.5 inline h-2.5 w-2.5" />K
          </Kbd>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 hidden font-semibold md:inline-flex"
        >
          <Plus className="mr-1 h-4 w-4" />
          Nouveau pack
        </Button>

        <button
          aria-label="Notifications"
          className="text-muted-foreground hover:bg-muted hover:text-foreground relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="bg-[oklch(0.68_0.22_20)] absolute right-2 top-2 h-1.5 w-1.5 rounded-full" />
        </button>

        <div className="bg-border mx-1 h-6 w-px" />

        <div className="flex items-center gap-2.5 pr-1">
          <div className="hidden text-right text-xs leading-tight md:block">
            <div className="text-foreground font-semibold">Admin Tekkil</div>
            <div className="text-muted-foreground">Super-administrateur</div>
          </div>
          <Avatar className="ring-primary/20 h-9 w-9 ring-2">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              AT
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
