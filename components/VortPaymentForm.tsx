"use client"

import { Separator } from "@/components/ui/separator"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Lock, Shield, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { formatPrice } from "@/lib/utils"

const VORT_PUBLIC_KEY = "pk_test_7ef015cfa47b58e17476be2b8e02c3caaedef997" // Mock public key

interface VortPaymentFormProps {
  amount: number
  currency?: string
  description: string
  customerEmail: string
  customerName: string
  onSuccess: (paymentId: string) => void
  onError: (error: string) => void
}

export default function VortPaymentForm({
  amount,
  currency = "ZAR",
  description,
  customerEmail,
  customerName,
  onSuccess,
  onError,
}: VortPaymentFormProps) {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardData, setCardData] = useState({
    card_number: "",
    exp_month: "",
    exp_year: "",
    cvv: "",
    cardholder_name: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value
    if (field === "card_number") processedValue = formatCardNumber(value)
    if (field === "cardholder_name") processedValue = value.toUpperCase()
    if (field === "cvv") processedValue = value.replace(/\D/g, "")

    setCardData((prev) => ({ ...prev, [field]: processedValue }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{1,4}/g) // Split into groups of up to 4
    return matches ? matches.join(" ").slice(0, 19) : v // Max 16 digits + 3 spaces
  }

  const currentYear = new Date().getFullYear() % 100 // Get last two digits of current year
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString())

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (
      !cardData.card_number ||
      cardData.card_number.replace(/\s/g, "").length < 13 ||
      cardData.card_number.replace(/\s/g, "").length > 16
    )
      newErrors.card_number = "Valid card number required (13-16 digits)."
    if (!cardData.exp_month || !cardData.exp_year) newErrors.expiry = "Expiry date required."
    if (!cardData.cvv || cardData.cvv.length < 3 || cardData.cvv.length > 4)
      newErrors.cvv = "Valid CVV required (3-4 digits)."
    if (!cardData.cardholder_name.trim()) newErrors.cardholder_name = "Cardholder name required."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      })
      return
    }
    setIsProcessing(true)
    try {
      // Simulate API call to Vort Gateway
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate network delay

      // Mock success or failure
      const isSuccess = Math.random() > 0.1 // 90% success rate for mock

      if (isSuccess) {
        const mockPaymentId = `vort_pay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        onSuccess(mockPaymentId)
      } else {
        throw new Error("Mock payment processing failed. Please try again.")
      }
    } catch (error: any) {
      onError(error.message || "Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center text-lg font-semibold text-foreground">
          <CreditCard className="h-5 w-5 mr-2 text-primary" /> Secure Payment
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter your card details. All transactions are mock and secure.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          <div>
            <Label htmlFor="card_number">Card Number *</Label>
            <Input
              id="card_number"
              type="text"
              value={cardData.card_number}
              onChange={(e) => handleInputChange("card_number", e.target.value)}
              className="bg-background mt-1"
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              required
            />
            {errors.card_number && (
              <p className="mt-1 text-xs text-destructive flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.card_number}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="cardholder_name">Cardholder Name *</Label>
            <Input
              id="cardholder_name"
              type="text"
              value={cardData.cardholder_name}
              onChange={(e) => handleInputChange("cardholder_name", e.target.value)}
              className="bg-background mt-1"
              placeholder="JOHN M. DOE"
              required
            />
            {errors.cardholder_name && (
              <p className="mt-1 text-xs text-destructive flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.cardholder_name}
              </p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="exp_month">Month *</Label>
              <Select value={cardData.exp_month} onValueChange={(value) => handleInputChange("exp_month", value)}>
                <SelectTrigger className="bg-background mt-1">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")).map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exp_year">Year *</Label>
              <Select value={cardData.exp_year} onValueChange={(value) => handleInputChange("exp_year", value)}>
                <SelectTrigger className="bg-background mt-1">
                  <SelectValue placeholder="YY" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cvv">CVV *</Label>
              <Input
                id="cvv"
                type="text"
                value={cardData.cvv}
                onChange={(e) => handleInputChange("cvv", e.target.value)}
                className="bg-background mt-1"
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>
          {(errors.expiry || errors.cvv) && (
            <p className="text-xs text-destructive flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.expiry || errors.cvv}
            </p>
          )}

          <div className="bg-secondary/50 rounded-md p-3 border border-border space-y-1.5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-foreground font-medium">{formatPrice(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processing Fee</span>
              <span className="text-foreground font-medium">{formatPrice(0)}</span>
            </div>
            <Separator className="my-1 bg-border" />
            <div className="flex justify-between text-md font-semibold">
              <span className="text-foreground">Total Due</span>
              <span className="text-primary">{formatPrice(amount)}</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base py-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 mr-2" />
                Pay {formatPrice(amount)}
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground flex items-center justify-center">
            <Shield className="h-3.5 w-3.5 mr-1.5 text-primary" /> Mock transactions are secure & encrypted.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
