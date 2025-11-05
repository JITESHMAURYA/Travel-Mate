// app/page.tsx
"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import WelcomeScreen from "@/components/welcome-screen"
import HomeScreen from "@/components/home-screen"
import TripsScreen from "@/components/trips-screen"
import AIPlannerScreen from "@/components/ai-planner-screen"
import AIChatInterface from "@/components/ai-chat-interface"
import ExpensesScreen from "@/components/expenses-screen"
import ProfileScreen from "@/components/profile-screen"
import EmergencyContactsScreen from "@/components/emergency-contacts-screen"
import SOSAlertScreen from "@/components/sos-alert-screen"
import BottomNav from "@/components/bottom-nav"
import { initializeAI } from "@/lib/ai/orchestrator"

type MainScreen = "home" | "trips" | "planner" | "chat" | "expenses" | "profile"
type Screen = MainScreen | "welcome" | "emergency-contacts" | "sos"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
    setCurrentScreen("home")
    initializeAI("user-123")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentScreen("welcome")
  }

  if (!isLoggedIn) {
    return <WelcomeScreen onLogin={handleLogin} />
  }

  // Type guard to ensure currentScreen is a MainScreen for BottomNav
  const mainScreen: MainScreen = 
    currentScreen === "welcome" || 
    currentScreen === "emergency-contacts" || 
    currentScreen === "sos" 
      ? "home" 
      : currentScreen

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-y-auto pb-20">
        {currentScreen === "home" && <HomeScreen onNavigate={setCurrentScreen} />}
        {currentScreen === "trips" && <TripsScreen />}
        {currentScreen === "planner" && <AIPlannerScreen />}
        {currentScreen === "chat" && <AIChatInterface />}
        {currentScreen === "expenses" && <ExpensesScreen />}
        {currentScreen === "profile" && <ProfileScreen onLogout={handleLogout} onNavigate={setCurrentScreen} />}
        {currentScreen === "emergency-contacts" && <EmergencyContactsScreen />}
        {currentScreen === "sos" && <SOSAlertScreen />}
      </main>
      <BottomNav currentScreen={mainScreen} onScreenChange={setCurrentScreen} />
    </div>
  )
}
