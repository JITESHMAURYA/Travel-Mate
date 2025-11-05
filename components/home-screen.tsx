// components/home-screen.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Compass, Sparkles, AlertTriangle } from "lucide-react"

// Add the Screen type
type Screen = "home" | "trips" | "planner" | "chat" | "expenses" | "profile" | "emergency-contacts" | "sos"

// Add this interface at the top
interface HomeScreenProps {
  onNavigate: (screen: Screen) => void  // Changed from string to Screen
}

// Update the function signature
export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const upcomingTrips = [
    { id: 1, name: "Paris, France", date: "May 15-22", image: "/paris-eiffel-tower.png" },
    { id: 2, name: "Tokyo, Japan", date: "June 1-10", image: "/tokyo-skyline-night.png" },
    { id: 3, name: "Bali, Indonesia", date: "July 5-15", image: "/bali-beach-sunset.png" },
  ]

  const attractions = [
    { id: 1, name: "Statue of Liberty", location: "New York", rating: 4.8 },
    { id: 2, name: "Big Ben", location: "London", rating: 4.7 },
    { id: 3, name: "Colosseum", location: "Rome", rating: 4.9 },
  ]

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back, Kushali!</h1>
        <p className="text-muted-foreground">Ready for your next trip?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button onClick={() => onNavigate("planner")} className="h-24 flex flex-col gap-2">
          <Sparkles className="h-6 w-6" />
          <div className="text-center">
            <div className="font-semibold">AI Planner</div>
            <div className="text-xs opacity-80">Plan your trip</div>
          </div>
        </Button>
        <Button variant="outline" className="h-24 flex flex-col gap-2">
          <Compass className="h-6 w-6" />
          <div className="text-center">
            <div className="font-semibold">Explore</div>
            <div className="text-xs opacity-80">Find attractions</div>
          </div>
        </Button>
        <Button 
          onClick={() => onNavigate("sos")} 
          variant="destructive" 
          className="h-24 flex flex-col gap-2"
        >
          <AlertTriangle className="h-6 w-6" />
          <div className="text-center">
            <div className="font-semibold">Emergency SOS</div>
            <div className="text-xs opacity-80">Quick access to emergency alerts</div>
          </div>
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Upcoming Trips</h2>
        <div className="grid gap-4">
          {upcomingTrips.map((trip) => (
            <Card key={trip.id} className="p-4 flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{trip.name}</h3>
                <p className="text-sm text-muted-foreground">{trip.date}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Popular Attractions</h2>
        <div className="grid gap-4">
          {attractions.map((attraction) => (
            <Card key={attraction.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{attraction.name}</h3>
                  <p className="text-sm text-muted-foreground">{attraction.location}</p>
                </div>
                <div className="text-sm font-medium">{attraction.rating}⭐</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
