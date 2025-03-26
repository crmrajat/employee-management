"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  MobileDialogClose,
} from "@/components/ui/dialog"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Search,
  Upload,
  FileText,
  File,
  FileIcon as FilePdf,
  FileImage,
  FileSpreadsheet,
  Download,
  FolderOpen,
  Plus,
  Trash2,
} from "lucide-react"
import { documentSchema, librarySchema } from "@/lib/validations"
import { formatDate } from "@/lib/utils"
import { EmptyState, TableContainer } from "@/components/ui-components"
import { toast } from "sonner"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"

// Sample data
const initialDocuments = [
  {
    id: 1,
    name: "Employee Handbook 2023.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadedBy: "Admin",
    uploadedAt: "2023-05-15",
    category: "Policies",
    content:
      "This comprehensive guide outlines all company policies, procedures, and expectations for employees. It includes information on benefits, time off, code of conduct, and more.",
  },
  {
    id: 2,
    name: "Onboarding Checklist.xlsx",
    type: "spreadsheet",
    size: "1.1 MB",
    uploadedBy: "HR Manager",
    uploadedAt: "2023-06-22",
    category: "Onboarding",
    content:
      "A detailed checklist for new employee onboarding, including IT setup, training requirements, paperwork, and introductory meetings.",
  },
  {
    id: 3,
    name: "Company Structure.png",
    type: "image",
    size: "3.7 MB",
    uploadedBy: "Admin",
    uploadedAt: "2023-04-10",
    category: "Organization",
    content: "An organizational chart showing the company's structure, departments, and reporting relationships.",
  },
  {
    id: 4,
    name: "Training Materials.pdf",
    type: "pdf",
    size: "5.2 MB",
    uploadedBy: "Training Manager",
    uploadedAt: "2023-07-05",
    category: "Training",
    content:
      "Training materials for new employees, including product knowledge, systems training, and company processes.",
  },
  {
    id: 5,
    name: "Benefits Overview.pdf",
    type: "pdf",
    size: "1.8 MB",
    uploadedBy: "HR Manager",
    uploadedAt: "2023-03-18",
    category: "Benefits",
    content:
      "An overview of employee benefits, including health insurance, retirement plans, and other perks offered by the company.",
  },
]

