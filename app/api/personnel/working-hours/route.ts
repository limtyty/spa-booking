import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const personnelId = searchParams.get("personnel_id")

  try {
    let query = `
      SELECT 
        pwh.*,
        p.name as personnel_name
      FROM personnel_working_hours pwh
      LEFT JOIN personnel p ON pwh.personnel_id = p.id
    `
    let params: any[] = []

    if (personnelId) {
      query += " WHERE pwh.personnel_id = ?"
      params = [personnelId]
    }

    query +=
      " ORDER BY p.name, FIELD(pwh.day_of_week, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')"

    const [rows] = await pool.execute(query, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching working hours:", error)
    return NextResponse.json({ error: "Failed to fetch working hours" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { personnel_id, working_hours } = body

    if (!personnel_id || !working_hours) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // Delete existing working hours for this personnel
      await connection.execute("DELETE FROM personnel_working_hours WHERE personnel_id = ?", [personnel_id])

      // Insert new working hours
      for (const hours of working_hours) {
        await connection.execute(
          "INSERT INTO personnel_working_hours (personnel_id, day_of_week, is_working, start_time, end_time) VALUES (?, ?, ?, ?, ?)",
          [personnel_id, hours.day_of_week, hours.is_working, hours.start_time, hours.end_time],
        )
      }

      await connection.commit()

      // Fetch updated working hours
      const [rows] = await connection.execute(
        "SELECT * FROM personnel_working_hours WHERE personnel_id = ? ORDER BY FIELD(day_of_week, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')",
        [personnel_id],
      )

      return NextResponse.json(rows, { status: 201 })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Error updating working hours:", error)
    return NextResponse.json({ error: "Failed to update working hours" }, { status: 500 })
  }
}
