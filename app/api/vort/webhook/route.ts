import { type NextRequest, NextResponse } from "next/server"

const VORT_SECRET_KEY = "sk_test_fada3506f76621f5e47fe9df456344dabcd52872"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("vort-signature")

    // In a real implementation, you would verify the webhook signature
    // using the secret key to ensure the request is from Vort

    const webhookData = JSON.parse(body)

    console.log("Vort webhook received:", {
      event: webhookData.event,
      payment_id: webhookData.data?.id,
      status: webhookData.data?.status,
      amount: webhookData.data?.amount,
      timestamp: new Date().toISOString(),
    })

    // Handle different webhook events
    switch (webhookData.event) {
      case "payment.completed":
        // Payment was successful
        console.log("Payment completed:", webhookData.data)
        // Here you would:
        // 1. Update order status in database
        // 2. Send confirmation emails
        // 3. Trigger fulfillment processes
        break

      case "payment.failed":
        // Payment failed
        console.log("Payment failed:", webhookData.data)
        // Handle failed payment
        break

      case "payment.cancelled":
        // Payment was cancelled
        console.log("Payment cancelled:", webhookData.data)
        // Handle cancelled payment
        break

      default:
        console.log("Unhandled webhook event:", webhookData.event)
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("Vort webhook error:", error)
    return new NextResponse("Error", { status: 500 })
  }
}
