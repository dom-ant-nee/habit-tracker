"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import HabitList from "@/components/habit-list"
import HabitManagement from "@/components/habit-management"
import ContributionGraph from "@/components/contribution-graph"
import DataImportExport from "@/components/data-import-export"
import { Settings, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type Habit = {
  id: string
  name: string
  icon?: string
  color?: string
}

export type CompletionData = {
  [date: string]: string[] // Array of completed habit IDs
}

// Sample initial habits
const initialHabits: Habit[] = [
  { id: "1", name: "Drink Water", icon: "droplet", color: "blue" },
  { id: "2", name: "Exercise", icon: "dumbbell", color: "green" },
  { id: "3", name: "Read", icon: "book-open", color: "purple" },
]

export default function HabitTracker() {
  const { toast } = useToast()
  const [habits, setHabits] = useState<Habit[]>(initialHabits)
  const [completionData, setCompletionData] = useState<CompletionData>({})
  const [isManagementOpen, setIsManagementOpen] = useState(false)
  const [isDataDialogOpen, setIsDataDialogOpen] = useState(false)
  const [lastToggledHabit, setLastToggledHabit] = useState<{ id: string; completed: boolean } | null>(null)
  const today = format(new Date(), "yyyy-MM-dd")

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits")
    const savedCompletionData = localStorage.getItem("completionData")

    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits))
      } catch (e) {
        console.error("Failed to parse saved habits", e)
      }
    }

    if (savedCompletionData) {
      try {
        setCompletionData(JSON.parse(savedCompletionData))
      } catch (e) {
        console.error("Failed to parse saved completion data", e)
      }
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits))
    localStorage.setItem("completionData", JSON.stringify(completionData))
  }, [habits, completionData])

  // Effect to show toast notification after state update
  useEffect(() => {
    if (lastToggledHabit) {
      const { completed } = lastToggledHabit
      toast({
        title: completed ? "Habit completed! 🎉" : "Habit unmarked",
        description: completed ? "Great job on building your habits!" : "Keep going, you can do it!",
        duration: 2000,
      })
      // Reset the state so the toast doesn't show again on subsequent renders
      setLastToggledHabit(null)
    }
  }, [lastToggledHabit, toast]) // Add toast to dependency array

  const toggleHabitCompletion = (habitId: string) => {
    let isCompleted = false
    setCompletionData((prev) => {
      const todayData = prev[today] || []
      const currentlyCompleted = todayData.includes(habitId)
      isCompleted = !currentlyCompleted

      const newTodayData = currentlyCompleted
        ? todayData.filter((id) => id !== habitId)
        : [...todayData, habitId]

      return {
        ...prev,
        [today]: newTodayData,
      }
    })
    setLastToggledHabit({ id: habitId, completed: isCompleted })
  }

  const getTodayCompletions = () => {
    return completionData[today] || []
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Habit Tracker</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setIsDataDialogOpen(true)} className="rounded-full">
            <BarChart2 className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIsManagementOpen(true)} className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <Card className="overflow-hidden border-2 shadow-lg">
        <CardHeader className="bg-primary/5 pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
            <div className="text-sm font-normal bg-primary/10 px-3 py-1 rounded-full">
              {getTodayCompletions().length}/{habits.length} completed
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="today" className="mt-0">
              <HabitList
                habits={habits}
                completedHabits={getTodayCompletions()}
                onToggleHabit={toggleHabitCompletion}
                onOpenManagement={() => setIsManagementOpen(true)}
              />
            </TabsContent>
            <TabsContent value="history" className="mt-0">
              <ContributionGraph completionData={completionData} habits={habits} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <HabitManagement
        habits={habits}
        setHabits={setHabits}
        completionData={completionData}
        setCompletionData={setCompletionData}
        isOpen={isManagementOpen}
        setIsOpen={setIsManagementOpen}
      />

      <DataImportExport
        habits={habits}
        completionData={completionData}
        setHabits={setHabits}
        setCompletionData={setCompletionData}
        isOpen={isDataDialogOpen}
        setIsOpen={setIsDataDialogOpen}
      />
    </div>
  )
}
