"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Clock, DollarSign, Edit, Trash2, Plus, Calendar, CheckCircle } from "lucide-react"
import TreatmentForm from "./treatment-form"
import type { Treatment } from "@/lib/types"

interface TreatmentWithStats extends Treatment {
  active_bookings: number
  completed_bookings: number
}

interface TreatmentsListProps {
  refresh?: number
}

export default function TreatmentsList({ refresh }: TreatmentsListProps) {
  const [treatments, setTreatments] = useState<TreatmentWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchTreatments()
  }, [refresh])

  const fetchTreatments = async () => {
    try {
      const response = await fetch("/api/treatments")
      const data = await response.json()
      setTreatments(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load treatments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (treatmentId: string) => {
    try {
      const response = await fetch(`/api/treatments/${treatmentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete treatment")
      }

      toast({
        title: "Success",
        description: "Treatment deactivated successfully",
      })

      fetchTreatments()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate treatment",
        variant: "destructive",
      })
    }
  }

  const handleFormSuccess = () => {
    fetchTreatments()
    setEditingTreatment(null)
    setShowNewForm(false)
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
    return <div className="text-center py-8">Loading treatments...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Treatment Management</h2>
          <p className="text-muted-foreground">Manage your spa treatments and services</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchTreatments} variant="outline">
            Refresh
          </Button>
          <Dialog open={showNewForm} onOpenChange={setShowNewForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Treatment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Treatment</DialogTitle>
              </DialogHeader>
              <TreatmentForm onSuccess={handleFormSuccess} onCancel={() => setShowNewForm(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {treatments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No treatments found</p>
            <Button onClick={() => setShowNewForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Treatment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {treatments.map((treatment) => (
            <Card key={treatment.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{treatment.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {treatment.description || "No description available"}
                    </CardDescription>
                  </div>
                  <Badge variant={treatment.is_active ? "default" : "secondary"}>
                    {treatment.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{formatDuration(treatment.duration_minutes)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">${treatment.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>{treatment.active_bookings} active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{treatment.completed_bookings} completed</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Dialog
                      open={editingTreatment?.id === treatment.id}
                      onOpenChange={(open) => setEditingTreatment(open ? treatment : null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Treatment</DialogTitle>
                        </DialogHeader>
                        <TreatmentForm
                          treatment={editingTreatment}
                          onSuccess={handleFormSuccess}
                          onCancel={() => setEditingTreatment(null)}
                        />
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Deactivate Treatment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to deactivate "{treatment.name}"? This will make it unavailable for
                            new bookings, but existing bookings will remain unchanged.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(treatment.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Deactivate
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Treatment Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{treatments.length}</div>
              <div className="text-sm text-muted-foreground">Total Treatments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{treatments.filter((t) => t.is_active).length}</div>
              <div className="text-sm text-muted-foreground">Active Treatments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {treatments.reduce((sum, t) => sum + t.active_bookings, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Active Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${treatments.reduce((sum, t) => sum + t.price * t.completed_bookings, 0).toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Revenue Generated</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
