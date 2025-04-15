"use client"

import { useState } from "react"
import { format, subDays, eachDayOfInterval, isSameDay } from "date-fns"
import type { Habit, CompletionData } from "@/components/habit-tracker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"

interface ContributionGraphProps {
  completionData: CompletionData
  habits: Habit[]
}

export default function ContributionGraph({ completionData, habits }: ContributionGraphProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Generate dates for the last 16 weeks (112 days)
  const today = new Date()
  const startDate = subDays(today, 111)

  const dates = eachDayOfInterval({
    start: startDate,
    end: today,
  })

  // Group dates by week
  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  dates.forEach((date, index) => {
    currentWeek.push(date)
    if (currentWeek.length === 7 || index === dates.length - 1) {
      weeks.push([...currentWeek])
      currentWeek = []
    }
  })

  // Calculate completion percentage for a date
  const getCompletionPercentage = (date: Date): number => {
    const dateStr = format(date, "yyyy-MM-dd")
    const completed = completionData[dateStr] || []

    if (habits.length === 0) return 0
    return (completed.length / habits.length) * 100
  }

  // Get color based on completion percentage
  const getColorClass = (percentage: number): string => {
    if (percentage === 0) return "bg-muted"
    if (percentage < 25) return "bg-emerald-200 dark:bg-emerald-900"
    if (percentage < 50) return "bg-emerald-300 dark:bg-emerald-800"
    if (percentage < 75) return "bg-emerald-400 dark:bg-emerald-700"
    if (percentage < 100) return "bg-emerald-500 dark:bg-emerald-600"
    return "bg-emerald-600 dark:bg-emerald-500"
  }

  // Get completed habits for a date
  const getCompletedHabits = (date: Date): Habit[] => {
    const dateStr = format(date, "yyyy-MM-dd")
    const completedIds = completionData[dateStr] || []
    return habits.filter((habit) => completedIds.includes(habit.id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-medium">Contribution Graph</div>
          <div className="text-xs text-muted-foreground">Last 16 weeks</div>
        </div>

        <div className="grid grid-flow-col gap-1.5 auto-cols-max">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-flow-row gap-1.5">
              {week.map((date) => {
                const percentage = getCompletionPercentage(date)
                const colorClass = getColorClass(percentage)

                return (
                  <TooltipProvider key={date.toString()} delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`w-5 h-5 rounded-sm ${colorClass} cursor-pointer transition-all hover:scale-125`}
                          onClick={() => setSelectedDate(isSameDay(date, selectedDate || new Date(0)) ? null : date)}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <div className="font-medium">{format(date, "MMM d, yyyy")}</div>
                        <div>
                          {percentage.toFixed(0)}% completed
                          {percentage > 0 && ` (${getCompletedHabits(date).length}/${habits.length})`}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center mt-2 gap-1 text-xs">
          <span className="text-muted-foreground">Less</span>
          <div className="w-4 h-4 rounded-sm bg-muted" />
          <div className="w-4 h-4 rounded-sm bg-emerald-200 dark:bg-emerald-900" />
          <div className="w-4 h-4 rounded-sm bg-emerald-300 dark:bg-emerald-800" />
          <div className="w-4 h-4 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
          <div className="w-4 h-4 rounded-sm bg-emerald-500 dark:bg-emerald-600" />
          <div className="w-4 h-4 rounded-sm bg-emerald-600 dark:bg-emerald-500" />
          <span className="text-muted-foreground">More</span>
        </div>
      </div>

      {selectedDate && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">{format(selectedDate, "MMMM d, yyyy")}</h3>
              <div className="text-xs text-muted-foreground">
                {getCompletedHabits(selectedDate).length}/{habits.length} completed
              </div>
            </div>

            <div className="space-y-2">
              {habits.map((habit) => {
                const isCompleted = getCompletedHabits(selectedDate).some((h) => h.id === habit.id)
                return (
                  <div key={habit.id} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isCompleted ? "bg-primary" : "bg-muted"}`} />
                    <span className={isCompleted ? "text-primary" : "text-muted-foreground"}>{habit.name}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
