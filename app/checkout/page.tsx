"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, ArrowLeft, Package, Trash2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import { useCart } from "@/hooks/useCart"

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { items, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, getTotalSavings, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [billingInfo, setBillingInfo] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  useEffect(() => {
    // Only redirect if we're sure the auth state has been loaded
    if (user === null) {
      // User is definitely not logged in
      router.push("/auth?redirect=checkout")
      return
    }

    // Only redirect if cart is definitely empty (not just loading)
    if (items.length === 0 && !localStorage.getItem("cart_items")) {
      router.push("/store")
      return
    }
  }, [user, items.length, router])

  const handleInputChange = (field: string, value: string) => {
    setBillingInfo((prev) => ({ ...prev, [field]: value }))
  }

  const generatePayFastForm = () => {
    // PayFast configuration
    const merchantId = "10000100" // Demo merchant ID
    const merchantKey = "46f0cd694581a" // Demo merchant key
    const passphrase = "jt7NOE43FZPn" // Demo passphrase

    // Create payment data
    const paymentData = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${window.location.origin}/payment/success`,
      cancel_url: `${window.location.origin}/payment/cancel`,
      notify_url: `${window.location.origin}/api/payment/notify`,
      name_first: billingInfo.firstName,
      name_last: billingInfo.lastName,
      email_address: billingInfo.email,
      cell_number: billingInfo.phone,
      amount: getTotalPrice().toFixed(2),
      item_name: `Vort Services (${getTotalItems()} items)`,
      item_description: items.map((item) => `${item.title} x${item.quantity}`).join(", "),
      custom_int1: getTotalItems(),
      custom_str1: user?.id || "guest",
      custom_str2: JSON.stringify(items.map((item) => ({ id: item.id, quantity: item.quantity }))),
    }

    return paymentData
  }

  const handlePayFastPayment = async () => {
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    if (!billingInfo.firstName || !billingInfo.lastName || !billingInfo.email || !billingInfo.phone) {
      alert("Please fill in all required fields")
      return
    }

    setIsProcessing(true)

    try {
      const paymentData = generatePayFastForm()

      // Create a form and submit to PayFast
      const form = document.createElement("form")
      form.method = "POST"
      form.action = "https://sandbox.payfast.co.za/eng/process" // Use sandbox for demo

      // Add all payment data as hidden inputs
      Object.entries(paymentData).forEach(([key, value]) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = value.toString()
        form.appendChild(input)
      })

      // Submit the form
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)

      // Clear cart after successful payment initiation
      clearCart()
    } catch (error) {
      console.error("PayFast payment error:", error)
      alert("Payment failed. Please try again.")
      setIsProcessing(false)
    }
  }

  if (!user || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    )
  }

  const products = {
    "ai-training-basic": {
      id: "ai-training-basic",
      title: "AI Training - Basic Package",
      description: "Get started with AI model training for your business data",
      price: 45000,
    },
    "ai-training-pro": {
      id: "ai-training-pro",
      title: "AI Training - Professional",
      description: "Advanced AI solutions with custom algorithms and optimization",
      price: 90000,
    },
    "app-development": {
      id: "app-development",
      title: "Custom App Development",
      description: "Full-stack application with AI integration",
      price: 75000,
    },
    "marketing-ai": {
      id: "marketing-ai",
      title: "Digital Marketing AI Suite",
      description: "AI-powered marketing automation and analytics",
      price: 30000,
    },
    "ai-consultation": {
      id: "ai-consultation",
      title: "AI Strategy Consultation",
      description: "1-on-1 consultation to plan your AI implementation",
      price: 7500,
    },
    "ai-templates": {
      id: "ai-templates",
      title: "AI Model Templates Pack",
      description: "Pre-built AI models for common business use cases",
      price: 4500,
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Vort
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/store" className="flex items-center text-gray-300 hover:text-blue-400 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Link>
              <span className="text-sm text-gray-300">Welcome, {user.name || user.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Secure Checkout
          </h1>
          <p className="text-gray-300">Complete your purchase securely with PayFast</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1 order-2 lg:order-1"
          >
            <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-500/20 backdrop-blur-sm sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Package className="h-6 w-6 mr-2 text-green-400" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-300">{item.category}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-green-400 font-bold">R{item.price}</span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-gray-400 line-through">R{item.originalPrice}</span>
                        )}
                        <span className="text-xs text-gray-300">x {item.quantity}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400 font-bold">R{(item.price * item.quantity).toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-600 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Subtotal ({getTotalItems()} items)</span>
                    <span className="text-white">R{getTotalPrice().toFixed(2)}</span>
                  </div>
                  {getTotalSavings() > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">You save</span>
                      <span className="text-green-400">-R{getTotalSavings().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t border-gray-600 pt-2">
                    <span className="text-white">Total</span>
                    <span className="text-green-400">R{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-2 order-1 lg:order-2 space-y-6"
          >
            {/* Billing Information */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-300">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={billingInfo.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="bg-slate-700/50 border-purple-500/30 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-300">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={billingInfo.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="bg-slate-700/50 border-purple-500/30 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-slate-700/50 border-purple-500/30 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-300">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={billingInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-slate-700/50 border-purple-500/30 text-white"
                    placeholder="+27 XX XXX XXXX"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-gray-300">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={billingInfo.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="bg-slate-700/50 border-purple-500/30 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-gray-300">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={billingInfo.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="bg-slate-700/50 border-purple-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-gray-300">
                      Postal Code
                    </Label>
                    <Input
                      id="postalCode"
                      value={billingInfo.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      className="bg-slate-700/50 border-purple-500/30 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="province" className="text-gray-300">
                    Province
                  </Label>
                  <Select value={billingInfo.province} onValueChange={(value) => handleInputChange("province", value)}>
                    <SelectTrigger className="bg-slate-700/50 border-purple-500/30">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-500/30">
                      <SelectItem value="EC">Eastern Cape</SelectItem>
                      <SelectItem value="FS">Free State</SelectItem>
                      <SelectItem value="GP">Gauteng</SelectItem>
                      <SelectItem value="KZN">KwaZulu-Natal</SelectItem>
                      <SelectItem value="LP">Limpopo</SelectItem>
                      <SelectItem value="MP">Mpumalanga</SelectItem>
                      <SelectItem value="NC">Northern Cape</SelectItem>
                      <SelectItem value="NW">North West</SelectItem>
                      <SelectItem value="WC">Western Cape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Payment Security */}
            <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-green-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <Shield className="h-8 w-8 text-green-400" />
                  <div>
                    <h3 className="font-semibold text-white">Secure Payment with PayFast</h3>
                    <p className="text-sm text-gray-300">Your payment information is encrypted and secure</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-6">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-300">
                    I agree to the{" "}
                    <a href="#" className="text-blue-400 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-400 hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                <div className="space-y-3">
                  <Link href="/billing">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-lg py-4">
                      Proceed to Billing
                    </Button>
                  </Link>

                  <Link href="/store">
                    <Button
                      variant="outline"
                      className="w-full border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 text-center text-xs text-gray-400 space-y-1">
                  <p>Powered by PayFast - South Africa's leading payment gateway</p>
                  <p>We accept all major credit cards, EFT, and mobile payments</p>
                  <div className="flex justify-center items-center space-x-4 mt-2">
                    <span>🔒 SSL Encrypted</span>
                    <span>💳 All Major Cards</span>
                    <span>📱 Mobile Payments</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
