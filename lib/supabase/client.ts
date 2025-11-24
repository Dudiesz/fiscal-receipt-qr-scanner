import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[v0] Supabase URL:", supabaseUrl ? "✓" : "✗")
    console.error("[v0] Supabase Anon Key:", supabaseAnonKey ? "✓" : "✗")
    throw new Error(
      "Variáveis de ambiente do Supabase não configuradas. " +
        "Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY nas variáveis de ambiente do projeto.",
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
