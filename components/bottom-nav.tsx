"use client"

import type React from "react"

import { Home, MapPin, Sparkles, MessageCircle, DollarSign, User } from "lucide-react"

type Screen = "home" | "trips" | "planner" | "chat" | "expenses" | "profile"

interface BottomNavProps {
  currentScreen: Screen
  onScreenChange: (screen: Screen) => void
}

export default function BottomNav({ currentScreen, onScreenChange }: BottomNavProps) {
  const navItems: { screen: Screen; icon: React.ReactNode; label: string }[] = [
    { screen: "home", icon: <Home className="w-6 h-6" />, label: "Home" },
    { screen: "trips", icon: <MapPin className="w-6 h-6" />, label: "Trips" },
    { screen: "planner", icon: <Sparkles className="w-6 h-6" />, label: "Planner" },
    { screen: "chat", icon: <MessageCircle className="w-6 h-6" />, label: "Chat" },
    { screen: "expenses", icon: <DollarSign className="w-6 h-6" />, label: "Expenses" },
    { screen: "profile", icon: <User className="w-6 h-6" />, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
      <div className="flex items-center justify-around h-20">
        {navItems.map((item) => (
          <button
            key={item.screen}
            onClick={() => onScreenChange(item.screen)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              currentScreen === item.screen ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
