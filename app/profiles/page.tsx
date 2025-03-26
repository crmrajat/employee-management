"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  MobileDialogClose,
} from "@/components/safe-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Search, Plus, Edit, UserCheck, Users } from "lucide-react"
import { employeeSchema } from "@/lib/validations"
import { EmptyState, ScrollableContent, TableContainer } from "@/components/ui-components"
import { toast } from "sonner"
import { FormDatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"
import { DeleteConfirmation } from "@/components/delete-confirmation"

// Sample data
const initialEmployees = [
  {
    id: 1,
    name: "Alex Johnson",
    position: "Software Developer",
    department: "Engineering",
    email: "alex.johnson@example.com",
    phone: "5551234567",
    mentor: "Sarah Williams",
    progress: 75,
    skills: ["JavaScript", "React", "Node.js"],
    startDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Emily Davis",
    position: "UX Designer",
    department: "Design",
    email: "emily.davis@example.com",
    phone: "5559876543",
    mentor: "Michael Brown",
    progress: 60,
    skills: ["UI/UX", "Figma", "User Research"],
    startDate: "2023-03-22",
  },
  {
    id: 3,
    name: "James Wilson",
    position: "Product Manager",
    department: "Product",
    email: "james.wilson@example.com",
    phone: "5554567890",
    mentor: "Lisa Chen",
    progress: 90,
    skills: ["Product Strategy", "Agile", "Market Analysis"],
    startDate: "2022-11-10",
  },
]

const mentors = ["Sarah Williams", "Michael Brown", "Lisa Chen", "David Miller", "Jennifer Taylor"]

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return format(date, "d MMM, yyyy") // Changed to "1 Jan, 2025" format
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid Date"
  }
}

