"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/safe-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Users, CheckSquare, BarChart3, GraduationCap, CheckCircle2, Circle, Plus } from "lucide-react"
import { trainingSchema, taskSchema } from "@/lib/validations"
import { formatDate } from "@/lib/utils"
import { EmptyState, TableContainer } from "@/components/ui-components"
import { toast } from "sonner"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"
import { DeleteConfirmation } from "@/components/delete-confirmation"

// Sample data
const trainingSchedule = [
  {
    id: 1,
    title: "New Employee Orientation",
    description: "Introduction to company policies and procedures",
    date: "2023-08-15",
    time: "09:00 - 12:00",
    location: "Conference Room A",
    instructor: "HR Team",
    attendees: 8,
    status: "upcoming",
  },
  {
    id: 2,
    title: "Leadership Development",
    description: "Advanced leadership skills for managers",
    date: "2023-08-22",
    time: "13:00 - 17:00",
    location: "Training Center",
    instructor: "David Miller",
    attendees: 12,
    status: "upcoming",
  },
  {
    id: 3,
    title: "Technical Skills Workshop",
    description: "Hands-on training for new software tools",
    date: "2023-08-10",
    time: "10:00 - 15:00",
    location: "IT Lab",
    instructor: "Tech Team",
    attendees: 15,
    status: "completed",
  },
  {
    id: 4,
    title: "Customer Service Excellence",
    description: "Best practices for customer interactions",
    date: "2023-08-05",
    time: "09:00 - 12:00",
    location: "Conference Room B",
    instructor: "Sarah Williams",
    attendees: 10,
    status: "completed",
  },
]

const taskChecklists = [
  {
    id: 1,
    title: "New Hire Onboarding",
    progress: 75,
    tasks: [
      { id: 1, description: "Complete company orientation", completed: true },
      { id: 2, description: "Set up workstation and accounts", completed: true },
      { id: 3, description: "Review employee handbook", completed: true },
      { id: 4, description: "Meet with department team", completed: false },
      { id: 5, description: "Complete required training modules", completed: false },
      { id: 6, description: "Schedule 30-day check-in", completed: false },
    ],
  },
  {
    id: 2,
    title: "Project Management Certification",
    progress: 40,
    tasks: [
      { id: 1, description: "Complete online course modules", completed: true },
      { id: 2, description: "Submit practice assignments", completed: true },
      { id: 3, description: "Participate in group discussions", completed: false },
      { id: 4, description: "Take practice exams", completed: false },
      { id: 5, description: "Schedule certification exam", completed: false },
    ],
  },
  {
    id: 3,
    title: "Technical Skills Development",
    progress: 60,
    tasks: [
      { id: 1, description: "Complete JavaScript fundamentals", completed: true },
      { id: 2, description: "Build practice projects", completed: true },
      { id: 3, description: "Review advanced concepts", completed: true },
      { id: 4, description: "Participate in code review", completed: false },
      { id: 5, description: "Complete final assessment", completed: false },
    ],
  },
]

const progressData = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Software Developer",
    avatar: "AJ",
    courses: [
      { name: "JavaScript Advanced", progress: 85 },
      { name: "React Fundamentals", progress: 60 },
      { name: "Team Leadership", progress: 40 },
    ],
  },
  {
    id: 2,
    name: "Emily Davis",
    role: "UX Designer",
    avatar: "ED",
    courses: [
      { name: "UI/UX Principles", progress: 90 },
      { name: "Design Systems", progress: 75 },
      { name: "User Research", progress: 65 },
    ],
  },
  {
    id: 3,
    name: "James Wilson",
    role: "Product Manager",
    avatar: "JW",
    courses: [
      { name: "Product Strategy", progress: 70 },
      { name: "Agile Methodologies", progress: 95 },
      { name: "Market Analysis", progress: 50 },
    ],
  },
]

