"use server"

import { Resend } from "resend"
import { createServerSupabaseClient } from "@/lib/supabase"

// Initialize Resend with error handling
let resend: Resend | null = null

try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
} catch (error) {
  console.warn("Resend API key not configured")
}

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return { success: false, message: "Please fill in all required fields." }
    }

    // Store in database
    const supabase = createServerSupabaseClient()
    const { data: contactData, error: dbError } = await supabase
      .from("contacts")
      .insert({
        name,
        email,
        company: company || null,
        phone: phone || null,
        subject,
        message,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return { success: false, message: "Failed to save your message. Please try again." }
    }

    console.log("Contact form saved to database:", contactData)

    // If Resend is configured, send email notification
    if (resend && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "noreply@vort.co.za",
          to: "support@vort.co.za",
          subject: `New Contact Form: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>ID:</strong> ${contactData.id}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company || "Not provided"}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <hr>
            <p><em>Sent from Vort Contact Form</em></p>
          `,
        })
        console.log("Email notification sent successfully")
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
        // Don't fail the whole operation if email fails
      }
    }

    return {
      success: true,
      message: "Message received successfully! We'll get back to you soon.",
      id: contactData.id,
    }
  } catch (error) {
    console.error("Contact form error:", error)
    return { success: false, message: "Failed to send message. Please try again." }
  }
}

export async function submitConsultationForm(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const company = formData.get("company") as string
    const phone = formData.get("phone") as string
    const service = formData.get("service") as string
    const budget = formData.get("budget") as string
    const timeline = formData.get("timeline") as string
    const message = formData.get("message") as string
    const preferredDate = formData.get("preferredDate") as string
    const preferredTime = formData.get("preferredTime") as string

    // Validate required fields
    if (!name || !email || !service) {
      return { success: false, message: "Please fill in all required fields." }
    }

    // Store in database
    const supabase = createServerSupabaseClient()
    const { data: consultationData, error: dbError } = await supabase
      .from("consultations")
      .insert({
        name,
        email,
        company: company || null,
        phone: phone || null,
        service,
        budget: budget || null,
        timeline: timeline || null,
        message: message || null,
        preferred_date: preferredDate || null,
        preferred_time: preferredTime || null,
      })
      .select()
      .single()

    if (dbError) {
      console.error("Database error:", dbError)
      return { success: false, message: "Failed to save your consultation request. Please try again." }
    }

    console.log("Consultation request saved to database:", consultationData)

    // If Resend is configured, send email notification
    if (resend && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "noreply@vort.co.za",
          to: "support@vort.co.za",
          subject: `New Consultation Request: ${service}`,
          html: `
            <h2>New Consultation Request</h2>
            <p><strong>ID:</strong> ${consultationData.id}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company || "Not provided"}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Service Interest:</strong> ${service}</p>
            <p><strong>Budget Range:</strong> ${budget || "Not specified"}</p>
            <p><strong>Timeline:</strong> ${timeline || "Not specified"}</p>
            <p><strong>Preferred Date:</strong> ${preferredDate || "Not specified"}</p>
            <p><strong>Preferred Time:</strong> ${preferredTime || "Not specified"}</p>
            <p><strong>Project Details:</strong></p>
            <p>${message || "No additional details provided"}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <hr>
            <p><em>Sent from Vort Consultation Form</em></p>
          `,
        })
        console.log("Consultation email notification sent successfully")
      } catch (emailError) {
        console.error("Consultation email sending failed:", emailError)
        // Don't fail the whole operation if email fails
      }
    }

    return {
      success: true,
      message: "Consultation request received! We'll contact you soon to schedule.",
      id: consultationData.id,
    }
  } catch (error) {
    console.error("Consultation form error:", error)
    return { success: false, message: "Failed to send consultation request. Please try again." }
  }
}
