// Intent Detection Service

import type { AIIntent, IntentResult, AIContext } from "./types"

const intentKeywords: Record<AIIntent, string[]> = {
  plan_trip: ["plan", "trip", "itinerary", "create", "organize", "schedule", "days"],
  translate_text: ["translate", "what does", "meaning", "language", "spell"],
  recognize_image: ["what is", "identify", "recognize", "where", "landmark", "monument"],
  track_expense: ["expense", "cost", "price", "spent", "budget", "money"],
  find_nearby_place: ["nearby", "close", "restaurant", "hotel", "attraction", "around"],
  adjust_itinerary: ["change", "modify", "update", "reschedule", "move", "swap"],
  show_alert: ["alert", "warning", "danger", "weather", "traffic", "delay"],
  summarize_trip: ["summary", "recap", "total", "spent", "visited", "overview"],
  chat: ["hello", "hi", "how", "tell", "what", "why", "when"],
}

export async function detectIntent(input: string, context: AIContext): Promise<IntentResult> {
  const lowerInput = input.toLowerCase()
  const scores: Record<AIIntent, number> = {} as Record<AIIntent, number>

  // Score each intent based on keyword matches
  Object.entries(intentKeywords).forEach(([intent, keywords]) => {
    const matches = keywords.filter((keyword) => lowerInput.includes(keyword)).length
    scores[intent as AIIntent] = matches
  })

  // Find the highest scoring intent
  const topIntent = Object.entries(scores).sort(([, a], [, b]) => b - a)[0]
  const [intent, score] = topIntent || ["chat", 0]

  // Calculate confidence (0-1)
  const maxScore = Math.max(...Object.values(scores))
  const confidence = maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.5

  // Extract parameters based on intent
  const parameters = extractParameters(input, intent as AIIntent, context)

  return {
    type: intent as AIIntent,
    confidence: confidence,
    parameters,
  }
}

function extractParameters(input: string, intent: AIIntent, context: AIContext): Record<string, any> {
  const params: Record<string, any> = {}

  switch (intent) {
    case "plan_trip":
      params.description = input
      params.destination = extractDestination(input)
      params.duration = extractDuration(input)
      break
    case "track_expense":
      params.amount = extractAmount(input)
      params.category = extractCategory(input)
      params.description = input
      break
    case "find_nearby_place":
      params.placeType = extractPlaceType(input)
      params.location = context.currentLocation
      break
    case "adjust_itinerary":
      params.change = input
      params.currentTrip = context.currentTrip
      break
  }

  return params
}

function extractDestination(input: string): string | null {
  const match = input.match(/to\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/)
  return match ? match[1] : null
}

function extractDuration(input: string): number | null {
  const match = input.match(/(\d+)\s*(?:day|week|night)/)
  return match ? Number.parseInt(match[1]) : null
}

function extractAmount(input: string): number | null {
  const match = input.match(/\$?(\d+(?:\.\d{2})?)/i)
  return match ? Number.parseFloat(match[1]) : null
}

function extractCategory(input: string): string {
  const categories = ["food", "transport", "accommodation", "activity", "shopping"]
  for (const cat of categories) {
    if (input.toLowerCase().includes(cat)) return cat
  }
  return "other"
}

function extractPlaceType(input: string): string {
  const types = ["restaurant", "hotel", "cafe", "museum", "park", "attraction"]
  for (const type of types) {
    if (input.toLowerCase().includes(type)) return type
  }
  return "place"
}
