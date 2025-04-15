import React from "react"
import * as Icons from "lucide-react"

// Create a mapping from string names (lowercase) to actual Lucide components
export const iconMap: { [key: string]: React.ElementType } = {
  droplet: Icons.Droplet,
  dumbbell: Icons.Dumbbell,
  "book-open": Icons.BookOpen,
  coffee: Icons.Coffee,
  heart: Icons.Heart,
  music: Icons.Music,
  penTool: Icons.PenTool,
  smartphone: Icons.Smartphone,
  sun: Icons.Sun,
  zap: Icons.Zap,
  // Add any other icons you might use here (using lowercase keys)
}

// Helper function to get the icon component safely
export const getIconComponent = (iconName?: string): React.ElementType | null => {
  if (!iconName || !iconMap[iconName]) {
    return null
  }
  return iconMap[iconName]
} 