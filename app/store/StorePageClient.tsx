"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Download, Zap, Brain, Code, TrendingUp, CheckCircle, Shield, Lock, Headset, Server } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import { useCart } from "@/hooks/useCart"
import CartSidebar from "@/components/CartSidebar"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function StorePageClient() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { user, profile } = useAuth()
  const { addToCart, getTotalItems } = useCart()
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const products = [
    {
      id: "cyber-compliance",
      title: "Cybersecurity & Compliance",
      description: "Comprehensive security solutions including compliance audits and employee training.",
      price: 85000,
      originalPrice: 110000,
      category: "Security",
      icon: Lock,
      features: [
        "Firewall & antivirus setup",
        "POPIA/GDPR compliance audits",
        "Employee security training",
        "Critical for legal protection",
        "Risk management framework",
      ],
      popular: true,
    },
    {
      id: "managed-it",
      title: "Managed IT Support",
      description: "Complete IT support package for businesses of all sizes.",
      price: 45000,
      originalPrice: 60000,
      category: "IT Support",
      icon: Headset,
      features: [
        "24/7 remote helpdesk",
        "Device & network maintenance",
        "Software updates & patching",
        "Essential for all businesses",
        "Monthly reporting included",
      ],
      popular: false,
    },
    {
      id: "cyber-security",
      title: "Business Cyber Security",
      description: "Comprehensive security assessment and protection for your business systems and data.",
      price: 65000,
      originalPrice: 85000,
      category: "Security",
      icon: Shield,
      features: [
        "Full vulnerability assessment",
        "Penetration testing",
        "Security policy development",
        "Employee training materials",
        "3-month monitoring period",
      ],
      popular: false,
    },
    {
      id: "app-development",
      title: "Custom App Development",
      description: "Full-stack application development with seamless AI integration, built for scale and performance.",
      price: 75000,
      originalPrice: 105000,
      category: "Development",
      icon: Code,
      features: [
        "React/Next.js frontend development",
        "Node.js/Python backend development",
        "AI model integration & API development",
        "Cloud deployment (AWS/Azure/GCP)",
        "60-day post-launch support",
      ],
      popular: false,
    },
    {
      id: "marketing-ai",
      title: "Digital Marketing AI Suite",
      description: "AI-powered marketing automation, customer journey analytics, and campaign optimization.",
      price: 30000,
      originalPrice: 45000,
      category: "Marketing",
      icon: TrendingUp,
      features: [
        "AI-driven customer segmentation",
        "Automated & personalized campaigns",
        "Predictive conversion optimization",
        "Comprehensive analytics dashboard",
        "45-day strategy support",
      ],
      popular: false,
    },
    {
      id: "ai-consultation",
      title: "AI Strategy Consultation",
      description: "Expert 1-on-1 consultation to define and plan your AI implementation roadmap for maximum impact.",
      price: 7500,
      originalPrice: 12000,
      category: "Consultation",
      icon: Zap,
      features: [
        "Intensive 2-hour strategy session",
        "Custom AI adoption roadmap",
        "Technology stack recommendations",
        "Potential ROI analysis & projections",
        "30-day follow-up email support",
      ],
      popular: false,
    }
  ]

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      description: product.description,
      category: product.category,
      quantity: 1,
    })
    toast({
      title: `${product.title} added to cart!`,
      description: `Price: ${formatPrice(product.price)}`,
    })
  }

  const handleBuyNow = (product: any) => {
    if (!user) {
      router.push("/auth?redirect=/store")
      return
    }
    handleAddToCart(product)
    setIsCartOpen(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Vort
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/train-ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Train AI
              </Link>
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    Hi, {profile?.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => setIsCartOpen(true)}
                    className="relative text-muted-foreground hover:text-foreground px-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 p-0 flex items-center justify-center rounded-full">
                        {getTotalItems()}
                      </Badge>
                    )}
                    <span className="sr-only">View Cart</span>
                  </Button>
                </div>
              ) : (
                <Link href="/auth?redirect=/store" passHref>
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-accent">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Vort Business Solutions</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive technology services designed to secure and empower your business operations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              id={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group flex"
            >
              {product.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1 text-xs shadow-md">
                    <Star className="h-3 w-3 mr-1.5" />
                    POPULAR CHOICE
                  </Badge>
                </div>
              )}
              <Card className="bg-card border-border w-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-primary text-primary-foreground rounded-md flex items-center justify-center">
                      <product.icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">{product.title}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground min-h-[40px]">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col justify-between pt-0">
                  <div>
                    <div className="flex items-baseline space-x-2 mb-4">
                      <span className="text-2xl font-bold text-foreground">{formatPrice(product.price)}</span>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <Badge variant="destructive" className="text-xs bg-red-700/10 text-red-500 border-red-700/20">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </Badge>
                    </div>
                    <ul className="space-y-1.5 mb-5">
                      {product.features.slice(0, 5).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-xs text-muted-foreground">
                          <CheckCircle className="h-3.5 w-3.5 text-primary mr-1.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2 mt-auto">
                    <Button
                      onClick={() => handleBuyNow(product)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      size="sm"
                    >
                      Buy Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAddToCart(product)}
                      className="w-full border-primary text-primary hover:bg-accent"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Card className="bg-secondary border-border">
            <CardContent className="p-6 md:p-8">
              <h3 className="text-xl font-semibold text-foreground mb-3">Secure & Reliable Services</h3>
              <p className="text-muted-foreground mb-4 max-w-xl mx-auto text-sm">
                Our solutions are designed with security and reliability in mind. We implement industry best practices to ensure your business operations remain protected and efficient.
              </p>
              <div className="flex justify-center items-center space-x-4 text-xs text-muted-foreground">
                <span>🔒 Enterprise-grade Security</span>
                <span>🛡️ Compliance Guaranteed</span>
                <span>⏱️ 24/7 Support</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
