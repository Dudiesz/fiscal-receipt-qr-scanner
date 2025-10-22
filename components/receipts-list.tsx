"use client"

import type { Receipt } from "@/types/receipt"
import { Trash2, Download, QrCode, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ReceiptsListProps {
  receipts: Receipt[]
  onDelete: (id: string) => void
  onExport: () => void
  onClearAll: () => void
}

export function ReceiptsList({ receipts, onDelete, onExport, onClearAll }: ReceiptsListProps) {
  if (receipts.length === 0) {
    return (
      <div className="text-center py-20 gradient-bg-blue rounded-2xl border border-primary/10">
        <div className="inline-flex p-6 bg-primary/10 rounded-2xl mb-6 shadow-lg shadow-primary/20">
          <QrCode className="w-16 h-16 text-primary/70" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum código escaneado</h3>
        <p className="text-muted-foreground">Os resultados aparecerão aqui assim que a leitura for concluída.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Notas Fiscais Escaneadas</h2>
          <p className="text-sm text-muted-foreground">
            {receipts.length} {receipts.length === 1 ? "nota fiscal" : "notas fiscais"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onExport}
            variant="outline"
            size="sm"
            className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary transition-all hover:scale-105 bg-transparent"
          >
            <Download className="w-4 h-4" />
            Baixar CSV
          </Button>
          <Button
            onClick={onClearAll}
            variant="outline"
            size="sm"
            className="gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive transition-all hover:scale-105 bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
            Limpar Tudo
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {receipts.map((receipt, index) => (
          <div
            key={receipt.id}
            className="animate-in slide-in-from-top-2 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="p-5 card-gradient rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200 hover:shadow-xl hover:shadow-primary/20 group hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                {/* Success icon on the left */}
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1 break-all font-mono">{receipt.accessKey}</p>
                  <p className="text-xs text-muted-foreground">
                    {receipt.date} • {receipt.time}
                  </p>
                </div>

                {/* Delete button */}
                <Button
                  onClick={() => onDelete(receipt.id)}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
