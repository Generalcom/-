import { type NextRequest, NextResponse } from "next/server"

const VORT_SECRET_KEY = "sk_test_fada3506f76621f5e47fe9df456344dabcd52872"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get("payment_id")

    if (!paymentId) {
      return NextResponse.json({ success: false, error: "Payment ID required" }, { status: 400 })
    }

    console.log("Verifying payment:", paymentId)

    // For demo purposes, simulate successful payment verification
    // In production, you would make the actual API call to Vort
    const simulatedPaymentData = {
      id: paymentId,
      status: "completed",
      amount: 299900, // Amount in cents
      currency: "ZAR",
      customer: {
        email: "customer@example.com",
        name: "John Doe",
      },
      created_at: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
      completed_at: new Date().toISOString(),
      description: "Vort Services",
      transaction: {
        reference: `TRX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        verified: true,
        email_sent: true,
        tracking_number: `VORT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      },
    }

    return NextResponse.json({
      success: true,
      payment: simulatedPaymentData,
    })
  } catch (error) {
    console.error("Vort payment verification error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify payment",
      },
      { status: 500 },
    )
  }
}
