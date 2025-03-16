import { Router } from "express";
import { Book_slot, cancelBooking, generateQRCode, scanQRCode } from "../controller/booking"

export const Booking_router = Router()

// Booking routes
Booking_router.post("/book", Book_slot)
Booking_router.put("/cancel/:bookingId", cancelBooking)

// QR code routes
Booking_router.get("/qr-code/:bookingId", generateQRCode)
Booking_router.post("/scan-qr", scanQRCode)

