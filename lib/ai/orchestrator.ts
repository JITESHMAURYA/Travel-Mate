// AI Orchestration Service - Main Brain

import { detectIntent } from "./intent-detector"
import { ContextManager } from "./context-manager"
import type { AIResponse, AIContext } from "./types"

export class TravelMateAI {
  private contextManager: ContextManager

  constructor(userId: string) {
    this.contextManager = new ContextManager(userId)
  }

  async process(userInput: string): Promise<AIResponse> {
    const context = this.contextManager.getContext()

    // Detect user intent
    const intentResult = await detectIntent(userInput, context)
    this.contextManager.addMessage("user", userInput, intentResult.type)

    // Route to appropriate handler
    let response: AIResponse

    switch (intentResult.type) {
      case "plan_trip":
        response = await this.handlePlanTrip(intentResult.parameters)
        break
      case "translate_text":
        response = await this.handleTranslate(intentResult.parameters)
        break
      case "recognize_image":
        response = await this.handleImageRecognition(intentResult.parameters)
        break
      case "track_expense":
        response = await this.handleExpense(intentResult.parameters)
        break
      case "find_nearby_place":
        response = await this.handleFindNearby(intentResult.parameters)
        break
      case "adjust_itinerary":
        response = await this.handleAdjustItinerary(intentResult.parameters)
        break
      case "show_alert":
        response = await this.handleAlert(intentResult.parameters)
        break
      case "summarize_trip":
        response = await this.handleSummary(intentResult.parameters)
        break
      default:
        response = await this.handleChat(userInput, context)
    }

    this.contextManager.addMessage("assistant", response.message)
    return response
  }

  private async handlePlanTrip(params: Record<string, any>): Promise<AIResponse> {
    return {
      message: `I'll help you plan a trip to ${params.destination || "your dream destination"}${params.duration ? ` for ${params.duration} days` : ""}. Let me create a personalized itinerary based on your preferences.`,
      action: {
        type: "create_itinerary",
        data: params,
      },
      suggestions: [
        "Add budget constraints",
        "Specify travel style (luxury/budget/adventure)",
        "Include must-see attractions",
      ],
    }
  }

  private async handleTranslate(params: Record<string, any>): Promise<AIResponse> {
    return {
      message: `I'll translate that for you. What language would you like me to translate to? Currently set to ${params.targetLanguage || "English"}.`,
      action: {
        type: "translate",
        data: params,
      },
      requiresUserConfirmation: true,
    }
  }

  private async handleImageRecognition(params: Record<string, any>): Promise<AIResponse> {
    return {
      message:
        "I can help identify landmarks and places in images. Please upload or describe the image you'd like me to analyze.",
      action: {
        type: "analyze_image",
        data: params,
      },
      suggestions: ["Upload a photo of a landmark", "Get location information", "Add to itinerary"],
    }
  }

  private async handleExpense(params: Record<string, any>): Promise<AIResponse> {
    const amount = params.amount || "unknown amount"
    const category = params.category || "general"

    return {
      message: `Logged expense: ${amount} for ${category}. Your trip budget is being tracked.`,
      action: {
        type: "add_expense",
        data: params,
      },
      suggestions: ["View expense breakdown", "Set budget alerts", "Split with friends"],
    }
  }

  private async handleFindNearby(params: Record<string, any>): Promise<AIResponse> {
    const placeType = params.placeType || "places"

    return {
      message: `Finding nearby ${placeType} for you. Based on your current location, here are some recommendations.`,
      action: {
        type: "find_nearby",
        data: params,
      },
      suggestions: ["Show on map", "Get directions", "Add to itinerary"],
    }
  }

  private async handleAdjustItinerary(params: Record<string, any>): Promise<AIResponse> {
    return {
      message: "I can help you adjust your itinerary. What changes would you like to make?",
      action: {
        type: "modify_itinerary",
        data: params,
      },
      requiresUserConfirmation: true,
    }
  }

  private async handleAlert(params: Record<string, any>): Promise<AIResponse> {
    return {
      message:
        "Alert: Check weather conditions and traffic before your next activity. Would you like me to suggest alternatives?",
      action: {
        type: "show_alert",
        data: params,
      },
      suggestions: ["View weather forecast", "Check traffic conditions", "Reschedule activity"],
    }
  }

  private async handleSummary(params: Record<string, any>): Promise<AIResponse> {
    return {
      message: "Here's your trip summary: Total spent, places visited, and highlights from your journey.",
      action: {
        type: "generate_summary",
        data: params,
      },
    }
  }

  private async handleChat(userInput: string, context: AIContext): Promise<AIResponse> {
    const contextSummary = this.contextManager.getContextSummary()

    return {
      message: `I'm your AI travel assistant! ${contextSummary} How can I help you with your trip today?`,
      suggestions: ["Plan a new trip", "Find nearby attractions", "Track expenses", "Adjust itinerary"],
    }
  }

  getContextManager(): ContextManager {
    return this.contextManager
  }
}

// Singleton instance
let aiInstance: TravelMateAI | null = null

export function initializeAI(userId: string): TravelMateAI {
  if (!aiInstance) {
    aiInstance = new TravelMateAI(userId)
  }
  return aiInstance
}

export function getAI(): TravelMateAI {
  if (!aiInstance) {
    aiInstance = new TravelMateAI("default-user")
  }
  return aiInstance
}
