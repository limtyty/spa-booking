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
import { MapPin, Users, Edit, Settings, Plus, AlertTriangle } from "lucide-react"
import RoomForm from "./room-form"
import type { Room } from "@/lib/types"

interface RoomsListProps {
  refresh?: number
}

export default function RoomsList({ refresh }: RoomsListProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchRooms()
  }, [refresh])

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/rooms")
      const data = await response.json()
      setRooms(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load rooms",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMaintenance = async (roomId: string) => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to set room to maintenance")
      }

      toast({
        title: "Success",
        description: "Room set to maintenance mode",
      })

      fetchRooms()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set room to maintenance",
        variant: "destructive",
      })
    }
  }

  const handleFormSuccess = () => {
    fetchRooms()
    setEditingRoom(null)
    setShowNewForm(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading rooms...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Room Management</h2>
          <p className="text-muted-foreground">Manage your spa treatment rooms and facilities</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchRooms} variant="outline">
            Refresh
          </Button>
          <Dialog open={showNewForm} onOpenChange={setShowNewForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
              </DialogHeader>
              <RoomForm onSuccess={handleFormSuccess} onCancel={() => setShowNewForm(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {rooms.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No rooms found</p>
            <Button onClick={() => setShowNewForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Room
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {room.name}
                    </CardTitle>
                    <CardDescription className="mt-1">{room.description || "No description available"}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(room.status)}>
                    {room.status === "available" ? "Available" : "Maintenance"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Capacity: {room.capacity} person(s)</span>
                  </div>

                  {room.status === "maintenance" && room.maintenance_note && (
                    <div className="flex items-start gap-2 p-2 bg-red-50 rounded-md">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Maintenance Note:</p>
                        <p className="text-sm text-red-700">{room.maintenance_note}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Dialog
                      open={editingRoom?.id === room.id}
                      onOpenChange={(open) => setEditingRoom(open ? room : null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Room</DialogTitle>
                        </DialogHeader>
                        <RoomForm
                          room={editingRoom}
                          onSuccess={handleFormSuccess}
                          onCancel={() => setEditingRoom(null)}
                        />
                      </DialogContent>
                    </Dialog>

                    {room.status === "available" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-orange-600 hover:text-orange-700 bg-transparent"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Set Room to Maintenance</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to set "{room.name}" to maintenance mode? This will make it
                              unavailable for new bookings.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleMaintenance(room.id)}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              Set to Maintenance
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
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
          <CardTitle>Room Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{rooms.length}</div>
              <div className="text-sm text-muted-foreground">Total Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {rooms.filter((r) => r.status === "available").length}
              </div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {rooms.filter((r) => r.status === "maintenance").length}
              </div>
              <div className="text-sm text-muted-foreground">In Maintenance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{rooms.reduce((sum, r) => sum + r.capacity, 0)}</div>
              <div className="text-sm text-muted-foreground">Total Capacity</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
