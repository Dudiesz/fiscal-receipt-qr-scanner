/**
 * Parses a fiscal receipt URL to extract the Access Key (Chave de Acesso)
 * The Access Key is the numeric sequence between ?p= and the first | character
 * The Access Key MUST be exactly 44 characters long to be valid
 *
 * Example:
 * Input: http://nfe.sefaz.go.gov.br/nfeweb/sites/nfce/danfeNFCe?p=52250861585865210636650030001859571564588879|2|1|2|...
 * Output: 52250861585865210636650030001859571564588879
 */
export function parseAccessKey(url: string): string | null {
  try {
    // Check if the URL contains the ?p= parameter
    const paramIndex = url.indexOf("?p=")
    if (paramIndex === -1) {
      // If no ?p= parameter, assume the entire string is the access key
      // Remove any non-numeric characters
      const cleaned = url.replace(/[^0-9]/g, "")
      return cleaned.length === 44 ? cleaned : null
    }

    // Extract the part after ?p=
    const afterParam = url.substring(paramIndex + 3)

    // Find the first pipe character
    const pipeIndex = afterParam.indexOf("|")

    // Extract the access key
    const accessKey = pipeIndex !== -1 ? afterParam.substring(0, pipeIndex) : afterParam

    // Validate that it's a numeric string
    if (!/^\d+$/.test(accessKey)) {
      return null
    }

    if (accessKey.length !== 44) {
      return null
    }

    return accessKey
  } catch (error) {
    console.error("[v0] Error parsing access key:", error)
    return null
  }
}