const resourceLibraries = [
  {
    id: 1,
    name: "HR Policies",
    description: "Company policies and procedures",
    documentCount: 12,
    documents: [
      { id: 1, name: "Employee Handbook.pdf", type: "pdf", size: "2.4 MB", uploadedAt: "2023-05-15" },
      { id: 2, name: "Code of Conduct.pdf", type: "pdf", size: "1.2 MB", uploadedAt: "2023-04-10" },
      { id: 3, name: "Remote Work Policy.pdf", type: "pdf", size: "0.8 MB", uploadedAt: "2023-06-22" },
    ],
  },
  {
    id: 2,
    name: "Training Materials",
    description: "Resources for employee development",
    documentCount: 8,
    documents: [
      { id: 1, name: "New Hire Training.pdf", type: "pdf", size: "3.5 MB", uploadedAt: "2023-07-05" },
      { id: 2, name: "Leadership Development.pptx", type: "file", size: "4.2 MB", uploadedAt: "2023-06-15" },
      { id: 3, name: "Technical Skills Workshop.pdf", type: "pdf", size: "2.8 MB", uploadedAt: "2023-05-20" },
    ],
  },
  {
    id: 3,
    name: "Onboarding Resources",
    description: "Materials for new employees",
    documentCount: 5,
    documents: [
      { id: 1, name: "Welcome Guide.pdf", type: "pdf", size: "1.5 MB", uploadedAt: "2023-06-10" },
      { id: 2, name: "First Week Schedule.xlsx", type: "spreadsheet", size: "0.7 MB", uploadedAt: "2023-06-12" },
      { id: 3, name: "IT Setup Instructions.pdf", type: "pdf", size: "1.2 MB", uploadedAt: "2023-06-15" },
    ],
  },
  {
    id: 4,
    name: "Technical Documentation",
    description: "Technical guides and references",
    documentCount: 15,
    documents: [
      { id: 1, name: "API Documentation.pdf", type: "pdf", size: "4.5 MB", uploadedAt: "2023-05-25" },
      { id: 2, name: "System Architecture.png", type: "image", size: "2.3 MB", uploadedAt: "2023-04-18" },
      { id: 3, name: "Database Schema.pdf", type: "pdf", size: "3.1 MB", uploadedAt: "2023-06-05" },
    ],
  },
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(initialDocuments)
  const [libraries, setLibraries] = useState(resourceLibraries)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadingFile, setUploadingFile] = useState(null)
  const [isAddLibraryDialogOpen, setIsAddLibraryDialogOpen] = useState(false)
  const [isViewDocumentDialogOpen, setIsViewDocumentDialogOpen] = useState(false)
  const [isViewLibraryDialogOpen, setIsViewLibraryDialogOpen] = useState(false)
  const [selectedLibrary, setSelectedLibrary] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [uploadDate, setUploadDate] = useState<Date | undefined>(undefined)
  const [documentToDelete, setDocumentToDelete] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [libraryToDelete, setLibraryToDelete] = useState(null)
  const [isDeleteLibraryDialogOpen, setIsDeleteLibraryDialogOpen] = useState(false)

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const documentForm = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: "",
      category: "",
    },
  })

  const libraryForm = useForm({
    resolver: zodResolver(librarySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]
      setUploadingFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        type: getFileType(file.name),
      })

      // Auto-fill the document form with the file name
      const fileName = file.name
      const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf("."))
      documentForm.setValue("name", fileNameWithoutExtension)

      // Set today's date as the default upload date
      setUploadDate(new Date())
    }
  }

  const getFileType = (filename) => {
    const extension = filename.split(".").pop().toLowerCase()
    if (["pdf"].includes(extension)) return "pdf"
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image"
    if (["xlsx", "xls", "csv"].includes(extension)) return "spreadsheet"
    return "file"
  }

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FilePdf className="h-10 w-10 text-red-500" />
      case "image":
        return <FileImage className="h-10 w-10 text-blue-500" />
      case "spreadsheet":
        return <FileSpreadsheet className="h-10 w-10 text-green-500" />
      default:
        return <File className="h-10 w-10 text-gray-500" />
    }
  }

  const handleUpload = async (data) => {
    if (uploadingFile) {
      setIsUploading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Validate that upload date is not in the future
        if (!uploadDate) {
          toast.error("Date required", {
            description: "Please select an upload date.",
            className: "toast-error",
          })
          setIsUploading(false)
          return
        }

        const formattedUploadDate = format(uploadDate, "yyyy-MM-dd")
        const uploadDateObj = new Date(formattedUploadDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (uploadDateObj > today) {
          toast.error("Invalid date", {
            description: "Upload date cannot be in the future.",
            className: "toast-error",
          })
          setIsUploading(false)
          return
        }

        const newDocument = {
          id: documents.length > 0 ? Math.max(...documents.map((d) => d.id)) + 1 : 1,
          name: `${data.name}.${uploadingFile.name.split(".").pop()}`,
          type: uploadingFile.type,
          size: uploadingFile.size,
          uploadedBy: "Current User",
          uploadedAt: formattedUploadDate,
          category: data.category,
          content: "This is a newly uploaded document.",
        }
        setDocuments([...documents, newDocument])
        setUploadingFile(null)
        documentForm.reset()
        setUploadDate(undefined)

        toast.success("Document uploaded", {
          description: `${newDocument.name} has been uploaded successfully.`,
          className: "toast-success",
        })
      } catch (error) {
        toast.error("Upload failed", {
          description: "There was an error uploading your document. Please try again.",
          className: "toast-error",
        })
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleAddLibrary = (data) => {
    const newLibrary = {
      id: libraries.length > 0 ? Math.max(...libraries.map((l) => l.id)) + 1 : 1,
      name: data.name,
      description: data.description,
      documentCount: 0,
      documents: [],
    }
    setLibraries([...libraries, newLibrary])
    setIsAddLibraryDialogOpen(false)
    libraryForm.reset()

    toast.success("Library created", {
      description: `${data.name} library has been created successfully.`,
      className: "toast-success",
    })
  }

  const confirmDeleteDocument = (doc, e) => {
    if (e) e.stopPropagation()
    setDocumentToDelete(doc)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteDocument = () => {
    if (!documentToDelete) return

    const doc = documentToDelete
    setDocuments(documents.filter((d) => d.id !== doc.id))
    if (selectedFile && selectedFile.id === doc.id) {
      setSelectedFile(null)
    }
    setIsDeleteDialogOpen(false)
    setDocumentToDelete(null)

    toast("Document deleted", {
      description: `"${doc.name}" has been removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          setDocuments((prev) => [...prev, doc].sort((a, b) => a.id - b.id))
          toast.success("Action undone", {
            description: `"${doc.name}" has been restored.`,
            className: "toast-success",
          })
        },
      },
      className: "toast-default",
    })
  }

  const confirmDeleteLibrary = (library, e) => {
    if (e) e.stopPropagation()
    setLibraryToDelete(library)
    setIsDeleteLibraryDialogOpen(true)
  }

  const handleDeleteLibrary = () => {
    if (!libraryToDelete) return

    const library = libraryToDelete
    setLibraries(libraries.filter((lib) => lib.id !== library.id))
    setIsDeleteLibraryDialogOpen(false)
    setLibraryToDelete(null)

    toast("Library deleted", {
      description: `"${library.name}" library has been removed.`,
      action: {
        label: "Undo",
        onClick: () => {
          setLibraries((prev) => [...prev, library].sort((a, b) => a.id - b.id))
          toast.success("Action undone", {
            description: `"${library.name}" library has been restored.`,
            className: "toast-success",
          })
        },
      },
      className: "toast-default",
    })
  }

  const handleBrowseLibrary = (library) => {
    setSelectedLibrary(library)
    setIsViewLibraryDialogOpen(true)
  }

  const handleViewDocument = (doc) => {
    setSelectedFile(doc)
    setIsViewDocumentDialogOpen(true)
  }

  const handleDownloadDocument = (doc, e) => {
    if (e) e.stopPropagation()

    toast.success("Document downloaded", {
      description: `${doc.name} has been downloaded.`,
      className: "toast-success",
    })
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Document Management</h1>
        </div>

        <Tabs defaultValue="documents">
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="documents" className="flex-1">
              Document Upload
            </TabsTrigger>
            <TabsTrigger value="libraries" className="flex-1">
              Resource Libraries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Document</CardTitle>
                  <CardDescription>Add new documents to the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                      tabIndex={0}
                      role="button"
                      aria-label="Upload document"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          document.getElementById("file-upload").click()
                        }
                      }}
                      onClick={() => document.getElementById("file-upload").click()}
                    >
                      <Input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileChange}
                        aria-label="Upload file"
                      />
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX, JPG, PNG (Max 10MB)</p>
                    </div>

                    {uploadingFile && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon(uploadingFile.type)}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{uploadingFile.name}</p>
                            <p className="text-xs text-muted-foreground">{uploadingFile.size}</p>
                          </div>
                        </div>

                        <Form {...documentForm}>
                          <form onSubmit={documentForm.handleSubmit(handleUpload)} className="space-y-4 mt-4">
                            <FormField
                              control={documentForm.control}
                              name="name"
                              rules={{
                                validate: {
                                  noSpecialChars: (value) =>
                                    /^[a-zA-Z0-9\s-_]+$/.test(value) ||
                                    "Document name cannot contain special characters except hyphens and underscores",
                                },
                              }}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Document Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} maxLength={100} />
                                  </FormControl>
                                  <FormMessage />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {field.value.length}/100 characters
                                  </p>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={documentForm.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <FormControl>
                                    <Input {...field} maxLength={50} placeholder="e.g., Policies, Training, HR" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Find the DatePicker in the document upload form */}
                            <FormItem className="flex flex-col">
                              <FormLabel>Upload Date</FormLabel>
                              <DatePicker date={uploadDate} setDate={setUploadDate} disablePastDates={false} />
                              {!uploadDate && documentForm.formState.isSubmitted && (
                                <p className="text-sm font-medium text-destructive">Upload date is required</p>
                              )}
                              <FormMessage />
                            </FormItem>

                            <Button type="submit" className="w-full" disabled={isUploading}>
                              {isUploading ? (
                                <span className="flex items-center gap-2">
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                  Uploading...
                                </span>
                              ) : (
                                "Upload File"
                              )}
                            </Button>
                          </form>
                        </Form>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4">
                    <CardTitle>Documents</CardTitle>
                    <div className="relative w-full">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setIsSearching(true)
                          // Simulate search delay
                          setTimeout(() => setIsSearching(false), 300)
                        }}
                        aria-label="Search documents"
                      />
                      {isSearching && (
                        <div className="absolute right-2 top-2.5">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[400px] overflow-auto">
                    {filteredDocuments.length > 0 ? (
                      <TableContainer>
                        <div className="space-y-2">
                          {filteredDocuments.map((doc) => (
                            <div
                              key={doc.id}
                              className="p-3 rounded-md flex items-center gap-3 hover:bg-muted"
                              onClick={() => handleViewDocument(doc)}
                            >
                              <div className="flex-shrink-0">{getFileIcon(doc.type)}</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{doc.name}</p>
                                <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                                  <span>{doc.size}</span>
                                  <span className="hidden xs:inline">•</span>
                                  <span className="hidden xs:inline">{formatDate(doc.uploadedAt)}</span>
                                </div>
                                <div className="mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {doc.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDownloadDocument(doc, e)
                                  }}
                                  aria-label={`Download ${doc.name}`}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    confirmDeleteDocument(doc, e)
                                  }}
                                  aria-label={`Delete ${doc.name}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableContainer>
                    ) : (
                      <EmptyState
                        icon={<FileText className="h-8 w-8 text-muted-foreground" />}
                        title="No documents found"
                        description={
                          searchTerm ? "Try adjusting your search terms" : "Upload your first document to get started"
                        }
                        actionLabel={searchTerm ? "Clear search" : "Upload Document"}
                        action={
                          searchTerm ? () => setSearchTerm("") : () => document.getElementById("file-upload").click()
                        }
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="libraries">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {libraries.map((library) => (
                <Card key={library.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5 text-primary" />
                        {library.name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          confirmDeleteLibrary(library, e)
                        }}
                        aria-label={`Delete ${library.name} library`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{library.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      <span className="font-medium">{library.documentCount}</span> documents in this library
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleBrowseLibrary(library)}>
                      Browse Library
                    </Button>
                  </CardFooter>
                </Card>
              ))}

              <Dialog open={isAddLibraryDialogOpen} onOpenChange={setIsAddLibraryDialogOpen}>
                <DialogTrigger asChild>
                  <Card
                    className="border-dashed hover:shadow-md transition-shadow cursor-pointer"
                    tabIndex={0}
                    role="button"
                    aria-label="Create new library"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setIsAddLibraryDialogOpen(true)
                      }
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-muted-foreground">Create New Library</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                      <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm text-center text-muted-foreground">
                        Create a new resource library to organize your documents
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Create Library
                      </Button>
                    </CardFooter>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Library</DialogTitle>
                    <DialogDescription>Create a new resource library to organize your documents.</DialogDescription>
                  </DialogHeader>
                  <Form {...libraryForm}>
                    <form onSubmit={libraryForm.handleSubmit(handleAddLibrary)} className="space-y-4">
                      <FormField
                        control={libraryForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Library Name</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={50} placeholder="e.g., HR Policies" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={libraryForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={200} placeholder="Brief description of the library" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button type="submit">Create Library</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>

        {/* View Document Dialog */}
        <Dialog open={isViewDocumentDialogOpen} onOpenChange={setIsViewDocumentDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-w-[95vw]">
            <MobileDialogClose />
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedFile && getFileIcon(selectedFile.type)}
                <span>{selectedFile?.name || "Document Preview"}</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                {selectedFile && (
                  <div className="flex flex-wrap items-center gap-1 mt-1">
                    <span>{selectedFile.size}</span>
                    <span>•</span>
                    <span>Uploaded {formatDate(selectedFile.uploadedAt)}</span>
                    <span>•</span>
                    <span>Category: {selectedFile.category}</span>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 border rounded-md bg-muted/30 max-h-[400px] overflow-auto">
              {selectedFile?.type === "image" ? (
                <div className="flex justify-center">
                  <img
                    src={`/placeholder.svg?height=300&width=500`}
                    alt={selectedFile?.name}
                    className="max-w-full h-auto rounded-md"
                  />
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <p>{selectedFile?.content}</p>
                  {selectedFile?.type === "pdf" && (
                    <div className="mt-4 p-4 bg-muted rounded-md text-center text-sm text-muted-foreground">
                      PDF preview not available in this view. Please download the document to view its contents.
                    </div>
                  )}
                </div>
              )}
            </div>
            <DialogFooter className="flex flex-col gap-2">
              <Button className="w-full" onClick={() => handleDownloadDocument(selectedFile)}>
                Download
              </Button>
              <Button variant="outline" className="w-full md:hidden" onClick={() => setIsViewDocumentDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Browse Library Dialog */}
        <Dialog open={isViewLibraryDialogOpen} onOpenChange={setIsViewLibraryDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-w-[95vw]">
            <MobileDialogClose />
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                {selectedLibrary?.name}
              </DialogTitle>
              <DialogDescription>{selectedLibrary?.description}</DialogDescription>
            </DialogHeader>
            <div className="max-h-[400px] overflow-auto">
              {selectedLibrary?.documents && selectedLibrary.documents.length > 0 ? (
                <div className="space-y-2">
                  {selectedLibrary.documents.map((doc) => (
                    <div key={doc.id} className="p-3 rounded-md flex items-center gap-3 hover:bg-muted">
                      {getFileIcon(doc.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.name}</p>
                        <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                          <span>{doc.size}</span>
                          <span className="hidden xs:inline">•</span>
                          <span className="hidden xs:inline">Uploaded {formatDate(doc.uploadedAt)}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownloadDocument(doc)
                          }}
                          aria-label={`Download ${doc.name}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <EmptyState
                    icon={<FileText className="h-8 w-8 text-muted-foreground" />}
                    title="No documents in this library"
                    description="This library doesn't have any documents yet."
                  />
                </div>
              )}
            </div>
            <DialogFooter className="flex flex-col gap-2">
              <Button variant="outline" className="w-full md:hidden" onClick={() => setIsViewLibraryDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Document Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Document</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{documentToDelete?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDocumentToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteDocument} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Library Confirmation Dialog */}
        <AlertDialog open={isDeleteLibraryDialogOpen} onOpenChange={setIsDeleteLibraryDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Library</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the "{libraryToDelete?.name}" library? This will remove all documents
                within this library. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setLibraryToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteLibrary} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

