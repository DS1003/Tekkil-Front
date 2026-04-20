"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  GraduationCap,
  Layers,
  Users,
  CreditCard,
  Search,
  MessageSquare,
  Bell,
  Plus,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { concours, packs, utilisateurs, paiements } from "@/lib/mock-data"

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-muted/60 border-transparent text-muted-foreground hover:bg-muted focus:ring-primary/20 flex h-9 w-full max-w-md items-center gap-2 rounded-lg border px-3 text-sm outline-none transition-all focus:ring-2 md:w-80 lg:w-96"
      >
        <Search className="h-4 w-4" />
        <span>Rechercher...</span>
        <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Tapez pour rechercher (concours, packs, utilisateurs...)" />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          
          <CommandGroup heading="Actions rapides">
            <CommandItem onSelect={() => runCommand(() => router.push("/packs"))}>
              <Plus className="mr-2 h-4 w-4" />
              Créer un nouveau pack
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/notifications"))}>
              <Bell className="mr-2 h-4 w-4" />
              Envoyer une notification
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Concours">
            {concours.map((c) => (
              <CommandItem
                key={c.id}
                onSelect={() => runCommand(() => router.push("/concours"))}
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                <span>{c.abbr} — {c.nom}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Packs">
            {packs.map((p) => (
              <CommandItem
                key={p.id}
                onSelect={() => runCommand(() => router.push(`/packs/${p.id}`))}
              >
                <Layers className="mr-2 h-4 w-4" />
                <span>{p.titre} ({p.concours})</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Utilisateurs">
            {utilisateurs.slice(0, 5).map((u) => (
              <CommandItem
                key={u.id}
                onSelect={() => runCommand(() => router.push("/utilisateurs"))}
              >
                <Users className="mr-2 h-4 w-4" />
                <span>{u.nom} ({u.email})</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Paiements">
            {paiements.slice(0, 3).map((p) => (
              <CommandItem
                key={p.id}
                onSelect={() => runCommand(() => router.push("/paiements"))}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                <span>{p.reference} — {p.utilisateur}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <Search className="mr-2 h-4 w-4" />
              Tableau de bord
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/chatbot"))}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Chatbot IA
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
