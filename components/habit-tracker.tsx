import { format } from "date-fns"
import { prisma } from "@/lib/prisma"
import HabitTrackerClient from "./habit-tracker-client"

/**
 * Main Server Component for the Habit Tracker application.
 * Fetches initial data and passes it to the client component for rendering.
 */
export default async function HabitTracker() {
  const today = format(new Date(), "yyyy-MM-dd")

  // Fetch initial data
  const habits = await prisma.habit.findMany()
  const todayCompletions = await prisma.completion.findMany({
    where: { date: today },
    select: { habitId: true },
  })
  const allCompletions = await prisma.completion.findMany()

  // Prepare data for the client component
  const completedHabitIds = new Set(todayCompletions.map(c => c.habitId))
  const formattedCompletionData: { [date: string]: string[] } = {}
  allCompletions.forEach(comp => {
    if (!formattedCompletionData[comp.date]) {
      formattedCompletionData[comp.date] = []
    }
    formattedCompletionData[comp.date].push(comp.habitId)
  })

  // Only render the client component, passing the fetched data
  return (
    <HabitTrackerClient 
      initialHabits={habits}
      initialCompletedHabitIds={completedHabitIds}
      initialFormattedCompletionData={formattedCompletionData}
    />
  )
}
