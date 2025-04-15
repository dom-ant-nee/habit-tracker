"use client"

import React from "react"
import { useState, useTransition } from "react"
import type { Habit } from "@prisma/client"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Edit, Trash2, Plus } from "lucide-react"
import { getIconComponent } from "@/lib/icons"
import HabitForm from "./habit-form"
import { addHabit, editHabit, deleteHabit } from "@/lib/actions"

/**
 * Props for the HabitManagement component.
 */
interface HabitManagementProps {
  /** Array of habits to display in the list (read-only in this context). */
  habits: Habit[]
  /** State controlling the visibility of the management dialog. */
  isOpen: boolean
  /** Function to update the visibility state of the management dialog. */
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * Component responsible for rendering the habit management dialog.
 * Allows users to view, add, edit, and delete habits.
 * Uses Server Actions for mutations.
 */
export default function HabitManagement({
  habits,
  isOpen,
  setIsOpen,
}: HabitManagementProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({ name: "", icon: "", color: "" })
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [deleteHabitId, setDeleteHabitId] = useState<string | null>(null)

  const iconOptions = [
    "droplet",
    "dumbbell",
    "book-open",
    "coffee",
    "heart",
    "music",
    "penTool",
    "smartphone",
    "sun",
    "zap",
  ]

  const colorOptions = [
    { name: "Blue", value: "blue" },
    { name: "Green", value: "green" },
    { name: "Purple", value: "purple" },
    { name: "Red", value: "red" },
    { name: "Yellow", value: "yellow" },
    { name: "Pink", value: "pink" },
    { name: "Orange", value: "orange" },
    { name: "Teal", value: "teal" },
  ]

  const resetForm = () => {
    setNewHabit({ name: "", icon: "", color: "" })
    setEditingHabit(null)
  }

  const handleAddOrEditHabit = () => {
    if (!newHabit.name?.trim()) {
      toast({
        title: "Error",
        description: "Habit name cannot be empty",
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      let result
      const habitData = {
        name: newHabit.name || "",
        icon: newHabit.icon || null,
        color: newHabit.color || null,
      }

      if (editingHabit) {
        result = await editHabit(editingHabit.id, habitData)
        if (result?.success) {
          toast({
            title: "Habit updated",
            description: `"${habitData.name}" has been updated.`,
          })
          setIsOpen(false)
        } else {
          toast({
            title: "Error updating habit",
            description: result?.error || "An unknown error occurred.",
            variant: "destructive",
          })
        }
      } else {
        result = await addHabit(habitData)
        if (result?.success) {
          toast({
            title: "Habit added",
            description: `"${habitData.name}" has been added to your habits.`,
          })
        } else {
          toast({
            title: "Error adding habit",
            description: result?.error || "An unknown error occurred.",
            variant: "destructive",
          })
        }
      }
      if (!editingHabit && result?.success) {
         resetForm()
      } else if (editingHabit) {
         resetForm()
      }
    })
  }

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit)
    setNewHabit({
      name: habit.name,
      icon: habit.icon || "",
      color: habit.color || "",
    })
  }

  const handleDeleteConfirmation = () => {
    startTransition(async () => {
      if (!deleteHabitId) {
        console.error("Delete attempted with null ID");
        toast({ title: "Error", description: "Invalid habit ID.", variant: "destructive" });
        return;
      }
      const result = await deleteHabit(deleteHabitId as string)
      if (result?.success) {
        toast({
          title: "Habit deleted",
          description: "The habit has been removed from your list.",
        })
        setDeleteHabitId(null)
      } else {
        toast({
          title: "Error deleting habit",
          description: result?.error || "An unknown error occurred.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Habits</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Habit List */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Your Habits</h3>
              {habits.length === 0 ? (
                <p className="text-sm text-muted-foreground">No habits yet. Add your first habit below.</p>
              ) : (
                <div className="grid gap-2">
                  {habits.map((habit) => {
                    const IconComponent = getIconComponent(habit.icon)
                    return (
                      <Card key={habit.id} className="p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {IconComponent && (
                            <span className={`text-${habit.color || "primary"}`}>
                              <IconComponent size={16} />
                            </span>
                          )}
                          <span>{habit.name}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditHabit(habit)}
                            aria-label={`Edit ${habit.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setDeleteHabitId(habit.id)}
                            aria-label={`Delete ${habit.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Add/Edit Form */}
            <HabitForm
              habitData={newHabit}
              setHabitData={setNewHabit}
              iconOptions={iconOptions}
              colorOptions={colorOptions}
              isEditing={!!editingHabit}
            />
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            {editingHabit && (
              <Button variant="ghost" onClick={resetForm} disabled={isPending}>
                Cancel Edit
              </Button>
            )}
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline" disabled={isPending}>Close</Button>
              </DialogClose>
              <Button onClick={handleAddOrEditHabit} disabled={isPending}>
                {isPending ? "Saving..." : (editingHabit ? "Update Habit" : 
                  <span className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add Habit
                  </span>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteHabitId} onOpenChange={(open) => !open && setDeleteHabitId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this habit and its completion history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirmation}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
