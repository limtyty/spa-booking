import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await pool.execute("SELECT * FROM rooms WHERE id = ?", [params.id])
    const rooms = rows as any[]

    if (rooms.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(rooms[0])
  } catch (error) {
    console.error("Error fetching room:", error)
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, capacity, description, status, maintenance_note } = body

    await pool.execute(
      "UPDATE rooms SET name = ?, capacity = ?, description = ?, status = ?, maintenance_note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [name, capacity, description, status, maintenance_note, params.id],
    )

    const [rows] = await pool.execute("SELECT * FROM rooms WHERE id = ?", [params.id])
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error updating room:", error)
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await pool.execute("UPDATE rooms SET status = ? WHERE id = ?", ["maintenance", params.id])
    return NextResponse.json({ message: "Room set to maintenance successfully" })
  } catch (error) {
    console.error("Error setting room to maintenance:", error)
    return NextResponse.json({ error: "Failed to set room to maintenance" }, { status: 500 })
  }
}
