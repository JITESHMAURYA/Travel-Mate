// components/expenses-screen.tsx
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Plus, TrendingDown, Users, Trash2 } from "lucide-react"

interface Member {
  id: string
  name: string
}

interface Expense {
  id: string
  category: string
  amount: number
  date: string
  description: string
  paidBy: string
  splitBetween: string[]
}

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      category: "Food",
      amount: 450,
      date: "2025-05-15",
      description: "Restaurant & Cafes",
      paidBy: "You",
      splitBetween: ["You", "John"]
    },
    {
      id: "2",
      category: "Transport",
      amount: 200,
      date: "2025-05-16",
      description: "Taxi & Metro",
      paidBy: "You",
      splitBetween: ["You"]
    },
    {
      id: "3",
      category: "Stay",
      amount: 800,
      date: "2025-05-15",
      description: "Hotel 3 nights",
      paidBy: "John",
      splitBetween: ["You", "John", "Sarah"]
    },
  ])

  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "You" },
    { id: "2", name: "John" },
    { id: "3", name: "Sarah" },
  ])

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [newMemberName, setNewMemberName] = useState("")

  // Form state
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    paidBy: "You",
    splitBetween: ["You"] as string[]
  })

  const categories = ["Food", "Transport", "Stay", "Activities", "Shopping", "Others"]

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.category) {
      alert("Please fill all required fields")
      return
    }

    const expense: Expense = {
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
      paidBy: newExpense.paidBy,
      splitBetween: newExpense.splitBetween
    }

    setExpenses([expense, ...expenses])
    setNewExpense({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split('T')[0],
      paidBy: "You",
      splitBetween: ["You"]
    })
    setIsAddExpenseOpen(false)
  }

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      alert("Please enter a member name")
      return
    }

    const member: Member = {
      id: Date.now().toString(),
      name: newMemberName.trim()
    }

    setMembers([...members, member])
    setNewMemberName("")
    setIsAddMemberOpen(false)
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id))
  }

  const handleDeleteMember = (id: string) => {
    const memberToDelete = members.find(m => m.id === id)
    if (memberToDelete?.name === "You") {
      alert("You cannot delete yourself")
      return
    }
    setMembers(members.filter(m => m.id !== id))
  }

  const toggleSplitMember = (memberName: string) => {
    if (newExpense.splitBetween.includes(memberName)) {
      setNewExpense({
        ...newExpense,
        splitBetween: newExpense.splitBetween.filter(m => m !== memberName)
      })
    } else {
      setNewExpense({
        ...newExpense,
        splitBetween: [...newExpense.splitBetween, memberName]
      })
    }
  }

  // Calculate chart data
  const chartData = categories.map(category => {
    const total = expenses
      .filter(exp => exp.category === category)
      .reduce((sum, exp) => sum + exp.amount, 0)
    return {
      name: category,
      value: total,
      color: getCategoryColor(category)
    }
  }).filter(item => item.value > 0)

  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  // Calculate split balances
  const calculateBalances = () => {
    const balances: { [key: string]: number } = {}
    members.forEach(member => {
      balances[member.name] = 0
    })

    expenses.forEach(expense => {
      const shareAmount = expense.amount / expense.splitBetween.length
      expense.splitBetween.forEach(member => {
        if (member !== expense.paidBy) {
          balances[member] -= shareAmount
          balances[expense.paidBy] += shareAmount
        }
      })
    })

    return balances
  }

  const balances = calculateBalances()

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <p className="text-muted-foreground">Track your trip spending</p>
      </div>

      {/* Total Expense Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-4xl font-bold">₹{totalExpense.toFixed(2)}</p>
          </div>
          <TrendingDown className="h-12 w-12 text-primary" />
        </div>

        {/* Pie Chart */}
        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
          <DialogTrigger asChild>
            <Button className="flex-1">
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  placeholder="e.g., Lunch at cafe"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paidBy">Paid By</Label>
                <Select
                  value={newExpense.paidBy}
                  onValueChange={(value) => setNewExpense({ ...newExpense, paidBy: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map(member => (
                      <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Split Between</Label>
                <div className="space-y-2 border rounded-md p-3">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`split-${member.id}`}
                        checked={newExpense.splitBetween.includes(member.name)}
                        onCheckedChange={() => toggleSplitMember(member.name)}
                      />
                      <label
                        htmlFor={`split-${member.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {member.name}
                      </label>
                    </div>
                  ))}
                </div>
                {newExpense.splitBetween.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    ₹{newExpense.amount ? (parseFloat(newExpense.amount) / newExpense.splitBetween.length).toFixed(2) : "0.00"} per person
                  </p>
                )}
              </div>

              <Button onClick={handleAddExpense} className="w-full">
                Add Expense
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <Users className="mr-2 h-4 w-4" />
              Manage Members
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Members</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="memberName">Add New Member</Label>
                <div className="flex gap-2">
                  <Input
                    id="memberName"
                    placeholder="Enter member name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                  />
                  <Button onClick={handleAddMember}>Add</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Members</Label>
                <div className="space-y-2">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-2 border rounded-md">
                      <span className="font-medium">{member.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${balances[member.name] > 0 ? 'text-green-600' : balances[member.name] < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                          {balances[member.name] > 0 ? `+₹${balances[member.name].toFixed(2)}` : 
                           balances[member.name] < 0 ? `-₹${Math.abs(balances[member.name]).toFixed(2)}` : 
                           'Settled'}
                        </span>
                        {member.name !== "You" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Expenses List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Recent Expenses</h2>
        {expenses.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No expenses yet. Add your first expense!
          </Card>
        ) : (
          expenses.map(expense => (
            <Card key={expense.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{expense.description}</h3>
                    <Badge style={{ backgroundColor: getCategoryColor(expense.category) }}>
                      {expense.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{expense.date}</span>
                    <span>•</span>
                    <span>Paid by {expense.paidBy}</span>
                    {expense.splitBetween.length > 1 && (
                      <>
                        <span>•</span>
                        <span>Split: {expense.splitBetween.join(", ")}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{expense.amount}</p>
                    {expense.splitBetween.length > 1 && (
                      <p className="text-xs text-muted-foreground">
                        ₹{(expense.amount / expense.splitBetween.length).toFixed(2)}/person
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    "Food": "#FF6B6B",
    "Transport": "#4ECDC4",
    "Stay": "#95E1D3",
    "Activities": "#FFD93D",
    "Shopping": "#A8E6CF",
    "Others": "#FFE66D"
  }
  return colors[category] || "#999999"
}