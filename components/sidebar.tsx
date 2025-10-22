"use client"

import { useState } from "react"
import { Menu, X, LayoutDashboard, User, ScanLine, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { href: "/", label: "Scanner", icon: ScanLine },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/relatorios", label: "Relatórios", icon: FileText },
    { href: "/perfil", label: "Meu Perfil", icon: User },
  ]

  return (
    <>
      {/* Mobile Toggle Button - Fixed position */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden hover:bg-primary/10 transition-all bg-[#0f1419]/95 backdrop-blur-sm border border-primary/20"
      >
        {isOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0f1419] border-r border-primary/20 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-border/50">
            <div
              className="p-2 rounded-lg shadow-lg shadow-primary/20"
              style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
            >
              <ScanLine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">FiscalFlow</h2>
              <p className="text-xs text-gray-400">Menu de Navegação</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:scale-[1.02] ${
                      isActive
                        ? "bg-primary/40 border border-primary/50 shadow-lg shadow-primary/20"
                        : "hover:bg-primary/20 border border-transparent"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-gray-400"}`} />
                    <span className={`font-medium ${isActive ? "text-white" : "text-gray-300"}`}>{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
