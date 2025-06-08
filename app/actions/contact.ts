"use server"

import { Resend } from "resend"

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

    // Log the form submission for now (can be removed when email is configured)
    console.log("Contact Form Submission:", {
      name,
      email,
      company,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString(),
    })

    // If Resend is configured, send email
    if (resend && process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "noreply@vort.co.za",
        to: "support@vort.co.za",
        subject: `Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || "Not provided"}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p><em>Sent from Vort Contact Form</em></p>
        `,
      })
    } else {
      // Fallback: Log that email service is not configured
      console.log("Email service not configured. Form data logged above.")
    }

    return { success: true, message: "Message received successfully! We'll get back to you soon." }
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

    // Log the consultation request
    console.log("Consultation Request:", {
      name,
      email,
      company,
      phone,
      service,
      budget,
      timeline,
      message,
      preferredDate,
      preferredTime,
      timestamp: new Date().toISOString(),
    })

    // If Resend is configured, send email
    if (resend && process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "noreply@vort.co.za",
        to: "support@vort.co.za",
        subject: `Consultation Request: ${service}`,
        html: `
          <h2>New Consultation Request</h2>
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
          <hr>
          <p><em>Sent from Vort Consultation Form</em></p>
        `,
      })
    } else {
      console.log("Email service not configured. Consultation request logged above.")
    }

    return { success: true, message: "Consultation request received! We'll contact you soon to schedule." }
  } catch (error) {
    console.error("Consultation form error:", error)
    return { success: false, message: "Failed to send consultation request. Please try again." }
  }
}
