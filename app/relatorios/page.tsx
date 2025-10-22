"use client"

import { useState, useEffect } from "react"
import { SlideMenu } from "@/components/slide-menu"
import { getReceipts } from "@/lib/storage"
import { exportToCSV } from "@/lib/csv-export"
import type { Receipt } from "@/types/receipt"
import { ScanLine, Download, FileText, Calendar, Clock, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RelatoriosPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isFilterActive, setIsFilterActive] = useState(false)

  useEffect(() => {
    loadReceipts()
  }, [])

  useEffect(() => {
    if (!isFilterActive) {
      setFilteredReceipts(receipts)
    }
  }, [receipts, isFilterActive])

  const loadReceipts = async () => {
    try {
      const data = await getReceipts()
      setReceipts(data)
    } catch (error) {
      console.error("Error loading receipts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilter = () => {
    if (!startDate && !endDate) {
      setFilteredReceipts(receipts)
      setIsFilterActive(false)
      return
    }

    const filtered = receipts.filter((receipt) => {
      const receiptDate = new Date(receipt.timestamp)
      const start = startDate ? new Date(startDate + "T00:00:00") : null
      const end = endDate ? new Date(endDate + "T23:59:59.999") : null

      if (start && receiptDate < start) return false
      if (end && receiptDate > end) return false
      return true
    })

    setFilteredReceipts(filtered)
    setIsFilterActive(true)
  }

  const handleExport = () => {
    exportToCSV(filteredReceipts)
  }

  const clearFilters = () => {
    setStartDate("")
    setEndDate("")
    setFilteredReceipts(receipts)
    setIsFilterActive(false)
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
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Relatórios</h2>
              <p className="text-gray-400">Visualize e exporte seus códigos escaneados</p>
            </div>
            <Button
              onClick={handleExport}
              disabled={filteredReceipts.length === 0}
              className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
            >
              <Download className="w-4 h-4" />
              Exportar CSV ({filteredReceipts.length})
            </Button>
          </div>

          <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-white">Filtrar por Data</h3>
              {isFilterActive && (
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">
                  Filtro ativo
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Data Inicial</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-[#0f1419]/60 border-primary/20 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Data Final</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-[#0f1419]/60 border-primary/20 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={applyFilter} className="w-full gap-2 bg-blue-500 hover:bg-blue-600 text-white">
                  <Search className="w-4 h-4" />
                  Buscar
                </Button>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full border-primary/30 hover:bg-primary/10 bg-transparent"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-[#1a2332]/80 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">
                  {isFilterActive ? "Resultados Encontrados" : "Total de Códigos Armazenados"}
                </p>
                <p className="text-4xl font-bold text-white">{filteredReceipts.length}</p>
                {isFilterActive && receipts.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">de {receipts.length} códigos totais</p>
                )}
              </div>
            </div>
          </div>

          {/* Receipts List */}
          <div className="bg-[#1a2332]/60 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">
              {isFilterActive ? "Códigos Filtrados" : "Códigos Escaneados"}
            </h3>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-gray-400 mt-4">Carregando...</p>
              </div>
            ) : filteredReceipts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  {isFilterActive
                    ? "Nenhum código encontrado para o período selecionado"
                    : "Nenhum código escaneado ainda"}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredReceipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="bg-[#0f1419]/60 border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-gray-300 break-all">{receipt.accessKey}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {receipt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {receipt.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
