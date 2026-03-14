"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, AlertCircle, CheckCircle2, Clock, Edit2, Trash2, FileText } from "lucide-react"
import { useState } from "react"

export function AccountsReceivableModule() {
  const {
    accountsReceivable,
    addAccountReceivable,
    updateAccountReceivable,
    deleteAccountReceivable,
    getCategoriesByModule,
    customers,
    orders,
  } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState<string | null>(null)
  const [newAccount, setNewAccount] = useState({
    description: "",
    amount: 0,
    category: "",
    dueDate: "",
    customer: "",
    orderId: "",
    paymentMethod: "boleto" as "boleto" | "cartao" | "pix" | "dinheiro" | "transferencia",
    status: "pending" as const,
    installments: 1,
  })

  const handleAddAccount = () => {
    if (newAccount.description && newAccount.amount > 0 && newAccount.dueDate) {
      if (editingAccount) {
        updateAccountReceivable(editingAccount, {
          ...newAccount,
          amount: Number.parseFloat(newAccount.amount.toString()),
          dueDate: new Date(newAccount.dueDate),
        })
        setEditingAccount(null)
      } else {
        addAccountReceivable({
          ...newAccount,
          amount: Number.parseFloat(newAccount.amount.toString()),
          dueDate: new Date(newAccount.dueDate),
        })
      }
      setNewAccount({
        description: "",
        amount: 0,
        category: "",
        dueDate: "",
        customer: "",
        orderId: "",
        paymentMethod: "boleto",
        status: "pending",
        installments: 1,
      })
      setShowForm(false)
    }
  }

  const handleEdit = (account: any) => {
    setEditingAccount(account.id)
    setNewAccount({
      description: account.description,
      amount: account.amount,
      category: account.category,
      dueDate: new Date(account.dueDate).toISOString().split("T")[0],
      customer: account.customer,
      orderId: account.orderId || "",
      paymentMethod: account.paymentMethod || "boleto",
      status: account.status,
      installments: account.installments || 1,
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    deleteAccountReceivable(id)
  }

  const handleReceiveAccount = (id: string) => {
    updateAccountReceivable(id, { status: "received" })
  }

  const handleReverseAccount = (id: string) => {
    updateAccountReceivable(id, { status: "pending" })
  }

  const totalPending = accountsReceivable.filter((a) => a.status === "pending").reduce((sum, a) => sum + a.amount, 0)
  const totalOverdue = accountsReceivable.filter((a) => a.status === "overdue").reduce((sum, a) => sum + a.amount, 0)
  const totalReceived = accountsReceivable.filter((a) => a.status === "received").reduce((sum, a) => sum + a.amount, 0)

  const financialCategories = getCategoriesByModule("financial")

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contas a Receber</h2>
          <p className="text-sm text-muted-foreground">Gerencie boletos e recebimentos de pedidos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Conta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />A Receber
          </p>
          <p className="text-2xl font-bold text-yellow-600">R$ {totalPending.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {accountsReceivable.filter((a) => a.status === "pending").length} contas
          </p>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Vencidas
          </p>
          <p className="text-2xl font-bold text-red-600">R$ {totalOverdue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {accountsReceivable.filter((a) => a.status === "overdue").length} contas
          </p>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Recebidas
          </p>
          <p className="text-2xl font-bold text-green-600">R$ {totalReceived.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {accountsReceivable.filter((a) => a.status === "received").length} contas
          </p>
        </Card>
      </div>

      {showForm && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">
            {editingAccount ? "Editar Conta" : "Adicionar Nova Conta a Receber"}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <input
                placeholder="Descrição da conta"
                value={newAccount.description}
                onChange={(e) => setNewAccount({ ...newAccount, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cliente</label>
              <select
                value={newAccount.customer}
                onChange={(e) => setNewAccount({ ...newAccount, customer: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Selecione um cliente</option>
                {customers.map((cust) => (
                  <option key={cust.id} value={cust.name}>
                    {cust.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pedido (Opcional)</label>
              <select
                value={newAccount.orderId}
                onChange={(e) => setNewAccount({ ...newAccount, orderId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Nenhum pedido vinculado</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    Pedido #{order.id} - {order.customerName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Valor (R$)</label>
              <input
                placeholder="0.00"
                type="number"
                step="0.01"
                value={newAccount.amount || ""}
                onChange={(e) => setNewAccount({ ...newAccount, amount: Number.parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Data de Vencimento</label>
              <input
                type="date"
                value={newAccount.dueDate}
                onChange={(e) => setNewAccount({ ...newAccount, dueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Forma de Pagamento</label>
              <select
                value={newAccount.paymentMethod}
                onChange={(e) =>
                  setNewAccount({
                    ...newAccount,
                    paymentMethod: e.target.value as "boleto" | "cartao" | "pix" | "dinheiro" | "transferencia",
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="boleto">Boleto</option>
                <option value="cartao">Cartão</option>
                <option value="pix">PIX</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="transferencia">Transferência</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <select
                value={newAccount.category}
                onChange={(e) => setNewAccount({ ...newAccount, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Selecione uma categoria</option>
                {financialCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">Cadastre em Categorias → Financeiro</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Parcelas</label>
              <select
                value={newAccount.installments}
                onChange={(e) => setNewAccount({ ...newAccount, installments: Number.parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value={1}>À vista</option>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                  <option key={n} value={n}>
                    {n}x
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false)
                setEditingAccount(null)
                setNewAccount({
                  description: "",
                  amount: 0,
                  category: "",
                  dueDate: "",
                  customer: "",
                  orderId: "",
                  paymentMethod: "boleto",
                  status: "pending",
                  installments: 1,
                })
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddAccount}>{editingAccount ? "Atualizar" : "Adicionar"} Conta</Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-semibold">Descrição</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Categoria</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Forma Pagamento</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Valor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Vencimento</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Parcelas</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {accountsReceivable.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma conta a receber
                  </td>
                </tr>
              ) : (
                accountsReceivable.map((account) => (
                  <tr key={account.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-3 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {account.paymentMethod === "boleto" && <FileText className="w-4 h-4 text-blue-500" />}
                        {account.description}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm">{account.customer}</td>
                    <td className="px-6 py-3 text-sm">{account.category}</td>
                    <td className="px-6 py-3 text-sm capitalize">{account.paymentMethod}</td>
                    <td className="px-6 py-3 text-sm font-semibold">R$ {account.amount.toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm">{new Date(account.dueDate).toLocaleDateString("pt-BR")}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          account.status === "received"
                            ? "bg-green-100 text-green-800"
                            : account.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {account.status === "received"
                          ? "Recebida"
                          : account.status === "overdue"
                            ? "Vencida"
                            : "Pendente"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">{account.installments}x</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        {account.status !== "received" && (
                          <Button size="sm" variant="outline" onClick={() => handleReceiveAccount(account.id)}>
                            Receber
                          </Button>
                        )}
                        {account.status === "received" && (
                          <Button size="sm" variant="outline" onClick={() => handleReverseAccount(account.id)}>
                            Estornar
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(account)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(account.id)}>
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
