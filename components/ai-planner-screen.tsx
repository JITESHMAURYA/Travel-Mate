"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, MapPin, Loader } from "lucide-react"
import { getAI } from "@/lib/ai/orchestrator"

export default function AIPlannerScreen() {
  const [dreamTrip, setDreamTrip] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [itinerary, setItinerary] = useState<any[]>([])
  const [aiResponse, setAiResponse] = useState("")

  const ai = getAI()

  const handleGenerate = async () => {
    if (!dreamTrip.trim()) return

    setIsGenerating(true)
    setAiResponse("")

    try {
      // Use AI orchestrator to process the trip planning request
      const response = await ai.process(dreamTrip)
      setAiResponse(response.message)

      // Simulate itinerary generation
      setTimeout(() => {
        setItinerary([
          {
            day: 1,
            title: "Arrival & City Exploration",
            activities: [
              { time: "10:00 AM", activity: "Arrive at airport", location: "International Airport" },
              { time: "2:00 PM", activity: "Check-in at hotel", location: "Downtown Hotel" },
              { time: "6:00 PM", activity: "Evening walk & dinner", location: "Local Restaurant" },
            ],
          },
          {
            day: 2,
            title: "Cultural Landmarks",
            activities: [
              { time: "9:00 AM", activity: "Visit main monument", location: "City Center" },
              { time: "1:00 PM", activity: "Lunch at local cafe", location: "Cafe District" },
              { time: "4:00 PM", activity: "Museum tour", location: "National Museum" },
            ],
          },
          {
            day: 3,
            title: "Nature & Adventure",
            activities: [
              { time: "8:00 AM", activity: "Hiking excursion", location: "Mountain Trail" },
              { time: "1:00 PM", activity: "Picnic lunch", location: "Scenic Viewpoint" },
              { time: "5:00 PM", activity: "Sunset viewing", location: "Hilltop" },
            ],
          },
        ])
      }, 1500)
    } catch (error) {
      console.error("[v0] Error generating itinerary:", error)
      setAiResponse("Error generating itinerary. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-foreground mb-1">AI Trip Planner</h1>
        <p className="text-muted-foreground">Describe your dream trip</p>
      </div>

      <Card className="p-4 border-0 shadow-md">
        <label className="block text-sm font-medium text-foreground mb-2">Describe your dream trip...</label>
        <Textarea
          placeholder="E.g., A 5-day trip to Paris with museums, cafes, and romantic walks..."
          value={dreamTrip}
          onChange={(e) => setDreamTrip(e.target.value)}
          className="min-h-24 bg-muted/50 border-muted resize-none"
        />
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !dreamTrip.trim()}
          className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 rounded-lg"
        >
          {isGenerating ? (
            <>
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Itinerary
            </>
          )}
        </Button>
      </Card>

      {aiResponse && (
        <Card className="p-4 border-0 shadow-md bg-accent/10">
          <p className="text-sm text-foreground">{aiResponse}</p>
        </Card>
      )}

      {itinerary.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Your Itinerary</h2>
          {itinerary.map((day) => (
            <Card key={day.day} className="p-4 border-0 shadow-md">
              <h3 className="font-bold text-lg text-foreground mb-3">
                Day {day.day}: {day.title}
              </h3>
              <div className="space-y-3">
                {day.activities.map((activity: any, idx: number) => (
                  <div key={idx} className="flex gap-3 pb-3 border-b border-border last:border-0">
                    <div className="text-sm font-semibold text-primary min-w-fit">{activity.time}</div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity.activity}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {activity.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
