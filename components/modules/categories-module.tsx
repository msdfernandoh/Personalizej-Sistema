"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Trash2, Tag, Edit } from "lucide-react"
import { useState } from "react"

export function CategoriesModule() {
  const { universalCategories, addUniversalCategory, updateUniversalCategory, deleteUniversalCategory } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    module: "financial" as "financial" | "orders" | "accounts_payable" | "products" | "shipping" | "calendar",
  })

  const handleEditCategory = (id: string) => {
    const category = universalCategories.find((c) => c.id === id)
    if (category) {
      setNewCategory({ name: category.name, module: category.module })
      setEditingCategory(id)
      setShowForm(true)
    }
  }

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.module) {
      if (editingCategory) {
        updateUniversalCategory(editingCategory, newCategory)
        setEditingCategory(null)
      } else {
        addUniversalCategory(newCategory)
      }
      setNewCategory({ name: "", module: "financial" })
      setShowForm(false)
    }
  }

  const moduleLabels = {
    financial: "Financeiro",
    orders: "Pedidos",
    accounts_payable: "Contas a Pagar",
    products: "Produtos",
    shipping: "Envios",
    calendar: "Agenda",
  }

  const moduleColors = {
    financial: "bg-emerald-100 text-emerald-800",
    orders: "bg-blue-100 text-blue-800",
    accounts_payable: "bg-orange-100 text-orange-800",
    products: "bg-purple-100 text-purple-800",
    shipping: "bg-cyan-100 text-cyan-800",
    calendar: "bg-pink-100 text-pink-800",
  }

  const groupedCategories = universalCategories.reduce(
    (acc, cat) => {
      if (!acc[cat.module]) acc[cat.module] = []
      acc[cat.module].push(cat)
      return acc
    },
    {} as Record<string, typeof universalCategories>,
  )

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categorias</h2>
          <p className="text-sm text-muted-foreground">Gerencie categorias para todos os módulos do sistema</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Categoria
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total de Categorias</p>
          <p className="text-2xl font-bold">{universalCategories.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Financeiro</p>
          <p className="text-2xl font-bold">{universalCategories.filter((c) => c.module === "financial").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pedidos</p>
          <p className="text-2xl font-bold">{universalCategories.filter((c) => c.module === "orders").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Contas a Pagar</p>
          <p className="text-2xl font-bold">
            {universalCategories.filter((c) => c.module === "accounts_payable").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Envios</p>
          <p className="text-2xl font-bold">{universalCategories.filter((c) => c.module === "shipping").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Agenda</p>
          <p className="text-2xl font-bold">{universalCategories.filter((c) => c.module === "calendar").length}</p>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">{editingCategory ? "Editar Categoria" : "Nova Categoria"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome da Categoria</label>
              <input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Ex: Vendas Online"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Módulo</label>
              <select
                value={newCategory.module}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    module: e.target.value as
                      | "financial"
                      | "orders"
                      | "accounts_payable"
                      | "products"
                      | "shipping"
                      | "calendar",
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="financial">Financeiro</option>
                <option value="orders">Pedidos</option>
                <option value="accounts_payable">Contas a Pagar</option>
                <option value="products">Produtos</option>
                <option value="shipping">Envios</option>
                <option value="calendar">Agenda</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false)
                setEditingCategory(null)
                setNewCategory({ name: "", module: "financial" })
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddCategory}>{editingCategory ? "Atualizar" : "Criar"} Categoria</Button>
          </div>
        </Card>
      )}

      {/* Categories by Module */}
      <div className="space-y-6">
        {Object.entries(groupedCategories).map(([module, categories]) => (
          <Card key={module} className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">{moduleLabels[module as keyof typeof moduleLabels]}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${moduleColors[module as keyof typeof moduleColors]}`}>
                {categories.length} categorias
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Tag className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{category.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${moduleColors[category.module]}`}>
                        {moduleLabels[category.module]}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCategory(category.id)}
                      className="text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteUniversalCategory(category.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {universalCategories.length === 0 && (
          <Card className="p-12 text-center">
            <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma categoria cadastrada ainda</p>
            <p className="text-sm text-muted-foreground">Clique em "Nova Categoria" para começar</p>
          </Card>
        )}
      </div>
    </div>
  )
}
