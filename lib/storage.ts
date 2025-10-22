import type { Receipt } from "@/types/receipt"
import { parseAccessKey } from "./parse-access-key"
import { createClient } from "@/lib/supabase/client"

export async function getReceipts(): Promise<Receipt[]> {
  const supabase = createClient()

  console.log("[v0] Fetching receipts from Supabase...")

  const { data, error } = await supabase.from("receipts").select("*").order("data_e_hora_do_scan", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching receipts:", error.message)
    throw error
  }

  console.log("[v0] Successfully fetched", data?.length || 0, "receipts")

  return (
    data?.map((row) => ({
      id: row.identificador,
      qrData: "", // Not stored in new schema
      accessKey: row.chave_de_acesso,
      timestamp: row.data_e_hora_do_scan,
      date: new Date(row.data_e_hora_do_scan).toLocaleDateString("pt-BR"),
      time: new Date(row.data_e_hora_do_scan).toLocaleTimeString("pt-BR"),
    })) || []
  )
}

export async function saveReceipt(qrData: string): Promise<Receipt | null> {
  const supabase = createClient()

  console.log("[v0] Attempting to save receipt...")

  // Parse the Access Key from the QR data
  const accessKey = parseAccessKey(qrData)

  if (!accessKey || accessKey.length !== 44) {
    console.error("[v0] Invalid access key length:", accessKey?.length, "Expected: 44")
    return null
  }

  console.log("[v0] Parsed access key:", accessKey.substring(0, 10) + "...")

  const { data: existing, error: checkError } = await supabase
    .from("receipts")
    .select("identificador")
    .eq("chave_de_acesso", accessKey)
    .maybeSingle()

  if (checkError) {
    console.error("[v0] Error checking for duplicates:", checkError.message)
    throw checkError
  }

  if (existing) {
    console.log("[v0] Duplicate found, not saving")
    return null // Duplicate found
  }

  const { data, error } = await supabase
    .from("receipts")
    .insert({
      chave_de_acesso: accessKey,
      data_e_hora_do_scan: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error saving receipt:", error.message)
    throw error
  }

  console.log("[v0] Receipt saved successfully")

  return {
    id: data.identificador,
    qrData: qrData,
    accessKey: data.chave_de_acesso,
    timestamp: data.data_e_hora_do_scan,
    date: new Date(data.data_e_hora_do_scan).toLocaleDateString("pt-BR"),
    time: new Date(data.data_e_hora_do_scan).toLocaleTimeString("pt-BR"),
  }
}

export async function deleteReceipt(id: string): Promise<void> {
  const supabase = createClient()

  console.log("[v0] Deleting receipt:", id)

  const { error } = await supabase.from("receipts").delete().eq("identificador", id)

  if (error) {
    console.error("[v0] Error deleting receipt:", error.message)
    throw error
  }

  console.log("[v0] Receipt deleted successfully")
}

export async function clearAllReceipts(): Promise<void> {
  const supabase = createClient()

  console.log("[v0] Clearing all receipts...")

  const { error } = await supabase
    .from("receipts")
    .delete()
    .neq("identificador", "00000000-0000-0000-0000-000000000000")

  if (error) {
    console.error("[v0] Error clearing receipts:", error.message)
    throw error
  }

  console.log("[v0] All receipts cleared successfully")
}
