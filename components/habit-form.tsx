"use client"

import React from "react"
import type { Habit } from "@/components/habit-tracker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as Icons from "lucide-react"
import { getIconComponent } from "@/lib/icons"

/**
 * Props for the HabitForm component.
 */
interface HabitFormProps {
  /** The current data for the habit being added/edited (can be partial). */
  habitData: Partial<Habit>
  /** Function to update the habit data state in the parent component. */
  setHabitData: React.Dispatch<React.SetStateAction<Partial<Habit>>>
  /** Array of available icon names (lowercase/kebab-case). */
  iconOptions: string[]
  /** Array of available color options. */
  colorOptions: { name: string; value: string }[]
  /** Boolean indicating if the form is in edit mode. */
  isEditing: boolean
}

/**
 * Renders the form fields for adding or editing a habit (name, icon, color).
 */
export default function HabitForm({ habitData, setHabitData, iconOptions, colorOptions, isEditing }: HabitFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{isEditing ? "Edit Habit" : "Add New Habit"}</h3>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="habit-name">Habit Name</Label>
          <Input
            id="habit-name"
            value={habitData.name || ""}
            onChange={(e) => setHabitData({ ...habitData, name: e.target.value })}
            placeholder="e.g., Drink Water"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="habit-icon">Icon (Optional)</Label>
            <Select
              value={habitData.icon || ""}
              onValueChange={(value) => setHabitData({ ...habitData, icon: value === 'none' ? '' : value })}
            >
              <SelectTrigger id="habit-icon">
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {iconOptions.map((icon) => {
                  const IconComponent = getIconComponent(icon)
                  return (
                    <SelectItem key={icon} value={icon}>
                      <div className="flex items-center gap-2">
                        {IconComponent && <IconComponent size={16} />}
                        <span>{icon}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="habit-color">Color (Optional)</Label>
            <Select
              value={habitData.color || ""}
              onValueChange={(value) => setHabitData({ ...habitData, color: value === 'default' ? '' : value })}
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
  )
} 