// components/profile-screen.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LogOut, Moon, Sun, MapPin, Award, Shield, Edit, Camera, User } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"

type Screen = "home" | "trips" | "planner" | "chat" | "expenses" | "profile" | "emergency-contacts" | "sos"

interface ProfileScreenProps {
  onLogout: () => void
  onNavigate: (screen: Screen) => void
}

export default function ProfileScreen({ onLogout, onNavigate }: ProfileScreenProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [userProfile, setUserProfile] = useState({
    name: "Kushali",
    email: "kushali@example.com",
    phone: "+91 98765 43210",
    bio: "Travel enthusiast exploring the world one trip at a time",
    location: "Mumbai, India"
  })

  const [editForm, setEditForm] = useState(userProfile)

  const travelHistory = [
    { id: 1, destination: "Paris, France", year: 2024, trips: 2 },
    { id: 2, destination: "Tokyo, Japan", year: 2024, trips: 1 },
    { id: 3, destination: "New York, USA", year: 2023, trips: 3 },
    { id: 4, destination: "Barcelona, Spain", year: 2023, trips: 1 },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleEditProfile = () => {
    setUserProfile(editForm)
    setIsEditProfileOpen(false)
  }

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePic(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-primary">{getInitials(userProfile.name)}</span>
                )}
              </div>
              <button
                onClick={handleCameraClick}
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-3 w-3" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-muted-foreground">{userProfile.email}</p>
              <p className="text-sm text-muted-foreground mt-1">{userProfile.location}</p>
            </div>
          </div>
          
          <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleEditProfile} className="flex-1">
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditForm(userProfile)
                      setIsEditProfileOpen(false)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {userProfile.bio && (
          <div className="mb-6 pb-6 border-b">
            <p className="text-sm text-muted-foreground">{userProfile.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Trips</div>
          </div>
          <div>
            <div className="text-2xl font-bold">28</div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </div>
          <div>
            <div className="text-2xl font-bold">4.8</div>
            <div className="text-sm text-muted-foreground">Rating</div>
          </div>
        </div>
      </Card>

      {/* Contact Info Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Phone:</span>
            <span className="font-medium">{userProfile.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium">{userProfile.location}</span>
          </div>
        </div>
      </Card>

      <Button 
        onClick={() => onNavigate("emergency-contacts")} 
        variant="outline" 
        className="w-full"
      >
        <Shield className="mr-2 h-4 w-4" />
        Emergency Contacts
      </Button>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Award className="h-5 w-5" />
          Travel History
        </h2>
        <div className="grid gap-3">
          {travelHistory.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">{item.destination}</div>
                    <div className="text-sm text-muted-foreground">{item.year}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.trips} {item.trips === 1 ? 'trip' : 'trips'}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Button onClick={onLogout} variant="destructive" className="w-full">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  )
}
