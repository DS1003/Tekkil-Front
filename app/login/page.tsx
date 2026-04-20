"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulation de connexion
    setTimeout(() => {
      setIsLoading(false)
      toast.success("Authentification réussie", {
        description: "Redirection vers le tableau de bord...",
      })
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="bg-grid relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Background Orbs animés */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="bg-primary/20 absolute -top-20 -left-20 h-[500px] w-[500px] rounded-full blur-[100px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -70, 0],
          y: [0, 70, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="bg-warning/20 absolute -right-20 -bottom-20 h-[500px] w-[500px] rounded-full blur-[100px]" 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-card mb-6 flex h-20 w-fit items-center justify-center rounded-2xl p-4 shadow-xl ring-1 ring-border"
          >
            <Image
              src="/tekkil-logo.png"
              alt="Tekkil Logo"
              width={140}
              height={50}
              className="h-10 w-auto object-contain"
            />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tekkil <span className="text-primary italic">Admin</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base">
            Plateforme de gestion pédagogique & stratégique
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-warning to-destructive" />
          
          <CardHeader className="space-y-1 pb-6">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm mb-1">
              <ShieldCheck className="h-4 w-4" />
              Accès Sécurisé
            </div>
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            <CardDescription className="text-sm">
              Authentifiez-vous pour accéder au panel d&apos;administration.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5">
            <form onSubmit={handleLogin} className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-semibold">Adresse Email</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Mail className="text-muted-foreground group-focus-within:text-primary transition-colors h-4 w-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@tekkil.sn"
                    className="pl-10 h-11 bg-background/50 border-border focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" title="Mot de passe" className="text-sm font-semibold">Mot de passe</Label>
                  <Link
                    href="#"
                    className="text-primary hover:text-primary/80 transition-colors text-xs font-bold"
                  >
                    Oublié ?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Lock className="text-muted-foreground group-focus-within:text-primary transition-colors h-4 w-4" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10 pl-10 h-11 bg-background/50 border-border focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-3 flex items-center transition-colors"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 py-1">
                <Checkbox id="remember" className="data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                <Label
                  htmlFor="remember"
                  className="text-xs font-medium text-muted-foreground cursor-pointer select-none"
                >
                  Rester connecté pendant 30 jours
                </Label>
              </div>

              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-primary-foreground h-11 w-full shadow-[0_4px_14px_0_oklch(0.52_0.24_265/0.3)] transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Vérification...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 font-bold tracking-wide">
                    SE CONNECTER <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t border-border/50 bg-muted/30 px-6 py-4">
            <div className="text-muted-foreground text-center text-xs">
              Accès réservé au personnel autorisé. Toute tentative de connexion non autorisée sera enregistrée.
            </div>
          </CardFooter>
        </Card>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-6 opacity-60">
          <Link href="#" className="text-foreground text-xs font-medium hover:underline">Support</Link>
          <div className="h-1 w-1 rounded-full bg-border" />
          <Link href="#" className="text-foreground text-xs font-medium hover:underline">Confidentialité</Link>
          <div className="h-1 w-1 rounded-full bg-border" />
          <span className="text-foreground text-xs font-medium">v1.2.0</span>
        </div>
      </motion.div>
    </div>
  )
}
