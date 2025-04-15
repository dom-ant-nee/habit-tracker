import React from "react"
import * as Icons from "lucide-react"

// Create a mapping from string names to actual Lucide components
export const iconMap: { [key: string]: React.ElementType } = {
  Droplet: Icons.Droplet,
  Dumbbell: Icons.Dumbbell,
  BookOpen: Icons.BookOpen,
  Coffee: Icons.Coffee,
  Heart: Icons.Heart,
  Music: Icons.Music,
  PenTool: Icons.PenTool,
  Smartphone: Icons.Smartphone,
  Sun: Icons.Sun,
  Zap: Icons.Zap,
  // Add any other icons you might use here
}

// Helper function to get the icon component safely
export const getIconComponent = (iconName?: string): React.ElementType | null => {
  if (!iconName || !iconMap[iconName]) {
    return null
  }
  return iconMap[iconName]
} 