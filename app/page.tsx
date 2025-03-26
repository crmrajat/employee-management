import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  FileText,
  GraduationCap,
  UserPlus,
  Bell,
  BarChart3,
  Calendar,
  CheckSquare,
  Upload,
  BookOpen,
  Clock,
  MessageSquare,
} from "lucide-react"

export default function Home() {
  const features = [
    {
      title: "Profile Management",
      description: "Manage employee profiles, mentor assignments, and track progress",
      icon: <Users className="h-6 w-6" />,
      link: "/profiles",
      subfeatures: [
        { name: "Employee Profiles", icon: <Users className="h-4 w-4" /> },
        { name: "Mentor Assignment", icon: <Users className="h-4 w-4" /> },
        { name: "Progress Tracking", icon: <BarChart3 className="h-4 w-4" /> },
      ],
    },
    {
      title: "Document Management",
      description: "Upload documents and access resource libraries",
      icon: <FileText className="h-6 w-6" />,
      link: "/documents",
      subfeatures: [
        { name: "Document Upload System", icon: <Upload className="h-4 w-4" /> },
        { name: "Resource Libraries", icon: <BookOpen className="h-4 w-4" /> },
      ],
    },
    {
      title: "Training & Development",
      description: "Schedule training, manage task checklists, and track progress",
      icon: <GraduationCap className="h-6 w-6" />,
      link: "/training",
      subfeatures: [
        { name: "Training Schedule", icon: <Calendar className="h-4 w-4" /> },
        { name: "Task Checklists", icon: <CheckSquare className="h-4 w-4" /> },
        { name: "Interactive Progress Tracking", icon: <BarChart3 className="h-4 w-4" /> },
      ],
    },
    {
      title: "Onboarding",
      description: "View timelines, submit feedback, and access resources",
      icon: <UserPlus className="h-6 w-6" />,
      link: "/onboarding",
      subfeatures: [
        { name: "Timeline Views", icon: <Clock className="h-4 w-4" /> },
        { name: "Feedback Forms", icon: <MessageSquare className="h-4 w-4" /> },
        { name: "Resource Access", icon: <BookOpen className="h-4 w-4" /> },
      ],
    },
    {
      title: "Notification System",
      description: "Stay updated with important announcements and reminders",
      icon: <Bell className="h-6 w-6" />,
      link: "/notifications",
      subfeatures: [],
    },
  ]

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold mb-3">Employee Management System</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A simple and efficient way to manage your team, track progress, and streamline onboarding processes
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow border-muted">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="bg-primary/10 p-2 rounded-full">{feature.icon}</div>
                <div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {feature.subfeatures.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {feature.subfeatures.map((subfeature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        {subfeature.icon}
                        <span>{subfeature.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4">
                  <Link href={feature.link}>
                    <Button className="w-full">Access {feature.title}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

