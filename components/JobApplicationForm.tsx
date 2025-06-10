"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, FileText, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createSupabaseClient } from "@/lib/supabase"

interface JobPosition {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
}

interface JobApplicationFormProps {
  position: JobPosition
  onClose: () => void
}

export default function JobApplicationForm({ position, onClose }: JobApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    portfolioUrl: "",
    coverLetter: "",
    experienceYears: "",
    currentCompany: "",
    currentPosition: "",
    salaryExpectation: "",
    availabilityDate: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive",
        })
        return
      }

      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      setResumeFile(file)
    }
  }

  // Function to ensure the storage bucket exists
  const ensureStorageBucket = async (supabase: any) => {
    try {
      // Check if bucket exists
      const { data: buckets } = await supabase.storage.listBuckets()
      const bucketExists = buckets.some((bucket: any) => bucket.name === "job-applications")

      if (!bucketExists) {
        // Create the bucket if it doesn't exist
        const { error } = await supabase.storage.createBucket("job-applications", {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        })

        if (error) {
          console.error("Error creating bucket:", error)
          return false
        }

        // Set bucket policies
        const { error: policyError } = await supabase.storage.from("job-applications").createPolicy({
          name: "Public Access",
          definition: {
            statements: [
              {
                effect: "allow",
                principal: "*",
                action: "object:get",
                resource: "job-applications/*",
              },
              {
                effect: "allow",
                principal: "authenticated",
                action: "object:upload",
                resource: "job-applications/*",
              },
              {
                effect: "allow",
                principal: "anon",
                action: "object:upload",
                resource: "job-applications/*",
              },
            ],
          },
        })

        if (policyError) {
          console.error("Error setting bucket policy:", policyError)
          return false
        }
      }

      return true
    } catch (error) {
      console.error("Error checking/creating bucket:", error)
      return false
    }
  }

  const uploadResume = async (file: File): Promise<string | null> => {
    try {
      const supabase = createSupabaseClient()

      // Ensure the bucket exists with proper permissions
      const bucketReady = await ensureStorageBucket(supabase)
      if (!bucketReady) {
        console.error("Storage bucket not ready")
        return null
      }

      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `resumes/${fileName}`

      // Upload with progress tracking
      const { error: uploadError, data } = await supabase.storage.from("job-applications").upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
        onUploadProgress: (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100)
          setUploadProgress(percent)
        },
      })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        return null
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("job-applications").getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error("Error uploading resume:", error)
      return null
    }
  }

  // Function to send confirmation email
  const sendConfirmationEmail = async () => {
    try {
      const response = await fetch("/api/send-application-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          position: position.title,
        }),
      })

      if (!response.ok) {
        console.error("Failed to send confirmation email")
        // Don't block the application process if email fails
      }
    } catch (error) {
      console.error("Error sending confirmation email:", error)
      // Don't block the application process if email fails
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      const supabase = createSupabaseClient()

      // Upload resume if provided
      let resumeUrl = null
      if (resumeFile) {
        resumeUrl = await uploadResume(resumeFile)
        if (!resumeUrl) {
          toast({
            title: "Upload failed",
            description: "Failed to upload resume. Please try again or contact support.",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }
      }

      // Submit application
      const applicationData = {
        position_id: position.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        linkedin_url: formData.linkedinUrl || null,
        portfolio_url: formData.portfolioUrl || null,
        cover_letter: formData.coverLetter || null,
        resume_url: resumeUrl,
        experience_years: formData.experienceYears ? Number.parseInt(formData.experienceYears) : null,
        current_company: formData.currentCompany || null,
        current_position: formData.currentPosition || null,
        salary_expectation: formData.salaryExpectation ? Number.parseInt(formData.salaryExpectation) : null,
        availability_date: formData.availabilityDate || null,
      }

      const { error } = await supabase.from("job_applications").insert([applicationData])

      if (error) {
        console.error("Application submission error:", error)
        toast({
          title: "Submission failed",
          description: "Failed to submit application. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Send confirmation email
      await sendConfirmationEmail()

      toast({
        title: "Application submitted!",
        description: "Thank you for your interest. We'll be in touch soon.",
      })

      onClose()
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Submission failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Function to submit without resume if there are issues
  const handleSubmitWithoutResume = async () => {
    setResumeFile(null)

    try {
      setIsSubmitting(true)
      const supabase = createSupabaseClient()

      // Submit application without resume
      const applicationData = {
        position_id: position.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        linkedin_url: formData.linkedinUrl || null,
        portfolio_url: formData.portfolioUrl || null,
        cover_letter: formData.coverLetter || null,
        resume_url: null,
        experience_years: formData.experienceYears ? Number.parseInt(formData.experienceYears) : null,
        current_company: formData.currentCompany || null,
        current_position: formData.currentPosition || null,
        salary_expectation: formData.salaryExpectation ? Number.parseInt(formData.salaryExpectation) : null,
        availability_date: formData.availabilityDate || null,
      }

      const { error } = await supabase.from("job_applications").insert([applicationData])

      if (error) {
        console.error("Application submission error:", error)
        toast({
          title: "Submission failed",
          description: "Failed to submit application. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Send confirmation email
      await sendConfirmationEmail()

      toast({
        title: "Application submitted!",
        description: "Thank you for your interest. We'll be in touch soon.",
      })

      onClose()
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Submission failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground">Apply for {position.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {position.department}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {position.location}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {position.type}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-foreground">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-foreground">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-foreground">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-foreground">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Professional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentCompany" className="text-foreground">
                    Current Company
                  </Label>
                  <Input
                    id="currentCompany"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currentPosition" className="text-foreground">
                    Current Position
                  </Label>
                  <Input
                    id="currentPosition"
                    name="currentPosition"
                    value={formData.currentPosition}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experienceYears" className="text-foreground">
                    Years of Experience
                  </Label>
                  <Input
                    id="experienceYears"
                    name="experienceYears"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="salaryExpectation" className="text-foreground">
                    Salary Expectation (ZAR)
                  </Label>
                  <Input
                    id="salaryExpectation"
                    name="salaryExpectation"
                    type="number"
                    min="0"
                    value={formData.salaryExpectation}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="availabilityDate" className="text-foreground">
                  Availability Date
                </Label>
                <Input
                  id="availabilityDate"
                  name="availabilityDate"
                  type="date"
                  value={formData.availabilityDate}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Links</h3>
              <div>
                <Label htmlFor="linkedinUrl" className="text-foreground">
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="portfolioUrl" className="text-foreground">
                  Portfolio/Website
                </Label>
                <Input
                  id="portfolioUrl"
                  name="portfolioUrl"
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  placeholder="https://yourportfolio.com"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Resume</h3>
              <div>
                <Label htmlFor="resume" className="text-foreground">
                  Upload Resume (PDF or Word) - Optional
                </Label>
                <div className="mt-1">
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("resume")?.click()}
                    className="w-full justify-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {resumeFile ? resumeFile.name : "Choose File"}
                  </Button>
                  {resumeFile && (
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4 mr-1" />
                      {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-2">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Uploading: {uploadProgress}%</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Cover Letter</h3>
              <div>
                <Label htmlFor="coverLetter" className="text-foreground">
                  Why are you interested in this position?
                </Label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1"
                  placeholder="Tell us about your interest in this role and what you can bring to Vort..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              {resumeFile ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmitWithoutResume}
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Without Resume"
                  )}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
