import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    // Parse PayFast notification data
    const params = new URLSearchParams(body)
    const paymentData = Object.fromEntries(params.entries())

    // Verify the payment with PayFast
    // In a real implementation, you would:
    // 1. Validate the signature
    // 2. Check the payment status
    // 3. Update your database
    // 4. Send confirmation emails

    console.log("PayFast notification received:", paymentData)

    // For demo purposes, we'll just log and return OK
    if (paymentData.payment_status === "COMPLETE") {
      // Payment successful - update order status
      console.log("Payment completed for order:", paymentData.item_name)
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("PayFast notification error:", error)
    return new NextResponse("Error", { status: 500 })
  }
}
