"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit2, Trash2, AlertCircle, Upload, Filter, Settings } from "lucide-react"
import { useState } from "react"

export function TasksModule() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    orders,
    customers,
    products,
    purchases,
    transactions,
    accountsPayable,
    categories,
    shipments,
    events,
  } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showStagesModal, setShowStagesModal] = useState(false)
  const [selectedImportModule, setSelectedImportModule] = useState<
    | "orders"
    | "customers"
    | "inventory"
    | "purchases"
    | "financial"
    | "accounts_payable"
    | "categories"
    | "shipments"
    | "calendar"
    | "tasks"
    | ""
  >("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [filterView, setFilterView] = useState<"all" | "priority" | "dueDate">("all")
  const [filterModule, setFilterModule] = useState<
    | "orders"
    | "customers"
    | "inventory"
    | "purchases"
    | "financial"
    | "accounts_payable"
    | "categories"
    | "shipments"
    | "calendar"
    | "tasks"
    | ""
  >("")

  const [customStages, setCustomStages] = useState([
    { id: "todo", label: "A Fazer", color: "bg-gray-100" },
    { id: "in_progress", label: "Em Progresso", color: "bg-blue-100" },
    { id: "review", label: "Revisão", color: "bg-yellow-100" },
    { id: "completed", label: "Concluído", color: "bg-green-100" },
  ])
  const [newStageName, setNewStageName] = useState("")

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo" as const,
    priority: "medium" as const,
    dueDate: new Date().toISOString().split("T")[0],
  })

  const handleImportItems = () => {
    selectedItems.forEach((itemId) => {
      switch (selectedImportModule) {
        case "orders": {
          const order = orders.find((o) => o.id === itemId)
          if (order) {
            addTask({
              title: `Processar Pedido #${order.id.slice(0, 8)}`,
              description: `Cliente: ${order.customerName} - Total: R$ ${(order.total || 0).toFixed(2)}`,
              status: "todo",
              priority: "high",
              dueDate: new Date(),
              orderId: order.id,
            })
          }
          break
        }
        case "customers": {
          const customer = customers.find((c) => c.id === itemId)
          if (customer) {
            addTask({
              title: `Contato com ${customer.name}`,
              description: `Email: ${customer.email} - Telefone: ${customer.phone}`,
              status: "todo",
              priority: "medium",
              dueDate: new Date(),
              customerId: customer.id,
            })
          }
          break
        }
        case "inventory": {
          const product = products.find((p) => p.id === itemId)
          if (product) {
            addTask({
              title: `Revisar Produto: ${product.name}`,
              description: `SKU: ${product.sku} - Estoque: ${product.stock}`,
              status: "todo",
              priority: product.stock < 10 ? "high" : "medium",
              dueDate: new Date(),
            })
          }
          break
        }
        case "purchases": {
          const purchase = purchases.find((p) => p.id === itemId)
          if (purchase) {
            addTask({
              title: `Compra #${purchase.id.slice(0, 8)}`,
              description: `Fornecedor: ${purchase.supplier} - Status: ${purchase.status}`,
              status: "todo",
              priority: "medium",
              dueDate: new Date(),
            })
          }
          break
        }
        case "financial": {
          const transaction = transactions.find((t) => t.id === itemId)
          if (transaction) {
            addTask({
              title: `Transação Financeira: ${transaction.type}`,
              description: `Valor: R$ ${transaction.amount.toFixed(2)} - ${transaction.description}`,
              status: "todo",
              priority: "medium",
              dueDate: new Date(),
            })
          }
          break
        }
        case "accounts_payable": {
          const account = accountsPayable.find((a) => a.id === itemId)
          if (account) {
            addTask({
              title: `Pagar: ${account.description}`,
              description: `Fornecedor: ${account.supplier} - Valor: R$ ${account.amount.toFixed(2)}`,
              status: "todo",
              priority: account.status === "vencida" ? "high" : "medium",
              dueDate: new Date(account.dueDate),
            })
          }
          break
        }
        case "categories": {
          const category = categories.find((c) => c.id === itemId)
          if (category) {
            addTask({
              title: `Revisar Categoria: ${category.name}`,
              description: `Módulo: ${category.module}`,
              status: "todo",
              priority: "low",
              dueDate: new Date(),
            })
          }
          break
        }
        case "shipments": {
          const shipment = shipments.find((s) => s.id === itemId)
          if (shipment) {
            addTask({
              title: `Envio #${shipment.orderId.slice(0, 8)}`,
              description: `Transportadora: ${shipment.carrier} - Status: ${shipment.status}`,
              status: "todo",
              priority: shipment.status === "atrasado" ? "high" : "medium",
              dueDate: new Date(shipment.estimatedDelivery),
            })
          }
          break
        }
        case "calendar": {
          const event = events.find((e) => e.id === itemId)
          if (event) {
            addTask({
              title: `Evento: ${event.title}`,
              description: `Tipo: ${event.type} - ${event.description}`,
              status: "todo",
              priority: "medium",
              dueDate: new Date(event.date),
            })
          }
          break
        }
        case "tasks": {
          const task = tasks.find((t) => t.id === itemId)
          if (task) {
            addTask({
              title: `Duplicar: ${task.title}`,
              description: task.description,
              status: "todo",
              priority: task.priority,
              dueDate: new Date(),
            })
          }
          break
        }
      }
    })

    setShowImportModal(false)
    setSelectedItems([])
    setSelectedImportModule("")
  }

  const handleAddStage = () => {
    if (newStageName.trim()) {
      const newStage = {
        id: newStageName.toLowerCase().replace(/\s+/g, "_"),
        label: newStageName,
        color: "bg-purple-100",
      }
      setCustomStages([...customStages, newStage])
      setNewStageName("")
    }
  }

  const handleAddTask = () => {
    if (newTask.title) {
      if (editingTask) {
        updateTask(editingTask, {
          ...newTask,
          dueDate: new Date(newTask.dueDate),
        })
        setEditingTask(null)
      } else {
        addTask({
          ...newTask,
          dueDate: new Date(newTask.dueDate),
        })
      }
      setNewTask({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: new Date().toISOString().split("T")[0],
      })
      setShowForm(false)
    }
  }

  const handleEdit = (task: any) => {
    setNewTask({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: new Date(task.dueDate).toISOString().split("T")[0],
    })
    setEditingTask(task.id)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTask(null)
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: new Date().toISOString().split("T")[0],
    })
  }

  const handleStatusChange = (taskId: string, newStatus: string) => {
    updateTask(taskId, { status: newStatus as any })
  }

  const getFilteredTasks = () => {
    let filtered = tasks

    if (filterView === "priority") {
      filtered = tasks.filter((t) => t.priority === "high")
    } else if (filterView === "dueDate") {
      filtered = tasks.sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
    }

    if (filterModule === "orders") {
      filtered = filtered.filter((t) => t.orderId)
    } else if (filterModule === "customers") {
      filtered = filtered.filter((t) => t.customerId)
    }
    // Adicionar outros filtros se necessário no futuro

    return filtered
  }

  const groupedTasks = customStages.reduce(
    (acc, stage) => {
      acc[stage.id] = getFilteredTasks().filter((t) => t.status === stage.id)
      return acc
    },
    {} as Record<string, typeof tasks>,
  )

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  }

  const priorityLabels = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === "completed").length
  const highPriorityTasks = tasks.filter((t) => t.priority === "high" && t.status !== "completed").length

  const getModuleData = () => {
    switch (selectedImportModule) {
      case "orders":
        return orders.map((o) => ({ id: o.id, label: `Pedido #${o.id.slice(0, 8)} - ${o.customerName}` }))
      case "customers":
        return customers.map((c) => ({ id: c.id, label: `${c.name} - ${c.email}` }))
      case "inventory":
        return products.map((p) => ({ id: p.id, label: `${p.name} - SKU: ${p.sku}` }))
      case "purchases":
        return purchases.map((p) => ({ id: p.id, label: `Compra #${p.id.slice(0, 8)} - ${p.supplier}` }))
      case "financial":
        return transactions.map((t) => ({ id: t.id, label: `${t.type} - R$ ${t.amount.toFixed(2)}` }))
      case "accounts_payable":
        return accountsPayable.map((a) => ({ id: a.id, label: `${a.description} - ${a.supplier}` }))
      case "categories":
        return categories.map((c) => ({ id: c.id, label: `${c.name} (${c.module})` }))
      case "shipments":
        return shipments.map((s) => ({ id: s.id, label: `Pedido #${s.orderId.slice(0, 8)} - ${s.carrier}` }))
      case "calendar":
        return events.map((e) => ({ id: e.id, label: `${e.title} - ${new Date(e.date).toLocaleDateString()}` }))
      case "tasks":
        return tasks.map((t) => ({ id: t.id, label: t.title }))
      default:
        return []
    }
  }

  const moduleData = getModuleData()

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciamento de Tarefas</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImportModal(true)} className="gap-2">
            <Upload className="w-4 h-4" />
            Importar Menus
          </Button>
          <Button variant="outline" onClick={() => setShowStagesModal(true)} className="gap-2">
            <Settings className="w-4 h-4" />
            Criar Etapas
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total de Tarefas</p>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
          <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            Alta Prioridade
          </p>
          <p className="text-2xl font-bold text-red-600">{highPriorityTasks}</p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Visualização:</span>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterView === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterView("all")}
            >
              Todas
            </Button>
            <Button
              variant={filterView === "priority" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterView("priority")}
            >
              Alta Prioridade
            </Button>
            <Button
              variant={filterView === "dueDate" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterView("dueDate")}
            >
              Por Vencimento
            </Button>
          </div>
          <span className="text-sm font-medium ml-4">Filtro por Tela:</span>
          <div className="flex gap-2 flex-wrap">
            <select
              className="px-3 py-1 text-sm border rounded"
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value as any)}
            >
              <option value="">Todas as Telas</option>
              <option value="orders">Pedidos</option>
              <option value="customers">Clientes</option>
              <option value="inventory">Estoque</option>
              <option value="purchases">Compras</option>
              <option value="financial">Financeiro</option>
              <option value="accounts_payable">Contas a Pagar</option>
              <option value="categories">Categorias</option>
              <option value="shipments">Envios</option>
              <option value="calendar">Agenda</option>
              <option value="tasks">Tarefas</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <h3 className="font-semibold text-lg">Importar Itens como Tarefas</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Selecione o Módulo</label>
              <select
                value={selectedImportModule}
                onChange={(e) => {
                  setSelectedImportModule(e.target.value as any)
                  setSelectedItems([])
                }}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Escolha um módulo...</option>
                <option value="orders">Pedidos</option>
                <option value="customers">Clientes</option>
                <option value="inventory">Estoque</option>
                <option value="purchases">Compras</option>
                <option value="financial">Financeiro</option>
                <option value="accounts_payable">Contas a Pagar</option>
                <option value="categories">Categorias</option>
                <option value="shipments">Envios</option>
                <option value="calendar">Agenda</option>
                <option value="tasks">Tarefas</option>
              </select>
            </div>

            {selectedImportModule && moduleData.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Selecione os itens (marque um ou todos)</label>
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
                  <label className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === moduleData.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(moduleData.map((item) => item.id))
                        } else {
                          setSelectedItems([])
                        }
                      }}
                    />
                    <span className="font-medium">Selecionar Todos</span>
                  </label>
                  {moduleData.map((item) => (
                    <label key={item.id} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id])
                          } else {
                            setSelectedItems(selectedItems.filter((id) => id !== item.id))
                          }
                        }}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowImportModal(false)
                  setSelectedItems([])
                  setSelectedImportModule("")
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleImportItems} disabled={selectedItems.length === 0}>
                Importar {selectedItems.length} item(ns)
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Stages Management Modal */}
      {showStagesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md space-y-4">
            <h3 className="font-semibold text-lg">Gerenciar Etapas do Kanban</h3>

            <div className="space-y-2">
              {customStages.map((stage, index) => (
                <div key={stage.id} className="flex items-center justify-between p-2 border rounded">
                  <span>{stage.label}</span>
                  {index >= 4 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCustomStages(customStages.filter((s) => s.id !== stage.id))}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Adicionar Nova Etapa</label>
              <div className="flex gap-2">
                <input
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder="Nome da etapa..."
                />
                <Button onClick={handleAddStage}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowStagesModal(false)}>
                Fechar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Form Modal/Card */}
      {showForm && (
        <Card className="p-6 space-y-4 border-2 border-primary">
          <h3 className="font-semibold text-lg">{editingTask ? "Editar Tarefa" : "Nova Tarefa"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Título da Tarefa</label>
              <input
                placeholder="Ex: Revisar proposta do cliente"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prioridade</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {customStages.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Data de Vencimento</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea
                placeholder="Detalhes da tarefa..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleAddTask}>{editingTask ? "Atualizar" : "Criar"} Tarefa</Button>
          </div>
        </Card>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {customStages.map((stage) => (
          <div key={stage.id}>
            <Card className="p-4 bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{stage.label}</h3>
                <span className="text-sm text-muted-foreground bg-background px-2 py-1 rounded-full">
                  {groupedTasks[stage.id]?.length || 0}
                </span>
              </div>
              <div className="space-y-3">
                {!groupedTasks[stage.id] || groupedTasks[stage.id].length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhuma tarefa</p>
                ) : (
                  groupedTasks[stage.id].map((task) => (
                    <Card key={task.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm flex-1">{task.title}</p>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleEdit(task)}>
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => deleteTask(task.id)}
                            >
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                            {priorityLabels[task.priority]}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                            </span>
                          )}
                        </div>

                        {/* Quick Status Change */}
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          className="w-full text-xs px-2 py-1 border rounded"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {customStages.map((stage) => (
                            <option key={stage.id} value={stage.id}>
                              {stage.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
