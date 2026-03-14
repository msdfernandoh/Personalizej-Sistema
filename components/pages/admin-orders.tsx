"use client"

import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { Package } from "lucide-react"

export function AdminOrders() {
  const { orders, updateOrder, setCurrentPage, products } = useStore()

  const getProductName = (productId: string) => {
    return products.find((p) => p.id === productId)?.name || "Unknown Product"
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground mt-2">Manage customer orders</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setCurrentPage("admin-products")}
              variant="outline"
              className="border-border text-foreground hover:bg-card"
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </Button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 border border-border rounded-lg bg-card">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-xl text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-border rounded-lg p-6 bg-card hover:shadow-lg transition">
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Order ID</p>
                    <p className="text-lg font-mono font-semibold text-foreground mt-1">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Customer</p>
                    <p className="font-semibold text-foreground mt-1">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Total</p>
                    <p className="text-2xl font-bold text-primary mt-1">${order.total}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Status</p>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrder(order.id, e.target.value as any)}
                      className={`mt-1 px-3 py-1 rounded text-sm font-semibold cursor-pointer ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Items ({order.items.length})</p>
                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <p key={item.productId} className="text-sm text-muted-foreground">
                        {getProductName(item.productId)} × {item.quantity}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
