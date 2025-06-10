import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Simple HTML email template
const createEmailTemplate = (firstName: string, lastName: string, position: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Received - Vort</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif; background-color: #f6f9fc; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 5px; border: 1px solid #e6ebf1; margin-bottom: 64px;">
          
          <!-- Header -->
          <div style="text-align: center; padding: 40px 48px 0;">
            <h1 style="color: #000; font-size: 24px; font-weight: bold; margin: 0; padding: 0;">Application Received</h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 48px;">
            <p style="color: #333; font-size: 16px; line-height: 26px; margin: 0 0 20px;">
              Dear ${firstName} ${lastName},
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 26px; margin: 0 0 20px;">
              Thank you for applying for the <strong>${position}</strong> position at Vort. We have received your application and our team is currently reviewing it.
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 26px; margin: 0 0 20px;">
              If your qualifications match our requirements, we will contact you to schedule an interview. Please note that due to the high volume of applications, this process may take some time.
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 26px; margin: 0 0 20px;">
              In the meantime, feel free to explore our website to learn more about our company and the work we do.
            </p>
            
            <p style="color: #333; font-size: 16px; line-height: 26px; margin: 20px 0 0;">
              Best regards,<br>
              The Vort Recruitment Team
            </p>
          </div>

          <!-- Footer -->
          <div style="padding: 22px 48px; margin-top: 32px; border-top: 1px solid #e6ebf1;">
            <p style="font-size: 12px; color: #898989; line-height: 22px; margin: 0;">
              © ${new Date().getFullYear()} Vort. All rights reserved.
            </p>
            <p style="font-size: 12px; color: #898989; line-height: 22px; margin: 0;">
              132 Corner Lovaday and Fox Street, Marshall, South Africa
            </p>
            <p style="font-size: 12px; color: #898989; line-height: 22px; margin: 0;">
              <a href="https://www.vort.co.za" style="color: #15c; text-decoration: underline;">www.vort.co.za</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, position } = await request.json()

    if (!firstName || !lastName || !email || !position) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await resend.emails.send({
      from: "Vort Careers <careers@vort.co.za>",
      to: [email],
      subject: `Your Application for ${position} at Vort`,
      html: createEmailTemplate(firstName, lastName, position),
    })

    if (error) {
      console.error("Email sending error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Email sending error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
