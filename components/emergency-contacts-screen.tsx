// components/emergency-contacts-screen.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Phone } from "lucide-react"
import { toast } from "sonner"

interface EmergencyContact {
  id: string
  name: string
  phone: string
}

export default function EmergencyContactsScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])
  const [newName, setNewName] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [isAdding, setIsAdding] = useState(false)

  const addContact = () => {
    if (!newName.trim() || !newPhone.trim()) {
      toast.error("Please enter both name and phone number")
      return
    }

    // Basic phone validation
    const phoneRegex = /^[0-9]{10,}$/
    if (!phoneRegex.test(newPhone.replace(/[\s()-]/g, ''))) {
      toast.error("Please enter a valid phone number")
      return
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newName,
      phone: newPhone,
    }

    setContacts([...contacts, contact])
    setNewName("")
    setNewPhone("")
    setIsAdding(false)
    
    toast.success("Emergency contact added")
  }

  const deleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id))
    toast.success("Contact removed")
  }

  return (
    <div className="p-4 space-y-6">
      <div className="pt-4">
        <h1 className="text-3xl font-bold text-foreground mb-1">
          Emergency Contacts
        </h1>
        <p className="text-muted-foreground">
          Manage contacts for SOS alerts
        </p>
      </div>

      {/* Add Contact Button */}
      {!isAdding && (
        <Button
          onClick={() => setIsAdding(true)}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Emergency Contact
        </Button>
      )}

      {/* Add Contact Form */}
      {isAdding && (
        <Card className="p-4 border-0 shadow-md space-y-3">
          <Input
            placeholder="Contact Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="bg-muted/50"
          />
          <Input
            placeholder="Phone Number"
            type="tel"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            className="bg-muted/50"
          />
          <div className="flex gap-2">
            <Button
              onClick={addContact}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setIsAdding(false)
                setNewName("")
                setNewPhone("")
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Contacts List */}
      <div className="space-y-3">
        {contacts.length === 0 ? (
          <Card className="p-6 border-0 shadow-md text-center">
            <p className="text-muted-foreground">
              No emergency contacts added yet
            </p>
          </Card>
        ) : (
          contacts.map((contact) => (
            <Card key={contact.id} className="p-4 border-0 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {contact.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contact.phone}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteContact(contact.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Emergency Number Info */}
      <Card className="p-4 border-0 shadow-md bg-accent/10">
        <p className="text-sm font-medium text-foreground mb-1">
          No contacts saved?
        </p>
        <p className="text-sm text-muted-foreground">
          If you trigger SOS without contacts, you'll be prompted to call the
          national emergency number (112).
        </p>
      </Card>
    </div>
  )
}