"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Keyboard } from "lucide-react"

interface ManualInputModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (qrData: string) => void
}

export function ManualInputModal({ isOpen, onClose, onSubmit }: ManualInputModalProps) {
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setError(null)
      try {
        onSubmit(inputValue.trim())
        setInputValue("")
        onClose()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao processar o código")
      }
    }
  }

  const handleClose = () => {
    setInputValue("")
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border border-primary/30 rounded-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Keyboard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Digitar Código</h2>
          </div>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="qr-input" className="text-sm font-medium text-muted-foreground">
              Chave de Acesso ou URL Completa
            </label>
            <Input
              id="qr-input"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setError(null)
              }}
              placeholder="Cole ou digite o código aqui..."
              className="bg-secondary border-border focus:border-primary transition-colors font-mono"
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1 bg-transparent hover:bg-secondary transition-colors"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!inputValue.trim()}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              Enviar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
