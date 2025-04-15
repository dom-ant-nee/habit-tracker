"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Habit } from "@/components/habit-tracker"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { getIconComponent } from "@/lib/icons"

interface HabitItemProps {
  habit: Habit
  isCompleted: boolean
  onToggle: () => void
}

export default function HabitItem({ habit, isCompleted, onToggle }: HabitItemProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  // Get the icon component using the helper
  const IconComponent = getIconComponent(habit.icon)

  const handleToggle = () => {
    // setIsAnimating(true) // Temporarily comment out
    onToggle()
    // Reset animation state after animation completes
    // setTimeout(() => setIsAnimating(false), 600) // Temporarily comment out
  }

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 ${
        isCompleted ? "bg-primary/5 border-primary/20" : "bg-card hover:bg-accent/50"
      }`}
    >
      {isAnimating && !isCompleted && (
        <motion.div
          className="absolute inset-0 bg-primary/10"
          initial={{ scale: 0, opacity: 0.8, x: "50%", y: "50%" }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}

      <div className="p-4 flex items-center gap-4">
        <div className="relative">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={handleToggle}
            className={`h-6 w-6 rounded-full transition-all duration-300 data-[state=checked]:text-primary-foreground data-[state=checked]:bg-primary ${
              habit.color
                ? `data-[state=checked]:border-${habit.color}-500` // Only apply custom border
                : "" // No extra border needed if no color
            }`}
          />
          {isAnimating && isCompleted && (
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              initial={{ scale: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </div>

        <div className="flex items-center gap-3 flex-1">
          {IconComponent && <IconComponent className={`h-5 w-5 ${isCompleted ? "text-primary/50" : "text-primary"}`} />}
          <span className={`text-base ${isCompleted ? "line-through text-muted-foreground" : ""}`}>{habit.name}</span>
        </div>
      </div>
    </Card>
  )
}
