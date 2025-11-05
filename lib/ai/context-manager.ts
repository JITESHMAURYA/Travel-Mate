// Context Management Service

import type { AIContext, ConversationMessage } from "./types"

const MAX_MEMORY = 20

export class ContextManager {
  private context: AIContext
  private conversationHistory: ConversationMessage[] = []

  constructor(userId: string) {
    this.context = {
      userId,
      preferences: {
        language: "en",
        currency: "USD",
        travelStyle: "adventure",
      },
      recentInteractions: [],
    }
  }

  getContext(): AIContext {
    return this.context
  }

  updateLocation(lat: number, lng: number): void {
    this.context.currentLocation = { lat, lng }
  }

  setCurrentTrip(trip: AIContext["currentTrip"]): void {
    this.context.currentTrip = trip
  }

  addMessage(role: "user" | "assistant", content: string, intent?: string): void {
    const message: ConversationMessage = {
      role,
      content,
      timestamp: Date.now(),
      intent: intent as any,
    }

    this.conversationHistory.push(message)

    // Keep only recent messages
    if (this.conversationHistory.length > MAX_MEMORY) {
      this.conversationHistory = this.conversationHistory.slice(-MAX_MEMORY)
    }

    this.context.recentInteractions = this.conversationHistory
  }

  getConversationHistory(): ConversationMessage[] {
    return this.conversationHistory
  }

  getContextSummary(): string {
    const trip = this.context.currentTrip
    const location = this.context.currentLocation

    let summary = ""
    if (trip) {
      summary += `Current trip: ${trip.destination} (${trip.startDate} to ${trip.endDate}). Budget: ${trip.currency || this.context.preferences.currency}${trip.budget}. `
    }
    if (location) {
      summary += `Current location: ${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}. `
    }
    summary += `Preferences: ${this.context.preferences.language}, ${this.context.preferences.travelStyle} travel style.`

    return summary
  }

  clearHistory(): void {
    this.conversationHistory = []
    this.context.recentInteractions = []
  }
}
