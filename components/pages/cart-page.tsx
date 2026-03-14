"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { Trash2, ArrowLeft } from "lucide-react"

export function CartPage() {
  const { cart, products, removeFromCart, updateCartQuantity, createOrder, clearCart, setCurrentPage } = useStore()
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    email: "",
  })

  const cartItems = cart.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  }))

  const total = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)

  const handleCheckout = () => {
    if (!checkoutData.name || !checkoutData.email) {
      alert("Please fill in all fields")
      return
    }

    if (cart.length === 0) {
      alert("Your cart is empty")
      return
    }

    createOrder({
      items: cart,
      total,
      customerEmail: checkoutData.email,
      customerName: checkoutData.name,
      status: "pending",
      createdAt: new Date(),
      id: "",
    })

    alert(`Order placed successfully! Confirmation sent to ${checkoutData.email}`)
    clearCart()
    setCheckoutData({ name: "", email: "" })
    setCurrentPage("shop")
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setCurrentPage("shop")}
          className="flex items-center gap-2 text-primary hover:opacity-80 transition mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </button>

        <h1 className="text-4xl font-bold mb-8 text-foreground">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-6">Your cart is empty</p>
            <Button
              onClick={() => setCurrentPage("shop")}
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.productId} className="border border-border rounded-lg p-4 bg-card flex gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground">{item.product?.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">${item.product?.price}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border border-border rounded bg-background">
                          <button
                            onClick={() => updateCartQuantity(item.productId, Math.max(1, item.quantity - 1))}
                            className="px-3 py-1 text-muted-foreground hover:text-foreground"
                          >
                            -
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            className="px-3 py-1 text-muted-foreground hover:text-foreground"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-semibold text-primary">
                          ${(item.product?.price || 0) * item.quantity}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-destructive hover:opacity-80 transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout */}
            <div className="lg:col-span-1">
              <div className="border border-border rounded-lg p-6 bg-card sticky top-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Order Summary</h2>
                  <div className="space-y-2 text-sm pb-4 border-b border-border">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${total}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg text-foreground pt-2">
                      <span>Total</span>
                      <span className="text-primary">${total}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                    <input
                      type="text"
                      value={checkoutData.name}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                    <input
                      type="email"
                      value={checkoutData.email}
                      onChange={(e) =>
                        setCheckoutData({
                          ...checkoutData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 text-lg py-6"
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
