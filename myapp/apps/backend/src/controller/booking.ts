import { prisma } from "@repo/db/clients"
import type { BookingTypes } from "../interface"
import QRCode from "qrcode"
import jwt from "jsonwebtoken"

// Secret key for JWT token (store in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export const Book_slot = async (req: any, res: any) => {
  const data: BookingTypes = req.body
  console.log(data)

  try {
    const response = await prisma.booking.create({
      data: {
        From: data.From,
        To: data.To,
        Date: new Date(data.Date),
        PType: data.PType,
        Vehcile_No: data.Vehcile_No,
        User_id: data.User_id,
        Booking_Type: data.Booking_Type,
      },
      select: {
        User_id: true,
        Vehcile_No: true,
        Booking_ID: true,
      },
    })
    console.log(`user ${response.User_id} has booked ${response.Booking_ID}`)
    return res.status(200).json({ msg: "Booking successful" })
  } catch (err) {
    return res.status(402).json({ msg: "error in booking", err })
  }
}

// Generate QR code for a booking
export const generateQRCode = async (req: any, res: any) => {
  try {
    const { bookingId } = req.params

    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { Booking_ID: bookingId },
    })

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    const token = jwt.sign(
      {
        bookingId: booking.Booking_ID,
        vehicleNo: booking.Vehcile_No,
        type: "booking-qr",
      },
      JWT_SECRET,
      { expiresIn: "24h" }, // QR code valid for 24 hours
    )

    // Generate QR code from the token
    const qrCodeDataUrl = await QRCode.toDataURL(token)

    res.json({
      success: true,
      qrCode: qrCodeDataUrl,
      booking: {
        id: booking.Booking_ID,
        from: booking.From,
        to: booking.To,
        date: booking.Date,
        vehicleNo: booking.Vehcile_No,
        status: booking.Booking_Status,
      },
    })
  } catch (error) {
    console.error("QR generation error:", error)
    res.status(500).json({ error: "Failed to generate QR code" })
  }
}

// Handle QR code scan
export const scanQRCode = async (req: any, res: any) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ error: "QR code data is required" })
    }

   
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired QR code" })
    }

    // Check if it's a valid booking QR code
    //@ts-ignore
    if (decoded.type !== "booking-qr") {
      return res.status(400).json({ error: "Invalid QR code type" })
    }
    //@ts-ignore
    const bookingId = decoded.bookingId 

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { Booking_ID: bookingId },
    })

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    // Check if booking is already checked out
    if (booking.CheckOut) {
      return res.status(400).json({
        error: "This booking has already been checked out",
        status: "expired",
      })
    }

    let updateData = {}
    let scanType = ""

    // First scan: Update check-in time
    if (!booking.CheckIn) {
      updateData = {
        CheckIn: new Date(),
        Booking_Status: "approved", // Using the enum value from your schema
      }
      scanType = "check-in"
    }
    // Second scan: Update check-out time
    else {
      updateData = {
        CheckOut: new Date(),
        Booking_Status: "approved", // Keep as approved after checkout
      }
      scanType = "check-out"
    }

    // Update the booking
    const updatedBooking = await prisma.booking.update({
      where: { Booking_ID: bookingId },
      data: updateData,
    })

    res.json({
      success: true,
      scanType,
      booking: {
        id: updatedBooking.Booking_ID,
        checkIn: updatedBooking.CheckIn,
        checkOut: updatedBooking.CheckOut,
        status: updatedBooking.Booking_Status,
        vehicleNo: updatedBooking.Vehcile_No,
      },
    })
  } catch (error) {
    console.error("QR scan error:", error)
    res.status(500).json({ error: "Failed to process QR code scan" })
  }
}

export const cancelBooking = async (req: any, res: any) => {
  try {
    const { bookingId } = req.params

    // Check if booking exists
    const booking = await prisma.booking.findUnique({
      where: { Booking_ID: bookingId },
    })

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    // Check if booking can be cancelled (not checked in yet)
    if (booking.CheckIn) {
      return res.status(400).json({
        error: "Cannot cancel booking after check-in",
      })
    }

    // Update booking status to rejected (using the enum from your schema)
    await prisma.booking.update({
      where: { Booking_ID: bookingId },
      data: {
        Booking_Status: "rejected",
      },
    })

    return res.status(200).json({
      success: true,
      msg: "Booking cancelled successfully",
    })
  } catch (error) {
    console.error("Cancel booking error:", error)
    return res.status(500).json({
      msg: "Error cancelling booking",
      error,
    })
  }
}

