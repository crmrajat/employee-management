"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Clock, CheckCircle2, Circle, FileText, Users, MessageSquare, BookOpen, Star } from "lucide-react"
import { feedbackSchema } from "@/lib/validations"
import { formatDate } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  MobileDialogClose,
} from "@/components/safe-dialog"
import { toast } from "sonner"

// Sample data
const onboardingTimeline = [
  {
    id: 1,
    title: "Pre-Boarding",
    description: "Complete before your first day",
    progress: 100,
    steps: [
      { id: 1, title: "Accept Offer Letter", completed: true, date: "2023-07-15" },
      { id: 2, title: "Complete Background Check", completed: true, date: "2023-07-18" },
      { id: 3, title: "Submit Required Documents", completed: true, date: "2023-07-20" },
    ],
  },
  {
    id: 2,
    title: "First Day",
    description: "Your first day at the company",
    progress: 100,
    steps: [
      { id: 1, title: "Orientation Session", completed: true, date: "2023-08-01" },
      { id: 2, title: "IT Setup and Access", completed: true, date: "2023-08-01" },
      { id: 3, title: "Meet Your Team", completed: true, date: "2023-08-01" },
    ],
  },
  {
    id: 3,
    title: "First Week",
    description: "Getting familiar with the company",
    progress: 66,
    steps: [
      { id: 1, title: "Department Overview", completed: true, date: "2023-08-02" },
      { id: 2, title: "Training Sessions", completed: true, date: "2023-08-03" },
      { id: 3, title: "Project Introduction", completed: false, scheduled: "2023-08-05" },
    ],
  },
  {
    id: 4,
    title: "First Month",
    description: "Becoming part of the team",
    progress: 0,
    steps: [
      { id: 1, title: "Complete Required Training", completed: false, scheduled: "2023-08-15" },
      { id: 2, title: "First Project Assignment", completed: false, scheduled: "2023-08-20" },
      { id: 3, title: "30-Day Review Meeting", completed: false, scheduled: "2023-09-01" },
    ],
  },
]

const resources = [
  {
    id: 1,
    title: "Employee Handbook",
    type: "document",
    description: "Complete guide to company policies and procedures",
    icon: <FileText className="h-8 w-8 text-primary" />,
  },
  {
    id: 2,
    title: "Organization Chart",
    type: "document",
    description: "Overview of company structure and departments",
    icon: <Users className="h-8 w-8 text-primary" />,
  },
  {
    id: 3,
    title: "Training Portal",
    type: "link",
    description: "Access to all required training materials",
    icon: <BookOpen className="h-8 w-8 text-primary" />,
  },
  {
    id: 4,
    title: "IT Support",
    type: "contact",
    description: "Get help with technical issues",
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
  },
]

