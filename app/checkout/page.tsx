"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield, ArrowLeft, Package, Trash2, RefreshCcw, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import { useCart } from "@/hooks/useCart"

export default function CheckoutPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { items, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, getTotalSavings, clearCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null)
  const [redirectAttempts, setRedirectAttempts] = useState(0)
  const [forceShow, setForceShow] = useState(false)
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  // Initialize billing info when user loads
  useEffect(() => {
    if (user && !authChecked) {
      setBillingInfo((prev) => ({
        ...prev,
        firstName: user.name?.split(" ")[0] || user.user_metadata?.full_name?.split(" ")[0] || "",
        lastName: user.name?.split(" ")[1] || user.user_metadata?.full_name?.split(" ")[1] || "",
        email: user.email || "",
      }))
      setAuthChecked(true)
    }
  }, [user, authChecked])

  // Check authentication and cart after auth is loaded
  useEffect(() => {
    // Clear any existing timeout to prevent multiple redirects
    if (redirectTimeout) {
      clearTimeout(redirectTimeout)
    }

    // Skip checks if we're forcing the page to show
    if (forceShow) {
      return
    }

    // Only proceed if auth is loaded and we've checked auth
    if (!authLoading && authChecked) {
      // Redirect to auth if not logged in
      if (!user) {
        console.log("No user found, redirecting to auth")
        const timeout = setTimeout(() => {
          router.push("/auth?redirect=checkout")
        }, 1000)
        setRedirectTimeout(timeout)
        setRedirectAttempts((prev) => prev + 1)
        return
      }

      // Redirect to store if cart is empty and we've loaded cart items
      if (items.length === 0) {
        // Check localStorage as a backup
        const storedItems = localStorage.getItem("cart_items")
        if (!storedItems || JSON.parse(storedItems).length === 0) {
          console.log("Cart is empty, redirecting to store")
          const timeout = setTimeout(() => {
            router.push("/store")
          }, 1000)
          setRedirectTimeout(timeout)
          setRedirectAttempts((prev) => prev + 1)
          return
        }
      }
    }
  }, [authLoading, authChecked, user, items.length, router, redirectTimeout, forceShow])

  // Safety mechanism to prevent infinite redirects
  useEffect(() => {
    if (redirectAttempts > 3) {
      console.log("Too many redirect attempts, forcing page to show")
      setForceShow(true)
    }
  }, [redirectAttempts])

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

  // Force show the checkout page even if conditions aren't met
  const handleForceShow = () => {
    setForceShow(true)
  }

  // Refresh the page to try again
  const handleRefresh = () => {
    window.location.reload()
  }

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show loading if redirecting (but this should be brief)
  if (!forceShow && (!user || (items.length === 0 && redirectAttempts <= 3))) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
          <p className="text-muted-foreground mb-8">Taking you to the right place...</p>

          <div className="flex flex-col items-center gap-4">
            <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              Refresh Page
            </Button>

            <Button onClick={handleForceShow} className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Continue to Checkout Anyway
            </Button>

            <div className="mt-4 text-sm text-muted-foreground">
              If you keep seeing this message, click "Continue to Checkout Anyway"
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If we're forcing the page to show or all conditions are met, show the checkout
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Vort
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                href="/store"
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Store
              </Link>
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.user_metadata?.full_name || user?.email || "Guest"}
              </span>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Secure Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase securely with PayFast</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1 order-2 lg:order-1"
          >
            <Card className="bg-card border-border backdrop-blur-sm sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Package className="h-6 w-6 mr-2 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-primary font-bold">R{item.price}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-xs text-muted-foreground line-through">R{item.originalPrice}</span>
                          )}
                          <span className="text-xs text-muted-foreground">x {item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-primary font-bold">R{(item.price * item.quantity).toFixed(2)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Your cart is empty</p>
                    <Link href="/store">
                      <Button variant="outline" className="mt-4">
                        Browse Products
                      </Button>
                    </Link>
                  </div>
                )}

                {items.length > 0 && (
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({getTotalItems()} items)</span>
                      <span className="text-foreground">R{getTotalPrice().toFixed(2)}</span>
                    </div>
                    {getTotalSavings() > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">You save</span>
                        <span className="text-primary">-R{getTotalSavings().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">R{getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                )}
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
            <Card className="bg-card border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-foreground">Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-foreground">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      value={billingInfo.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-foreground">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      value={billingInfo.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="bg-background border-border text-foreground"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-background border-border text-foreground"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-foreground">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={billingInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-background border-border text-foreground"
                    placeholder="+27 XX XXX XXXX"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-foreground">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={billingInfo.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-foreground">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={billingInfo.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-foreground">
                      Postal Code
                    </Label>
                    <Input
                      id="postalCode"
                      value={billingInfo.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="province" className="text-foreground">
                    Province
                  </Label>
                  <Select value={billingInfo.province} onValueChange={(value) => handleInputChange("province", value)}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
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
            <Card className="bg-card border-border backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">Secure Payment with PayFast</h3>
                    <p className="text-sm text-muted-foreground">Your payment information is encrypted and secure</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-6">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </Label>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handlePayFastPayment}
                    disabled={isProcessing || items.length === 0}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-4"
                  >
                    {isProcessing ? "Processing..." : "Complete Payment"}
                  </Button>

                  <Link href="/store">
                    <Button
                      variant="outline"
                      className="w-full border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 text-center text-xs text-muted-foreground space-y-1">
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
