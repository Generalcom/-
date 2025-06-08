"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, CheckCircle, Loader2 } from "lucide-react"
import { submitContactForm } from "@/app/actions/contact"
import { toast } from "@/components/ui/use-toast"

const initialFormData = {
  name: "",
  email: "",
  company: "",
  phone: "",
  subject: "",
  message: "",
}

export default function ContactForm() {
  const [isPending, setIsPending] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState(initialFormData)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    try {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => formDataObj.append(key, value))
      const response = await submitContactForm(formDataObj)

      if (response.success) {
        setIsSubmitted(true)
        toast({ title: "Message Sent!", description: response.message })
        setFormData(initialFormData) // Reset form
        setTimeout(() => setIsSubmitted(false), 5000) // Allow sending another message after 5s
      } else {
        toast({ title: "Submission Failed", description: response.message, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" })
      console.error("Contact form error:", error)
    } finally {
      setIsPending(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-10 bg-secondary/30 rounded-lg border border-border">
        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent Successfully!</h3>
        <p className="text-muted-foreground">
          Thank you for contacting Vort. We'll respond to your inquiry within 24 business hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
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
          <Label htmlFor="email">Email Address *</Label>
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
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            className="bg-background mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
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
        <Label htmlFor="subject">Subject *</Label>
        <Select
          name="subject"
          value={formData.subject}
          onValueChange={(value) => handleInputChange("subject", value)}
          required
        >
          <SelectTrigger className="bg-background mt-1 w-full">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="General Inquiry">General Inquiry</SelectItem>
            <SelectItem value="AI Training Solutions">AI Training Solutions</SelectItem>
            <SelectItem value="Custom App Development">Custom App Development</SelectItem>
            <SelectItem value="Digital Marketing AI">Digital Marketing AI</SelectItem>
            <SelectItem value="AI Strategy Consultation">AI Strategy Consultation</SelectItem>
            <SelectItem value="Technical Support">Technical Support</SelectItem>
            <SelectItem value="Partnership Opportunities">Partnership Opportunities</SelectItem>
            <SelectItem value="Careers">Careers</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          className="bg-background min-h-[120px] mt-1"
          placeholder="Tell us about your project, requirements, or any questions you have..."
          required
        />
      </div>
      <Button
        type="submit"
        disabled={isPending || !formData.name || !formData.email || !formData.subject || !formData.message}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base py-3"
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-5 w-5 mr-2" />
            Send Message
          </>
        )}
      </Button>
    </form>
  )
}
