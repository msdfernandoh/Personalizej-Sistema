"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { useState } from "react"

export function ShippingModule() {
  const { shipments, orders, createShipment, updateShipment, deleteShipment, getCategoriesByModule } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editingShipment, setEditingShipment] = useState<string | null>(null)

  const shippingCategories = getCategoriesByModule("shipping")

  const [newShipment, setNewShipment] = useState({
    orderId: "",
    carrier: "",
    trackingNumber: "",
    estimatedDelivery: "",
    status: "pending" as const,
  })

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    shipped: "bg-blue-100 text-blue-800",
    in_transit: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    returned: "bg-red-100 text-red-800",
  }

  const statusLabels = {
    pending: "Pendente",
    shipped: "Enviado",
    in_transit: "Em Trânsito",
    delivered: "Entregue",
    returned: "Devolvido",
  }

  const handleAddShipment = () => {
    if (newShipment.orderId && newShipment.carrier && newShipment.trackingNumber) {
      if (editingShipment) {
        updateShipment(editingShipment, {
          ...newShipment,
          estimatedDelivery: newShipment.estimatedDelivery
            ? new Date(newShipment.estimatedDelivery)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        setEditingShipment(null)
      } else {
        createShipment({
          orderId: newShipment.orderId,
          carrier: newShipment.carrier,
          trackingNumber: newShipment.trackingNumber,
          status: newShipment.status,
          estimatedDelivery: newShipment.estimatedDelivery
            ? new Date(newShipment.estimatedDelivery)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
      }
      setNewShipment({ orderId: "", carrier: "", trackingNumber: "", estimatedDelivery: "", status: "pending" })
      setShowForm(false)
    } else {
      alert("Por favor, preencha todos os campos obrigatórios")
    }
  }

  const handleEdit = (shipment: any) => {
    setEditingShipment(shipment.id)
    setNewShipment({
      orderId: shipment.orderId,
      carrier: shipment.carrier,
      trackingNumber: shipment.trackingNumber,
      estimatedDelivery: new Date(shipment.estimatedDelivery).toISOString().split("T")[0],
      status: shipment.status,
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    deleteShipment(id)
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    const updates: any = { status: newStatus }
    if (newStatus === "delivered") {
      updates.actualDelivery = new Date()
    }
    updateShipment(id, updates)
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Envios e Entrega</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Criar Envio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total de Envios</p>
          <p className="text-2xl font-bold">{shipments.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Em Trânsito</p>
          <p className="text-2xl font-bold">{shipments.filter((s) => s.status === "in_transit").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Entregues</p>
          <p className="text-2xl font-bold">{shipments.filter((s) => s.status === "delivered").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pendentes</p>
          <p className="text-2xl font-bold">{shipments.filter((s) => s.status === "pending").length}</p>
        </Card>
      </div>

      {showForm && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">{editingShipment ? "Editar Envio" : "Novo Envio"}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Pedido</label>
              <select
                value={newShipment.orderId}
                onChange={(e) => setNewShipment({ ...newShipment, orderId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                disabled={!!editingShipment}
              >
                <option value="">Selecione um pedido</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    Pedido #{order.id.slice(0, 8)} - {order.customerName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Transportadora</label>
              <select
                value={newShipment.carrier}
                onChange={(e) => setNewShipment({ ...newShipment, carrier: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Selecione uma transportadora</option>
                {shippingCategories.length > 0 ? (
                  shippingCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Correios">Correios</option>
                    <option value="Sedex">Sedex</option>
                    <option value="PAC">PAC</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Código de Rastreio</label>
              <input
                value={newShipment.trackingNumber}
                onChange={(e) => setNewShipment({ ...newShipment, trackingNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Ex: BR123456789BR"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data de Entrega Estimada</label>
              <input
                type="date"
                value={newShipment.estimatedDelivery}
                onChange={(e) => setNewShipment({ ...newShipment, estimatedDelivery: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false)
                setEditingShipment(null)
                setNewShipment({
                  orderId: "",
                  carrier: "",
                  trackingNumber: "",
                  estimatedDelivery: "",
                  status: "pending",
                })
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddShipment}>{editingShipment ? "Atualizar" : "Criar"} Envio</Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-semibold">Pedido</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Rastreamento</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Transportadora</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Entrega Estimada</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Entrega Real</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {shipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhum envio
                  </td>
                </tr>
              ) : (
                shipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-3 text-sm font-medium">#{shipment.orderId.slice(0, 8)}</td>
                    <td className="px-6 py-3 text-sm font-mono">{shipment.trackingNumber}</td>
                    <td className="px-6 py-3 text-sm">{shipment.carrier}</td>
                    <td className="px-6 py-3 text-sm">
                      {new Date(shipment.estimatedDelivery).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {shipment.actualDelivery ? new Date(shipment.actualDelivery).toLocaleDateString("pt-BR") : "-"}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2 items-center">
                        <select
                          value={shipment.status}
                          onChange={(e) => handleStatusChange(shipment.id, e.target.value)}
                          className="text-xs px-2 py-1 border rounded"
                        >
                          <option value="pending">Pendente</option>
                          <option value="shipped">Enviado</option>
                          <option value="in_transit">Em Trânsito</option>
                          <option value="delivered">Entregue</option>
                          <option value="returned">Devolvido</option>
                        </select>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(shipment)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(shipment.id)}>
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
