// Unified AI Chat & Voice Interface

"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Mic, Volume2, Loader } from "lucide-react"
import { getAI } from "@/lib/ai/orchestrator"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export default function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const ai = getAI()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("")
        setInput(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("[v0] Speech recognition error:", event.error)
      }
    }
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await ai.process(input)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Auto-read response
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(response.message)
        window.speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error("[v0] Error processing message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">TravelMate AI Assistant</h2>
              <p className="text-muted-foreground">Ask me anything about your trip!</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <Card
              className={`max-w-xs px-4 py-2 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground border-0"
                  : "bg-muted text-foreground border-0"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </Card>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-muted text-foreground border-0 px-4 py-2">
              <Loader className="w-4 h-4 animate-spin" />
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Ask me about your trip..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-muted border-muted"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleVoiceInput} variant={isListening ? "default" : "outline"} className="flex-1">
            <Mic className="w-4 h-4 mr-2" />
            {isListening ? "Listening..." : "Voice Input"}
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Volume2 className="w-4 h-4 mr-2" />
            Speak
          </Button>
        </div>
      </div>
    </div>
  )
}
