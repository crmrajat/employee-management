import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Update the formatDate function to ensure consistent "1 Jan, 2025" format
export function formatDate(dateString: string) {
  try {
    const date = parseISO(dateString)
    return format(date, "d MMM, yyyy") // Consistent "1 Jan, 2025" format
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}

export function formatDateTime(dateTimeString: string) {
  try {
    const date = parseISO(dateTimeString)
    return format(date, "d MMM, yyyy 'at' h:mm a") // Consistent "1 Jan, 2025 at 1:30 PM" format
  } catch (error) {
    console.error("Error formatting date time:", error)
    return dateTimeString
  }
}

export function formatTime(dateTimeString: string) {
  try {
    const date = parseISO(dateTimeString)
    return format(date, "h:mm a") // 12-hour format with AM/PM
  } catch (error) {
    console.error("Error formatting time:", error)
    return dateTimeString
  }
}

