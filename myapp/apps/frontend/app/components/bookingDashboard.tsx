"use client"

import { useState } from "react"
import QRCodeGenerator from "./qr-code-generator"
import QRCodeScanner from "./qr-code-scanner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock booking data
const MOCK_BOOKINGS = [
  {
    Booking_ID: "b1a2c3d4-e5f6-7890-a1b2-c3d4e5f67890",
    From: "Main Street",
    To: "Downtown",
    Date: new Date().toISOString(),
    PType: "Four_Wheeler",
    Vehcile_No: "ABC123",
    Booking_Type: "Parking",
    Booking_Status: "pending",
    User_id: "u1234567",
  },
  {
    Booking_ID: "c2d3e4f5-6789-0123-b2c3-d4e5f678901",
    From: "Airport",
    To: "Hotel Zone",
    Date: new Date().toISOString(),
    PType: "Two_Wheeler",
    Vehcile_No: "XYZ789",
    Booking_Type: "Parking",
    Booking_Status: "pending",
    User_id: "u7654321",
  },
]

export default function BookingDashboard() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [qrCode, setQrCode] = useState("")
  const [scanResult, setScanResult] = useState(null)
  const [activeTab, setActiveTab] = useState("generate")

  // Function to generate QR code
  const generateQRCode = async (bookingId) => {
    try {
      // In a real app, this would call your API
      const response = await fetch(`/api/booking-qr/generate/${bookingId}`)
      const data = await response.json()

      if (data.success) {
        setQrCode(data.qrCode)
        setSelectedBooking(bookings.find((b) => b.Booking_ID === bookingId))
      }
    } catch (error) {
      console.error("Error generating QR code:", error)
      // In a real app, show an error message to the user
    }
  }

  // Function to handle QR code scan result
  const handleScanResult = async (token) => {
    try {
      // In a real app, this would call your API
      const response = await fetch("/api/booking-qr/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()
      setScanResult(data)

      // Update the booking status in our local state
      if (data.success && data.booking) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.Booking_ID === data.booking.id
              ? {
                  ...booking,
                  Booking_Status: data.scanType === "check-in" ? "approved" : "approved",
                  CheckIn: data.scanType === "check-in" ? new Date() : booking.CheckIn,
                  CheckOut: data.scanType === "check-out" ? new Date() : booking.CheckOut,
                }
              : booking,
          ),
        )
      }
    } catch (error) {
      console.error("Error processing scan:", error)
      setScanResult({ error: "Failed to process scan" })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>Select a booking to generate a QR code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.Booking_ID}
                className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => generateQRCode(booking.Booking_ID)}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {booking.From} to {booking.To}
                    </p>
                    <p className="text-sm text-gray-500">Vehicle: {booking.Vehcile_No}</p>
                    <p className="text-sm text-gray-500">Type: {booking.PType}</p>
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        booking.Booking_Status === "approved"
                          ? "bg-green-100 text-green-800"
                          : booking.Booking_Status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.Booking_Status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate QR</TabsTrigger>
            <TabsTrigger value="scan">Scan QR</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
                <CardDescription>
                  {selectedBooking
                    ? `QR code for booking from ${selectedBooking.From} to ${selectedBooking.To}`
                    : "Select a booking to generate QR code"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <QRCodeGenerator qrCode={qrCode} selectedBooking={selectedBooking} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scan">
            <Card>
              <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>Use your camera to scan a booking QR code</CardDescription>
              </CardHeader>
              <CardContent>
                <QRCodeScanner onScan={handleScanResult} scanResult={scanResult} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

