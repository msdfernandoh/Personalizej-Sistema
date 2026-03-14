"use client"

import type React from "react"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Save, X } from "lucide-react"
import { useState } from "react"

export function ProductRegistrationPage() {
  const { addProduct, updateProduct, editingProduct, setEditingProduct, setCurrentPage, getCategoriesByModule } =
    useStore()
  const [formData, setFormData] = useState({
    name: editingProduct?.name || "",
    description: editingProduct?.description || "",
    costPrice: editingProduct?.costPrice?.toString() || "",
    salePrice: editingProduct?.salePrice?.toString() || "",
    stock: editingProduct?.stock?.toString() || "",
    category: editingProduct?.category || "",
    sku: editingProduct?.sku || "",
    weight: editingProduct?.weight?.toString() || "",
    height: editingProduct?.height?.toString() || "",
    width: editingProduct?.width?.toString() || "",
    length: editingProduct?.length?.toString() || "",
    size: editingProduct?.size || "",
    color: editingProduct?.color || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.sku) {
      const productData = {
        name: formData.name,
        description: formData.description,
        costPrice: Number.parseFloat(formData.costPrice) || 0,
        salePrice: Number.parseFloat(formData.salePrice) || 0,
        stock: Number.parseInt(formData.stock) || 0,
        category: formData.category,
        sku: formData.sku,
        weight: Number.parseFloat(formData.weight) || 0,
        height: Number.parseFloat(formData.height) || 0,
        width: Number.parseFloat(formData.width) || 0,
        length: Number.parseFloat(formData.length) || 0,
        size: formData.size,
        color: formData.color,
      }

      if (editingProduct) {
        updateProduct(editingProduct.id, productData)
        setEditingProduct(null)
      } else {
        addProduct(productData)
      }
      setCurrentPage("inventory")
    }
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setCurrentPage("inventory")
  }

  const productCategories = getCategoriesByModule("products")

  return (
    <div className="min-h-full bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleCancel} className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {editingProduct ? "Editar Produto" : "Cadastro de Produto"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {editingProduct
                  ? "Edite os dados abaixo para atualizar o produto"
                  : "Preencha os dados abaixo para adicionar um novo produto ao estoque"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="p-8 shadow-md">
            <div className="space-y-8">
              {/* Informações Básicas */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Informações Básicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-foreground">
                      Nome do Produto <span className="text-destructive">*</span>
                    </label>
                    <input
                      required
                      placeholder="Digite o nome completo do produto"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">
                      SKU <span className="text-destructive">*</span>
                    </label>
                    <input
                      required
                      placeholder="Ex: PROD-001"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Categoria</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Selecione uma categoria</option>
                      {productCategories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">Cadastre categorias em Categorias → Produtos</p>{" "}
                    // Added help text
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-foreground">Descrição</label>
                    <textarea
                      placeholder="Descrição detalhada do produto"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Preço e Estoque */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Preço e Estoque</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Preço de Custo (R$)</label>
                    <input
                      placeholder="0,00"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Preço de Venda (R$)</label>
                    <input
                      placeholder="0,00"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Quantidade em Estoque</label>
                    <input
                      placeholder="0"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Características Físicas */}
              <div>
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Características Físicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Peso (kg)</label>
                    <input
                      placeholder="0,00"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Altura (cm)</label>
                    <input
                      placeholder="0,00"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Largura (cm)</label>
                    <input
                      placeholder="0,00"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.width}
                      onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Comprimento (cm)</label>
                    <input
                      placeholder="0,00"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.length}
                      onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Tamanho</label>
                    <input
                      placeholder="Ex: P, M, G, GG, 38, 40"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Cor</label>
                    <input
                      placeholder="Ex: Azul, Vermelho, Preto"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full px-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={handleCancel} className="gap-2 px-6 bg-transparent">
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button type="submit" className="gap-2 px-6 bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4" />
              {editingProduct ? "Salvar Alterações" : "Salvar Produto"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
