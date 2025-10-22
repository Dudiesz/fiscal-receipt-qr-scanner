"use client"

import { NavigationMenu } from "@/components/navigation-menu"
import { ScanLine, User, Mail, Calendar, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Perfil() {
  return (
    <div className="min-h-screen gradient-bg">
      <header className="border-b border-border/50 bg-background/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg shadow-lg shadow-primary/20"
                style={{ background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)" }}
              >
                <ScanLine className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)" }}
                >
                  FiscalFlow
                </h1>
                <p className="text-xs text-muted-foreground -mt-0.5">Meu Perfil</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-lg shadow-primary/30 border-2 border-primary/20">
                <User className="w-5 h-5 text-white" />
              </div>
              <NavigationMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="space-y-8">
          <div className="text-center">
            <div className="inline-flex mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-2xl shadow-primary/40 border-4 border-primary/20">
                <User className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Meu Perfil</h2>
            <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
          </div>

          <div className="gradient-bg-blue rounded-2xl p-8 border border-primary/10 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-background/40 backdrop-blur-sm border border-border/50">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Nome</p>
                  <p className="text-sm font-medium text-foreground">Usuário FiscalFlow</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-background/40 backdrop-blur-sm border border-border/50">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">usuario@fiscalflow.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-background/40 backdrop-blur-sm border border-border/50">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Membro desde</p>
                  <p className="text-sm font-medium text-foreground">Janeiro 2025</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-background/40 backdrop-blur-sm border border-border/50">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Plano</p>
                  <p className="text-sm font-medium text-foreground">Gratuito</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <Button className="w-full bg-primary hover:bg-primary/90 transition-all hover:scale-105">
                Editar Perfil
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-primary/20 mt-20 bg-background/40 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6 text-center">
          <p className="text-sm text-muted-foreground">FiscalFlow • Desenvolvido com Next.js & v0</p>
        </div>
      </footer>
    </div>
  )
}
