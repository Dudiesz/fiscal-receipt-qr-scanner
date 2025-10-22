"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Camera, CameraOff, QrCode, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QRScannerProps {
  onScan: (data: string) => void
  scannedCount?: number
}

export function QRScanner({ onScan, scannedCount = 0 }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [touchRipples, setTouchRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isInitializedRef = useRef(false)
  const videoStreamRef = useRef<MediaStream | null>(null)
  const scannerContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        const state = scannerRef.current.getState()
        if (state === 2 || state === 3) {
          scannerRef.current.stop().catch(console.error)
        }
      }
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const triggerCameraFocus = async () => {
    if (!videoStreamRef.current) return

    try {
      const videoTrack = videoStreamRef.current.getVideoTracks()[0]
      const capabilities = videoTrack.getCapabilities() as any

      if (capabilities.focusMode && capabilities.focusMode.includes("continuous")) {
        await videoTrack.applyConstraints({
          advanced: [{ focusMode: "continuous" } as any],
        })
      }

      if ("vibrate" in navigator) {
        navigator.vibrate(10)
      }
    } catch (err) {
      console.log("[v0] Focus trigger failed:", err)
    }
  }

  const handleTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isScanning) return

    const rect = scannerContainerRef.current?.getBoundingClientRect()
    if (!rect) return

    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    const rippleId = Date.now()
    setTouchRipples((prev) => [...prev, { id: rippleId, x, y }])

    setTimeout(() => {
      setTouchRipples((prev) => prev.filter((r) => r.id !== rippleId))
    }, 600)

    triggerCameraFocus()
  }

  const startScanning = async () => {
    try {
      setError(null)

      const qrReaderElement = document.getElementById("qr-reader")
      if (!qrReaderElement) {
        throw new Error("Elemento do scanner não encontrado. Tente recarregar a página.")
      }

      if (!scannerRef.current && !isInitializedRef.current) {
        isInitializedRef.current = true
        scannerRef.current = new Html5Qrcode("qr-reader")
      }

      if (scannerRef.current) {
        const state = scannerRef.current.getState()
        if (state === 2) {
          return
        }

        const qrboxSize = Math.min(window.innerWidth * 0.6, 220)

        // Try to start with basic configuration first
        await scannerRef.current.start(
          { facingMode: "environment" },
          {
            fps: 15,
            qrbox: { width: qrboxSize, height: qrboxSize },
            aspectRatio: 1.0,
            disableFlip: false,
          },
          (decodedText) => {
            if ("vibrate" in navigator) {
              navigator.vibrate([50, 30, 50])
            }

            setShowSuccess(true)
            setTimeout(() => {
              setShowSuccess(false)
              onScan(decodedText)
            }, 1500)
          },
          undefined,
        )

        const videoElement = document.querySelector("#qr-reader video") as HTMLVideoElement
        if (videoElement && videoElement.srcObject) {
          videoStreamRef.current = videoElement.srcObject as MediaStream

          // Try to apply advanced constraints if supported
          try {
            const videoTrack = videoStreamRef.current.getVideoTracks()[0]
            const capabilities = videoTrack.getCapabilities() as any

            const constraints: any = { advanced: [] }

            if (capabilities.focusMode && capabilities.focusMode.includes("continuous")) {
              constraints.advanced.push({ focusMode: "continuous" })
            }

            if (capabilities.exposureMode && capabilities.exposureMode.includes("continuous")) {
              constraints.advanced.push({ exposureMode: "continuous" })
            }

            if (capabilities.whiteBalanceMode && capabilities.whiteBalanceMode.includes("continuous")) {
              constraints.advanced.push({ whiteBalanceMode: "continuous" })
            }

            if (constraints.advanced.length > 0) {
              await videoTrack.applyConstraints(constraints)
              console.log("[v0] Advanced camera constraints applied successfully")
            }
          } catch (constraintErr) {
            console.log("[v0] Could not apply advanced constraints, using defaults:", constraintErr)
          }
        }

        setIsScanning(true)
      }
    } catch (startErr: any) {
      console.error("[v0] Scanner error:", startErr)

      let errorMessage = "Falha ao iniciar a câmera."

      if (startErr.message?.includes("Permission")) {
        errorMessage = "Permissão de câmera negada. Por favor, permita o acesso à câmera."
      } else if (startErr.message?.includes("NotFoundError")) {
        errorMessage = "Nenhuma câmera encontrada no dispositivo."
      } else if (startErr.message?.includes("NotReadableError")) {
        errorMessage = "Câmera está sendo usada por outro aplicativo."
      } else if (startErr.message?.includes("elemento")) {
        errorMessage = startErr.message
      } else if (startErr.message) {
        errorMessage = `Erro: ${startErr.message}`
      }

      setError(errorMessage)
      setIsScanning(false)
      isInitializedRef.current = false
      scannerRef.current = null
    }
  }

  const stopScanning = async () => {
    try {
      if (scannerRef.current) {
        const state = scannerRef.current.getState()
        if (state === 2 || state === 3) {
          await scannerRef.current.stop()
        }
        setIsScanning(false)
        videoStreamRef.current = null
      }
    } catch (err) {
      console.error(err)
      setIsScanning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-xs mx-auto px-4 sm:px-0">
        <div className="absolute top-1 left-1 w-8 h-8 sm:w-10 sm:h-10 border-t-4 border-l-4 border-primary rounded-tl-lg pulse-corner z-10" />
        <div className="absolute top-1 right-1 w-8 h-8 sm:w-10 sm:h-10 border-t-4 border-r-4 border-primary rounded-tr-lg pulse-corner z-10" />
        <div className="absolute bottom-1 left-1 w-8 h-8 sm:w-10 sm:h-10 border-b-4 border-l-4 border-primary rounded-bl-lg pulse-corner z-10" />
        <div className="absolute bottom-1 right-1 w-8 h-8 sm:w-10 sm:h-10 border-b-4 border-r-4 border-primary rounded-br-lg pulse-corner z-10" />

        <div
          ref={scannerContainerRef}
          onTouchStart={handleTouch}
          className={`relative rounded-lg overflow-hidden card-gradient border-2 transition-all duration-300 aspect-square ${
            isScanning
              ? "border-primary pulse-glow shadow-lg shadow-primary/20 cursor-pointer active:scale-[0.98]"
              : "border-border/50"
          }`}
        >
          <div id="qr-reader" className="w-full h-full" />

          {touchRipples.map((ripple) => (
            <div
              key={ripple.id}
              className="absolute pointer-events-none z-30"
              style={{
                left: ripple.x,
                top: ripple.y,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="w-4 h-4 rounded-full bg-primary/40 animate-ping" />
              <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/60 animate-pulse" />
            </div>
          ))}

          {isScanning && (
            <>
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent scan-line-animation z-10 opacity-80" />
              <div className="absolute bottom-4 left-0 right-0 text-center z-10 animate-in fade-in duration-1000 delay-500">
                <p className="text-xs text-primary-foreground/80 bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                  Toque para focar
                </p>
              </div>
            </>
          )}

          {showSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-success/20 backdrop-blur-sm z-20 animate-in fade-in duration-300">
              <div className="relative">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-success/30"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset="283"
                    className="text-success animate-draw-circle"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-50 duration-500 delay-700">
                  <CheckCircle2 className="w-16 h-16 text-success drop-shadow-lg" strokeWidth={2.5} />
                </div>
              </div>
              <div className="absolute bottom-8 left-0 right-0 text-center animate-in slide-in-from-bottom-4 duration-500 delay-500">
                <p className="text-lg font-bold text-success drop-shadow-lg">Código Lido com Sucesso!</p>
              </div>
            </div>
          )}

          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <div className="text-center space-y-3">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center transform hover:scale-105 transition-transform">
                    <QrCode className="w-10 h-10 text-primary" strokeWidth={2.5} />
                  </div>
                  {scannedCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full min-w-[2rem] h-8 px-2 flex items-center justify-center text-xs font-bold shadow-lg shadow-primary/30 animate-in zoom-in-50 duration-200">
                      {scannedCount}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {scannedCount === 0
                      ? "Aguardando leitura..."
                      : `${scannedCount} código${scannedCount !== 1 ? "s" : ""} armazenado${scannedCount !== 1 ? "s" : ""}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {scannedCount === 0 ? "Inicie a câmera para começar" : "Pronto para escanear mais"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="text-destructive-foreground text-sm text-center bg-destructive/10 border border-destructive/30 rounded-lg p-4 animate-in slide-in-from-top-2 duration-200">
          {error}
        </div>
      )}

      <div className="flex justify-center gap-3">
        {!isScanning ? (
          <Button
            onClick={startScanning}
            size="lg"
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:shadow-xl hover:shadow-primary/40 hover:scale-105 font-semibold"
          >
            <Camera className="w-5 h-5" />
            Iniciar Leitura
          </Button>
        ) : (
          <Button
            onClick={stopScanning}
            variant="destructive"
            size="lg"
            className="gap-2 transition-all hover:scale-105 font-semibold"
          >
            <CameraOff className="w-5 h-5" />
            Parar Leitura
          </Button>
        )}
      </div>
    </div>
  )
}
