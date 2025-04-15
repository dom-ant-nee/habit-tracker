"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Habit } from "@/lib/prisma/client"
import HabitItem from "@/components/habit-item"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Props for the HabitList component.
 */
interface HabitListProps {
  /** Array of all habits to potentially display. */
  habits: Habit[]
  /** Array of IDs for habits completed today. */
  completedHabits: string[]
  /** Callback function to open the habit management modal. */
  onOpenManagement: () => void
}

/**
 * Renders the list of habits for the current day.
 * Shows an empty placeholder if no habits exist.
 * Allows filtering completed habits.
 * Note: Habit toggling is now handled within HabitItem via Server Actions.
 * Note: Opening management modal is handled by a parent client component.
 */
export default function HabitList({
  habits,
  completedHabits,
  onOpenManagement,
}: HabitListProps) {
  const [showCompleted, setShowCompleted] = useState(true)

  const filteredHabits = showCompleted ? habits : habits.filter((habit) => !completedHabits.includes(habit.id))

  if (habits.length === 0) {
    return (
      <EmptyPlaceholder
        title="No habits created"
        description="You don't have any habits yet. Add your first habit to get started."
        icon={PlusCircle}
        action={
          <Button variant="outline" className="mt-4" onClick={onOpenManagement} >
            Add your first habit
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <AnimatePresence initial={false}>
          {filteredHabits.map((habit) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HabitItem
                habit={habit}
                isCompleted={completedHabits.includes(habit.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {habits.length > 0 && completedHabits.length > 0 && (
        <Button variant="ghost" size="sm" onClick={() => setShowCompleted(!showCompleted)} className="text-xs w-full">
          {showCompleted ? "Hide completed" : "Show completed"}
        </Button>
      )}
    </div>
  )
}
