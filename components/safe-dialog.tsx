"use client"

import * as React from "react"
import {
  Dialog as ShadcnDialog,
  DialogContent as ShadcnDialogContent,
  DialogDescription as ShadcnDialogDescription,
  DialogHeader as ShadcnDialogHeader,
  DialogTitle as ShadcnDialogTitle,
  DialogTrigger as ShadcnDialogTrigger,
  DialogFooter as ShadcnDialogFooter,
  DialogClose as ShadcnDialogClose,
} from "@/components/ui/dialog"
import { X } from "lucide-react"

interface DialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Dialog({ children, open, onOpenChange }: DialogProps) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <ShadcnDialog open={open} onOpenChange={onOpenChange}>
      {children}
    </ShadcnDialog>
  )
}

export const DialogDescription = ShadcnDialogDescription
export const DialogHeader = ShadcnDialogHeader
export const DialogTitle = ShadcnDialogTitle
export const DialogTrigger = ShadcnDialogTrigger
export const DialogFooter = ShadcnDialogFooter
export const DialogClose = ShadcnDialogClose

// Update the DialogContent component to handle the close button better
// Find the DialogContent component:
// And replace it with:
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof ShadcnDialogContent>,
  React.ComponentPropsWithoutRef<typeof ShadcnDialogContent>
>(({ className, children, ...props }, ref) => (
  <ShadcnDialogContent ref={ref} className={`max-h-[85vh] md:max-h-none flex flex-col ${className}`} {...props}>
    {children}
  </ShadcnDialogContent>
))
DialogContent.displayName = "DialogContent"

// Add a custom DialogClose component that's only visible on mobile
export const MobileDialogClose = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ShadcnDialogClose>) => (
  <ShadcnDialogClose
    className={`absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground md:hidden ${className}`}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </ShadcnDialogClose>
)

