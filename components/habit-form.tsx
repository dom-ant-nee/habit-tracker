"use client"

import React from "react"
import type { Habit } from "@/components/habit-tracker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as Icons from "lucide-react"

// Define props for the HabitForm component
interface HabitFormProps {
  habitData: Partial<Habit>
  setHabitData: React.Dispatch<React.SetStateAction<Partial<Habit>>>
  iconOptions: string[]
  colorOptions: { name: string; value: string }[]
  isEditing: boolean
}

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