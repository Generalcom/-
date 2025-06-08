"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, X, CheckCircle } from "lucide-react" // Renamed Calendar to CalendarIcon
import { motion, AnimatePresence } from "framer-motion"
import { submitConsultationForm } from "@/app/actions/contact"
import { toast } from "@/components/ui/use-toast"

interface ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
}

const initialFormData = {
  name: "",
  email: "",
  company: "",
  phone: "",
  service: "",
  budget: "",
  timeline: "",
  message: "",
  preferredDate: "",
  preferredTime: "",
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState(initialFormData)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => formDataObj.append(key, value))
      const result = await submitConsultationForm(formDataObj)

      if (result.success) {
        setIsSubmitted(true)
        toast({ title: "Consultation Scheduled!", description: result.message })
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData(initialFormData)
          onClose()
        }, 3000)
      } else {
        toast({ title: "Submission Failed", description: result.message, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" })
      console.error("Consultation form error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="bg-card border-border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {!isSubmitted ? (
                <>
                  <CardHeader className="border-b border-border">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                        Schedule Free Consultation
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground pt-1">
                      Let's discuss your AI needs and how Vort can elevate your business.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-sm">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                            className="bg-background mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                            className="bg-background mt-1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company" className="text-sm">
                            Company Name
                          </Label>
                          <Input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={(e) => handleInputChange("company", e.target.value)}
                            className="bg-background mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-sm">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+27 XX XXX XXXX"
                            className="bg-background mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="service" className="text-sm">
                          Service Interest *
                        </Label>
                        <Select
                          name="service"
                          value={formData.service}
                          onValueChange={(value) => handleInputChange("service", value)}
                        >
                          <SelectTrigger className="bg-background mt-1">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="ai-training">AI Training</SelectItem>
                            <SelectItem value="app-development">App Development</SelectItem>
                            <SelectItem value="digital-marketing">Digital Marketing AI</SelectItem>
                            <SelectItem value="consultation">AI Consultation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="budget" className="text-sm">
                            Budget Range
                          </Label>
                          <Select
                            name="budget"
                            value={formData.budget}
                            onValueChange={(value) => handleInputChange("budget", value)}
                          >
                            <SelectTrigger className="bg-background mt-1">
                              <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              <SelectItem value="<R50k">Under R50,000</SelectItem>
                              <SelectItem value="R50k-R150k">R50k - R150k</SelectItem>
                              <SelectItem value="R150k-R500k">R150k - R500k</SelectItem>
                              <SelectItem value=">R500k">R500,000+</SelectItem>
                              <SelectItem value="discuss">Prefer to discuss</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="timeline" className="text-sm">
                            Project Timeline
                          </Label>
                          <Select
                            name="timeline"
                            value={formData.timeline}
                            onValueChange={(value) => handleInputChange("timeline", value)}
                          >
                            <SelectTrigger className="bg-background mt-1">
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              <SelectItem value="asap">ASAP</SelectItem>
                              <SelectItem value="1-month">1 Month</SelectItem>
                              <SelectItem value="3-months">3 Months</SelectItem>
                              <SelectItem value="6-months">6 Months</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="preferredDate" className="text-sm">
                            Preferred Date
                          </Label>
                          <Input
                            id="preferredDate"
                            name="preferredDate"
                            type="date"
                            value={formData.preferredDate}
                            onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="bg-background mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="preferredTime" className="text-sm">
                            Preferred Time
                          </Label>
                          <Select
                            name="preferredTime"
                            value={formData.preferredTime}
                            onValueChange={(value) => handleInputChange("preferredTime", value)}
                          >
                            <SelectTrigger className="bg-background mt-1">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              <SelectItem value="09:00">09:00</SelectItem>
                              <SelectItem value="10:00">10:00</SelectItem>
                              <SelectItem value="11:00">11:00</SelectItem>
                              <SelectItem value="14:00">14:00</SelectItem>
                              <SelectItem value="15:00">15:00</SelectItem>
                              <SelectItem value="16:00">16:00</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="message" className="text-sm">
                          Project Details
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          className="bg-background min-h-[100px] mt-1"
                          placeholder="Tell us about your project, goals, and specific requirements..."
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          type="submit"
                          disabled={isSubmitting || !formData.name || !formData.email || !formData.service}
                          className="w-full sm:flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {isSubmitting ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Scheduling...
                            </>
                          ) : (
                            <>
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              Schedule Consultation
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onClose}
                          className="w-full sm:w-auto border-primary text-primary hover:bg-accent"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-8 md:p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">Consultation Scheduled!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you! We'll contact you within 24 business hours to confirm your consultation.
                  </p>
                  <div className="bg-secondary rounded-lg p-4 text-left text-sm">
                    <h4 className="font-semibold text-foreground mb-2">What's Next:</h4>
                    <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                      <li>We'll send a calendar invite to your email.</li>
                      <li>Prepare any questions about your AI needs.</li>
                      <li>We look forward to discussing your project!</li>
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
