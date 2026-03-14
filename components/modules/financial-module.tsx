"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, TrendingUp, TrendingDown, Filter } from "lucide-react"
import { useState } from "react"

export function FinancialModule() {
  const { financials, addFinancial, orders, getCategoriesByModule, customers, suppliers } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [filterDate, setFilterDate] = useState("")
  const [clientOrSupplier, setClientOrSupplier] = useState<"client" | "supplier">("client")

  const [newFinancial, setNewFinancial] = useState({
    type: "entrada" as const,
    amount: 0,
    description: "",
    category: "",
    status: "pending" as const,
    date: new Date().toISOString().split("T")[0],
    clientSupplier: "",
  })

  const handleAddFinancial = () => {
    if (newFinancial.amount > 0 && newFinancial.description) {
      addFinancial({
        ...newFinancial,
        amount: Number.parseFloat(newFinancial.amount.toString()),
        date: new Date(newFinancial.date),
      })
      setNewFinancial({
        type: "entrada",
        amount: 0,
        description: "",
        category: "",
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        clientSupplier: "",
      })
      setShowForm(false)
    }
  }

  const filteredFinancials = filterDate
    ? financials.filter((f) => {
        const fDate = new Date(f.date).toISOString().split("T")[0]
        return fDate === filterDate
      })
    : financials

  const income = filteredFinancials
    .filter((f) => f.type !== "expense" && f.status === "completed")
    .reduce((sum, f) => sum + f.amount, 0)
  const expenses = filteredFinancials
    .filter((f) => f.type === "expense" && f.status === "completed")
    .reduce((sum, f) => sum + f.amount, 0)
  const revenue = orders.reduce((sum, o) => sum + (o.paymentStatus === "paid" ? o.total : 0), 0)

  const financialCategories = getCategoriesByModule("financial")

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Relatórios Financeiros</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Transação
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-green-500">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Receita Total
          </p>
          <p className="text-2xl font-bold text-green-600">R$ {revenue.toFixed(2)}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            Despesas
          </p>
          <p className="text-2xl font-bold text-red-600">R$ {expenses.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Entradas</p>
          <p className="text-2xl font-bold">R$ {income.toFixed(2)}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <p className="text-sm text-muted-foreground">Lucro Líquido</p>
          <p className={`text-2xl font-bold ${revenue - expenses > 0 ? "text-green-600" : "text-red-600"}`}>
            R$ {(revenue - expenses).toFixed(2)}
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <label className="text-sm font-medium">Filtrar por data:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />
          {filterDate && (
            <Button variant="ghost" size="sm" onClick={() => setFilterDate("")}>
              Limpar Filtro
            </Button>
          )}
        </div>
      </Card>

      {showForm && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Adicionar Transação</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Transação</label>
              <select
                value={newFinancial.type}
                onChange={(e) => setNewFinancial({ ...newFinancial, type: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="entrada">Entrada</option>
                <option value="recebimento_cartao">Recebimento Cartão</option>
                <option value="recebimento_pix">Recebimento PIX</option>
                <option value="recebimento_dinheiro">Recebimento Dinheiro</option>
                <option value="recebimento_boleto">Recebimento Boleto</option>
                <option value="expense">Despesa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={newFinancial.status}
                onChange={(e) => setNewFinancial({ ...newFinancial, status: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="pending">Pendente</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Valor (R$)</label>
              <input
                placeholder="0.00"
                type="number"
                step="0.01"
                value={newFinancial.amount || ""}
                onChange={(e) => setNewFinancial({ ...newFinancial, amount: Number.parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data</label>
              <input
                type="date"
                value={newFinancial.date}
                onChange={(e) => setNewFinancial({ ...newFinancial, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <select
                value={newFinancial.category}
                onChange={(e) => setNewFinancial({ ...newFinancial, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Selecione uma categoria</option>
                {financialCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">Cadastre categorias em Categorias → Financeiro</p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Cliente/Fornecedor</label>
              <div className="flex gap-2">
                <select
                  value={clientOrSupplier}
                  onChange={(e) => setClientOrSupplier(e.target.value as "client" | "supplier")}
                  className="w-32 px-3 py-2 border rounded-lg"
                >
                  <option value="client">Cliente</option>
                  <option value="supplier">Fornecedor</option>
                </select>
                <select className="flex-1 px-3 py-2 border rounded-lg">
                  <option value="">Selecione...</option>
                  {clientOrSupplier === "client"
                    ? customers.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    : suppliers.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                </select>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea
                placeholder="Descrição da transação"
                value={newFinancial.description}
                onChange={(e) => setNewFinancial({ ...newFinancial, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddFinancial}>Adicionar Transação</Button>
          </div>
        </Card>
      )}

      {filterDate && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">
            Movimento de Caixa - {new Date(filterDate).toLocaleDateString("pt-BR")}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">Total de Entradas</p>
              <p className="text-2xl font-bold text-green-600">R$ {income.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">Total de Saídas</p>
              <p className="text-2xl font-bold text-red-600">R$ {expenses.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">Saldo do Dia</p>
            <p className={`text-2xl font-bold ${income - expenses >= 0 ? "text-blue-600" : "text-red-600"}`}>
              R$ {(income - expenses).toFixed(2)}
            </p>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-semibold">Data</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Tipo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Descrição</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Categoria</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Cliente/Fornecedor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Valor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredFinancials.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma transação
                  </td>
                </tr>
              ) : (
                filteredFinancials.map((f) => (
                  <tr key={f.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-3 text-sm">{new Date(f.date).toLocaleDateString("pt-BR")}</td>
                    <td className="px-6 py-3 text-sm font-medium capitalize">
                      {f.type === "entrada"
                        ? "Entrada"
                        : f.type === "recebimento_cartao"
                          ? "Rec. Cartão"
                          : f.type === "recebimento_pix"
                            ? "Rec. PIX"
                            : f.type === "recebimento_dinheiro"
                              ? "Rec. Dinheiro"
                              : f.type === "recebimento_boleto"
                                ? "Rec. Boleto"
                                : "Despesa"}
                    </td>
                    <td className="px-6 py-3 text-sm">{f.description}</td>
                    <td className="px-6 py-3 text-sm">{f.category}</td>
                    <td className="px-6 py-3 text-sm">{f.clientSupplier}</td>
                    <td className="px-6 py-3 text-sm font-semibold">
                      <span className={f.type === "expense" ? "text-red-600" : "text-green-600"}>
                        R$ {f.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          f.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : f.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {f.status === "completed" ? "Concluído" : f.status === "pending" ? "Pendente" : "Cancelado"}
                      </span>
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
