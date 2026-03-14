"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Printer, Upload, Edit2, Trash2, Paperclip, Download, Eye, X } from "lucide-react"
import { useState } from "react"

export function OrdersModule() {
  const {
    orders,
    customers,
    products,
    createOrder,
    updateOrder,
    deleteOrder,
    addFinancial,
    getCategoriesByModule,
    createShipment,
    addOrderAttachment,
    removeOrderAttachment,
  } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)
  const [showShipmentModal, setShowShipmentModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadingOrderId, setUploadingOrderId] = useState<string | null>(null)
  const [shipmentData, setShipmentData] = useState({
    carrier: "",
    trackingNumber: "",
    estimatedDelivery: "",
  })

  const [newOrder, setNewOrder] = useState({
    customerId: "",
    items: [] as { productId: string; quantity: number }[],
    shippingAddress: "",
    shippingNumber: "",
    shippingCity: "",
    shippingState: "",
    shippingZipCode: "",
    shippingCost: 0,
    notes: "",
  })

  const [paymentDetails, setPaymentDetails] = useState({
    type: "recebimento_pix" as
      | "entrada"
      | "recebimento_cartao"
      | "recebimento_pix"
      | "recebimento_dinheiro"
      | "recebimento_boleto",
    bank: "",
    category: "",
    notes: "",
  })

  const [newStatus, setNewStatus] = useState<"pending" | "processing" | "shipped" | "delivered" | "cancelled">(
    "pending",
  )

  const getCustomerName = (customerId: string) => {
    return customers.find((c) => c.id === customerId)?.name || "Desconhecido"
  }

  const loadCustomerAddress = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId)
    if (customer) {
      setNewOrder({
        ...newOrder,
        customerId,
        shippingAddress: customer.address,
        shippingNumber: customer.addressNumber,
        shippingCity: customer.city,
        shippingState: customer.state,
        shippingZipCode: customer.zipCode,
      })
    } else {
      setNewOrder({ ...newOrder, customerId })
    }
  }

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const statusLabels = {
    pending: "Pendente",
    processing: "Processando",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
  }

  const paymentTypeLabels = {
    entrada: "Entrada",
    recebimento_cartao: "Recebimento Cartão",
    recebimento_pix: "Recebimento PIX",
    recebimento_dinheiro: "Recebimento Dinheiro",
    recebimento_boleto: "Recebimento Boleto",
  }

  const financialCategories = getCategoriesByModule("financial")

  const handleAddOrder = () => {
    if (newOrder.customerId && newOrder.items.length > 0) {
      const customer = customers.find((c) => c.id === newOrder.customerId)
      if (!customer) return

      const orderItems = newOrder.items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId)
          if (!product) return null
          return {
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            unitPrice: product.salePrice || 0,
            total: (product.salePrice || 0) * item.quantity,
          }
        })
        .filter(Boolean)

      const subtotal = orderItems.reduce((sum, item) => sum + (item?.total || 0), 0)
      const total = subtotal + newOrder.shippingCost

      const fullAddress = `${newOrder.shippingAddress}, ${newOrder.shippingNumber} - ${newOrder.shippingCity}/${newOrder.shippingState} - ${newOrder.shippingZipCode}`

      createOrder({
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        items: orderItems as any,
        total,
        shippingCost: newOrder.shippingCost,
        status: "pending",
        paymentStatus: "pending",
        shippingAddress: fullAddress,
        notes: newOrder.notes,
      })

      setNewOrder({
        customerId: "",
        items: [],
        shippingAddress: "",
        shippingNumber: "",
        shippingCity: "",
        shippingState: "",
        shippingZipCode: "",
        shippingCost: 0,
        notes: "",
      })
      setShowForm(false)
    }
  }

  const addItemToOrder = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { productId: "", quantity: 1 }],
    })
  }

  const handlePrintOrder = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <html>
        <head>
          <title>Pedido #${order.id.slice(0, 8)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-size: 18px; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Pedido #${order.id.slice(0, 8)}</h1>
          <p><strong>Cliente:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Endereço de Entrega:</strong> ${order.shippingAddress}</p>
          <p><strong>Status:</strong> ${statusLabels[order.status as keyof typeof statusLabels]}</p>
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>R$ ${item.unitPrice.toFixed(2)}</td>
                  <td>R$ ${item.total.toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <div class="total">Total: R$ ${order.total.toFixed(2)}</div>
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const handleUploadOrders = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json,.csv"
    input.onchange = (e: any) => {
      const file = e.target?.files[0]
      if (file) {
        alert(`Arquivo ${file.name} selecionado. Funcionalidade de importação em desenvolvimento.`)
      }
    }
    input.click()
  }

  const calculateOrderTotal = () => {
    return newOrder.items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)
      return sum + (product?.salePrice || 0) * item.quantity
    }, 0)
  }

  const calculateFullTotal = () => {
    return calculateOrderTotal() + newOrder.shippingCost
  }

  const handleOpenPaymentModal = (orderId: string) => {
    setEditingOrderId(orderId)
    setShowPaymentModal(true)
  }

  const handleOpenStatusModal = (orderId: string, currentStatus: string) => {
    setEditingOrderId(orderId)
    setNewStatus(currentStatus as any)
    setShowStatusModal(true)
  }

  const handleConfirmPayment = () => {
    if (!editingOrderId) return

    const order = orders.find((o) => o.id === editingOrderId)
    if (!order) return

    addFinancial({
      type: paymentDetails.type,
      orderId: editingOrderId,
      amount: order.total,
      description: `Pagamento do Pedido #${order.id.slice(0, 8)} - ${order.customerName}`,
      category: paymentDetails.category || "Vendas",
      paymentMethod: paymentDetails.bank,
      status: "completed",
      date: new Date(),
    })

    updateOrder(editingOrderId, { paymentStatus: "paid" })

    setShowPaymentModal(false)
    setPaymentDetails({ type: "recebimento_pix", bank: "", category: "", notes: "" })
    setEditingOrderId(null)
  }

  const handleUpdateStatus = () => {
    if (!editingOrderId) return
    updateOrder(editingOrderId, { status: newStatus })
    setShowStatusModal(false)
    setEditingOrderId(null)
  }

  const handleOpenShipmentModal = (orderId: string) => {
    setEditingOrderId(orderId)
    setShowShipmentModal(true)
  }

  const handleCreateShipment = () => {
    if (!editingOrderId || !shipmentData.carrier || !shipmentData.trackingNumber) {
      const missingFields = []
      if (!editingOrderId) missingFields.push("Pedido")
      if (!shipmentData.carrier) missingFields.push("Transportadora")
      if (!shipmentData.trackingNumber) missingFields.push("Código de Rastreio")

      alert(`Por favor, preencha todos os campos obrigatórios: ${missingFields.join(", ")}`)
      return
    }

    createShipment({
      orderId: editingOrderId,
      carrier: shipmentData.carrier,
      trackingNumber: shipmentData.trackingNumber,
      status: "shipped",
      estimatedDelivery: shipmentData.estimatedDelivery
        ? new Date(shipmentData.estimatedDelivery)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days default
    })

    updateOrder(editingOrderId, {
      status: "shipped",
      trackingNumber: shipmentData.trackingNumber,
    })

    setShowShipmentModal(false)
    setShipmentData({ carrier: "", trackingNumber: "", estimatedDelivery: "" })
    setEditingOrderId(null)
  }

  const handleFileUpload = (orderId: string) => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.accept = "*/*"
    input.onchange = (e: any) => {
      const files = Array.from(e.target?.files || []) as File[]
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          addOrderAttachment(orderId, {
            name: file.name,
            url: event.target?.result as string,
          })
        }
        reader.readAsDataURL(file)
      })
    }
    input.click()
  }

  const handleDownloadAttachment = (url: string, name: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = name
    link.click()
  }

  const handleViewAttachment = (url: string, name: string) => {
    const newWindow = window.open()
    if (newWindow) {
      if (name.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/i)) {
        newWindow.document.write(`<img src="${url}" style="max-width: 100%; height: auto;" />`)
      } else if (name.match(/\.(pdf)$/i)) {
        newWindow.document.write(`<embed src="${url}" width="100%" height="100%" type="application/pdf" />`)
      } else {
        newWindow.document.write(`<pre>${url}</pre>`)
      }
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pedidos</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleUploadOrders} className="gap-2 bg-transparent">
            <Upload className="w-4 h-4" />
            Importar Pedidos
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Pedido
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total de Pedidos</p>
          <p className="text-2xl font-bold">{orders.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pendentes</p>
          <p className="text-2xl font-bold">{orders.filter((o) => o.status === "pending").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Enviados</p>
          <p className="text-2xl font-bold">{orders.filter((o) => o.status === "shipped").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Receita Total</p>
          <p className="text-2xl font-bold">R$ {orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</p>
        </Card>
      </div>

      {showForm && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Criar Novo Pedido</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cliente</label>
              <select
                value={newOrder.customerId}
                onChange={(e) => loadCustomerAddress(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Selecione um cliente</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Itens do Pedido</label>
              {newOrder.items.map((item, index) => {
                const product = products.find((p) => p.id === item.productId)
                const itemTotal = (product?.salePrice || 0) * item.quantity

                return (
                  <div key={index} className="flex gap-2 mb-2 items-center">
                    <select
                      value={item.productId}
                      onChange={(e) => {
                        const newItems = [...newOrder.items]
                        newItems[index].productId = e.target.value
                        setNewOrder({ ...newOrder, items: newItems })
                      }}
                      className="flex-1 px-3 py-2 border rounded-lg"
                    >
                      <option value="">Selecione um produto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - R$ {(product.salePrice || 0).toFixed(2)}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const newItems = [...newOrder.items]
                        newItems[index].quantity = Number.parseInt(e.target.value) || 1
                        setNewOrder({ ...newOrder, items: newItems })
                      }}
                      className="w-24 px-3 py-2 border rounded-lg"
                      placeholder="Qtd"
                    />
                    {product && (
                      <span className="text-sm font-semibold w-32 text-right">R$ {itemTotal.toFixed(2)}</span>
                    )}
                  </div>
                )
              })}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItemToOrder}
                className="mt-2 bg-transparent"
              >
                <Plus className="w-4 h-4 mr-1" /> Adicionar Item
              </Button>

              {newOrder.items.length > 0 && (
                <div className="mt-4 pt-4 border-t space-y-2">
                  <p className="text-lg font-medium text-right">Subtotal: R$ {calculateOrderTotal().toFixed(2)}</p>
                  <div className="flex items-center justify-end gap-2">
                    <label className="text-sm font-medium">Frete:</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newOrder.shippingCost}
                      onChange={(e) =>
                        setNewOrder({ ...newOrder, shippingCost: Number.parseFloat(e.target.value) || 0 })
                      }
                      className="w-32 px-3 py-2 border rounded-lg text-right"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xl font-bold text-right border-t pt-2">
                    Total com Frete: R$ {calculateFullTotal().toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Endereço de Entrega</h4>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-2">Endereço</label>
                  <input
                    value={newOrder.shippingAddress}
                    onChange={(e) => setNewOrder({ ...newOrder, shippingAddress: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Rua, Avenida..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Número</label>
                  <input
                    value={newOrder.shippingNumber}
                    onChange={(e) => setNewOrder({ ...newOrder, shippingNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Nº"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Cidade</label>
                  <input
                    value={newOrder.shippingCity}
                    onChange={(e) => setNewOrder({ ...newOrder, shippingCity: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Cidade"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Estado</label>
                  <input
                    value={newOrder.shippingState}
                    onChange={(e) => setNewOrder({ ...newOrder, shippingState: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="UF"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CEP</label>
                  <input
                    value={newOrder.shippingZipCode}
                    onChange={(e) => setNewOrder({ ...newOrder, shippingZipCode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Observações</label>
              <textarea
                value={newOrder.notes}
                onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddOrder}>Criar Pedido</Button>
          </div>
        </Card>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md space-y-4">
            <h3 className="font-semibold text-lg">Baixar Pagamento</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Recebimento</label>
                <select
                  value={paymentDetails.type}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      type: e.target.value as typeof paymentDetails.type,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="entrada">Entrada</option>
                  <option value="recebimento_cartao">Recebimento Cartão</option>
                  <option value="recebimento_pix">Recebimento PIX</option>
                  <option value="recebimento_dinheiro">Recebimento Dinheiro</option>
                  <option value="recebimento_boleto">Recebimento Boleto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Banco / Conta</label>
                <input
                  value={paymentDetails.bank}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, bank: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Ex: Banco do Brasil, Nubank..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <select
                  value={paymentDetails.category}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Selecione uma categoria</option>
                  {financialCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  <option value="Vendas">Vendas (Padrão)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Observações</label>
                <textarea
                  value={paymentDetails.notes}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Informações adicionais sobre o pagamento..."
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPaymentModal(false)
                  setEditingOrderId(null)
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleConfirmPayment}>Confirmar Pagamento</Button>
            </div>
          </Card>
        </div>
      )}

      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md space-y-4">
            <h3 className="font-semibold text-lg">Alterar Status do Pedido</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Novo Status</label>
              <select
                value={newStatus}
                onChange={(e) =>
                  setNewStatus(e.target.value as "pending" | "processing" | "shipped" | "delivered" | "cancelled")
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="pending">Pendente</option>
                <option value="processing">Processando</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregue</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowStatusModal(false)
                  setEditingOrderId(null)
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdateStatus}>Atualizar Status</Button>
            </div>
          </Card>
        </div>
      )}

      {showShipmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md space-y-4">
            <h3 className="font-semibold text-lg">Criar Envio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Transportadora</label>
                <input
                  value={shipmentData.carrier}
                  onChange={(e) => setShipmentData({ ...shipmentData, carrier: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Ex: Correios, Sedex, PAC..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Código de Rastreio</label>
                <input
                  value={shipmentData.trackingNumber}
                  onChange={(e) => setShipmentData({ ...shipmentData, trackingNumber: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Ex: BR123456789BR"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data de Entrega Estimada</label>
                <input
                  type="date"
                  value={shipmentData.estimatedDelivery}
                  onChange={(e) => setShipmentData({ ...shipmentData, estimatedDelivery: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowShipmentModal(false)
                  setEditingOrderId(null)
                  setShipmentData({ carrier: "", trackingNumber: "", estimatedDelivery: "" })
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateShipment}>Criar Envio</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Orders Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Pedido</th>
                <th className="text-left py-3 px-4">Cliente</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Pagamento</th>
                <th className="text-left py-3 px-4">Anexos</th>
                <th className="text-right py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">#{order.id.slice(0, 8)}</td>
                  <td className="py-3 px-4">{order.customerName}</td>
                  <td className="py-3 px-4">R$ {order.total.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleOpenStatusModal(order.id, order.status)}
                      className={`px-2 py-1 rounded text-xs font-medium ${statusColors[order.status]} cursor-pointer hover:opacity-80`}
                    >
                      {statusLabels[order.status]}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    {order.paymentStatus === "pending" ? (
                      <button
                        onClick={() => handleOpenPaymentModal(order.id)}
                        className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 cursor-pointer hover:opacity-80"
                      >
                        Pendente
                      </button>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Pago</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileUpload(order.id)}
                        className="h-8 w-8 p-0"
                        title="Upload de arquivos"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      {order.attachments && order.attachments.length > 0 && (
                        <button
                          onClick={() => {
                            setUploadingOrderId(order.id)
                            setShowUploadModal(true)
                          }}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                        >
                          {order.attachments.length} arquivo(s)
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePrintOrder(order.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenShipmentModal(order.id)}
                        className="h-8 w-8 p-0"
                        title="Criar envio"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingOrderId(order.id)
                          const customer = customers.find((c) => c.id === order.customerId)
                          if (customer) {
                            setNewOrder({
                              customerId: order.customerId,
                              items: order.items.map((item) => ({
                                productId: item.productId,
                                quantity: item.quantity,
                              })),
                              shippingAddress: customer.address,
                              shippingNumber: customer.addressNumber,
                              shippingCity: customer.city,
                              shippingState: customer.state,
                              shippingZipCode: customer.zipCode,
                              shippingCost: order.shippingCost || 0,
                              notes: order.notes || "",
                            })
                            setShowForm(true)
                          }
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja excluir este pedido?")) {
                            deleteOrder(order.id)
                          }
                        }}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Attachments Modal */}
      {showUploadModal && uploadingOrderId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Arquivos Anexados</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadingOrderId(null)
                }}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {orders
                .find((o) => o.id === uploadingOrderId)
                ?.attachments?.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Paperclip className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{attachment.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(attachment.uploadedAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewAttachment(attachment.url, attachment.name)}
                        className="h-8 w-8 p-0"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadAttachment(attachment.url, attachment.name)}
                        className="h-8 w-8 p-0"
                        title="Baixar"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Deseja remover este arquivo?")) {
                            removeOrderAttachment(uploadingOrderId, index)
                          }
                        }}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

              {(!orders.find((o) => o.id === uploadingOrderId)?.attachments ||
                orders.find((o) => o.id === uploadingOrderId)?.attachments?.length === 0) && (
                <p className="text-center text-muted-foreground py-8">Nenhum arquivo anexado</p>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => handleFileUpload(uploadingOrderId)} className="gap-2">
                <Upload className="w-4 h-4" />
                Adicionar Arquivos
              </Button>
              <Button
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadingOrderId(null)
                }}
              >
                Fechar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