export default function ProfilesPage() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const [newSkill, setNewSkill] = useState("")
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)
  const [isEditingEmployee, setIsEditingEmployee] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Use a ref to track form operations
  const formOperationInProgress = useRef(false)

  // Ensure the component is mounted before rendering complex UI
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      mentor: "",
      progress: 0,
      skills: [],
      startDate: "",
    },
  })

  // Use useCallback for form reset to prevent unnecessary rerenders
  const resetForm = useCallback(() => {
    if (!formOperationInProgress.current) {
      form.reset({
        name: "",
        position: "",
        department: "",
        email: "",
        phone: "",
        mentor: "",
        progress: 0,
        skills: [],
        startDate: "",
      })
    }
  }, [form])

  // Fix the edit form initialization to properly parse dates
  useEffect(() => {
    if (selectedEmployee && isEditDialogOpen && !formOperationInProgress.current) {
      formOperationInProgress.current = true
      form.reset({
        ...selectedEmployee,
        // Ensure phone is a string without special characters
        phone: selectedEmployee.phone ? selectedEmployee.phone.replace(/\D/g, "") : "",
      })
      formOperationInProgress.current = false
    }
  }, [selectedEmployee, isEditDialogOpen, form])

  const handleSelectEmployee = useCallback((employee) => {
    setSelectedEmployee(employee)
  }, [])

  // Fix the add employee handler to properly format dates
  const handleAddEmployee = useCallback(
    async (data) => {
      if (formOperationInProgress.current) return
      formOperationInProgress.current = true

      setIsAddingEmployee(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        const newEmployee = {
          ...data,
          id: employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1,
        }

        setEmployees((prev) => [...prev, newEmployee])
        setIsAddDialogOpen(false)
        resetForm()

        toast.success("Employee added", {
          description: `${data.name} has been added successfully.`,
          className: "toast-success",
        })
      } catch (error) {
        toast.error("Failed to add employee", {
          description: "There was an error adding the employee. Please try again.",
          className: "toast-error",
        })
      } finally {
        setIsAddingEmployee(false)
        formOperationInProgress.current = false
      }
    },
    [employees, resetForm],
  )

  // Fix the edit employee handler to properly format dates
  const handleEditEmployee = useCallback(
    async (data) => {
      if (formOperationInProgress.current || !selectedEmployee) return
      formOperationInProgress.current = true

      setIsEditingEmployee(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        const updatedEmployee = {
          ...data,
          id: selectedEmployee.id,
        }

        setEmployees((prev) => prev.map((emp) => (emp.id === selectedEmployee.id ? updatedEmployee : emp)))
        setSelectedEmployee(updatedEmployee)
        setIsEditDialogOpen(false)

        toast.success("Employee updated", {
          description: `${data.name}'s profile has been updated successfully.`,
          className: "toast-success",
        })
      } catch (error) {
        toast.error("Failed to update employee", {
          description: "There was an error updating the employee. Please try again.",
          className: "toast-error",
        })
      } finally {
        setIsEditingEmployee(false)
        formOperationInProgress.current = false
      }
    },
    [selectedEmployee],
  )

  const confirmDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteEmployee = useCallback(() => {
    if (!employeeToDelete) return

    const deletedEmployee = { ...employeeToDelete }
    setEmployees((prev) => prev.filter((emp) => emp.id !== deletedEmployee.id))

    if (selectedEmployee?.id === deletedEmployee.id) {
      setSelectedEmployee(null)
    }

    setIsDeleteDialogOpen(false)
    setEmployeeToDelete(null)

    toast("Employee deleted", {
      description: `${deletedEmployee.name} has been removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          setEmployees((prev) => [...prev, deletedEmployee])
          if (selectedEmployee?.id === deletedEmployee.id) {
            setSelectedEmployee(deletedEmployee)
          }
          toast.success("Action undone", {
            description: `${deletedEmployee.name} has been restored.`,
            className: "toast-success",
          })
        },
      },
      className: "toast-default",
    })
  }, [employeeToDelete, selectedEmployee])

  const handleAddSkill = useCallback(() => {
    if (newSkill.trim() !== "" && !form.getValues().skills.includes(newSkill.trim())) {
      form.setValue("skills", [...form.getValues().skills, newSkill.trim()])
      setNewSkill("")
    }
  }, [form, newSkill])

  // Update the handleRemoveSkill function to show a toast with undo functionality
  const handleRemoveSkill = useCallback(
    (skillToRemove) => {
      const currentSkills = [...form.getValues().skills]
      form.setValue(
        "skills",
        currentSkills.filter((skill) => skill !== skillToRemove),
      )

      toast(`Skill removed`, {
        description: `"${skillToRemove}" has been removed from skills.`,
        action: {
          label: "Undo",
          onClick: () => {
            form.setValue("skills", [...form.getValues().skills, skillToRemove])
            toast.success("Action undone", {
              description: `"${skillToRemove}" has been restored to skills.`,
              className: "toast-success",
            })
          },
        },
        className: "toast-default",
      })
    },
    [form],
  )

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleAddSkill()
      }
    },
    [handleAddSkill],
  )

  // Show a simplified UI while the component is mounting
  if (!mounted) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Employee Profiles</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Employees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center">
                    <p>Loading employees...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              <Card className="h-full flex items-center justify-center">
                <p>Select an employee to view details</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Employee Profiles</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Employees</CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                    type="button"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search employees"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ScrollableContent maxHeight="500px">
                  {filteredEmployees.length > 0 ? (
                    <div className="space-y-2">
                      {filteredEmployees.map((employee) => (
                        <div
                          key={employee.id}
                          className={`p-3 rounded-md cursor-pointer flex items-center gap-3 ${
                            selectedEmployee?.id === employee.id ? "bg-primary/10" : "hover:bg-muted"
                          }`}
                          onClick={() => handleSelectEmployee(employee)}
                          tabIndex={0}
                          role="button"
                          aria-pressed={selectedEmployee?.id === employee.id}
                          aria-label={`Select ${employee.name}`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              handleSelectEmployee(employee)
                            }
                          }}
                        >
                          <Avatar>
                            <AvatarFallback>
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">{employee.position}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Users className="h-8 w-8 text-muted-foreground" />}
                      title="No employees found"
                      description={
                        searchTerm ? "Try adjusting your search terms" : "Add your first employee to get started"
                      }
                      actionLabel={searchTerm ? "Clear search" : "Add Employee"}
                      action={searchTerm ? () => setSearchTerm("") : () => setIsAddDialogOpen(true)}
                    />
                  )}
                </ScrollableContent>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedEmployee ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Employee Profile</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1"
                        aria-label={`Edit ${selectedEmployee?.name}'s profile`}
                        type="button"
                        onClick={() => setIsEditDialogOpen(true)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <DeleteConfirmation
                        itemName={selectedEmployee.name}
                        itemType="Employee"
                        onDelete={() => {
                          const deletedEmployee = { ...selectedEmployee }
                          setEmployees((prev) => prev.filter((emp) => emp.id !== deletedEmployee.id))
                          setSelectedEmployee(null)
                        }}
                        onUndo={() => {
                          setEmployees((prev) => [...prev, selectedEmployee].sort((a, b) => a.id - b.id))
                        }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                      <Avatar className="h-16 w-16 self-center sm:self-start">
                        <AvatarFallback className="text-lg">
                          {selectedEmployee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center sm:text-left">
                        <h2 className="text-xl font-bold">{selectedEmployee.name}</h2>
                        <p className="text-muted-foreground">
                          {selectedEmployee.position} • {selectedEmployee.department}
                        </p>
                        {selectedEmployee.startDate && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Started on {formatDate(selectedEmployee.startDate)}
                          </p>
                        )}
                      </div>
                    </div>

                    <Tabs defaultValue="info" className="w-full">
                      <TabsList className="mb-4 w-full grid grid-cols-2">
                        <TabsTrigger value="info">Information</TabsTrigger>
                        <TabsTrigger value="progress">Progress</TabsTrigger>
                      </TabsList>
                      <TabsContent value="info" className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <h3 className="font-medium text-muted-foreground mb-1">Email</h3>
                            <p className="break-all">{selectedEmployee.email}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-muted-foreground mb-1">Phone</h3>
                            <p>{selectedEmployee.phone}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-muted-foreground mb-1">Department</h3>
                            <p>{selectedEmployee.department}</p>
                          </div>
                          <div>
                            <h3 className="font-medium text-muted-foreground mb-1">Mentor</h3>
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-primary" />
                              <p>{selectedEmployee.mentor}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-muted-foreground mb-2">Skills</h3>
                          <div className="max-h-32 overflow-auto">
                            <TableContainer>
                              <div className="flex flex-wrap gap-2">
                                {selectedEmployee.skills.map((skill, index) => (
                                  <div key={index} className="bg-primary/10 px-3 py-1 rounded-full text-sm">
                                    {skill}
                                  </div>
                                ))}
                              </div>
                            </TableContainer>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="progress">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <h3 className="font-medium">Overall Progress</h3>
                              <span>{selectedEmployee.progress}%</span>
                            </div>
                            <Progress
                              value={selectedEmployee.progress}
                              className="h-2"
                              aria-label={`Overall progress: ${selectedEmployee.progress}%`}
                            />
                          </div>
                          <div className="border rounded-md p-4">
                            <h3 className="font-medium mb-3">Development Areas</h3>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Technical Skills</span>
                                  <span className="text-sm">{Math.round(selectedEmployee.progress * 0.8)}%</span>
                                </div>
                                <Progress
                                  value={selectedEmployee.progress * 0.8}
                                  className="h-1.5"
                                  aria-label={`Technical skills: ${Math.round(selectedEmployee.progress * 0.8)}%`}
                                />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Communication</span>
                                  <span className="text-sm">{Math.round(selectedEmployee.progress * 1.1)}%</span>
                                </div>
                                <Progress
                                  value={Math.min(selectedEmployee.progress * 1.1, 100)}
                                  className="h-1.5"
                                  aria-label={`Communication: ${Math.round(Math.min(selectedEmployee.progress * 1.1, 100))}%`}
                                />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">Leadership</span>
                                  <span className="text-sm">{Math.round(selectedEmployee.progress * 0.7)}%</span>
                                </div>
                                <Progress
                                  value={selectedEmployee.progress * 0.7}
                                  className="h-1.5"
                                  aria-label={`Leadership: ${Math.round(selectedEmployee.progress * 0.7)}%`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center text-center p-6">
                <EmptyState
                  icon={<Users className="h-12 w-12 text-muted-foreground" />}
                  title="No Employee Selected"
                  description="Select an employee from the list to view their profile details, assign mentors, and track progress."
                />
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Add Employee Dialog - Only render when open to avoid context issues */}
      {isAddDialogOpen && (
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            if (!formOperationInProgress.current) {
              setIsAddDialogOpen(open)
              if (!open) {
                resetForm()
              }
            }
          }}
        >
          <DialogContent className="sm:max-w-[525px] flex flex-col">
            <MobileDialogClose />
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Fill in the details to add a new employee to the system.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  form.handleSubmit(handleAddEmployee)(e)
                }}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} maxLength={50} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input placeholder="Software Developer" {...field} maxLength={50} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                              <Input placeholder="Engineering" {...field} maxLength={50} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john.doe@example.com"
                                {...field}
                                maxLength={100}
                                aria-describedby="email-description"
                              />
                            </FormControl>
                            <p id="email-description" className="text-xs text-muted-foreground mt-1">
                              Must be a valid company email address
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="1234567890"
                                {...field}
                                maxLength={10}
                                aria-describedby="phone-description"
                              />
                            </FormControl>
                            <p id="phone-description" className="text-xs text-muted-foreground mt-1">
                              10-digit number with no spaces or special characters
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mentor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mentor</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a mentor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mentors.map((mentor) => (
                                  <SelectItem key={mentor} value={mentor}>
                                    {mentor}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormDatePicker
                        control={form.control}
                        name="startDate"
                        label="Start Date"
                        placeholder="Select start date"
                        disablePastDates={false}
                      />
                      <FormField
                        control={form.control}
                        name="progress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Progress ({field.value}%)</FormLabel>
                            <FormControl>
                              <Input
                                type="range"
                                min="0"
                                max="100"
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skills</FormLabel>
                          <div className="h-24 border rounded-md p-2 mb-2 overflow-auto">
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((skill, index) => (
                                <div
                                  key={index}
                                  className="bg-primary/10 px-2 py-1 rounded text-sm flex items-center gap-1"
                                >
                                  {skill}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="text-muted-foreground hover:text-foreground ml-1"
                                    aria-label={`Remove ${skill} skill`}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add skill"
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyDown={handleKeyDown}
                              maxLength={30}
                              aria-label="Add a skill"
                            />
                            <Button type="button" variant="outline" size="sm" onClick={handleAddSkill}>
                              Add
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter className="flex-shrink-0 pt-4 border-t mt-auto form-buttons">
                  <Button type="submit" className="w-full sm:w-auto" disabled={isAddingEmployee}>
                    {isAddingEmployee ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Adding...
                      </span>
                    ) : (
                      "Add Employee"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Employee Dialog - Only render when open to avoid context issues */}
      {isEditDialogOpen && selectedEmployee && (
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            if (!formOperationInProgress.current) {
              setIsEditDialogOpen(open)
            }
          }}
        >
          <DialogContent className="sm:max-w-[525px] flex flex-col">
            <MobileDialogClose />
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>Make changes to {selectedEmployee?.name}'s profile.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  form.handleSubmit(handleEditEmployee)(e)
                }}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={50} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={50} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={50} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} maxLength={100} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="1234567890"
                                {...field}
                                maxLength={10}
                                aria-describedby="phone-description"
                              />
                            </FormControl>
                            <p id="phone-description" className="text-xs text-muted-foreground mt-1">
                              10-digit number with no spaces or special characters
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mentor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mentor</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a mentor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {mentors.map((mentor) => (
                                  <SelectItem key={mentor} value={mentor}>
                                    {mentor}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormDatePicker
                        control={form.control}
                        name="startDate"
                        label="Start Date"
                        placeholder="Select start date"
                        disablePastDates={false}
                      />
                      <FormField
                        control={form.control}
                        name="progress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Progress ({field.value}%)</FormLabel>
                            <FormControl>
                              <Input
                                type="range"
                                min="0"
                                max="100"
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                                value={field.value}
                                aria-valuemin="0"
                                aria-valuemax="100"
                                aria-valuenow={field.value}
                                aria-valuetext={`${field.value} percent`}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skills</FormLabel>
                          <div className="h-24 border rounded-md p-2 mb-2 overflow-auto">
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((skill, index) => (
                                <div
                                  key={index}
                                  className="bg-primary/10 px-2 py-1 rounded text-sm flex items-center gap-1"
                                >
                                  {skill}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(skill)}
                                    className="text-muted-foreground hover:text-foreground ml-1"
                                    aria-label={`Remove ${skill} skill`}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add skill"
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyDown={handleKeyDown}
                              maxLength={30}
                              aria-label="Add a skill"
                            />
                            <Button type="button" variant="outline" size="sm" onClick={handleAddSkill}>
                              Add
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter className="flex-shrink-0 pt-4 border-t mt-auto form-buttons">
                  <Button type="submit" className="w-full sm:w-auto" disabled={isEditingEmployee}>
                    {isEditingEmployee ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Employee Confirmation Dialog */}
    </div>
  )
}

