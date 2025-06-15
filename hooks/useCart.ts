"use client"

import { useState, useEffect, createContext, useContext } from "react"

export interface CartItem {
  id: string
  title: string
  price: number
  originalPrice: number
  description: string
  category: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Omit<CartItem, "quantity">) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getTotalSavings: () => number
  isEmpty: () => boolean
  syncCartWithStorage: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const context = useContext(CartContext)

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      const newItem = { ...product, quantity: 1 }
      const updatedItems = [...prevItems, newItem]
      localStorage.setItem("cart_items", JSON.stringify(updatedItems))
      return updatedItems
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== productId)
      localStorage.setItem("cart_items", JSON.stringify(updatedItems))
      return updatedItems
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item))
      localStorage.setItem("cart_items", JSON.stringify(updatedItems))
      return updatedItems
    })
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("cart_items")
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalSavings = () => {
    return items.reduce((total, item) => total + (item.originalPrice - item.price) * item.quantity, 0)
  }

  // Improve cart persistence by adding a sync function
  const syncCartWithStorage = () => {
    const savedCart = localStorage.getItem("cart_items")
    if (savedCart && items.length === 0) {
      setItems(JSON.parse(savedCart))
    }
  }

  // Load cart from localStorage on mount
  useEffect(() => {
    syncCartWithStorage()
  }, [])

  const isEmpty = () => {
    return items.length === 0
  }

  if (context !== undefined) {
    return context
  }

  // Export the syncCartWithStorage function
  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getTotalSavings,
    isEmpty,
    syncCartWithStorage,
  }
}
