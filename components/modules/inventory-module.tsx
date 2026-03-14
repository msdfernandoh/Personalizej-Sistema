"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit2, Trash2, Package, AlertCircle } from "lucide-react"

export function InventoryModule() {
  const { products, deleteProduct, setCurrentPage, setEditingProduct } = useStore()

  const lowStockProducts = products.filter((p) => p.stock < 10)

  const handleAddProduct = () => {
    setCurrentPage("product-registration")
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Controle de Estoque</h2>
          <p className="text-sm text-muted-foreground mt-1">Gerencie seus produtos e inventário</p>
        </div>
        <Button onClick={handleAddProduct} className="gap-2 shadow-md">
          <Plus className="w-4 h-4" />
          Cadastrar Produto
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total de Produtos</p>
              <p className="text-3xl font-bold text-foreground">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Valor Total</p>
              <p className="text-3xl font-bold text-foreground">
                R$ {products.reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Estoque Baixo</p>
              <p className="text-3xl font-bold text-yellow-600">{lowStockProducts.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Categorias</p>
              <p className="text-3xl font-bold text-foreground">{new Set(products.map((p) => p.category)).size}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nome</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Categoria</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Preço</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estoque</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Valor Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-12 h-12 text-muted-foreground/50" />
                      <p className="font-medium">Nenhum produto cadastrado</p>
                      <p className="text-sm">Clique em "Cadastrar Produto" para adicionar o primeiro produto</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{product.sku}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{product.name}</p>
                        {product.size && product.color && (
                          <p className="text-xs text-muted-foreground">
                            {product.size} • {product.color}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground">
                        {product.category || "Sem categoria"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      R$ {(Number(product.price) || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock < 10
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : product.stock < 20
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {product.stock} un.
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-foreground">
                      R$ {((Number(product.price) || 0) * (Number(product.stock) || 0)).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-primary/10 hover:text-primary"
                          onClick={() => {
                            setEditingProduct(product)
                            setCurrentPage("product-registration")
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
