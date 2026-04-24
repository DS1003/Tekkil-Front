"use client"

import { Bell, Check, Circle, Info, TriangleAlert } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const notifications = [
  {
    id: 1,
    title: "Nouveau pack créé",
    description: "Le pack 'Réussite Concours' a été validé.",
    time: "Il y a 2 min",
    type: "success",
    read: false,
  },
  {
    id: 2,
    title: "Alerte système",
    description: "La base de données a subi une maintenance.",
    time: "Il y a 1h",
    type: "warning",
    read: false,
  },
  {
    id: 3,
    title: "Nouvel utilisateur",
    description: "Amadou Diallo vient de s'inscrire.",
    time: "Il y a 3h",
    type: "info",
    read: true,
  },
]

export function NotificationsDropdown() {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Notifications"
          className="text-muted-foreground hover:bg-muted hover:text-foreground relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="bg-destructive absolute right-2 top-2 flex h-2 w-2 rounded-full ring-2 ring-background" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[320px] p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <DropdownMenuLabel className="p-0 text-base">Notifications</DropdownMenuLabel>
            <p className="text-muted-foreground text-xs">
              Vous avez {unreadCount} notifications non lues
            </p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            Tout marquer
          </Button>
        </div>
        <DropdownMenuSeparator className="m-0" />
        <ScrollArea className="h-[300px]">
          <DropdownMenuGroup>
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex cursor-pointer flex-col items-start gap-1 p-4 focus:bg-muted/50",
                  !notification.read && "bg-muted/20"
                )}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {notification.type === "success" && (
                      <div className="bg-emerald-500/10 text-emerald-500 rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    {notification.type === "warning" && (
                      <div className="bg-amber-500/10 text-amber-500 rounded-full p-1">
                        <TriangleAlert className="h-3 w-3" />
                      </div>
                    )}
                    {notification.type === "info" && (
                      <div className="bg-blue-500/10 text-blue-500 rounded-full p-1">
                        <Info className="h-3 w-3" />
                      </div>
                    )}
                    <span className="text-sm font-semibold">{notification.title}</span>
                  </div>
                  <span className="text-muted-foreground whitespace-nowrap text-[10px]">
                    {notification.time}
                  </span>
                </div>
                <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                  {notification.description}
                </p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </ScrollArea>
        <DropdownMenuSeparator className="m-0" />
        <div className="p-2">
          <Button variant="ghost" className="w-full justify-center text-xs font-medium">
            Voir toutes les notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
