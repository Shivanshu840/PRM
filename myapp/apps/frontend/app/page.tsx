import BookingDashboard from "@/components/booking-dashboard"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Booking QR Code System</h1>
      <BookingDashboard />
    </main>
  )
}

