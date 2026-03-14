"use client"

import { useStore } from "@/lib/store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, DollarSign, CheckCircle, AlertCircle, Calendar, TrendingUp } from "lucide-react"
import { useState } from "react"

export function DashboardModule() {
  const { orders, tasks, accountsPayable, financials, customers } = useStore()
  const [filterType, setFilterType] = useState<"month" | "custom">("month")
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
  )
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])

  // Filtrar por período
  const filterByPeriod = (date: Date) => {
    const itemDate = new Date(date)
    const start = new Date(startDate)
    const end = new Date(endDate)
    end.setHours(23, 59, 59)
    return itemDate >= start && itemDate <= end
  }

  // Tarefas Pendentes
  const pendingTasks = tasks.filter((t) => t.status !== "completed")
  const highPriorityTasks = pendingTasks.filter((t) => t.priority === "high")

  // Pedidos no período
  const filteredOrders = orders.filter((o) => filterByPeriod(o.createdAt))
  const pendingOrders = filteredOrders.filter((o) => o.status === "pending")
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0)

  // Contas a Pagar no período
  const filteredAccountsPayable = accountsPayable.filter((a) => filterByPeriod(a.dueDate))
  const pendingAccounts = filteredAccountsPayable.filter((a) => a.status === "pending")
  const totalPayable = pendingAccounts.reduce((sum, a) => sum + a.amount, 0)

  // Financeiro no período
  const filteredFinancials = financials.filter((f) => filterByPeriod(f.date))
  const revenue = filteredFinancials.filter((f) => f.type !== "expense").reduce((sum, f) => sum + f.amount, 0)
  const expenses = filteredFinancials.filter((f) => f.type === "expense").reduce((sum, f) => sum + f.amount, 0)
  const profit = revenue - expenses

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral do seu negócio</p>
        </div>
      </div>

      {/* Filtros de Período */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex gap-2">
            <Button
              variant={filterType === "month" ? "default" : "outline"}
              onClick={() => {
                setFilterType("month")
                setStartDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0])
                setEndDate(new Date().toISOString().split("T")[0])
              }}
            >
              Este Mês
            </Button>
            <Button variant={filterType === "custom" ? "default" : "outline"} onClick={() => setFilterType("custom")}>
              Período Personalizado
            </Button>
          </div>

          {filterType === "custom" && (
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              />
              <span className="text-muted-foreground">até</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Pedidos</p>
              <p className="text-3xl font-bold mt-2">{filteredOrders.length}</p>
              <p className="text-xs text-muted-foreground mt-1">{pendingOrders.length} pendentes</p>
            </div>
            <Package className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Receita Total</p>
              <p className="text-3xl font-bold mt-2 text-green-600">R$ {totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">No período selecionado</p>
            </div>
            <DollarSign className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Contas a Pagar</p>
              <p className="text-3xl font-bold mt-2 text-red-600">R$ {totalPayable.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-1">{pendingAccounts.length} contas pendentes</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tarefas Pendentes</p>
              <p className="text-3xl font-bold mt-2">{pendingTasks.length}</p>
              <p className="text-xs text-red-600 mt-1">{highPriorityTasks.length} alta prioridade</p>
            </div>
            <CheckCircle className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Financeiro Detalhado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Receitas</p>
              <p className="text-2xl font-bold text-green-600">R$ {revenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Despesas</p>
              <p className="text-2xl font-bold text-red-600">R$ {expenses.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lucro Líquido</p>
              <p className={`text-2xl font-bold ${profit >= 0 ? "text-blue-600" : "text-red-600"}`}>
                R$ {profit.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tarefas Pendentes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Tarefas Pendentes - Alta Prioridade
        </h3>
        <div className="space-y-3">
          {highPriorityTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhuma tarefa de alta prioridade pendente</p>
          ) : (
            highPriorityTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{task.title}</p>
                  {task.description && <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">Alta Prioridade</span>
                  {task.dueDate && (
                    <span className="text-sm text-muted-foreground">
                      {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Contas a Pagar Próximas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          Contas a Pagar - Vencimento Próximo
        </h3>
        <div className="space-y-3">
          {pendingAccounts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhuma conta pendente</p>
          ) : (
            pendingAccounts
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 5)
              .map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{account.description}</p>
                    <p className="text-sm text-muted-foreground">{account.supplier}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-red-600">R$ {account.amount.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(account.dueDate).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              ))
          )}
        </div>
      </Card>
    </div>
  )
}
