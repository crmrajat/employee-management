"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TimePicker } from "@/components/time-picker"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
  disablePastDates?: boolean
}

// Update the DatePicker component to not rely on form context when used standalone

// Replace the DatePicker component implementation with this:
export function DatePicker({ date, setDate, className, disablePastDates = true }: DatePickerProps) {
  // Track if the popover is open
  const [open, setOpen] = React.useState(false)

  // Function to disable dates
  const disableDate = React.useCallback(
    (date: Date) => {
      if (!disablePastDates) return false

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date < today
    },
    [disablePastDates],
  )

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              setOpen(false)
            }}
            initialFocus
            disabled={disableDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Form-integrated date picker component
interface FormDatePickerProps {
  name: string
  control: any
  label?: string
  placeholder?: string
  className?: string
  disablePastDates?: boolean
}

export function FormDatePicker({
  name,
  control,
  label,
  placeholder,
  className,
  disablePastDates = true,
}: FormDatePickerProps) {
  // Function to disable dates - moved outside the render function
  const disableDate = React.useCallback(
    (date: Date) => {
      if (!disablePastDates) return false

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date < today
    },
    [disablePastDates],
  )

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Convert the string date from the form to a Date object for the Calendar
        const selectedDate = field.value ? new Date(field.value) : undefined

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    {field.value ? format(new Date(field.value), "PPP") : <span>{placeholder || "Pick a date"}</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      // Create a date string that preserves the selected date regardless of timezone
                      const year = date.getFullYear()
                      const month = String(date.getMonth() + 1).padStart(2, "0")
                      const day = String(date.getDate()).padStart(2, "0")
                      const dateString = `${year}-${month}-${day}`
                      field.onChange(dateString)
                    } else {
                      field.onChange("")
                    }
                  }}
                  initialFocus
                  disabled={disableDate}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

// Form-integrated date and time picker component
interface FormDateTimePickerProps {
  name: string
  control: any
  label?: string
  placeholder?: string
  className?: string
  showTimePicker?: boolean
  disablePastDates?: boolean
}

export function FormDateTimePicker({
  name,
  control,
  label,
  placeholder,
  className,
  showTimePicker = false,
  disablePastDates = true,
}: FormDateTimePickerProps) {
  // Function to disable dates - moved outside the render function
  const disableDate = React.useCallback(
    (date: Date) => {
      if (!disablePastDates) return false

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return date < today
    },
    [disablePastDates],
  )

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Convert the string date from the form to a Date object for the Calendar
        const selectedDate = field.value ? new Date(field.value) : undefined

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                  >
                    {field.value ? (
                      format(new Date(field.value), showTimePicker ? "PPP p" : "PPP")
                    ) : (
                      <span>{placeholder || "Pick a date"}</span>
                    )}
                    <div className="ml-auto flex items-center">
                      {showTimePicker && <Clock className="mr-2 h-4 w-4 opacity-50" />}
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                    </div>
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      // Preserve the time from the existing date or use current time
                      const currentTime = selectedDate || new Date()

                      // Create a new date with the correct day, preserving time
                      const newDate = new Date(date)
                      newDate.setHours(currentTime.getHours())
                      newDate.setMinutes(currentTime.getMinutes())
                      newDate.setSeconds(0)

                      // Create an ISO string but ensure we're using the local date
                      const year = newDate.getFullYear()
                      const month = String(newDate.getMonth() + 1).padStart(2, "0")
                      const day = String(newDate.getDate()).padStart(2, "0")
                      const hours = String(newDate.getHours()).padStart(2, "0")
                      const minutes = String(newDate.getMinutes()).padStart(2, "0")

                      // Format as ISO-like string but preserving the actual selected date
                      const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`
                      field.onChange(dateTimeString)
                    } else {
                      field.onChange("")
                    }
                  }}
                  initialFocus
                  disabled={disableDate}
                />
                {showTimePicker && selectedDate && (
                  <TimePicker
                    date={selectedDate}
                    setDate={(date) => {
                      // Ensure we preserve the correct day when updating time
                      const year = date.getFullYear()
                      const month = String(date.getMonth() + 1).padStart(2, "0")
                      const day = String(date.getDate()).padStart(2, "0")
                      const hours = String(date.getHours()).padStart(2, "0")
                      const minutes = String(date.getMinutes()).padStart(2, "0")

                      // Format as ISO-like string but preserving the actual selected date
                      const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`
                      field.onChange(dateTimeString)
                    }}
                  />
                )}
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

