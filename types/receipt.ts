export interface Receipt {
  id: string
  qrData: string // Original URL/QR data
  accessKey: string // Parsed Access Key (Chave de Acesso)
  timestamp: string
  date: string
  time: string
}
