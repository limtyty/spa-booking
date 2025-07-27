import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await pool.execute(
      `
      SELECT 
        b.*,
        t.name as treatment_name,
        r.name as room_name,
        GROUP_CONCAT(p.name SEPARATOR ', ') as personnel_names
      FROM bookings b
      LEFT JOIN treatments t ON b.treatment_id = t.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN booking_personnel bp ON b.id = bp.booking_id
      LEFT JOIN personnel p ON bp.personnel_id = p.id
      WHERE b.id = ?
      GROUP BY b.id
    `,
      [params.id],
    )

    const bookings = rows as any[]

    if (bookings.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(bookings[0])
  } catch (error) {
    console.error("Error fetching booking:", error)
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, notes } = body

    await pool.execute("UPDATE bookings SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [
      status,
      notes,
      params.id,
    ])

    const [rows] = await pool.execute(
      `
      SELECT 
        b.*,
        t.name as treatment_name,
        r.name as room_name,
        GROUP_CONCAT(p.name SEPARATOR ', ') as personnel_names
      FROM bookings b
      LEFT JOIN treatments t ON b.treatment_id = t.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN booking_personnel bp ON b.id = bp.booking_id
      LEFT JOIN personnel p ON bp.personnel_id = p.id
      WHERE b.id = ?
      GROUP BY b.id
    `,
      [params.id],
    )

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error updating booking:", error)
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await pool.execute("UPDATE bookings SET status = ? WHERE id = ?", ["cancelled", params.id])
    return NextResponse.json({ message: "Booking cancelled successfully" })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 })
  }
}
