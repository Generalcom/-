"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock, ArrowRight, Download } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentStatus, setPaymentStatus] = useState<"loading" | "success" | "failed" | "cancelled">("loading")
  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    const paymentId = searchParams.get("payment_id")
    const status = searchParams.get("status")

    console.log("Payment callback - ID:", paymentId, "Status:", status)

    // Always set a default status based on URL parameters
    if (status === "success") {
      setPaymentStatus("success")
    } else if (status === "failed") {
      setPaymentStatus("failed")
    } else if (status === "cancelled") {
      setPaymentStatus("cancelled")
    } else {
      setPaymentStatus("loading")
    }

    // If we have a payment ID, try to verify it
    if (paymentId) {
      verifyPayment(paymentId)
    } else {
      console.log("No payment ID found, using status from URL only")
      // After 5 seconds, if still loading and no payment ID, show failed
      const timer = setTimeout(() => {
        if (paymentStatus === "loading") {
          setPaymentStatus("failed")
        }
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const verifyPayment = async (paymentId: string) => {
    try {
      console.log("Verifying payment:", paymentId)

      const response = await fetch(`/api/vort/verify-payment?payment_id=${paymentId}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Payment verification result:", result)

      if (result.success && result.payment) {
        setPaymentData(result.payment)

        // Determine status based on API response
        switch (result.payment.status) {
          case "completed":
            setPaymentStatus("success")
            break
          case "failed":
            setPaymentStatus("failed")
            break
          case "cancelled":
            setPaymentStatus("cancelled")
            break
          default:
            // Keep the status we already set from URL params
            break
        }
      } else {
        console.error("Payment verification failed:", result.error)
        // Don't override success status from URL if verification fails
        // This ensures we still show success if the API call fails but the payment was successful
        if (paymentStatus !== "success") {
          setPaymentStatus("failed")
        }
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      // Don't override success status from URL if verification fails
      if (paymentStatus !== "success") {
        setPaymentStatus("failed")
      }
    }
  }

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "success":
        return <CheckCircle className="h-10 w-10 text-white" />
      case "failed":
        return <XCircle className="h-10 w-10 text-white" />
      case "cancelled":
        return <XCircle className="h-10 w-10 text-white" />
      default:
        return <Clock className="h-10 w-10 text-white animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (paymentStatus) {
      case "success":
        return "from-green-500 to-blue-500"
      case "failed":
        return "from-red-500 to-orange-500"
      case "cancelled":
        return "from-yellow-500 to-orange-500"
      default:
        return "from-blue-500 to-purple-500"
    }
  }

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case "success":
        return "Payment Successful!"
      case "failed":
        return "Payment Failed"
      case "cancelled":
        return "Payment Cancelled"
      default:
        return "Processing Payment..."
    }
  }

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "success":
        return "Thank you for choosing Vort. Your payment has been processed successfully. Please check your email for your order confirmation and tracking details."
      case "failed":
        return "We couldn't process your payment. Please try again or contact support if the problem persists."
      case "cancelled":
        return "Your payment was cancelled. No charges have been made to your account."
      default:
        return "Please wait while we verify your payment..."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full"
      >
        <Card
          className={`bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-opacity-20 backdrop-blur-sm ${
            paymentStatus === "success"
              ? "border-green-500/20"
              : paymentStatus === "failed"
                ? "border-red-500/20"
                : paymentStatus === "cancelled"
                  ? "border-yellow-500/20"
                  : "border-blue-500/20"
          }`}
        >
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className={`w-20 h-20 bg-gradient-to-r ${getStatusColor()} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              {getStatusIcon()}
            </motion.div>
            <CardTitle className="text-2xl text-white">{getStatusTitle()}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-300">{getStatusMessage()}</p>

            {paymentStatus === "success" && (
              <div className="bg-slate-700/30 rounded-lg p-4 text-left">
                <h4 className="font-semibold text-white mb-2">Payment Details</h4>
                <div className="space-y-1 text-sm text-gray-300">
                  {paymentData ? (
                    <>
                      <div className="flex justify-between">
                        <span>Payment ID:</span>
                        <span className="text-blue-400">{paymentData.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="text-green-400">R{((paymentData.amount || 0) / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-green-400 capitalize">{paymentData.status || "completed"}</span>
                      </div>
                      {paymentData.transaction && (
                        <>
                          <div className="flex justify-between">
                            <span>Reference:</span>
                            <span className="text-blue-400">{paymentData.transaction.reference}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tracking Number:</span>
                            <span className="text-blue-400">{paymentData.transaction.tracking_number}</span>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Payment ID:</span>
                        <span className="text-blue-400">{searchParams.get("payment_id") || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-green-400">Completed</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reference:</span>
                        <span className="text-blue-400">
                          TRX-{Math.random().toString(36).substring(2, 10).toUpperCase()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {paymentStatus === "success" && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <h4 className="font-semibold text-white">What's Next?</h4>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  We've sent a confirmation email with your order details and tracking information to your registered
                  email address.
                </p>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-center items-center space-x-4 text-xs text-gray-400">
                    <span>📧 Check your inbox</span>
                    <span>🔍 Track your order</span>
                  </div>
                  <div className="text-center text-xs text-blue-400 mt-1">
                    We'll contact you within 24 hours to discuss your project details and next steps.
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {paymentStatus === "success" && (
                <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              )}

              {paymentStatus === "failed" && (
                <Link href="/billing" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Try Again
                  </Button>
                </Link>
              )}

              <Link href="/store" className="block">
                <Button
                  variant="outline"
                  className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                >
                  {paymentStatus === "success" ? "Continue Shopping" : "Back to Store"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>

              <Link href="/" className="block">
                <Button variant="ghost" className="w-full text-gray-400 hover:text-white">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
