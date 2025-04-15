"use client"

import type React from "react"

import { useState } from "react"
import type { Habit, CompletionData } from "@/components/habit-tracker"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Download, Upload } from "lucide-react"

interface DataImportExportProps {
  habits: Habit[]
  completionData: CompletionData
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
  setCompletionData: React.Dispatch<React.SetStateAction<CompletionData>>
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DataImportExport({
  habits,
  completionData,
  setHabits,
  setCompletionData,
  isOpen,
  setIsOpen,
}: DataImportExportProps) {
  const { toast } = useToast()
  const [importData, setImportData] = useState("")
  const [importError, setImportError] = useState<string | null>(null)

  const exportData = {
    habits,
    completionData,
    exportDate: new Date().toISOString(),
  }

  const exportDataString = JSON.stringify(exportData, null, 2)

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportDataString)
    toast({
      title: "Copied to clipboard",
      description: "Your habit data has been copied to clipboard.",
    })
  }

  const handleDownload = () => {
    const blob = new Blob([exportDataString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `habit-tracker-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Download started",
      description: "Your habit data is being downloaded.",
    })
  }

  const handleImport = () => {
    setImportError(null)

    try {
      const data = JSON.parse(importData)

      if (!data.habits || !Array.isArray(data.habits)) {
        throw new Error("Invalid data format: habits array is missing")
      }

      if (!data.completionData || typeof data.completionData !== "object") {
        throw new Error("Invalid data format: completionData object is missing")
      }

      // Validate habits structure
      data.habits.forEach((habit: any) => {
        if (!habit.id || !habit.name) {
          throw new Error("Invalid habit data: each habit must have an id and name")
        }
      })

      // Import the data
      setHabits(data.habits)
      setCompletionData(data.completionData)

      toast({
        title: "Data imported successfully",
        description: `Imported ${data.habits.length} habits and completion data.`,
      })

      setImportData("")
      setIsOpen(false)
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Invalid JSON format")
      toast({
        title: "Import failed",
        description: "There was an error importing your data.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import/Export Data</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 py-4">
            <div className="text-sm text-muted-foreground">
              Export your habits and completion history as JSON. You can use this to backup your data or transfer it to
              another device.
            </div>

            <Textarea value={exportDataString} readOnly className="font-mono text-xs h-[200px]" />

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download JSON
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 py-4">
            <div className="text-sm text-muted-foreground">
              Import habits and completion history from a JSON file. This will replace your current data.
            </div>

            {importError && (
              <Alert variant="destructive">
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            )}

            <Textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your JSON data here..."
              className="font-mono text-xs h-[200px]"
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleImport}>
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
