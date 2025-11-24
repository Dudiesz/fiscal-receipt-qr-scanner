"use client"

import { useState } from "react"
import { Menu, X, ScanLine, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SlideMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { href: "/", label: "Scanner", icon: ScanLine },
    { href: "/relatorios", label: "Relatórios", icon: FileText },
  ]

  return (
    <>
      {/* Hamburger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="icon"
        className="hover:bg-primary/10 transition-all"
      >
        <Menu className="w-6 h-6 text-foreground" />
      </Button>

      {/* Dark Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 bg-[#0f1419] border-r border-primary/20 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6 space-y-8">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between pb-6 border-b border-border/50">
            <div className="flex items-center gap-3">
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
            <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon" className="hover:bg-primary/10">
              <X className="w-5 h-5 text-gray-400" />
            </Button>
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
      </div>
    </>
  )
}
