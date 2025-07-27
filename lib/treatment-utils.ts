import type { Treatment } from "./types"

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }
  return `${mins}m`
}

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`
}

export const calculateTreatmentRevenue = (treatments: Treatment[], bookingCounts: Record<string, number>): number => {
  return treatments.reduce((total, treatment) => {
    const completedBookings = bookingCounts[treatment.id] || 0
    return total + treatment.price * completedBookings
  }, 0)
}

export const getTreatmentsByPopularity = (treatments: Treatment[], bookingCounts: Record<string, number>) => {
  return treatments
    .map((treatment) => ({
      ...treatment,
      bookingCount: bookingCounts[treatment.id] || 0,
    }))
    .sort((a, b) => b.bookingCount - a.bookingCount)
}

export const validateTreatmentData = (data: Partial<Treatment>): string[] => {
  const errors: string[] = []

  if (!data.name?.trim()) {
    errors.push("Treatment name is required")
  }

  if (!data.duration_minutes || data.duration_minutes < 15) {
    errors.push("Duration must be at least 15 minutes")
  }

  if (!data.price || data.price < 0) {
    errors.push("Price must be greater than 0")
  }

  return errors
}
