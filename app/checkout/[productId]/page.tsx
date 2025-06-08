"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import { useCart } from "@/hooks/useCart"

const products = {
  "ai-training-basic": {
    id: "ai-training-basic",
    title: "AI Training - Basic Package",
    description: "Get started with AI model training for your business data",
    price: 2999,
  },
  "ai-training-pro": {
    id: "ai-training-pro",
    title: "AI Training - Professional",
    description: "Advanced AI solutions with custom algorithms and optimization",
    price: 5999,
  },
  "app-development": {
    id: "app-development",
    title: "Custom App Development",
    description: "Full-stack application with AI integration",
    price: 4999,
  },
  "marketing-ai": {
    id: "marketing-ai",
    title: "Digital Marketing AI Suite",
    description: "AI-powered marketing automation and analytics",
    price: 1999,
  },
  "ai-consultation": {
    id: "ai-consultation",
    title: "AI Strategy Consultation",
    description: "1-on-1 consultation to plan your AI implementation",
    price: 499,
  },
  "ai-templates": {
    id: "ai-templates",
    title: "AI Model Templates Pack",
    description: "Pre-built AI models for common business use cases",
    price: 299,
  },
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [product, setProduct] = useState<any>(null)
  const { addToCart } = useCart()

  useEffect(() => {
    const productId = params.productId as string
    const foundProduct = products[productId as keyof typeof products]

    if (!foundProduct) {
      router.push("/store")
      return
    }

    if (!user) {
      router.push("/auth")
      return
    }

    setProduct(foundProduct)
  }, [params.productId, user, router])

  useEffect(() => {
    if (product && user) {
      // Add product to cart and redirect to billing
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.price,
        description: product.description,
        category: "Service",
      })
      router.push("/billing")
    }
  }, [product, user, router, addToCart])

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    )
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
              <Link href="/store" className="hover:text-blue-400 transition-colors">
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            Secure Checkout
          </h1>
          <p className="text-gray-300">Complete your purchase securely with PayFast</p>
        </div>
      </div>
    </div>
  )
}
