"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { Plus, Trash2, Edit2 } from "lucide-react"

export function AdminProducts() {
  const { products, addProduct, deleteProduct, updateProduct, setCurrentPage } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
  })

  const handleSubmit = () => {
    if (!formData.name || !formData.description || !formData.category) {
      alert("Please fill in all fields")
      return
    }

    if (editingId) {
      updateProduct(editingId, formData)
      setEditingId(null)
    } else {
      addProduct({
        id: Date.now().toString(),
        ...formData,
      })
    }

    setFormData({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
    })
    setShowForm(false)
  }

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-2">Manage your product inventory</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setCurrentPage("admin-orders")}
              variant="outline"
              className="border-border text-foreground hover:bg-card"
            >
              View Orders
            </Button>
            <Button
              onClick={() => {
                setShowForm(true)
                setEditingId(null)
                setFormData({
                  name: "",
                  description: "",
                  price: 0,
                  stock: 0,
                  category: "",
                })
              }}
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 border border-border rounded-lg p-6 bg-card">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-border rounded bg-background text-foreground"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 border border-border rounded bg-background text-foreground"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                className="px-4 py-2 border border-border rounded bg-background text-foreground"
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) })}
                className="px-4 py-2 border border-border rounded bg-background text-foreground"
              />
            </div>
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded bg-background text-foreground mb-6"
              rows={3}
            />
            <div className="flex gap-3">
              <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:opacity-90">
                {editingId ? "Update Product" : "Add Product"}
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  setFormData({
                    name: "",
                    description: "",
                    price: 0,
                    stock: 0,
                    category: "",
                  })
                }}
                variant="outline"
                className="border-border text-foreground hover:bg-card"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border border-border rounded-lg p-6 bg-card hover:shadow-lg transition">
              <h3 className="text-lg font-semibold mb-2 text-foreground">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
              <div className="space-y-2 mb-6 border-t border-b border-border py-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold text-foreground">${product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stock:</span>
                  <span
                    className={product.stock > 10 ? "text-green-600 font-semibold" : "text-yellow-600 font-semibold"}
                  >
                    {product.stock} units
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">{product.category}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(product)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-border text-foreground hover:bg-card"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this product?")) {
                      deleteProduct(product.id)
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
