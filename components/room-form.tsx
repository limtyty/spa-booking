"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Room } from "@/lib/types"

interface RoomFormProps {
  room?: Room
  onSuccess?: () => void
  onCancel?: () => void
}

export default function RoomForm({ room, onSuccess, onCancel }: RoomFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const isEditing = !!room

  const [formData, setFormData] = useState({
    name: room?.name || "",
    capacity: room?.capacity || 1,
    description: room?.description || "",
    status: room?.status || "available",
    maintenance_note: room?.maintenance_note || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEditing ? `/api/rooms/${room.id}` : "/api/rooms"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} room`)
      }

      toast({
        title: "Success",
        description: `Room ${isEditing ? "updated" : "created"} successfully`,
      })

      if (!isEditing) {
        // Reset form for new rooms
        setFormData({
          name: "",
          capacity: 1,
          description: "",
          status: "available",
          maintenance_note: "",
        })
      }

      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} room`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Room" : "New Room"}</CardTitle>
        <CardDescription>{isEditing ? "Update room details" : "Add a new treatment room to your spa"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Serenity Suite"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                max="10"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) || 1 })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the room features and amenities..."
              rows={3}
            />
          </div>

          {formData.status === "maintenance" && (
            <div className="space-y-2">
              <Label htmlFor="maintenance_note">Maintenance Note</Label>
              <Textarea
                id="maintenance_note"
                value={formData.maintenance_note}
                onChange={(e) => setFormData({ ...formData, maintenance_note: e.target.value })}
                placeholder="Describe the maintenance issue or work being done..."
                rows={2}
              />
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Update Room" : "Create Room"}
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
