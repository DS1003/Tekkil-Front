"use client"

import { Bell, Check, Clock, Megaphone } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { notifications } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function NotifDropdown() {
  const unreadCount = notifications.filter(n => n.statut === "Envoyée").length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Notifications"
          className="text-muted-foreground hover:bg-muted hover:text-foreground relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="bg-primary absolute right-2 top-2 h-1.5 w-1.5 rounded-full ring-2 ring-background" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between font-semibold">
          <span>Notifications</span>
          <Button variant="ghost" size="sm" className="h-auto p-1 text-[10px] text-primary">
            Marquer tout comme lu
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-3 focus:bg-accent/50">
              <div className="flex w-full items-center gap-2">
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full",
                  n.type === "Urgence" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                )}>
                  {n.type === "Rappel" ? <Clock className="h-3 w-3" /> : <Megaphone className="h-3 w-3" />}
                </div>
                <span className="flex-1 truncate text-xs font-semibold">{n.titre}</span>
                <span className="text-[10px] text-muted-foreground">{n.date.split(' ')[1]}</span>
              </div>
              <p className="line-clamp-2 text-[11px] text-muted-foreground">
                Cible : {n.cible} · {n.envoyees} envoyées
              </p>
              <div className="mt-1 flex items-center gap-1">
                <Check className="h-3 w-3 text-success" />
                <span className="text-[10px] text-success">Envoyée avec succès</span>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center text-xs font-medium text-primary">
          Voir toutes les notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