export default function TrainingPage() {
  const [trainings, setTrainings] = useState(trainingSchedule)
  const [selectedChecklist, setSelectedChecklist] = useState(taskChecklists[0])
  const [checklists, setChecklists] = useState(taskChecklists)
  const [isAddTrainingDialogOpen, setIsAddTrainingDialogOpen] = useState(false)
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)
  const [isDetailedReportOpen, setIsDetailedReportOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [registeredTrainings, setRegisteredTrainings] = useState([])
  const [registrationLoading, setRegistrationLoading] = useState(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Add state for delete confirmation
  const [trainingToDelete, setTrainingToDelete] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [isDeleteTaskDialogOpen, setIsDeleteTaskDialogOpen] = useState(false)

  const trainingForm = useForm({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      instructor: "",
    },
  })

  const taskForm = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      description: "",
      completed: false,
    },
  })

  const toggleTask = (taskId) => {
    const updatedChecklists = checklists.map((checklist) => {
      if (checklist.id === selectedChecklist.id) {
        const updatedTasks = checklist.tasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, completed: !task.completed }
          }
          return task
        })

        // Calculate new progress
        const completedCount = updatedTasks.filter((task) => task.completed).length
        const newProgress = Math.round((completedCount / updatedTasks.length) * 100)

        return {
          ...checklist,
          tasks: updatedTasks,
          progress: newProgress,
        }
      }
      return checklist
    })

    setChecklists(updatedChecklists)
    setSelectedChecklist(updatedChecklists.find((c) => c.id === selectedChecklist.id))

    toast.success("Task updated", {
      description: "Your progress has been saved.",
    })
  }

  const handleAddTraining = (data) => {
    setIsSubmitting(true)

    try {
      // Format the date from the DatePicker component
      const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""

      if (!formattedDate) {
        toast.error("Date required", {
          description: "Please select a date for the training.",
        })
        setIsSubmitting(false)
        return
      }

      const newTraining = {
        ...data,
        date: formattedDate,
        id: trainings.length > 0 ? Math.max(...trainings.map((t) => t.id)) + 1 : 1,
        attendees: 0,
        status: "upcoming",
      }

      setTrainings([...trainings, newTraining])
      setIsAddTrainingDialogOpen(false)
      trainingForm.reset()
      setSelectedDate(undefined)

      toast.success("Training added", {
        description: `${data.title} has been scheduled successfully.`,
      })
    } catch (error) {
      console.error("Error adding training:", error)
      toast.error("Failed to add training", {
        description: "There was an error adding the training. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddTask = (data) => {
    if (!selectedChecklist) {
      toast.error("No checklist selected", {
        description: "Please select a checklist to add a task to.",
      })
      return
    }

    const updatedChecklists = checklists.map((checklist) => {
      if (checklist.id === selectedChecklist.id) {
        const newTask = {
          id: checklist.tasks.length > 0 ? Math.max(...checklist.tasks.map((t) => t.id)) + 1 : 1,
          description: data.description,
          completed: data.completed,
        }

        const updatedTasks = [...checklist.tasks, newTask]

        // Calculate new progress
        const completedCount = updatedTasks.filter((task) => task.completed).length
        const newProgress = Math.round((completedCount / updatedTasks.length) * 100)

        return {
          ...checklist,
          tasks: updatedTasks,
          progress: newProgress,
        }
      }
      return checklist
    })

    setChecklists(updatedChecklists)
    setSelectedChecklist(updatedChecklists.find((c) => c.id === selectedChecklist.id))
    setIsAddTaskDialogOpen(false)
    taskForm.reset()

    toast.success("Task added", {
      description: "New task has been added to the checklist.",
    })
  }

  // Confirm delete training
  const confirmDeleteTraining = (training) => {
    setTrainingToDelete(training)
    setIsDeleteDialogOpen(true)
  }

  // Handle delete training with undo functionality
  const handleDeleteTraining = () => {
    if (!trainingToDelete) return

    const deletedTraining = trainingToDelete
    setTrainings(trainings.filter((training) => training.id !== deletedTraining.id))
    setIsDeleteDialogOpen(false)
    setTrainingToDelete(null)

    toast("Training deleted", {
      description: `"${deletedTraining.title}" has been removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          setTrainings((prev) => [...prev, deletedTraining].sort((a, b) => a.id - b.id))
          toast.success("Action undone", {
            description: `"${deletedTraining.title}" has been restored.`,
          })
        },
      },
    })
  }

  // Confirm delete task
  const confirmDeleteTask = (checklist, task) => {
    setTaskToDelete({ checklist, task })
    setIsDeleteTaskDialogOpen(true)
  }

  // Handle delete task with undo functionality
  const handleDeleteTask = () => {
    if (!taskToDelete) return

    const { checklist, task } = taskToDelete
    const originalChecklist = { ...checklist }

    const updatedChecklists = checklists.map((c) => {
      if (c.id === checklist.id) {
        const updatedTasks = c.tasks.filter((t) => t.id !== task.id)

        // Calculate new progress
        const completedCount = updatedTasks.filter((t) => t.completed).length
        const newProgress = updatedTasks.length > 0 ? Math.round((completedCount / updatedTasks.length) * 100) : 0

        return {
          ...c,
          tasks: updatedTasks,
          progress: newProgress,
        }
      }
      return c
    })

    setChecklists(updatedChecklists)
    if (selectedChecklist.id === checklist.id) {
      setSelectedChecklist(updatedChecklists.find((c) => c.id === checklist.id))
    }

    setIsDeleteTaskDialogOpen(false)
    setTaskToDelete(null)

    toast("Task deleted", {
      description: `"${task.description}" has been removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          setChecklists(checklists.map((c) => (c.id === checklist.id ? originalChecklist : c)))
          if (selectedChecklist.id === checklist.id) {
            setSelectedChecklist(originalChecklist)
          }
          toast.success("Action undone", {
            description: `"${task.description}" has been restored.`,
          })
        },
      },
    })
  }

  const handleRegisterForTraining = async (trainingId) => {
    setRegistrationLoading(trainingId)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Add this training ID to registered trainings
      setRegisteredTrainings([...registeredTrainings, trainingId])

      // Show success toast
      toast.success("Registration successful", {
        description: "You have been registered for this training session.",
      })
    } catch (error) {
      toast.error("Registration failed", {
        description: "There was an error registering for this training. Please try again.",
      })
    } finally {
      setRegistrationLoading(null)
    }
  }

  const handleViewTrainingDetails = (trainingId) => {
    // In a real app, this would show detailed information about the training
    toast.success("Training details", {
      description: "Viewing detailed information about this training session.",
    })
  }

  const handleViewDetailedReport = (employee) => {
    setSelectedEmployee(employee)
    setIsDetailedReportOpen(true)
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Training & Development</h1>
        </div>

        <Tabs defaultValue="schedule">
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="schedule" className="flex-1">
              Schedule
            </TabsTrigger>
            <TabsTrigger value="checklists" className="flex-1">
              Tasks
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex-1">
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <div className="flex justify-end mb-4">
              <Button className="gap-1" onClick={() => setIsAddTrainingDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Training
              </Button>
            </div>

            {trainings.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                <TableContainer>
                  {trainings.map((training) => (
                    <Card key={training.id} className={training.status === "completed" ? "opacity-70" : ""}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{training.title}</CardTitle>
                            <CardDescription>{training.description}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={training.status === "upcoming" ? "default" : "secondary"}>
                              {training.status === "upcoming" ? "Upcoming" : "Completed"}
                            </Badge>
                            {training.status === "upcoming" && (
                              <DeleteConfirmation
                                itemName={training.title}
                                itemType="Training"
                                onDelete={() => {
                                  const deletedTraining = { ...training }
                                  setTrainings(trainings.filter((t) => t.id !== deletedTraining.id))
                                }}
                                onUndo={() => {
                                  setTrainings((prev) => [...prev, training].sort((a, b) => a.id - b.id))
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{formatDate(training.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{training.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">Instructor: {training.instructor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="truncate">{training.attendees} Attendees</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          variant={training.status === "upcoming" ? "default" : "outline"}
                          disabled={
                            training.status === "completed" ||
                            registeredTrainings.includes(training.id) ||
                            registrationLoading === training.id
                          }
                          onClick={() =>
                            training.status === "upcoming"
                              ? handleRegisterForTraining(training.id)
                              : handleViewTrainingDetails(training.id)
                          }
                          aria-label={
                            training.status === "upcoming"
                              ? registeredTrainings.includes(training.id)
                                ? "Already registered"
                                : `Register for ${training.title}`
                              : `View details for ${training.title}`
                          }
                        >
                          {training.status === "upcoming" ? (
                            registeredTrainings.includes(training.id) ? (
                              "Registered"
                            ) : registrationLoading === training.id ? (
                              <span className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Registering...
                              </span>
                            ) : (
                              "Register"
                            )
                          ) : (
                            "View Details"
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </TableContainer>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <EmptyState
                    icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
                    title="No trainings scheduled"
                    description="There are no training sessions scheduled at the moment."
                    actionLabel="Schedule Training"
                    action={() => setIsAddTrainingDialogOpen(true)}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="checklists">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Checklists</CardTitle>
                  <CardDescription>Track your progress on various tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[200px] overflow-auto">
                    <div className="space-y-2">
                      {checklists.map((checklist) => (
                        <div
                          key={checklist.id}
                          className={`p-3 rounded-md cursor-pointer ${
                            selectedChecklist.id === checklist.id ? "bg-primary/10" : "hover:bg-muted"
                          }`}
                          onClick={() => setSelectedChecklist(checklist)}
                          tabIndex={0}
                          role="button"
                          aria-pressed={selectedChecklist.id === checklist.id}
                          aria-label={`Select ${checklist.title} checklist`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              setSelectedChecklist(checklist)
                            }
                          }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{checklist.title}</h3>
                            <span className="text-sm">{checklist.progress}%</span>
                          </div>
                          <Progress
                            value={checklist.progress}
                            className="h-2"
                            aria-label={`${checklist.title} progress: ${checklist.progress}%`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <CardTitle>{selectedChecklist.title}</CardTitle>
                      <CardDescription>
                        {selectedChecklist.tasks.filter((t) => t.completed).length} of {selectedChecklist.tasks.length}{" "}
                        tasks completed
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedChecklist.progress}%</span>
                        <Progress
                          value={selectedChecklist.progress}
                          className="w-24 h-2"
                          aria-label={`Overall progress: ${selectedChecklist.progress}%`}
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        onClick={() => setIsAddTaskDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Add Task
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[400px] overflow-auto">
                    {selectedChecklist.tasks.length > 0 ? (
                      <div className="space-y-4">
                        {selectedChecklist.tasks.map((task) => (
                          <div
                            key={task.id}
                            className={`flex items-start gap-3 p-3 rounded-md ${task.completed ? "bg-primary/5" : ""}`}
                          >
                            <Checkbox
                              id={`task-${task.id}`}
                              checked={task.completed}
                              onCheckedChange={() => toggleTask(task.id)}
                              className="mt-1"
                              aria-label={`Mark "${task.description}" as ${task.completed ? "incomplete" : "complete"}`}
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={`task-${task.id}`}
                                className={`font-medium cursor-pointer ${
                                  task.completed ? "line-through text-muted-foreground" : ""
                                }`}
                              >
                                {task.description}
                              </label>
                            </div>
                            <div className="flex items-center">
                              <DeleteConfirmation
                                itemName={task.description}
                                itemType="Task"
                                onDelete={() => {
                                  const updatedTasks = selectedChecklist.tasks.filter((t) => t.id !== task.id)
                                  const completedCount = updatedTasks.filter((t) => t.completed).length
                                  const newProgress =
                                    updatedTasks.length > 0
                                      ? Math.round((completedCount / updatedTasks.length) * 100)
                                      : 0

                                  const updatedChecklist = {
                                    ...selectedChecklist,
                                    tasks: updatedTasks,
                                    progress: newProgress,
                                  }

                                  setChecklists(
                                    checklists.map((c) => (c.id === selectedChecklist.id ? updatedChecklist : c)),
                                  )
                                  setSelectedChecklist(updatedChecklist)
                                }}
                                onUndo={() => {
                                  // Restore the original checklist
                                  const originalChecklist = checklists.find((c) => c.id === selectedChecklist.id)
                                  if (originalChecklist) {
                                    setSelectedChecklist(originalChecklist)
                                  }
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={<CheckSquare className="h-8 w-8 text-muted-foreground" />}
                        title="No tasks yet"
                        description="Add your first task to this checklist to get started."
                        actionLabel="Add Task"
                        action={() => setIsAddTaskDialogOpen(true)}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress">
            {progressData.length > 0 ? (
              <div className="space-y-6">
                {progressData.map((employee) => (
                  <Card key={employee.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{employee.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{employee.name}</CardTitle>
                          <CardDescription>{employee.role}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {employee.courses.map((course, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-primary" />
                                <span className="font-medium">{course.name}</span>
                              </div>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={course.progress}
                                className="h-2 flex-1"
                                aria-label={`${course.name} progress: ${course.progress}%`}
                              />
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                {course.progress >= 100 ? (
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Circle className="h-3 w-3" />
                                )}
                                <span>{course.progress >= 100 ? "Completed" : "In Progress"}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewDetailedReport(employee)}
                        aria-label={`View detailed report for ${employee.name}`}
                      >
                        View Detailed Report
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <EmptyState
                    icon={<BarChart3 className="h-12 w-12 text-muted-foreground" />}
                    title="No progress data available"
                    description="There is no training progress data available at the moment."
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Add Training Dialog */}
        <Dialog open={isAddTrainingDialogOpen} onOpenChange={setIsAddTrainingDialogOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Schedule New Training</DialogTitle>
              <DialogDescription>Fill in the details to schedule a new training session.</DialogDescription>
            </DialogHeader>
            <Form {...trainingForm}>
              <form onSubmit={trainingForm.handleSubmit(handleAddTraining)} className="space-y-4">
                <FormField
                  control={trainingForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={100} placeholder="e.g., Leadership Workshop" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={trainingForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={250} placeholder="Brief description of the training" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <DatePicker date={selectedDate} setDate={setSelectedDate} disablePastDates={true} />
                    {!selectedDate && trainingForm.formState.isSubmitted && (
                      <p className="text-sm font-medium text-destructive">Date is required</p>
                    )}
                  </div>

                  <FormField
                    control={trainingForm.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 09:00 - 12:00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={trainingForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} maxLength={100} placeholder="e.g., Conference Room A" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={trainingForm.control}
                    name="instructor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructor</FormLabel>
                        <FormControl>
                          <Input {...field} maxLength={50} placeholder="e.g., John Smith" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Scheduling...
                      </span>
                    ) : (
                      "Schedule Training"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Add Task Dialog */}
        <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Add a new task to the "{selectedChecklist?.title}" checklist.</DialogDescription>
            </DialogHeader>
            <Form {...taskForm}>
              <form onSubmit={taskForm.handleSubmit(handleAddTask)} className="space-y-4">
                <FormField
                  control={taskForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Description</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={100} placeholder="e.g., Complete training module" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={taskForm.control}
                  name="completed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} id="task-completed" />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="task-completed">Mark as completed</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" className="w-full sm:w-auto">
                    Add Task
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Detailed Report Dialog */}
        <Dialog open={isDetailedReportOpen} onOpenChange={setIsDetailedReportOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-[700px] max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{selectedEmployee?.avatar || "?"}</AvatarFallback>
                </Avatar>
                <span className="truncate">{selectedEmployee?.name || "Employee"} - Progress Report</span>
              </DialogTitle>
              <DialogDescription>Training progress and achievements</DialogDescription>
            </DialogHeader>

            {selectedEmployee && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-muted rounded-lg p-3">
                    <h3 className="font-medium text-xs mb-1">Overall Completion</h3>
                    <div className="text-xl font-bold mb-1">
                      {Math.round(
                        selectedEmployee.courses.reduce((acc, course) => acc + course.progress, 0) /
                          selectedEmployee.courses.length,
                      )}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground">Average across all courses</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <h3 className="font-medium text-xs mb-1">Courses Completed</h3>
                    <div className="text-xl font-bold mb-1">
                      {selectedEmployee.courses.filter((c) => c.progress >= 100).length}/
                      {selectedEmployee.courses.length}
                    </div>
                    <p className="text-xs text-muted-foreground">Fully completed courses</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <h3 className="font-medium text-xs mb-1">Time Invested</h3>
                    <div className="text-xl font-bold mb-1">24h</div>
                    <p className="text-xs text-muted-foreground">Total training hours</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Course Progress Details</h3>
                  <div className="space-y-6">
                    {selectedEmployee.courses.map((course, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-medium text-sm">{course.name}</h4>
                          <Badge variant={course.progress >= 100 ? "success" : "outline"} className="text-xs">
                            {course.progress >= 100 ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                          <span>Progress: {course.progress}%</span>
                          <span>Last activity: 3 days ago</span>
                        </div>
                        <Progress
                          value={course.progress}
                          className="h-2"
                          aria-label={`${course.name} progress: ${course.progress}%`}
                        />
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-muted/50 p-2 rounded">
                            <div className="font-medium">4/5</div>
                            <div className="text-muted-foreground">Modules</div>
                          </div>
                          <div className="bg-muted/50 p-2 rounded">
                            <div className="font-medium">12/15</div>
                            <div className="text-muted-foreground">Lessons</div>
                          </div>
                          <div className="bg-muted/50 p-2 rounded">
                            <div className="font-medium">85%</div>
                            <div className="text-muted-foreground">Quiz Score</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Recommendations</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <GraduationCap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Consider enrolling in "Advanced {selectedEmployee.role} Techniques"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>
                        Complete remaining modules in "{selectedEmployee.courses.find((c) => c.progress < 100)?.name}"
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Join the monthly {selectedEmployee.role} community meetup</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <DialogFooter className="flex flex-col gap-2">
              <Button className="w-full" onClick={() => setIsDetailedReportOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

