'use server' // Mark this file as containing Server Actions

import { revalidatePath } from "next/cache"
import { prisma } from "./prisma"
import type { Habit } from "@prisma/client"
import { format } from 'date-fns'

// --- Habit Actions ---

export async function addHabit(data: Pick<Habit, 'name' | 'icon' | 'color'>) {
  try {
    await prisma.habit.create({
      data: {
        name: data.name,
        icon: data.icon || null, // Ensure null if empty
        color: data.color || null,
      },
    })
    revalidatePath("/") // Revalidate the home page to show the new habit
    return { success: true }
  } catch (error) {
    console.error("Failed to add habit:", error)
    return { success: false, error: "Failed to add habit." }
  }
}

export async function editHabit(id: string, data: Pick<Habit, 'name' | 'icon' | 'color'>) {
  try {
    await prisma.habit.update({
      where: { id },
      data: {
        name: data.name,
        icon: data.icon || null,
        color: data.color || null,
      },
    })
    revalidatePath("/") // Revalidate to show updated habit details
    return { success: true }
  } catch (error) {
    console.error(`Failed to edit habit ${id}:`, error)
    return { success: false, error: "Failed to update habit." }
  }
}

export async function deleteHabit(id: string | null | undefined) {
  if (!id) {
    return { success: false, error: "Invalid ID provided for deletion." }
  }

  try {
    // Prisma schema's onDelete: Cascade handles deleting related Completions
    await prisma.habit.delete({ where: { id } })
    revalidatePath("/") // Revalidate to remove the habit from the list
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete habit ${id}:`, error)
    return { success: false, error: "Failed to delete habit." }
  }
}

// --- Completion Actions ---

export async function toggleCompletion(habitId: string, date: string) {
  try {
    const existingCompletion = await prisma.completion.findUnique({
      where: {
        date_habitId: { date, habitId },
      },
    })

    if (existingCompletion) {
      // If exists, delete it (uncomplete)
      await prisma.completion.delete({
        where: {
          date_habitId: { date, habitId },
        },
      })
    } else {
      // If doesn't exist, create it (complete)
      await prisma.completion.create({
        data: {
          habitId,
          date,
        },
      })
    }

    revalidatePath("/") // Revalidate to update completion status/graph
    return { success: true, completed: !existingCompletion } // Return the new completion status
  } catch (error) {
    console.error(`Failed to toggle completion for habit ${habitId} on ${date}:`, error)
    return { success: false, error: "Failed to update habit completion." }
  }
} 