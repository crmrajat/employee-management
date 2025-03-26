"use client"

import { useState } from "react"
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
import { Trash2 } from "lucide-react"
import { toast } from "sonner"

interface DeleteConfirmationProps {
  itemName: string
  itemType: string
  onDelete: () => void
  onUndo?: () => void
  className?: string
  size?: "default" | "icon"
  variant?: "ghost" | "destructive" | "outline" | "default"
}

export function DeleteConfirmation({
  itemName,
  itemType,
  onDelete,
  onUndo,
  className = "",
  size = "icon",
  variant = "ghost",
}: DeleteConfirmationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = () => {
    setIsOpen(false)

    // Execute the delete operation
    onDelete()

    // Show toast with undo option
    if (onUndo) {
      toast(`${itemType} deleted`, {
        description: `"${itemName}" has been removed.`,
        action: {
          label: "Undo",
          onClick: () => {
            onUndo()
            toast.success("Action undone", {
              description: `"${itemName}" has been restored.`,
              className: "toast-success",
            })
          },
        },
        className: "toast-error",
      })
    } else {
      toast.error(`${itemType} deleted`, {
        description: `"${itemName}" has been removed.`,
      })
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`${size === "icon" ? "h-8 w-8 text-destructive" : ""} ${className}`}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
        aria-label={`Delete ${itemName}`}
      >
        {size === "icon" ? <Trash2 className="h-4 w-4" /> : `Delete ${itemType}`}
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {itemType}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemName}"?{" "}
              {onUndo ? "You can undo this action if needed." : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

