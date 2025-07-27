"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import type { Personnel } from "@/lib/types"

interface WorkingHours {
  day_of_week: string
  is_working: boolean
  start_time: string
  end_time: string
}

interface WorkingHoursFormProps {
  personnel: Personnel | null
  onSuccess?: () => void
  onCancel?: () => void
}

const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
]

export default function WorkingHoursForm({ personnel, onSuccess, onCancel }: WorkingHoursFormProps) {
  const [loading, setLoading] = useState(false)
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (personnel) {
      fetchWorkingHours()
    }
  }, [personnel])

  const fetchWorkingHours = async () => {
    if (!personnel) return

    try {
      const response = await fetch(`/api/personnel/working-hours?personnel_id=${personnel.id}`)
      const data = await response.json()

      // Initialize with default hours if none exist
      const existingHours = data.reduce((acc: Record<string, WorkingHours>, hour: any) => {
        acc[hour.day_of_week] = {
          day_of_week: hour.day_of_week,
          is_working: hour.is_working,
          start_time: hour.start_time || "09:00",
          end_time: hour.end_time || "17:00",
        }
        return acc
      }, {})

      const initialHours = DAYS_OF_WEEK.map((day) => ({
        day_of_week: day.key,
        is_working: existingHours[day.key]?.is_working || false,
        start_time: existingHours[day.key]?.start_time || "09:00",
        end_time: existingHours[day.key]?.end_time || "17:00",
      }))

      setWorkingHours(initialHours)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load working hours",
        variant: "destructive",
      })
    }
  }

  const updateWorkingHours = (dayIndex: number, field: keyof WorkingHours, value: any) => {
    const updated = [...workingHours]
    updated[dayIndex] = { ...updated[dayIndex], [field]: value }
    setWorkingHours(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!personnel) return

    setLoading(true)

    try {
      const response = await fetch("/api/personnel/working-hours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personnel_id: personnel.id,
          working_hours: workingHours,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update working hours")
      }

      toast({
        title: "Success",
        description: "Working hours updated successfully",
      })

      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update working hours",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const setAllDays = (isWorking: boolean) => {
    const updated = workingHours.map((hours) => ({
      ...hours,
      is_working: isWorking,
    }))
    setWorkingHours(updated)
  }

  const setStandardHours = () => {
    const updated = workingHours.map((hours, index) => ({
      ...hours,
      is_working: index < 5, // Monday to Friday
      start_time: "09:00",
      end_time: "17:00",
    }))
    setWorkingHours(updated)
  }

  if (!personnel) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Working Hours - {personnel.name}</CardTitle>
        <CardDescription>Set the weekly schedule for this staff member</CardDescription>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setAllDays(true)}>
            Work All Days
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setAllDays(false)}>
            Clear All
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={setStandardHours}>
            Standard Hours
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day, index) => {
              const hours = workingHours[index]
              if (!hours) return null

              return (
                <div key={day.key} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-24">
                    <Label className="font-medium">{day.label}</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={hours.is_working}
                      onCheckedChange={(checked) => updateWorkingHours(index, "is_working", checked)}
                    />
                    <Label className="text-sm">Working</Label>
                  </div>

                  {hours.is_working && (
                    <>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`start-${day.key}`} className="text-sm">
                          From:
                        </Label>
                        <Input
                          id={`start-${day.key}`}
                          type="time"
                          value={hours.start_time}
                          onChange={(e) => updateWorkingHours(index, "start_time", e.target.value)}
                          className="w-32"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor={`end-${day.key}`} className="text-sm">
                          To:
                        </Label>
                        <Input
                          id={`end-${day.key}`}
                          type="time"
                          value={hours.end_time}
                          onChange={(e) => updateWorkingHours(index, "end_time", e.target.value)}
                          className="w-32"
                        />
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update Schedule"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
