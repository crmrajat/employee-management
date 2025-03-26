import * as z from "zod"

// Document validation schema
export const documentSchema = z.object({
  name: z.string().min(1, "Document name is required").max(100, "Document name cannot exceed 100 characters"),
  category: z.string().min(1, "Category is required").max(50, "Category cannot exceed 50 characters"),
  uploadDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true
        const parsedDate = new Date(date)
        return !isNaN(parsedDate.getTime())
      },
      { message: "Invalid date format" },
    )
    .refine(
      (date) => {
        if (!date) return true
        const parsedDate = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return parsedDate <= today
      },
      { message: "Upload date cannot be in the future" },
    ),
})

// Library validation schema
export const librarySchema = z.object({
  name: z.string().min(1, "Library name is required").max(50, "Library name cannot exceed 50 characters"),
  description: z.string().max(200, "Description cannot exceed 200 characters"),
})

// Employee validation schema
export const employeeSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name cannot exceed 50 characters"),
  position: z.string().min(1, "Position is required").max(50, "Position cannot exceed 50 characters"),
  department: z.string().min(1, "Department is required").max(50, "Department cannot exceed 50 characters"),
  email: z.string().email("Invalid email address").max(100, "Email cannot exceed 100 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(10, "Phone number cannot exceed 10 digits"),
  mentor: z.string().optional(),
  progress: z.number().min(0).max(100),
  skills: z.array(z.string()),
  startDate: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true
        const parsedDate = new Date(date)
        return !isNaN(parsedDate.getTime())
      },
      { message: "Invalid date format" },
    )
    .refine(
      (date) => {
        if (!date) return true
        const parsedDate = new Date(date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return parsedDate <= today
      },
      { message: "Start date cannot be in the future" },
    ),
})

// Training validation schema
export const trainingSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title cannot exceed 100 characters"),
  description: z.string().max(250, "Description cannot exceed 250 characters"),
  date: z
    .string()
    .min(1, "Date is required")
    .refine(
      (date) => {
        if (!date) return true
        const parsedDate = new Date(date)
        return !isNaN(parsedDate.getTime())
      },
      { message: "Invalid date format" },
    ),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(1, "Location is required").max(100, "Location cannot exceed 100 characters"),
  instructor: z.string().min(1, "Instructor is required").max(50, "Instructor cannot exceed 50 characters"),
})

// Task validation schema
export const taskSchema = z.object({
  description: z.string().min(1, "Task description is required").max(100, "Description cannot exceed 100 characters"),
  completed: z.boolean().default(false),
})

// Feedback validation schema
export const feedbackSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  feedback: z.string().max(500, "Feedback cannot exceed 500 characters"),
})

