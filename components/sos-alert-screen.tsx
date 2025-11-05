// components/sos-alert-screen.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, MapPin, Phone, Loader } from "lucide-react"
import { toast } from "sonner"

interface Location {
  latitude: number
  longitude: number
  accuracy: number
  city?: string
}

export default function SOSAlertScreen() {
  const [isSending, setIsSending] = useState(false)
  const [location, setLocation] = useState<Location | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  
  // Get current location
  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"))
        return
      }

      setIsGettingLocation(true)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }
          setLocation(loc)
          setIsGettingLocation(false)
          resolve(loc)
        },
        (error) => {
          setIsGettingLocation(false)
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    })
  }

  // Get city name from coordinates (reverse geocoding)
  const getCityName = async (lat: number, lon: number): Promise<string> => {
    try {
      // Using OpenStreetMap Nominatim API (free, no key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      )
      const data = await response.json()
      
      return data.address?.city || 
             data.address?.town || 
             data.address?.village || 
             data.address?.state || 
             "Unknown location"
    } catch (error) {
      return "Unknown location"
    }
  }

  // Send SOS Alert
  const sendSOSAlert = async () => {
    setIsSending(true)

    try {
      // Step 1: Get location
      let userLocation: Location
      try {
        userLocation = await getCurrentLocation()
      } catch (error) {
        toast.error("Could not get location. Sending alert without it.")
        userLocation = {
          latitude: 0,
          longitude: 0,
          accuracy: 0,
        }
      }

      // Step 2: Get city name
      if (userLocation.latitude !== 0) {
        const city = await getCityName(
          userLocation.latitude,
          userLocation.longitude
        )
        userLocation.city = city
      }

      // Step 3: Check if we have emergency contacts
      // In real app, you'd get this from storage/database
      const hasContacts = false // Change this based on your contact storage

      if (hasContacts) {
        // Send SMS to contacts
        await sendSMSToContacts(userLocation)
        
        toast.success("SOS alert sent successfully!", {
          description: "Your emergency contacts have been notified.",
        })
      } else {
        // No contacts - prompt to call emergency number
        const shouldCall = window.confirm(
          "No emergency contacts saved. Would you like to call 112 (emergency services)?"
        )
        
        if (shouldCall) {
          window.location.href = "tel:112"
        }
      }
    } catch (error) {
      console.error("SOS Error:", error)
      
      // Check error type for specific messages
      if (!navigator.onLine) {
        toast.error("No network signal. Cannot send SMS alert. Please try calling.", {
          duration: 5000,
        })
      } else {
        toast.error("Failed to send alert. Please try again or call an emergency number directly.", {
          duration: 5000,
        })
      }
    } finally {
      setIsSending(false)
    }
  }

  // Simulate SMS sending (replace with actual SMS API)
  const sendSMSToContacts = async (location: Location) => {
    // In a real app, you would:
    // 1. Use Twilio, AWS SNS, or native SMS API
    // 2. Format the message with location
    // 3. Send to all contacts
    
    const googleMapsLink = `https://maps.google.com/?q=${location.latitude},${location.longitude}`
    
    const message = `🆘 EMERGENCY ALERT
    
I need help! My current location:
${location.city || "Unknown location"}

View on map: ${googleMapsLink}

- Sent from TravelMate`

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("SMS sent:", message)
        resolve(true)
      }, 2000)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Emergency SOS
          </h1>
          <p className="text-muted-foreground">
            Send an alert to your emergency contacts with your location
          </p>
        </div>

        {/* Location Status */}
        {location && (
          <Card className="p-4 border-0 shadow-md bg-white">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Current Location</p>
                <p className="text-xs text-muted-foreground">
                  {location.city || "Detecting..."}
                </p>
              </div>
              {isGettingLocation && (
                <Loader className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </Card>
        )}

        {/* SOS Button */}
        <Card className="p-8 border-0 shadow-lg bg-white">
          <button
            onClick={sendSOSAlert}
            disabled={isSending}
            className="relative w-full aspect-square max-w-[200px] mx-auto"
          >
            <div
              className={`absolute inset-0 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-200 flex items-center justify-center shadow-lg ${
                isSending ? "scale-95 opacity-75" : "hover:scale-105"
              }`}
            >
              {isSending ? (
                <Loader className="w-16 h-16 text-white animate-spin" />
              ) : (
                <span className="text-white text-5xl font-bold">SOS</span>
              )}
            </div>
            
            {/* Pulse animation when not sending */}
            {!isSending && (
              <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20"></div>
            )}
          </button>

          {isSending && (
            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-foreground">
                Sending alert...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Near {location?.city || "detecting location"}
              </p>
              <p className="text-xs text-muted-foreground">
                Alerting your emergency contacts.
              </p>
            </div>
          )}

          {!isSending && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Press and hold to send alert
            </p>
          )}
        </Card>

        {/* Cancel Button */}
        {isSending && (
          <Button
            onClick={() => setIsSending(false)}
            variant="outline"
            className="w-full"
          >
            Cancel Alert
          </Button>
        )}

        {/* Info Cards */}
        <div className="space-y-3">
          <Card className="p-4 border-0 shadow-sm bg-white">
            <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Auto-detects GPS
            </p>
            <p className="text-xs text-muted-foreground">
              Your exact location will be shared via SMS with a map link
            </p>
          </Card>

          <Card className="p-4 border-0 shadow-sm bg-white">
            <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              No contacts saved?
            </p>
            <p className="text-xs text-muted-foreground">
              You'll be prompted to dial the national emergency number (112)
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}