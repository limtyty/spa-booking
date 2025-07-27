import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [rows] = await pool.execute("SELECT * FROM treatments WHERE id = ?", [params.id])
    const treatments = rows as any[]

    if (treatments.length === 0) {
      return NextResponse.json({ error: "Treatment not found" }, { status: 404 })
    }

    return NextResponse.json(treatments[0])
  } catch (error) {
    console.error("Error fetching treatment:", error)
    return NextResponse.json({ error: "Failed to fetch treatment" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description, duration_minutes, price, is_active } = body

    await pool.execute(
      "UPDATE treatments SET name = ?, description = ?, duration_minutes = ?, price = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [name, description, duration_minutes, price, is_active, params.id],
    )

    const [rows] = await pool.execute("SELECT * FROM treatments WHERE id = ?", [params.id])
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error updating treatment:", error)
    return NextResponse.json({ error: "Failed to update treatment" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await pool.execute("UPDATE treatments SET is_active = FALSE WHERE id = ?", [params.id])
    return NextResponse.json({ message: "Treatment deactivated successfully" })
  } catch (error) {
    console.error("Error deactivating treatment:", error)
    return NextResponse.json({ error: "Failed to deactivate treatment" }, { status: 500 })
  }
}
