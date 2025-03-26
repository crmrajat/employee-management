"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Info, AlertCircle, Calendar, CheckCircle2, X } from "lucide-react"
import { formatDateTime } from "@/lib/utils"
import { EmptyState, ScrollableContent, TableContainer } from "@/components/ui-components"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Sample data
const initialNotifications = [
  {
    id: 1,
    title: "New Training Available",
    message: "A new leadership training course is now available. Register before August 15.",
    type: "info",
    date: "2023-08-01T10:30:00",
    read: false,
  },
  {
    id: 2,
    title: "Document Review Required",
    message: "Please review and sign the updated company policy document by August 10.",
    type: "alert",
    date: "2023-08-02T09:15:00",
    read: false,
  },
  {
    id: 3,
    title: "Meeting Reminder",
    message: "Team meeting scheduled for tomorrow at 2:00 PM in Conference Room A. Please bring your project updates.",
    type: "reminder",
    date: "2023-08-03T14:30:00",
    read: true,
  },
  {
    id: 4,
    title: "Onboarding Progress Update",
    message: "You have completed 75% of your onboarding tasks. Keep up the good work!",
    type: "success",
    date: "2023-08-03T16:45:00",
    read: true,
  },
  {
    id: 5,
    title: "Feedback Requested",
    message: "Please provide feedback on your recent training session by August 7.",
    type: "info",
    date: "2023-08-04T11:20:00",
    read: false,
  },
]

const notificationSettings = [
  {
    id: 1,
    category: "Training & Development",
    settings: [
      { id: 1, name: "New Training Courses", enabled: true },
      { id: 2, name: "Training Reminders", enabled: true },
      { id: 3, name: "Certification Updates", enabled: false },
    ],
  },
  {
    id: 2,
    category: "Documents & Resources",
    settings: [
      { id: 1, name: "New Document Uploads", enabled: true },
      { id: 2, name: "Document Review Requests", enabled: true },
      { id: 3, name: "Resource Updates", enabled: false },
    ],
  },
  {
    id: 3,
    category: "Meetings & Events",
    settings: [
      { id: 1, name: "Meeting Invitations", enabled: true },
      { id: 2, name: "Meeting Reminders", enabled: true },
      { id: 3, name: "Event Announcements", enabled: true },
    ],
  },
  {
    id: 4,
    category: "Onboarding",
    settings: [
      { id: 1, name: "Task Reminders", enabled: true },
      { id: 2, name: "Progress Updates", enabled: true },
      { id: 3, name: "Feedback Requests", enabled: false },
    ],
  },
]

export default function NotificationsPage() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [settings, setSettings] = useState(notificationSettings)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )

    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    })
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))

    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    })
  }

  const deleteNotification = (id) => {
    const notificationToDelete = notifications.find((n) => n.id === id)
    setNotifications(notifications.filter((notification) => notification.id !== id))

    const { dismiss } = toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
      action: (
        <Button
          variant="outline"
          size="sm"
          className="mt-2 sm:mt-0"
          onClick={() => {
            setNotifications((prev) => [...prev, notificationToDelete].sort((a, b) => a.id - b.id))
            dismiss()
            toast({
              title: "Action undone",
              description: "The notification has been restored.",
            })
          }}
        >
          Undo
        </Button>
      ),
    })
  }

  const toggleSetting = (categoryId, settingId) => {
    const updatedSettings = settings.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          settings: category.settings.map((setting) => {
            if (setting.id === settingId) {
              return { ...setting, enabled: !setting.enabled }
            }
            return setting
          }),
        }
      }
      return category
    })

    setSettings(updatedSettings)

    // Find the setting that was toggled
    const category = updatedSettings.find((c) => c.id === categoryId)
    const setting = category.settings.find((s) => s.id === settingId)

    toast({
      title: `${setting.enabled ? "Enabled" : "Disabled"} ${setting.name}`,
      description: `You will ${setting.enabled ? "now" : "no longer"} receive notifications for ${setting.name.toLowerCase()}.`,
    })
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "alert":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "reminder":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const [notificationToDelete, setNotificationToDelete] = useState(null)
  const [isDeleteNotificationDialogOpen, setIsDeleteNotificationDialogOpen] = useState(false)

  const confirmDeleteNotification = (id) => {
    const notification = notifications.find((n) => n.id === id)
    setNotificationToDelete(notification)
    setIsDeleteNotificationDialogOpen(true)
  }

  const handleDeleteNotification = () => {
    if (notificationToDelete) {
      deleteNotification(notificationToDelete.id)
      setIsDeleteNotificationDialogOpen(false)
      setNotificationToDelete(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>

        <Tabs defaultValue="notifications">
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="notifications" className="relative flex-1">
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <CardTitle>Your Notifications</CardTitle>
                  {unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead} className="w-full sm:w-auto">
                      Mark all as read
                    </Button>
                  )}
                </div>
                <CardDescription>Stay updated with important announcements and reminders</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollableContent maxHeight="500px">
                  {notifications.length > 0 ? (
                    <TableContainer>
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`flex gap-3 p-4 rounded-lg ${
                              notification.read ? "bg-muted/50" : "bg-primary/5 border border-primary/20"
                            }`}
                          >
                            <div className="mt-1 flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                <h3 className={`font-medium ${!notification.read ? "text-primary" : ""}`}>
                                  {notification.title}
                                </h3>
                                <div className="flex items-center gap-2 order-first sm:order-last">
                                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {formatDateTime(notification.date)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      confirmDeleteNotification(notification.id)
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2 h-8 text-xs"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark as read
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TableContainer>
                  ) : (
                    <EmptyState
                      icon={<Bell className="h-12 w-12 text-muted-foreground" />}
                      title="No notifications"
                      description="You're all caught up! Check back later for new notifications."
                    />
                  )}
                </ScrollableContent>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Customize which notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollableContent maxHeight="500px">
                  <div className="space-y-6">
                    {settings.map((category) => (
                      <div key={category.id}>
                        <h3 className="font-medium text-lg mb-3">{category.category}</h3>
                        <div className="space-y-3">
                          {category.settings.map((setting) => (
                            <div
                              key={setting.id}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                            >
                              <Label htmlFor={`${category.id}-${setting.id}`} className="cursor-pointer">
                                {setting.name}
                              </Label>
                              <Switch
                                id={`${category.id}-${setting.id}`}
                                checked={setting.enabled}
                                onCheckedChange={() => toggleSetting(category.id, setting.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollableContent>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <AlertDialog open={isDeleteNotificationDialogOpen} onOpenChange={setIsDeleteNotificationDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this notification? You can undo this action if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNotificationToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNotification}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

