import type { Receipt } from "@/types/receipt"

export function exportToCSV(receipts: Receipt[]): void {
  if (receipts.length === 0) {
    alert("Nenhum registro para exportar")
    return
  }

  const headers = ["Chave de Acesso", "Data", "Hora", "Timestamp"]

  const rows = receipts.map((receipt) => [
    receipt.accessKey, // No quotes - plain text
    receipt.date,
    receipt.time,
    receipt.timestamp,
  ])

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `notas_fiscais_${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
