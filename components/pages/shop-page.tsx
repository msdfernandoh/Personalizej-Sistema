"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { ShoppingCart } from "lucide-react"

export function ShopPage() {
  const { products, addToCart, setCurrentPage } = useStore()
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const handleAddToCart = (productId: string) => {
    const quantity = quantities[productId] || 1
    addToCart(productId, quantity)
    setCurrentPage("cart")
  }

  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Product Catalog</h1>
          <p className="text-muted-foreground text-lg">Browse our complete range of enterprise solutions</p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">{category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.category === category)
                .map((product) => (
                  <div
                    key={product.id}
                    className="border border-border rounded-lg p-6 bg-card hover:shadow-lg transition flex flex-col"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-foreground">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                      <div className="mb-4">
                        <span className="text-sm text-muted-foreground">Stock: </span>
                        <span
                          className={product.stock > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}
                        >
                          {product.stock} units
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-3xl font-bold text-primary">${product.price}</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="1"
                          max={product.stock}
                          defaultValue="1"
                          onChange={(e) =>
                            setQuantities({
                              ...quantities,
                              [product.id]: Number.parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-16 px-2 py-2 border border-border rounded bg-background text-foreground text-center"
                        />
                        <Button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={product.stock === 0}
                          className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
