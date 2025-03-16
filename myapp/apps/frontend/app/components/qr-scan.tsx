"use client"

import { useState, useRef, useCallback } from "react"
import Webcam from "react-webcam"
import jsQR from "jsqr"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Camera, RefreshCw } from "lucide-react"

export default function QRCodeScanner({ onScan, scanResult }) {
  const webcamRef = useRef(null)
  const [scanning, setScanning] = useState(false)
  const [cameraError, setCameraError] = useState(false)

  const capture = useCallback(() => {
    if (!webcamRef.current) return

    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) return

    // Convert data URL to image for QR processing
    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      // Create canvas to process the image
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      canvas.width = image.width
      canvas.height = image.height
      context.drawImage(image, 0, 0, canvas.width, canvas.height)

      // Get image data for QR code detection
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      // Detect QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        // QR code detected
        setScanning(false)
        onScan(code.data)
      }
    }
  }, [onScan])

  // Start scanning loop
  const startScanning = () => {
    setScanning(true)
    scanLoop()
  }

  // Scan continuously until a QR code is found
  const scanLoop = useCallback(() => {
    if (scanning) {
      capture()
      setTimeout(scanLoop, 500) // Scan every 500ms
    }
  }, [scanning, capture])

  // Handle camera errors
  const handleCameraError = () => {
    setCameraError(true)
    setScanning(false)
  }

  // Reset scanner
  const resetScanner = () => {
    setScanning(false)
    setCameraError(false)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {cameraError ? (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Camera Error</AlertTitle>
          <AlertDescription>Unable to access camera. Please check permissions and try again.</AlertDescription>
          <Button onClick={resetScanner} className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </Alert>
      ) : (
        <>
          <div className="relative border rounded-lg overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: "environment",
              }}
              onUserMediaError={handleCameraError}
              className="w-full max-w-md"
            />
            {scanning && (
              <div className="absolute inset-0 border-4 border-blue-500 animate-pulse pointer-events-none"></div>
            )}
          </div>

          {!scanning ? (
            <Button onClick={startScanning}>
              <Camera className="mr-2 h-4 w-4" /> Start Scanning
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setScanning(false)}>
              Stop Scanning
            </Button>
          )}
        </>
      )}

      {scanResult && (
        <Alert variant={scanResult.success ? "default" : "destructive"}>
          {scanResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          <AlertTitle>
            {scanResult.success
              ? `Scan Successful - ${scanResult.scanType === "check-in" ? "Check-In" : "Check-Out"}`
              : "Scan Failed"}
          </AlertTitle>
          <AlertDescription>
            {scanResult.success
              ? `Vehicle ${scanResult.booking?.vehicleNo} has been ${scanResult.scanType === "check-in" ? "checked in" : "checked out"}.`
              : scanResult.error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

