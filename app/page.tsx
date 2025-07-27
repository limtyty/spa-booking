"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookingForm from "@/components/booking-form"
import BookingsList from "@/components/bookings-list"
import { Calendar, Users, Scissors, MapPin } from "lucide-react"
// Add import for TreatmentsList
import TreatmentsList from "@/components/treatments-list"
// Add import for TreatmentAnalytics
import TreatmentAnalytics from "@/components/treatment-analytics"
import StaffList from "@/components/staff-list"
import RoomsList from "@/components/rooms-list"

export default function Home() {
  const [refreshBookings, setRefreshBookings] = useState(0)
  // Add state for treatment refresh
  const [refreshTreatments, setRefreshTreatments] = useState(0)

  const handleBookingSuccess = () => {
    setRefreshBookings((prev) => prev + 1)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Spa Booking Management</h1>
        <p className="text-muted-foreground">Manage your spa bookings, treatments, and staff</p>
      </div>

      <Tabs defaultValue="bookings" className="space-y-6">
        {/* Update the tabs to include analytics */}
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="new-booking" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            New Booking
          </TabsTrigger>
          <TabsTrigger value="treatments" className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            Treatments
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="rooms" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Rooms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <BookingsList refresh={refreshBookings} />
        </TabsContent>

        <TabsContent value="new-booking">
          <BookingForm onSuccess={handleBookingSuccess} />
        </TabsContent>

        {/* Update the treatments TabsContent */}
        <TabsContent value="treatments">
          <TreatmentsList refresh={refreshTreatments} />
        </TabsContent>

        {/* Add the analytics tab content */}
        <TabsContent value="analytics">
          <TreatmentAnalytics />
        </TabsContent>

        <TabsContent value="staff">
          <StaffList refresh={refreshTreatments} />
        </TabsContent>

        <TabsContent value="rooms">
          <RoomsList refresh={refreshTreatments} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
