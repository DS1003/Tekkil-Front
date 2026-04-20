import type { Metadata, Viewport } from "next"
import { Roboto_Condensed, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-roboto-condensed",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Tekkil Admin — Plateforme de préparation aux concours",
  description:
    "Panel d'administration Tekkil : gestion des concours, packs pédagogiques, utilisateurs, paiements Mobile Money et sécurité.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${robotoCondensed.variable} ${geistMono.variable}`}
    >
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
        <Toaster richColors theme="light" />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
