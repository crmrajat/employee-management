"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Toaster } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  actionLabel?: string
  action?: () => void
}

export function EmptyState({ icon, title, description, actionLabel, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {actionLabel && action && (
        <Button onClick={action} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

interface ScrollableContentProps {
  children: ReactNode
  maxHeight: string
}

export function ScrollableContent({ children, maxHeight }: ScrollableContentProps) {
  return (
    <ScrollArea className="w-full" style={{ maxHeight }}>
      {children}
    </ScrollArea>
  )
}

export function ToastProvider() {
  return (
    <div suppressHydrationWarning>
      <style jsx global>{`
        .dialog-content {
          display: flex;
          flex-direction: column;
          max-height: 85vh;
        }
        
        .dialog-header {
          flex-shrink: 0;
        }
        
        .dialog-body {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0;
        }
        
        .dialog-footer {
          flex-shrink: 0;
          border-top: 1px solid hsl(var(--border));
          padding-top: 1rem;
          margin-top: auto;
        }

        /* Ensure buttons have proper spacing on mobile */
        @media (max-width: 640px) {
          .dialog-footer button + button,
          .form-buttons button + button {
            margin-top: 0.5rem;
          }
        }

        /* Make tables scrollable on small screens */
        .table-container {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
      <Toaster position="bottom-right" />
    </div>
  )
}

// Scrollable table container
export function TableContainer({ children }: { children: ReactNode }) {
  return <div className="table-container">{children}</div>
}

