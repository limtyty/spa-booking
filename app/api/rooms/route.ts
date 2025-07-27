import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const [rows] = await pool.execute("SELECT * FROM rooms ORDER BY name")
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, capacity, description, status } = body

    if (!name || !capacity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const id = uuidv4()
    await pool.execute("INSERT INTO rooms (id, name, capacity, description, status) VALUES (?, ?, ?, ?, ?)", [
      id,
      name,
      capacity,
      description,
      status || "available",
    ])

    const [rows] = await pool.execute("SELECT * FROM rooms WHERE id = ?", [id])
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}
