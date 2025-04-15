import type { Habit } from "@/components/habit-tracker"

/**
 * Default set of habits to populate the tracker if none are found in localStorage.
 */
export const initialHabits: Habit[] = [
  { id: "1", name: "Drink Water", icon: "droplet", color: "blue" },
  { id: "2", name: "Exercise", icon: "dumbbell", color: "green" },
  { id: "3", name: "Read", icon: "book-open", color: "purple" },
]

// Add other constants here if needed in the future 