"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full"
      >
        <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-red-500/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <XCircle className="h-10 w-10 text-white" />
            </motion.div>
            <CardTitle className="text-2xl text-white">Payment Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-300">Your payment was cancelled. No charges have been made to your account.</p>

            <div className="space-y-3">
              <Link href="/store" className="block">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </Link>

              <Link href="/" className="block">
                <Button
                  variant="outline"
                  className="w-full border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
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
