"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Trash2, Clock, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import { useCart } from "@/hooks/useCart"
import VortPaymentForm from "@/components/VortPaymentForm" // Assuming this is the mock payment form
import { toast } from "@/components/ui/use-toast"

export default function BillingClientPage() {
  const router = useRouter()
  const { user, profile, loading: authLoading } = useAuth()
  const { items, removeFromCart, getTotalItems, getTotalPrice, getTotalSavings, clearCart } = useCart()

  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
    country: "South Africa",
  })
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/auth?redirect=/billing")
      } else if (items.length === 0) {
        const savedCart = localStorage.getItem("cart_items")
        if (!savedCart || JSON.parse(savedCart).length === 0) {
          router.replace("/store")
        } else {
          setIsPageLoading(false) // Cart has items from local storage
        }
      } else {
        setIsPageLoading(false) // User logged in and cart has items
      }

      if (user) {
        setBillingInfo((prev) => ({
          ...prev,
          firstName:
            profile?.full_name?.split(" ")[0] || user.user_metadata?.full_name?.split(" ")[0] || prev.firstName,
          lastName:
            profile?.full_name?.split(" ").slice(1).join(" ") ||
            user.user_metadata?.full_name?.split(" ").slice(1).join(" ") ||
            prev.lastName,
          email: user.email || prev.email,
        }))
      }
    }
  }, [user, profile, authLoading, items.length, router])

  const handleInputChange = (field: string, value: string) => {
    setBillingInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleProceedToPayment = () => {
    if (!agreeToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      })
      return
    }
    const requiredFields: (keyof typeof billingInfo)[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "postalCode",
      "province",
    ]
    const missingFields = requiredFields.filter((field) => !billingInfo[field])

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in all required fields: ${missingFields.join(", ")}.`,
        variant: "destructive",
      })
      return
    }
    setShowPaymentForm(true)
  }

  const handlePaymentSuccess = (paymentId: string) => {
    clearCart()
    toast({ title: "Payment Successful!", description: `Your order ID: ${paymentId}. We'll be in touch soon.` })
    router.push(`/payment/success?payment_id=${paymentId}`)
  }

  const handlePaymentError = (error: string) => {
    toast({ title: "Payment Failed", description: error || "An unexpected error occurred.", variant: "destructive" })
  }

  if (isPageLoading || authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <h1 className="text-xl font-medium text-foreground">Loading Checkout...</h1>
          <p className="text-muted-foreground">Preparing your order details.</p>
        </div>
      </div>
    )
  }

  if (!user || (items.length === 0 && !isPageLoading)) {
    // Check again after loading state
    // This case should ideally be handled by the useEffect redirect, but as a fallback:
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary text-foreground">
      <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Vort
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/store"
                className="text-sm flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Store
              </Link>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Welcome, {profile?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {showPaymentForm ? "Complete Your Payment" : "Secure Checkout"}
          </h1>
          <p className="text-muted-foreground text-md">
            {showPaymentForm
              ? "Final step: enter your payment details below."
              : "Please review your order and provide billing information."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 order-2 lg:order-1"
          >
            <Card className="bg-card border-border shadow-lg sticky top-24">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center text-lg font-semibold text-foreground">
                  <Package className="h-5 w-5 mr-2 text-primary" /> Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-sm">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 bg-secondary/50 rounded-md border border-border"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground leading-tight">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.category} (x{item.quantity})
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-foreground font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      {!showPaymentForm && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive/80 h-7 w-7 ml-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Separator className="my-2 bg-border" />
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(getTotalPrice())}</span>
                  </div>
                  {getTotalSavings() > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Savings</span>
                      <span className="text-primary">-{formatPrice(getTotalSavings())}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span className="text-foreground">{formatPrice(0)}</span>
                  </div>
                  <Separator className="my-2 bg-border" />
                  <div className="flex justify-between text-md font-semibold">
                    <span className="text-foreground">Total Due</span>
                    <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-md p-3 mt-4 text-xs">
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-primary mb-0.5">24-Hour Contact Promise</h4>
                      <p className="text-muted-foreground">
                        We'll contact you within 24 business hours of purchase to discuss project details.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 order-1 lg:order-2 space-y-6"
          >
            {showPaymentForm ? (
              <VortPaymentForm
                amount={getTotalPrice()}
                currency="ZAR"
                description={`Vort Services Order (${getTotalItems()} items)`}
                customerEmail={billingInfo.email}
                customerName={`${billingInfo.firstName} ${billingInfo.lastName}`}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            ) : (
              <>
                <Card className="bg-card border-border shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground">Billing Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={billingInfo.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                          className="bg-background mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={billingInfo.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                          className="bg-background mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={billingInfo.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          className="bg-background mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={billingInfo.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+27 XX XXX XXXX"
                          required
                          className="bg-background mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company">Company Name (Optional)</Label>
                      <Input
                        id="company"
                        value={billingInfo.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className="bg-background mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={billingInfo.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        required
                        className="bg-background mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={billingInfo.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          required
                          className="bg-background mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="province">Province *</Label>
                        <Select
                          value={billingInfo.province}
                          onValueChange={(value) => handleInputChange("province", value)}
                        >
                          <SelectTrigger className="bg-background mt-1">
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
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
                      <div>
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          value={billingInfo.postalCode}
                          onChange={(e) => handleInputChange("postalCode", e.target.value)}
                          required
                          className="bg-background mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={billingInfo.country}
                        disabled
                        className="bg-background mt-1 text-muted-foreground"
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-lg">
                  <CardContent className="p-6 space-y-5 text-sm">
                    <div className="flex items-start space-x-2.5">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                        className="mt-0.5"
                      />
                      <Label htmlFor="terms" className="text-muted-foreground leading-normal">
                        I agree to the{" "}
                        <Link href="/terms-of-service" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy-policy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                        . I understand Vort will contact me within 24 hours.
                      </Label>
                    </div>
                    <div className="flex items-start space-x-2.5">
                      <Checkbox
                        id="newsletter"
                        checked={subscribeNewsletter}
                        onCheckedChange={(checked) => setSubscribeNewsletter(checked as boolean)}
                        className="mt-0.5"
                      />
                      <Label htmlFor="newsletter" className="text-muted-foreground">
                        Subscribe to our newsletter for AI insights and updates.
                      </Label>
                    </div>
                    <Button
                      onClick={handleProceedToPayment}
                      disabled={!agreeToTerms}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base py-3"
                    >
                      Proceed to Payment - {formatPrice(getTotalPrice())}
                    </Button>
                    <div className="mt-4 text-center text-xs text-muted-foreground space-y-1">
                      <p className="flex items-center justify-center">
                        <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-primary" /> SSL Encrypted • Secure Processing •
                        24hr Contact Guarantee
                      </p>
                      <p>
                        Questions?{" "}
                        <Link href="/contact" className="text-primary hover:underline">
                          Contact us
                        </Link>{" "}
                        or call +27 11 123 4567
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            {showPaymentForm && (
              <div className="text-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentForm(false)}
                  className="border-primary text-primary hover:bg-accent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Billing Details
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
