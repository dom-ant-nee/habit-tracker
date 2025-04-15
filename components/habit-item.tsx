"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import type { Habit } from "@/lib/prisma/client"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { getIconComponent } from "@/lib/icons"
import { toggleCompletion } from "@/lib/actions"
import { format } from 'date-fns'
import { useToast } from "@/hooks/use-toast"

/**
 * Props for the HabitItem component.
 */
interface HabitItemProps {
  /** The habit data object. */
  habit: Habit
  /** Whether the habit is currently marked as completed. */
  isCompleted: boolean
}

/**
 * Renders a single habit item with a checkbox, icon (optional), and name.
 * Handles visual state changes for completion (strikethrough, background).
 * Calls a server action to toggle completion status.
 */
export default function HabitItem({ habit, isCompleted }: HabitItemProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [isAnimating, setIsAnimating] = useState(false)

  // Get the icon component using the helper
  const IconComponent = getIconComponent(habit.icon)

  const handleToggle = () => {
    // We can re-enable animation triggers if desired, but keep state local
    // setIsAnimating(true) 
    // setTimeout(() => setIsAnimating(false), 600)

    startTransition(async () => {
      const today = format(new Date(), "yyyy-MM-dd")
      const result = await toggleCompletion(habit.id, today)

      if (!result?.success) {
        toast({ 
          title: "Error", 
          description: result?.error || "Failed to update habit.", 
          variant: "destructive" 
        })
      } else {
        // Optionally show success toast (already handled by HabitTracker effect, maybe remove that one?)
        // For now, let's rely on the visual change + revalidation.
        // toast({
        //   title: result.completed ? "Habit completed! 🎉" : "Habit unmarked",
        //   duration: 1500
        // })
      }
    })
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
            disabled={isPending}
            className={`h-6 w-6 rounded-full transition-all duration-300 data-[state=checked]:text-primary-foreground data-[state=checked]:bg-primary ${
              habit.color
                ? `data-[state=checked]:border-${habit.color}-500`
                : ""
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
