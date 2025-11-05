"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Calendar, MapPin } from "lucide-react"

export default function TripsScreen() {
  const trips = [
    {
      id: 1,
      name: "Paris Adventure",
      destination: "Paris, France",
      startDate: "2025-05-15",
      endDate: "2025-05-22",
      status: "Upcoming",
      image: "/paris-eiffel-tower.png",
    },
    {
      id: 2,
      name: "Tokyo Exploration",
      destination: "Tokyo, Japan",
      startDate: "2025-06-01",
      endDate: "2025-06-10",
      status: "Planning",
      image: "/vibrant-tokyo-street.png",
    },
    {
      id: 3,
      name: "Bali Getaway",
      destination: "Bali, Indonesia",
      startDate: "2025-07-05",
      endDate: "2025-07-15",
      status: "Upcoming",
      image: "/bali-beach.png",
    },
  ]

  return (
    <div className="p-4 space-y-6">
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-foreground mb-1">My Trips</h1>
        <p className="text-muted-foreground">Manage all your travel plans</p>
      </div>

      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg">
        <Plus className="w-5 h-5 mr-2" />
        Create New Trip
      </Button>

      <div className="space-y-3">
        {trips.map((trip) => (
          <Card key={trip.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition cursor-pointer">
            <img src={trip.image || "/placeholder.svg"} alt={trip.name} className="w-full h-32 object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg text-foreground">{trip.name}</h3>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary">
                  {trip.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                <MapPin className="w-4 h-4" />
                {trip.destination}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {trip.startDate} to {trip.endDate}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
