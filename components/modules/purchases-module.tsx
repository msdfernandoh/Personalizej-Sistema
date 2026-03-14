"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, CheckCircle, Trash2, Edit2 } from "lucide-react"
import { useState } from "react"

export function PurchasesModule() {
  const {
    purchases,
    products,
    createPurchase,
    confirmPurchase,
    updatePurchase,
    deletePurchase,
    addFinancial,
    addAccountPayable,
  } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editingPurchase, setEditingPurchase] = useState<string | null>(null)
  const [newPurchase, setNewPurchase] = useState({
    supplierName: "",
    items: [] as { productId: string; quantity: number; costPrice: number; salePrice: number }[],
    notes: "",
    status: "draft" as "draft" | "confirmed" | "paid" | "shipped" | "delivered",
  })

  const addItemToPurchase = () => {
    setNewPurchase({
      ...newPurchase,
      items: [...newPurchase.items, { productId: "", quantity: 1, costPrice: 0, salePrice: 0 }],
    })
  }

  const removeItemFromPurchase = (index: number) => {
    const newItems = newPurchase.items.filter((_, i) => i !== index)
    setNewPurchase({ ...newPurchase, items: newItems })
  }

  const handleCreatePurchase = () => {
    if (newPurchase.supplierName && newPurchase.items.length > 0) {
      const purchaseItems = newPurchase.items.map((item) => {
        const product = products.find((p) => p.id === item.productId)
        return {
          productId: item.productId,
          productName: product?.name || "",
          quantity: item.quantity,
          costPrice: item.costPrice,
          salePrice: item.salePrice,
          total: item.costPrice * item.quantity,
        }
      })

      const total = purchaseItems.reduce((sum, item) => sum + item.total, 0)

      if (editingPurchase) {
        updatePurchase(editingPurchase, {
          supplierName: newPurchase.supplierName,
          items: purchaseItems,
          total,
          notes: newPurchase.notes,
          status: newPurchase.status,
        })
        setEditingPurchase(null)
      } else {
        createPurchase({
          supplierId: Date.now().toString(),
          supplierName: newPurchase.supplierName,
          items: purchaseItems,
          total,
          status: newPurchase.status,
          paymentStatus: "pending",
          notes: newPurchase.notes,
        })
      }

      setNewPurchase({ supplierName: "", items: [], notes: "", status: "draft" })
      setShowForm(false)
    }
  }

  const handleConfirmPurchase = (id: string) => {
    if (confirm("Confirmar esta compra? Será lançada em contas a pagar.")) {
      confirmPurchase(id)
    }
  }

  const handlePayPurchase = (id: string) => {
    const purchase = purchases.find((p) => p.id === id)
    if (!purchase) return

    // Create financial transaction
    addFinancial({
      type: "expense",
      amount: purchase.total,
      description: `Pagamento de compra - ${purchase.supplierName}`,
      category: "Compras",
      status: "completed",
      date: new Date(),
    })

    updatePurchase(id, { paymentStatus: "paid" })
  }

  const handleInvoicePurchase = (id: string) => {
    const purchase = purchases.find((p) => p.id === id)
    if (!purchase) return

    // Create account payable
    addAccountPayable({
      description: `Compra de ${purchase.items.length} itens - ${purchase.supplierName}`,
      amount: purchase.total,
      category: "Compras",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "pending",
      supplier: purchase.supplierName,
      installments: 1,
    })

    updatePurchase(id, { status: "confirmed" })
  }

  const handleEdit = (purchase: any) => {
    setEditingPurchase(purchase.id)
    setNewPurchase({
      supplierName: purchase.supplierName,
      items: purchase.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        costPrice: item.costPrice,
        salePrice: item.salePrice,
      })),
      notes: purchase.notes || "",
      status: purchase.status,
    })
    setShowForm(true)
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    updatePurchase(id, { status: newStatus as any })
  }

  const handleDeletePurchase = (id: string) => {
    deletePurchase(id)
  }

  const statusLabels = {
    draft: "Rascunho",
    confirmed: "Confirmada",
    paid: "Pago",
    shipped: "Enviado",
    delivered: "Entregue",
    received: "Recebida",
  }

  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    confirmed: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-teal-100 text-teal-800",
    received: "bg-green-100 text-green-800",
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Compras</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Compra
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total de Compras</p>
          <p className="text-2xl font-bold">{purchases.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pendentes</p>
          <p className="text-2xl font-bold">{purchases.filter((p) => p.status === "draft").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Valor Total</p>
          <p className="text-2xl font-bold">R$ {purchases.reduce((sum, p) => sum + p.total, 0).toFixed(2)}</p>
        </Card>
      </div>

      {showForm && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">{editingPurchase ? "Editar Compra" : "Nova Compra"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fornecedor</label>
              <input
                placeholder="Nome do fornecedor"
                value={newPurchase.supplierName}
                onChange={(e) => setNewPurchase({ ...newPurchase, supplierName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Itens da Compra</label>
              {newPurchase.items.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2 items-end">
                  <div className="flex-1">
                    <select
                      value={item.productId}
                      onChange={(e) => {
                        const newItems = [...newPurchase.items]
                        const product = products.find((p) => p.id === e.target.value)
                        newItems[index] = {
                          ...newItems[index],
                          productId: e.target.value,
                          costPrice: product?.costPrice || 0,
                          salePrice: product?.salePrice || 0,
                        }
                        setNewPurchase({ ...newPurchase, items: newItems })
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Selecione um produto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qtd"
                      value={item.quantity || ""}
                      onChange={(e) => {
                        const newItems = [...newPurchase.items]
                        newItems[index].quantity = Number.parseInt(e.target.value) || 1
                        setNewPurchase({ ...newPurchase, items: newItems })
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Custo"
                      value={item.costPrice || ""}
                      onChange={(e) => {
                        const newItems = [...newPurchase.items]
                        newItems[index].costPrice = Number.parseFloat(e.target.value) || 0
                        setNewPurchase({ ...newPurchase, items: newItems })
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Venda"
                      value={item.salePrice || ""}
                      onChange={(e) => {
                        const newItems = [...newPurchase.items]
                        newItems[index].salePrice = Number.parseFloat(e.target.value) || 0
                        setNewPurchase({ ...newPurchase, items: newItems })
                      }}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeItemFromPurchase(index)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItemToPurchase}
                className="mt-2 bg-transparent"
              >
                <Plus className="w-4 h-4 mr-1" /> Adicionar Item
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Observações</label>
              <textarea
                value={newPurchase.notes}
                onChange={(e) => setNewPurchase({ ...newPurchase, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>

            {newPurchase.items.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-lg font-semibold">
                  Total: R${" "}
                  {newPurchase.items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false)
                setEditingPurchase(null)
                setNewPurchase({ supplierName: "", items: [], notes: "", status: "draft" })
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreatePurchase}>{editingPurchase ? "Atualizar" : "Criar"} Compra</Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Fornecedor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Itens</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma compra registrada
                  </td>
                </tr>
              ) : (
                purchases.map((purchase) => (
                  <tr key={purchase.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-3 text-sm font-medium">#{purchase.id.slice(0, 8)}</td>
                    <td className="px-6 py-3 text-sm">{purchase.supplierName}</td>
                    <td className="px-6 py-3 text-sm">{purchase.items.length} itens</td>
                    <td className="px-6 py-3 text-sm font-semibold">R$ {purchase.total.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <select
                        value={purchase.status}
                        onChange={(e) => handleStatusChange(purchase.id, e.target.value)}
                        className="text-xs px-2 py-1 border rounded"
                      >
                        <option value="draft">Rascunho</option>
                        <option value="confirmed">Confirmada</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregue</option>
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        {purchase.status === "draft" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleConfirmPurchase(purchase.id)}
                            className="gap-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirmar
                          </Button>
                        )}
                        {purchase.paymentStatus !== "paid" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePayPurchase(purchase.id)}
                              className="gap-1"
                            >
                              💳 Pago
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleInvoicePurchase(purchase.id)}
                              className="gap-1"
                            >
                              📄 Faturado
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(purchase)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeletePurchase(purchase.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
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
