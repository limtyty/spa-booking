"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Clock, Star } from "lucide-react"
import type { Treatment } from "@/lib/types"

interface TreatmentWithStats extends Treatment {
  active_bookings: number
  completed_bookings: number
  total_revenue: number
  popularity_rank: number
}

export default function TreatmentAnalytics() {
  const [treatments, setTreatments] = useState<TreatmentWithStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/treatments")
      const data = await response.json()

      // Calculate additional stats
      const treatmentsWithStats = data.map((treatment: any, index: number) => ({
        ...treatment,
        total_revenue: treatment.price * treatment.completed_bookings,
        popularity_rank: index + 1,
      }))

      // Sort by popularity (completed bookings)
      treatmentsWithStats.sort((a: any, b: any) => b.completed_bookings - a.completed_bookings)

      setTreatments(treatmentsWithStats)
    } catch (error) {
      console.error("Failed to fetch treatment analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalRevenue = treatments.reduce((sum, t) => sum + t.total_revenue, 0)
  const totalBookings = treatments.reduce((sum, t) => sum + t.completed_bookings, 0)
  const mostPopular = treatments[0]

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From completed treatments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">Completed treatments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostPopular?.name || "N/A"}</div>
            <p className="text-xs text-muted-foreground">{mostPopular?.completed_bookings || 0} bookings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Treatment Performance</CardTitle>
          <CardDescription>Ranking by completed bookings and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {treatments.slice(0, 10).map((treatment, index) => {
              const maxBookings = Math.max(...treatments.map((t) => t.completed_bookings))
              const progressValue = maxBookings > 0 ? (treatment.completed_bookings / maxBookings) * 100 : 0

              return (
                <div key={treatment.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="w-8 h-6 flex items-center justify-center text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{treatment.name}</span>
                      {index === 0 && <Star className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{treatment.completed_bookings} bookings</span>
                      <span>${treatment.total_revenue.toFixed(2)}</span>
                    </div>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
