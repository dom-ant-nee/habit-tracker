"use client"

import React from "react"

import { useState } from "react"
import type { Habit, CompletionData } from "@/components/habit-tracker"
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
import * as Icons from "lucide-react"

interface HabitManagementProps {
  habits: Habit[]
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
  completionData: CompletionData
  setCompletionData: React.Dispatch<React.SetStateAction<CompletionData>>
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function HabitManagement({ habits, setHabits, completionData, setCompletionData, isOpen, setIsOpen }: HabitManagementProps) {
  const { toast } = useToast()
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({ name: "", icon: "", color: "" })
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [deleteHabitId, setDeleteHabitId] = useState<string | null>(null)

  const iconOptions = [
    "Droplet",
    "Dumbbell",
    "BookOpen",
    "Coffee",
    "Heart",
    "Music",
    "PenTool",
    "Smartphone",
    "Sun",
    "Zap",
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

  const handleAddHabit = () => {
    if (!newHabit.name?.trim()) {
      toast({
        title: "Error",
        description: "Habit name cannot be empty",
        variant: "destructive",
      })
      return
    }

    if (editingHabit) {
      // Update existing habit
      setHabits(
        habits.map((h) =>
          h.id === editingHabit.id
            ? { ...h, name: newHabit.name || h.name, icon: newHabit.icon || h.icon, color: newHabit.color || h.color }
            : h,
        ),
      )
      toast({
        title: "Habit updated",
        description: `"${newHabit.name}" has been updated.`,
      })
    } else {
      // Add new habit
      const habit: Habit = {
        id: Date.now().toString(),
        name: newHabit.name,
        icon: newHabit.icon || undefined,
        color: newHabit.color || undefined,
      }
      setHabits([...habits, habit])
      toast({
        title: "Habit added",
        description: `"${habit.name}" has been added to your habits.`,
      })
    }

    resetForm()
  }

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit)
    setNewHabit({
      name: habit.name,
      icon: habit.icon || "",
      color: habit.color || "",
    })
  }

  const handleDeleteHabit = (id: string) => {
    // Filter out the deleted habit from the habits list
    setHabits(habits.filter((h) => h.id !== id))

    // Remove the deleted habit's ID from completion data for all dates
    setCompletionData((prevData) => {
      const newData = { ...prevData }
      for (const date in newData) {
        if (newData[date].includes(id)) {
          newData[date] = newData[date].filter((habitId) => habitId !== id)
        }
      }
      return newData
    })

    setDeleteHabitId(null)
    toast({
      title: "Habit deleted",
      description: "The habit has been removed from your list.",
    })
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                  {habits.map((habit) => (
                    <Card key={habit.id} className="p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {habit.icon && Icons[habit.icon as keyof typeof Icons] && (
                          <span className={`text-${habit.color || "primary"}`}>
                            {React.createElement(Icons[habit.icon as keyof typeof Icons] as React.ElementType, { size: 16 })}
                          </span>
                        )}
                        <span>{habit.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditHabit(habit)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => setDeleteHabitId(habit.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Add/Edit Form */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{editingHabit ? "Edit Habit" : "Add New Habit"}</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="habit-name">Habit Name</Label>
                  <Input
                    id="habit-name"
                    value={newHabit.name || ""}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    placeholder="e.g., Drink Water"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="habit-icon">Icon (Optional)</Label>
                    <Select
                      value={newHabit.icon || ""}
                      onValueChange={(value) => setNewHabit({ ...newHabit, icon: value })}
                    >
                      <SelectTrigger id="habit-icon">
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            <div className="flex items-center gap-2">
                              {React.createElement(Icons[icon as keyof typeof Icons] as React.ElementType, { size: 16 })}
                              <span>{icon}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="habit-color">Color (Optional)</Label>
                    <Select
                      value={newHabit.color || ""}
                      onValueChange={(value) => setNewHabit({ ...newHabit, color: value })}
                    >
                      <SelectTrigger id="habit-color">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full bg-${color.value}-500`} />
                              <span>{color.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            {editingHabit && (
              <Button variant="ghost" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button onClick={handleAddHabit}>
                {editingHabit ? (
                  "Update Habit"
                ) : (
                  <span className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Add Habit
                  </span>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteHabitId} onOpenChange={() => setDeleteHabitId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this habit and its completion history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteHabitId && handleDeleteHabit(deleteHabitId)}
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
