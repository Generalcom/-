"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

// Custom animated empty cart component
function AnimatedEmptyCart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-48 h-48 bg-muted/20 rounded-lg animate-pulse flex items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-48 h-48 flex items-center justify-center"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center border-2 border-primary/20">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <ShoppingBag className="h-16 w-16 text-primary/60" />
          </motion.div>
        </div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute -bottom-1 -left-1 w-4 h-4 bg-primary/15 rounded-full"
        />
      </motion.div>
    </motion.div>
  )
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, getTotalSavings, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed to checkout.",
        action: (
          <Link href="/auth?redirect=/checkout">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        ),
      })
      onClose()
      return
    }

    // Close cart sidebar and navigate to checkout
    onClose()
    router.push("/checkout")
  }

  const handleRemoveFromCart = (itemId: string, itemTitle: string) => {
    removeFromCart(itemId)
    toast({
      title: `${itemTitle} removed from cart.`,
      variant: "default",
    })
  }

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-card border-l border-border z-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Shopping Cart</h2>
                {getTotalItems() > 0 && (
                  <Badge variant="default" className="bg-primary text-primary-foreground text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="mb-4">
                    <AnimatedEmptyCart />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1 mt-4">Your cart is empty</h3>
                  <p className="text-base text-[#666] mb-6">Add some AI solutions to get started!</p>
                  <Link href="/store" passHref>
                    <Button onClick={onClose} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="bg-secondary/50 rounded-md p-3 border border-border"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="flex-1 pr-2">
                          <h4 className="font-medium text-foreground text-sm leading-tight">{item.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFromCart(item.id, item.title)}
                          className="text-destructive hover:text-destructive/80 h-7 w-7"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="h-7 w-7 border-primary text-primary"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-foreground font-medium w-7 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 border-primary text-primary"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <span className="text-foreground font-semibold text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          {item.originalPrice > item.price && (
                            <p className="text-xs text-muted-foreground line-through">
                              {formatPrice(item.originalPrice * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCart}
                    className="w-full border-destructive text-destructive hover:bg-destructive/10 mt-3"
                  >
                    Clear Cart
                  </Button>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-4 bg-background/50">
                <div className="space-y-2 mb-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({getTotalItems()} items)</span>
                    <span className="text-foreground font-medium">{formatPrice(getTotalPrice())}</span>
                  </div>
                  {getTotalSavings() > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Savings</span>
                      <span className="text-primary font-medium">-{formatPrice(getTotalSavings())}</span>
                    </div>
                  )}
                  <Separator className="my-1 bg-border" />
                  <div className="flex justify-between text-md font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base py-2.5"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full border-primary text-primary hover:bg-accent"
                  >
                    Continue Shopping
                  </Button>
                </div>
                <p className="mt-3 text-center text-xs text-muted-foreground">🔒 Secure checkout process</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
