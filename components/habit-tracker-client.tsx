'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import type { Habit } from '@prisma/client'
import HabitManagement from '@/components/habit-management'
import DataImportExport from '@/components/data-import-export'
import HabitList from '@/components/habit-list'
import ContributionGraph from '@/components/contribution-graph'
import { Button } from '@/components/ui/button'
import { Settings, BarChart2 } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HabitTrackerClientProps {
  initialHabits: Habit[]
  initialCompletedHabitIds: Set<string>
  initialFormattedCompletionData: { [date: string]: string[] }
}

/**
 * Client component responsible for managing modal states, rendering modals,
 * rendering interactive UI elements (header buttons, habit list),
 * and coordinating client-side interactions.
 */
export default function HabitTrackerClient({ 
  initialHabits, 
  initialCompletedHabitIds,
  initialFormattedCompletionData
}: HabitTrackerClientProps) {
  const [isManagementOpen, setIsManagementOpen] = useState(false)
  const [isDataDialogOpen, setIsDataDialogOpen] = useState(false)

  // We pass initialHabits to HabitManagement, but it won't update live 
  // within the modal after add/edit without more complex state sharing 
  // or re-fetching within the modal, which might be overkill.
  // The main list updates correctly due to revalidatePath in server actions.

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Habit Tracker</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setIsDataDialogOpen(true)} className="rounded-full" aria-label="Import/Export Data">
            <BarChart2 className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIsManagementOpen(true)} className="rounded-full" aria-label="Manage Habits">
            <Settings className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <Card className="overflow-hidden border-2 shadow-lg">
        <CardHeader className="bg-primary/5 pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
            <div className="text-sm font-normal bg-primary/10 px-3 py-1 rounded-full">
              {initialCompletedHabitIds.size}/{initialHabits.length} completed
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="today" className="mt-0">
              <HabitList
                habits={initialHabits}
                completedHabits={Array.from(initialCompletedHabitIds)}
                onOpenManagement={() => setIsManagementOpen(true)} // Pass handler
              />
            </TabsContent>
            <TabsContent value="history" className="mt-0">
              <ContributionGraph
                completionData={initialFormattedCompletionData}
                habits={initialHabits}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Render the modals */}
      <HabitManagement
        habits={initialHabits} // Pass habits for display list in modal
        isOpen={isManagementOpen}
        setIsOpen={setIsManagementOpen}
      />

      {/* TODO: Decide how to handle DataImportExport */}
       <DataImportExport
        habits={initialHabits} 
        completionData={initialFormattedCompletionData} // Pass formatted data
        setHabits={() => {}} // Not needed with server actions
        setCompletionData={() => {}} // Not needed with server actions
        isOpen={isDataDialogOpen}
        setIsOpen={setIsDataDialogOpen}
      /> 
    </div>
  )
} 