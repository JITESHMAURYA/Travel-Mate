// AI Intent and Context Types

export type AIIntent =
  | "plan_trip"
  | "translate_text"
  | "recognize_image"
  | "track_expense"
  | "find_nearby_place"
  | "adjust_itinerary"
  | "show_alert"
  | "summarize_trip"
  | "chat"

export interface IntentResult {
  type: AIIntent
  confidence: number
  parameters: Record<string, any>
}

export interface AIContext {
  userId: string
  currentLocation?: { lat: number; lng: number }
  currentTrip?: {
    destination: string
    startDate: string
    endDate: string
    budget: number
  }
  preferences: {
    language: string
    currency: string
    travelStyle: "luxury" | "budget" | "adventure" | "cultural"
  }
  recentInteractions: ConversationMessage[]
}

export interface ConversationMessage {
  role: "user" | "assistant"
  content: string
  timestamp: number
  intent?: AIIntent
}

export interface AIResponse {
  message: string
  action?: {
    type: string
    data: any
  }
  suggestions?: string[]
  requiresUserConfirmation?: boolean
}
