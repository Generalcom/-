"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, ArrowRight, Clock, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PaymentSuccessPage() {
  useEffect(() => {
    // You could track the successful payment here
    console.log("Payment successful")
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full"
      >
        <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-green-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-10 w-10 text-white" />
            </motion.div>
            <CardTitle className="text-2xl text-white">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-300">Thank you for choosing Vort. Your order has been received successfully.</p>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <h4 className="font-semibold text-white">What happens next?</h4>
              </div>
              <p className="text-sm text-gray-300 mb-3">
                We'll contact you within 24 hours to discuss your project details and next steps.
              </p>
              <div className="flex justify-center items-center space-x-6 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Phone className="h-3 w-3" />
                  <span>Phone consultation</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span>Email follow-up</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>Project kickoff</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>

              <Link href="/store" className="block">
                <Button
                  variant="outline"
                  className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                >
                  Continue Shopping
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
