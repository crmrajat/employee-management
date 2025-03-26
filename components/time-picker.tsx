"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  date: Date
  setDate: (date: Date) => void
  className?: string
}

export function TimePicker({ date, setDate, className }: TimePickerProps) {
  // Initialize state from props, but only once
  const [hour, setHour] = useState<number>(() => {
    return date ? date.getHours() % 12 || 12 : 12
  })
  const [minute, setMinute] = useState<number>(() => {
    return date ? date.getMinutes() : 0
  })
  const [isPM, setIsPM] = useState<boolean>(() => {
    return date ? date.getHours() >= 12 : false
  })

  // Track if time was manually changed
  const [timeChanged, setTimeChanged] = useState(false)

  // Update the date only when time inputs change manually
  useEffect(() => {
    if (timeChanged) {
      const newDate = new Date(date || new Date())
      newDate.setHours(isPM ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour)
      newDate.setMinutes(minute)
      newDate.setSeconds(0)
      setDate(newDate)
      setTimeChanged(false)
    }
  }, [timeChanged, hour, minute, isPM, setDate, date])

  // Handle hour input
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10)
    if (isNaN(value)) {
      setHour(12)
    } else {
      setHour(Math.max(1, Math.min(12, value)))
    }
    setTimeChanged(true)
  }

  // Handle minute input
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value, 10)
    if (isNaN(value)) {
      setMinute(0)
    } else {
      setMinute(Math.max(0, Math.min(59, value)))
    }
    setTimeChanged(true)
  }

  // Toggle AM/PM
  const toggleAMPM = () => {
    setIsPM(!isPM)
    setTimeChanged(true)
  }

  return (
    <div className={cn("flex flex-col gap-2 p-4", className)}>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 opacity-50" />
        <span className="text-sm font-medium">Select time</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="grid gap-1 text-center">
          <Label htmlFor="hours" className="text-xs">
            Hours
          </Label>
          <Input
            id="hours"
            className="w-16 text-center"
            value={hour}
            onChange={handleHourChange}
            type="number"
            min={1}
            max={12}
          />
        </div>
        <div className="grid gap-1 text-center">
          <Label htmlFor="minutes" className="text-xs">
            Minutes
          </Label>
          <Input
            id="minutes"
            className="w-16 text-center"
            value={minute.toString().padStart(2, "0")}
            onChange={handleMinuteChange}
            type="number"
            min={0}
            max={59}
          />
        </div>
        <div className="grid gap-1 text-center">
          <Label htmlFor="ampm" className="text-xs">
            AM/PM
          </Label>
          <button
            id="ampm"
            type="button"
            className="w-16 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={toggleAMPM}
          >
            {isPM ? "PM" : "AM"}
          </button>
        </div>
      </div>
    </div>
  )
}

