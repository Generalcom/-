"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Shield, Lock } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

// This component is now used as a reference for payment gateway integration
// The main billing flow uses the new billing page

interface PayFastCheckoutProps {
  product: {
    id: string
    title: string
    price: number
    description: string
  }
  onSuccess?: () => void
  onCancel?: () => void
}

export default function PayFastCheckout({ product, onSuccess, onCancel }: PayFastCheckoutProps) {
  const { user } = useAuth()
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
      amount: product.price.toFixed(2),
      item_name: product.title,
      item_description: product.description,
      custom_int1: product.id,
      custom_str1: user?.id || "guest",
    }

    return paymentData
  }

  const handlePayFastPayment = async () => {
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions")
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
    } catch (error) {
      console.error("PayFast payment error:", error)
      alert("Payment failed. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Order Summary */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <CreditCard className="h-6 w-6 mr-2 text-green-400" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-white">{product.title}</h3>
                <p className="text-sm text-gray-300">{product.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">R{product.price.toFixed(2)}</div>
              </div>
            </div>
            <div className="border-t border-gray-600 pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="text-white">Total</span>
                <span className="text-green-400">R{product.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 border-purple-500/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Billing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-gray-300">
                First Name
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
                Last Name
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
              Email Address
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
              Phone Number
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
              required
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
                required
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
                required
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
          <div className="flex items-center space-x-4 mb-4">
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
            <Button
              onClick={handlePayFastPayment}
              disabled={isProcessing || !agreeToTerms}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:opacity-50 text-lg py-3"
            >
              {isProcessing ? (
                <>
                  <Lock className="h-5 w-5 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Pay R{product.price.toFixed(2)} with PayFast
                </>
              )}
            </Button>

            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                className="w-full border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
              >
                Cancel
              </Button>
            )}
          </div>

          <div className="mt-4 text-center text-xs text-gray-400">
            <p>Powered by PayFast - South Africa's leading payment gateway</p>
            <p>We accept all major credit cards, EFT, and mobile payments</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
