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
import { Mail, Phone, Edit, Trash2, Plus, Calendar, User } from "lucide-react"
import StaffForm from "./staff-form"
import WorkingHoursForm from "./working-hours-form"
import type { Personnel } from "@/lib/types"

interface StaffListProps {
  refresh?: number
}

export default function StaffList({ refresh }: StaffListProps) {
  const [staff, setStaff] = useState<Personnel[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStaff, setEditingStaff] = useState<Personnel | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [scheduleStaff, setScheduleStaff] = useState<Personnel | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchStaff()
  }, [refresh])

  const fetchStaff = async () => {
    try {
      const response = await fetch("/api/personnel")
      const data = await response.json()
      setStaff(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load staff",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (staffId: string) => {
    try {
      const response = await fetch(`/api/personnel/${staffId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to deactivate staff member")
      }

      toast({
        title: "Success",
        description: "Staff member deactivated successfully",
      })

      fetchStaff()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate staff member",
        variant: "destructive",
      })
    }
  }

  const handleFormSuccess = () => {
    fetchStaff()
    setEditingStaff(null)
    setShowNewForm(false)
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      "Massage Therapist": "bg-blue-100 text-blue-800",
      Esthetician: "bg-purple-100 text-purple-800",
      "Nail Technician": "bg-pink-100 text-pink-800",
      "Hair Stylist": "bg-green-100 text-green-800",
      "Spa Manager": "bg-orange-100 text-orange-800",
      Receptionist: "bg-gray-100 text-gray-800",
      "Wellness Coach": "bg-teal-100 text-teal-800",
      Aromatherapist: "bg-indigo-100 text-indigo-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return <div className="text-center py-8">Loading staff...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Staff Management</h2>
          <p className="text-muted-foreground">Manage your spa team and schedules</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchStaff} variant="outline">
            Refresh
          </Button>
          <Dialog open={showNewForm} onOpenChange={setShowNewForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>
              <StaffForm onSuccess={handleFormSuccess} onCancel={() => setShowNewForm(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {staff.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No staff members found</p>
            <Button onClick={() => setShowNewForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Staff Member
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <Card key={member.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {member.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                    </CardDescription>
                  </div>
                  <Badge variant={member.is_active ? "default" : "secondary"}>
                    {member.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Dialog
                      open={editingStaff?.id === member.id}
                      onOpenChange={(open) => setEditingStaff(open ? member : null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Staff Member</DialogTitle>
                        </DialogHeader>
                        <StaffForm
                          personnel={editingStaff}
                          onSuccess={handleFormSuccess}
                          onCancel={() => setEditingStaff(null)}
                        />
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={scheduleStaff?.id === member.id}
                      onOpenChange={(open) => setScheduleStaff(open ? member : null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Manage Schedule - {member.name}</DialogTitle>
                        </DialogHeader>
                        <WorkingHoursForm
                          personnel={scheduleStaff}
                          onSuccess={() => setScheduleStaff(null)}
                          onCancel={() => setScheduleStaff(null)}
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
                          <AlertDialogTitle>Deactivate Staff Member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to deactivate "{member.name}"? They will no longer be available for
                            new assignments, but existing bookings will remain unchanged.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(member.id)}
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
          <CardTitle>Staff Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{staff.length}</div>
              <div className="text-sm text-muted-foreground">Total Staff</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{staff.filter((s) => s.is_active).length}</div>
              <div className="text-sm text-muted-foreground">Active Staff</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{new Set(staff.map((s) => s.role)).size}</div>
              <div className="text-sm text-muted-foreground">Different Roles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {staff.filter((s) => s.role === "Massage Therapist").length}
              </div>
              <div className="text-sm text-muted-foreground">Therapists</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
