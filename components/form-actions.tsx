"use client"

import { Button } from "@/components/ui/button"
import { Link as LinkIcon, Eraser } from "lucide-react"
import { toast } from "sonner"

export function FormActions() {
  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => toast.success("Link copied to clipboard"),
      () => toast.error("Failed to copy URL to clipboard.")
    )
  }

  const clearForm = () => {
    window.location.href = "/"
    window.location.reload()
  }

  return (
    <div className="flex flex-row justify-center space-x-2">
      <Button variant="outline" onClick={clearForm}>
        <Eraser className="mr-1" />
        Clear Form
      </Button>
      <Button onClick={copyUrlToClipboard} className="max-w-full">
        <LinkIcon className="mr-1" />
        Copy Link
      </Button>
    </div>
  )
}
