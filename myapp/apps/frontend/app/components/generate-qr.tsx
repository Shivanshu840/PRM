"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function QRCodeGenerator({ qrCode, selectedBooking }) {
  if (!qrCode) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-gray-500">Select a booking to generate QR code</p>
      </div>
    )
  }

  const downloadQRCode = () => {
    const link = document.createElement("a")
    link.href = qrCode
    link.download = `booking-qr-${selectedBooking.Booking_ID}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="border p-4 rounded-lg">
        <Image src={qrCode || "/placeholder.svg"} alt="Booking QR Code" width={200} height={200} />
      </div>
      <Button onClick={downloadQRCode}>Download QR Code</Button>
    </div>
  )
}

