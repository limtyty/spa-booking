export interface Treatment {
  id: string
  name: string
  description?: string
  duration_minutes: number
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Personnel {
  id: string
  name: string
  role: string
  email: string
  phone?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  name: string
  capacity: number
  description?: string
  status: "available" | "maintenance"
  maintenance_note?: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  client_name: string
  client_email: string
  client_phone: string
  booking_date: string
  booking_time: string
  treatment_id: string
  room_id: string
  status: "confirmed" | "cancelled" | "completed" | "no-show"
  notes?: string
  created_at: string
  updated_at: string
  treatment_name?: string
  room_name?: string
  personnel_names?: string
}

export interface BookingWithDetails extends Booking {
  treatment: Treatment
  room: Room
  personnel: Personnel[]
}
