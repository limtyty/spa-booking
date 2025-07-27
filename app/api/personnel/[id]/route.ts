import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await pool.execute("SELECT * FROM personnel WHERE id = ?", [params.id])
    const personnel = rows as any[]

    if (personnel.length === 0) {
      return NextResponse.json({ error: "Personnel not found" }, { status: 404 })
    }

    return NextResponse.json(personnel[0])
  } catch (error) {
    console.error("Error fetching personnel:", error)
    return NextResponse.json({ error: "Failed to fetch personnel" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, role, email, phone, is_active } = body

    await pool.execute(
      "UPDATE personnel SET name = ?, role = ?, email = ?, phone = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [name, role, email, phone, is_active, params.id],
    )

    const [rows] = await pool.execute("SELECT * FROM personnel WHERE id = ?", [params.id])
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error updating personnel:", error)
    return NextResponse.json({ error: "Failed to update personnel" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await pool.execute("UPDATE personnel SET is_active = FALSE WHERE id = ?", [params.id])
    return NextResponse.json({ message: "Personnel deactivated successfully" })
  } catch (error) {
    console.error("Error deactivating personnel:", error)
    return NextResponse.json({ error: "Failed to deactivate personnel" }, { status: 500 })
  }
}
