import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const [rows] = await pool.execute("SELECT * FROM personnel WHERE is_active = TRUE ORDER BY name")
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching personnel:", error)
    return NextResponse.json({ error: "Failed to fetch personnel" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, role, email, phone } = body

    if (!name || !role || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const id = uuidv4()
    await pool.execute("INSERT INTO personnel (id, name, role, email, phone) VALUES (?, ?, ?, ?, ?)", [
      id,
      name,
      role,
      email,
      phone,
    ])

    const [rows] = await pool.execute("SELECT * FROM personnel WHERE id = ?", [id])
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating personnel:", error)
    return NextResponse.json({ error: "Failed to create personnel" }, { status: 500 })
  }
}
