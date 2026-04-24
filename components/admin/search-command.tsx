"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Package,
  Trophy,
  Users,
  Search,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

interface SearchCommandProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function SearchCommand({ open, setOpen }: SearchCommandProps) {
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Rechercher concours, packs, utilisateurs..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
        <CommandGroup heading="Actions rapides">
          <CommandItem onSelect={() => runCommand(() => router.push("/concours"))}>
            <Trophy className="mr-2 h-4 w-4" />
            <span>Gérer les concours</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/packs"))}>
            <Package className="mr-2 h-4 w-4" />
            <span>Gérer les packs</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/utilisateurs"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Gérer les utilisateurs</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/paiements"))}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Suivi des paiements</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Paramètres">
          <CommandItem onSelect={() => runCommand(() => router.push("/profil"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Mon Profil</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/parametres"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres système</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
