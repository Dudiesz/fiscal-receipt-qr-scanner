-- Add column to store the full QR code text/URL
ALTER TABLE receipts 
ADD COLUMN IF NOT EXISTS texto_completo TEXT;

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_receipts_texto_completo ON receipts(texto_completo);
