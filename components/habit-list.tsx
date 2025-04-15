"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Habit } from "@/components/habit-tracker"
import HabitItem from "@/components/habit-item"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HabitListProps {
  habits: Habit[]
  completedHabits: string[]
  onToggleHabit: (habitId: string) => void
  onOpenManagement: () => void
}

export default function HabitList({
  habits,
  completedHabits,
  onToggleHabit,
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
          <Button variant="outline" className="mt-4" onClick={onOpenManagement}>
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
                onToggle={() => onToggleHabit(habit.id)}
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
