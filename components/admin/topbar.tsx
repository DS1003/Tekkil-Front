import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommandMenu } from "./command-menu"
import { NotifDropdown } from "./notif-dropdown"
import { UserMenu } from "./user-menu"
import Link from "next/link"

export function AdminTopbar() {
  return (
    <header className="bg-background/80 border-border sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 backdrop-blur-md md:px-6">
      {/* Mobile logo */}
      <Link href="/dashboard" className="lg:hidden">
        <Image
          src="/tekkil-logo.png"
          alt="Tekkil"
          width={100}
          height={40}
          className="h-8 w-auto object-contain"
        />
      </Link>

      {/* Global Search */}
      <CommandMenu />

      <div className="ml-auto flex items-center gap-2">
        <Link href="/packs">
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hidden font-semibold md:inline-flex"
          >
            <Plus className="mr-1 h-4 w-4" />
            Nouveau pack
          </Button>
        </Link>

        <NotifDropdown />

        <div className="bg-border mx-1 h-6 w-px" />

        <UserMenu />
      </div>
    </header>
  )
}
