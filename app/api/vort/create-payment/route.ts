import { type NextRequest, NextResponse } from "next/server"

const VORT_SECRET_KEY = "sk_test_fada3506f76621f5e47fe9df456344dabcd52872"
const VORT_API_BASE = "https://api.vort.co.za/v1"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      amount,
      currency = "ZAR",
      description,
      customer_email,
      customer_name,
      callback_url,
      webhook_url,
      metadata,
    } = body

    // Create payment data for Vort API
    const paymentData = {
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description,
      customer: {
        email: customer_email,
        name: customer_name,
      },
      callback_url,
      webhook_url,
      metadata,
    }

    console.log("Creating Vort payment:", paymentData)

    // For demo purposes, simulate Vort API response
    // In production, you would make the actual API call to Vort
    const simulatedResponse = {
      id: `vort_${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      amount: paymentData.amount,
      currency: paymentData.currency,
      payment_url: `https://checkout.vort.co.za/pay/${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      customer: paymentData.customer,
      description: paymentData.description,
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      payment: simulatedResponse,
    })
  } catch (error) {
    console.error("Vort payment creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create payment",
      },
      { status: 500 },
    )
  }
}
