"use client"

import { useState, useEffect } from "react"
import { QRScanner } from "@/components/qr-scanner"
import { ManualInputModal } from "@/components/manual-input-modal"
import { SlideMenu } from "@/components/slide-menu"
import { saveReceipt } from "@/lib/storage"
import { getSessionScanCount, addSessionScan } from "@/lib/session-storage"
import { CheckCircle2, AlertTriangle, XCircle, Database, ScanLine } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [sessionScanCount, setSessionScanCount] = useState(0)
  const [status, setStatus] = useState<{ type: "success" | "duplicate" | "error"; message: string } | null>(null)
  const [isManualInputOpen, setIsManualInputOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dbError, setDbError] = useState<string | null>(null)

  useEffect(() => {
    setSessionScanCount(getSessionScanCount())
    setIsLoading(false)
  }, [])

  const showStatus = (type: "success" | "duplicate" | "error", message: string) => {
    setStatus({ type, message })
    setTimeout(() => setStatus(null), 6000)
  }

  const handleScan = async (qrData: string) => {
    if (dbError) {
      showStatus("error", "Configure o banco de dados antes de escanear códigos.")
      return
    }

    try {
      const newReceipt = await saveReceipt(qrData)

      if (newReceipt) {
        addSessionScan(newReceipt.accessKey)
        setSessionScanCount(getSessionScanCount())
        showStatus("success", `Código salvo: ${qrData}`)
      } else {
        showStatus("duplicate", "Este código já foi lido anteriormente.")
      }
    } catch (error: any) {
      const errorMessage = error?.message || String(error)

      if (errorMessage.includes("44 dígitos") || errorMessage.includes("Invalid")) {
        showStatus("error", "Código inválido. A chave de acesso deve ter exatamente 44 dígitos.")
      } else {
        showStatus("error", "Erro ao salvar o código. Tente novamente.")
      }
    }
  }

  if (dbError === "table_not_found") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-card border-2 border-warning/40 rounded-lg p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg border border-warning/30">
                <Database className="w-8 h-8 text-warning" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Configuração do Banco de Dados Necessária</h1>
                <p className="text-muted-foreground">A tabela de notas fiscais precisa ser criada</p>
              </div>
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Passos para Configurar:</h2>
              <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                <li className="leading-relaxed">
                  Clique no botão <strong className="text-foreground">"Run Script"</strong> abaixo do chat
                </li>
                <li className="leading-relaxed">
                  Selecione o script{" "}
                  <code className="bg-background px-2 py-1 rounded text-primary font-mono">
                    scripts/002_create_receipts_table_v2.sql
                  </code>
                </li>
                <li className="leading-relaxed">Aguarde a execução do script</li>
                <li className="leading-relaxed">
                  <strong className="text-foreground">Recarregue esta página</strong> (pressione F5 ou Ctrl+R)
                </li>
              </ol>

              <div className="bg-warning/10 border border-warning/30 rounded p-3 mt-4">
                <p className="text-xs text-warning font-semibold">
                  ⚠️ Importante: Após executar o script, você DEVE recarregar a página para que o Supabase reconheça a
                  nova tabela.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => window.location.reload()} className="flex-1 bg-primary hover:bg-primary/90">
                Recarregar Página
              </Button>
              <Button
                onClick={() => setSessionScanCount(getSessionScanCount())}
                variant="outline"
                className="flex-1 border-primary/30 hover:bg-primary/10"
              >
                Tentar Novamente
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Se o problema persistir, verifique se a integração Supabase está configurada corretamente.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (dbError === "unknown") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-card border-2 border-destructive/40 rounded-lg p-8 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <div>
              <h1
                className="text-2xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)" }}
              >
                FiscalFlow
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Leitor de Notas Fiscais</p>
            </div>
            <Button onClick={() => window.location.reload()} className="w-full bg-primary hover:bg-primary/90">
              Recarregar Página
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <header className="border-b border-border/50 bg-[#0a0e1a]/95 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SlideMenu />
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg shadow-lg shadow-primary/20"
                  style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
                >
                  <ScanLine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">FiscalFlow</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="space-y-8">
          <section className="bg-[#1a2332]/60 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Scanner de QR Code</h2>
              <p className="text-gray-400">Aponte para o QR Code e o sistema detectará automaticamente</p>
            </div>

            <QRScanner onScan={handleScan} scannedCount={sessionScanCount} />

            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setIsManualInputOpen(true)}
                variant="outline"
                size="lg"
                className="gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all hover:scale-105 bg-transparent backdrop-blur-sm"
              >
                Digitar Código Manualmente
              </Button>
            </div>
          </section>

          {status && (
            <section className="animate-in slide-in-from-top-2 duration-300">
              <div
                className={`p-5 rounded-lg border-2 transition-all backdrop-blur-sm ${
                  status.type === "success"
                    ? "bg-success/10 border-success/40"
                    : status.type === "duplicate"
                      ? "bg-warning/10 border-warning/40"
                      : "bg-destructive/10 border-destructive/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  {status.type === "success" && <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />}
                  {status.type === "duplicate" && <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0" />}
                  {status.type === "error" && <XCircle className="w-6 h-6 text-destructive flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold ${
                        status.type === "success"
                          ? "text-success"
                          : status.type === "duplicate"
                            ? "text-warning"
                            : "text-destructive"
                      }`}
                    >
                      {status.type === "success" && "Sucesso"}
                      {status.type === "duplicate" && "Código Duplicado"}
                      {status.type === "error" && "Erro"}
                    </p>
                    <p className="text-sm text-foreground/80 break-all">{status.message}</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <ManualInputModal isOpen={isManualInputOpen} onClose={() => setIsManualInputOpen(false)} onSubmit={handleScan} />
    </div>
  )
}
