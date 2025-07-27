"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, DollarSign } from "lucide-react"
import type { Treatment } from "@/lib/types"

interface TreatmentSelectorProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function TreatmentSelector({
  value,
  onValueChange,
  placeholder = "Select treatment",
  disabled,
}: TreatmentSelectorProps) {
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTreatments()
  }, [])

  const fetchTreatments = async () => {
    try {
      const response = await fetch("/api/treatments")
      const data = await response.json()
      setTreatments(data.filter((t: Treatment) => t.is_active))
    } catch (error) {
      console.error("Failed to fetch treatments:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }
    return `${mins}m`
  }

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading treatments..." />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {treatments.map((treatment) => (
          <SelectItem key={treatment.id} value={treatment.id}>
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                <div className="font-medium">{treatment.name}</div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(treatment.duration_minutes)}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />${treatment.price.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
