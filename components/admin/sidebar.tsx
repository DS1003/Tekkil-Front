"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import {
  LayoutDashboard,
  GraduationCap,
  Layers,
  Users,
  CreditCard,
  FileCheck2,
  MessageSquare,
  Bell,
  ShieldAlert,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navSections = [
  {
    label: "Vue d'ensemble",
    items: [{ href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, badge: null }],
  },
  {
    label: "Pédagogie",
    items: [
      { href: "/concours", label: "Concours & Cycles", icon: GraduationCap, badge: "7" },
      { href: "/packs", label: "Packs", icon: Layers, badge: "65" },
      { href: "/examens-blancs", label: "Examens blancs", icon: FileCheck2, badge: null },
    ],
  },
  {
    label: "Communauté",
    items: [
      { href: "/utilisateurs", label: "Utilisateurs", icon: Users, badge: "12.4k" },
      { href: "/paiements", label: "Paiements", icon: CreditCard, badge: null },
      { href: "/notifications", label: "Notifications", icon: Bell, badge: null },
      { href: "/chatbot", label: "Chatbot IA", icon: MessageSquare, badge: "Beta" },
    ],
  },
  {
    label: "Système",
    items: [
      { href: "/securite", label: "Sécurité & Anti-fraude", icon: ShieldAlert, badge: "3" },
      { href: "/parametres", label: "Paramètres", icon: Settings, badge: null },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-sidebar border-sidebar-border sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r lg:flex">
      {/* Brand */}
      <div className="border-sidebar-border flex h-16 items-center gap-2 border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/tekkil-logo.png"
            alt="Tekkil"
            width={140}
            height={56}
            priority
            className="h-9 w-auto object-contain"
          />
        </Link>
        <span className="ml-auto rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {navSections.map((section) => (
          <div key={section.label} className="mb-6">
            <div className="text-muted-foreground mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider">
              {section.label}
            </div>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href || pathname?.startsWith(item.href + "/")
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="bg-primary absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer card */}
      <div className="border-sidebar-border border-t p-3">
        <div className="relative overflow-hidden rounded-xl bg-primary p-4 text-primary-foreground">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[oklch(0.85_0.17_88)]/40 blur-xl" />
          <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full bg-[oklch(0.68_0.22_20)]/40 blur-xl" />
          <div className="relative">
            <div className="text-sm font-bold tracking-tight">
              Concours en cours
            </div>
            <div className="mt-1 text-xs leading-relaxed text-primary-foreground/80">
              7 concours actifs — 2 clôturent dans moins de 30 jours.
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-primary-foreground/20">
              <div className="h-full w-[72%] rounded-full bg-[oklch(0.85_0.17_88)]" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
