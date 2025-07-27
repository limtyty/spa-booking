import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

// Update the GET method to include more detailed information
export async function GET() {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        t.*,
        COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as active_bookings,
        COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings
      FROM treatments t
      LEFT JOIN bookings b ON t.id = b.treatment_id
      WHERE t.is_active = TRUE
      GROUP BY t.id
      ORDER BY t.name
    `)
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching treatments:", error)
    return NextResponse.json({ error: "Failed to fetch treatments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, duration_minutes, price } = body

    if (!name || !duration_minutes || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const id = uuidv4()
    await pool.execute(
      "INSERT INTO treatments (id, name, description, duration_minutes, price) VALUES (?, ?, ?, ?, ?)",
      [id, name, description, duration_minutes, price],
    )

    const [rows] = await pool.execute("SELECT * FROM treatments WHERE id = ?", [id])
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating treatment:", error)
    return NextResponse.json({ error: "Failed to create treatment" }, { status: 500 })
  }
}
