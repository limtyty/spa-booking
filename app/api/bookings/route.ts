import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const [rows] = await pool.execute(`
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
      GROUP BY b.id
      ORDER BY b.booking_date DESC, b.booking_time DESC
    `)
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      client_name,
      client_email,
      client_phone,
      booking_date,
      booking_time,
      treatment_id,
      room_id,
      personnel_ids,
      notes,
    } = body

    if (!client_name || !client_email || !client_phone || !booking_date || !booking_time || !treatment_id || !room_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const booking_id = uuidv4()

      // Insert booking
      await connection.execute(
        "INSERT INTO bookings (id, client_name, client_email, client_phone, booking_date, booking_time, treatment_id, room_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [booking_id, client_name, client_email, client_phone, booking_date, booking_time, treatment_id, room_id, notes],
      )

      // Insert personnel assignments if provided
      if (personnel_ids && personnel_ids.length > 0) {
        for (const personnel_id of personnel_ids) {
          await connection.execute("INSERT INTO booking_personnel (booking_id, personnel_id) VALUES (?, ?)", [
            booking_id,
            personnel_id,
          ])
        }
      }

      await connection.commit()

      // Fetch the created booking with details
      const [rows] = await connection.execute(
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
        [booking_id],
      )

      return NextResponse.json(rows[0], { status: 201 })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