export default function OnboardingPage() {
  const [activeTimeline, setActiveTimeline] = useState(onboardingTimeline[2]) // First Week is active
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isViewDocumentDialogOpen, setIsViewDocumentDialogOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)

  const form = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      feedback: "",
    },
  })

  const handleSubmitFeedback = async (data) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success("Feedback submitted", {
        description: `Thank you for your feedback! You rated your experience ${data.rating}/5.`,
      })
      form.reset()
    } catch (error) {
      toast.error("Failed to submit feedback", {
        description: "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Onboarding</h1>
        </div>

        <Tabs defaultValue="timeline">
          <TabsList className="mb-6">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {onboardingTimeline.map((phase) => (
                <Card
                  key={phase.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    activeTimeline.id === phase.id ? "border-primary" : ""
                  }`}
                  onClick={() => setActiveTimeline(phase)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{phase.title}</CardTitle>
                      <Badge variant={phase.progress === 100 ? "success" : "outline"} className="ml-2">
                        {phase.progress === 100 ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                    <CardDescription>{phase.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="mb-1">
                      <span className="text-sm font-medium">{phase.progress}% Complete</span>
                    </div>
                    <Progress value={phase.progress} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{activeTimeline.title} Timeline</CardTitle>
                <CardDescription>{activeTimeline.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="max-h-[400px] overflow-auto">
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted" />
                    <div className="space-y-6 sm:space-y-8 relative ml-4 sm:ml-6">
                      {activeTimeline.steps.map((step, index) => (
                        <div key={step.id} className="relative pb-2">
                          <div className="absolute -left-4 sm:-left-6 mt-1.5 flex items-center justify-center">
                            <div
                              className={`rounded-full p-1 ${
                                step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {step.completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                            </div>
                          </div>
                          <div className="flex flex-col space-y-1.5 pl-4 sm:pl-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium">{step.title}</h3>
                              {step.completed ? (
                                <Badge variant="outline" className="text-xs">
                                  Completed
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Pending
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                              <span className="line-clamp-2">
                                {step.completed ? (
                                  <span>Completed on {formatDate(step.date)}</span>
                                ) : (
                                  <span>Scheduled for {formatDate(step.scheduled)}</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Feedback</CardTitle>
                <CardDescription>Share your experience with the onboarding process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmitFeedback)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>How would you rate your onboarding experience?</FormLabel>
                          <div className="flex gap-2 mt-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Button
                                key={rating}
                                type="button"
                                variant={field.value === rating ? "default" : "outline"}
                                size="icon"
                                className="h-10 w-10"
                                onClick={() => field.onChange(rating)}
                                aria-label={`Rate ${rating} out of 5 stars`}
                                aria-pressed={field.value === rating}
                                tabIndex={0}
                              >
                                <Star className={`h-5 w-5 ${field.value >= rating ? "fill-current" : ""}`} />
                              </Button>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="feedback"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What could we improve?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share your thoughts and suggestions..."
                              rows={5}
                              maxLength={500}
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">
                            {form.getValues().feedback.length}/500 characters
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button type="submit" disabled={form.getValues().rating === 0 || isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Feedback"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">{resource.icon}</div>
                      <div>
                        <CardTitle>{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setSelectedResource(resource)
                        setIsViewDocumentDialogOpen(true)
                      }}
                    >
                      {resource.type === "document"
                        ? "View Document"
                        : resource.type === "link"
                          ? "Access Resource"
                          : "Contact"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={isViewDocumentDialogOpen} onOpenChange={setIsViewDocumentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <MobileDialogClose />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedResource?.icon}
              <span>{selectedResource?.title}</span>
            </DialogTitle>
            <DialogDescription>{selectedResource?.description}</DialogDescription>
          </DialogHeader>
          <div className="p-4 border rounded-md bg-muted/30 max-h-[400px] overflow-auto">
            <div className="prose prose-sm max-w-none">
              {selectedResource?.type === "document" ? (
                <div>
                  <p>
                    This is the content of the {selectedResource?.title}. It contains important information about
                    company policies, procedures, and guidelines that all employees should be familiar with.
                  </p>
                  <p>The document covers topics such as:</p>
                  <ul>
                    <li>Company mission and values</li>
                    <li>Code of conduct</li>
                    <li>Employment policies</li>
                    <li>Benefits and compensation</li>
                    <li>Time off and leave policies</li>
                    <li>IT and security guidelines</li>
                  </ul>
                  <p>Please review this document carefully and reach out to HR if you have any questions.</p>
                </div>
              ) : selectedResource?.type === "link" ? (
                <div className="text-center p-4">
                  <p>This resource is available through an external link. Click the button below to access it.</p>
                </div>
              ) : (
                <div className="text-center p-4">
                  <p>Contact information and details for {selectedResource?.title}.</p>
                  <p className="mt-2">Email: support@example.com</p>
                  <p>Phone: (555) 123-4567</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2">
            <Button variant="outline" className="md:hidden" onClick={() => setIsViewDocumentDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

