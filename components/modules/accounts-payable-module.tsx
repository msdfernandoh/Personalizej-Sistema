"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, AlertCircle, CheckCircle2, Clock, Edit2, Trash2, Building2 } from "lucide-react"
import { useState } from "react"

export function AccountsPayableModule() {
  const {
    accountsPayable,
    addAccountPayable,
    updateAccountPayable,
    deleteAccountPayable,
    getCategoriesByModule,
    suppliers,
    banks,
    addBank,
    updateBank,
    deleteBank,
  } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState<string | null>(null)
  const [newAccount, setNewAccount] = useState({
    description: "",
    amount: 0,
    category: "",
    dueDate: "",
    supplier: "",
    bank: "",
    status: "pending" as const,
    installments: 1,
  })
  const [showBanks, setShowBanks] = useState(false)
  const [editingBank, setEditingBank] = useState<string | null>(null)
  const [newBank, setNewBank] = useState({ name: "", code: "" })

  const handleAddAccount = () => {
    if (newAccount.description && newAccount.amount > 0 && newAccount.dueDate) {
      if (editingAccount) {
        updateAccountPayable(editingAccount, {
          ...newAccount,
          amount: Number.parseFloat(newAccount.amount.toString()),
          dueDate: new Date(newAccount.dueDate),
        })
        setEditingAccount(null)
      } else {
        addAccountPayable({
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
        supplier: "",
        bank: "",
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
      supplier: account.supplier,
      bank: account.bank ?? "",
      status: account.status,
      installments: account.installments,
    })
    setShowForm(true)
  }

  const handleAddBank = () => {
    if (newBank.name.trim()) {
      if (editingBank) {
        updateBank(editingBank, { name: newBank.name.trim(), code: newBank.code.trim() || undefined })
        setEditingBank(null)
      } else {
        addBank({ name: newBank.name.trim(), code: newBank.code.trim() || undefined })
      }
      setNewBank({ name: "", code: "" })
    }
  }

  const handleEditBank = (bank: { id: string; name: string; code?: string }) => {
    setEditingBank(bank.id)
    setNewBank({ name: bank.name, code: bank.code ?? "" })
  }

  const handleDeleteBank = (id: string) => {
    deleteBank(id)
    if (editingBank === id) {
      setEditingBank(null)
      setNewBank({ name: "", code: "" })
    }
  }

  const handleDelete = (id: string) => {
    deleteAccountPayable(id)
  }

  const handlePayAccount = (id: string) => {
    updateAccountPayable(id, { status: "paid" })
  }

  const handleReverseAccount = (id: string) => {
    updateAccountPayable(id, { status: "pending" })
  }

  const totalPending = accountsPayable.filter((a) => a.status === "pending").reduce((sum, a) => sum + a.amount, 0)
  const totalOverdue = accountsPayable.filter((a) => a.status === "overdue").reduce((sum, a) => sum + a.amount, 0)
  const totalPaid = accountsPayable.filter((a) => a.status === "paid").reduce((sum, a) => sum + a.amount, 0)

  const financialCategories = getCategoriesByModule("accounts_payable")

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Contas a Pagar</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBanks(!showBanks)} className="gap-2">
            <Building2 className="w-4 h-4" />
            Bancos
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Conta
          </Button>
        </div>
      </div>

      {showBanks && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Cadastro de Bancos
          </h3>
          <p className="text-sm text-muted-foreground">
            Cadastre os bancos para associar às contas a pagar (ex.: banco de onde será feito o pagamento).
          </p>
          <div className="flex gap-2 flex-wrap items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Nome do banco</label>
              <input
                placeholder="Ex: Banco do Brasil"
                value={newBank.name}
                onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
                className="w-48 px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Código (opcional)</label>
              <input
                placeholder="Ex: 001"
                value={newBank.code}
                onChange={(e) => setNewBank({ ...newBank, code: e.target.value })}
                className="w-24 px-3 py-2 border rounded-lg"
              />
            </div>
            <Button onClick={handleAddBank}>{editingBank ? "Atualizar" : "Adicionar"} Banco</Button>
            {editingBank && (
              <Button variant="outline" onClick={() => { setEditingBank(null); setNewBank({ name: "", code: "" }); }}>
                Cancelar
              </Button>
            }
          </div>
          {banks.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-2 text-left font-medium">Nome</th>
                    <th className="px-4 py-2 text-left font-medium">Código</th>
                    <th className="px-4 py-2 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {banks.map((b) => (
                    <tr key={b.id} className="border-b hover:bg-muted/30">
                      <td className="px-4 py-2">{b.name}</td>
                      <td className="px-4 py-2">{b.code ?? "—"}</td>
                      <td className="px-4 py-2 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditBank(b)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteBank(b.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pendentes
          </p>
          <p className="text-2xl font-bold text-yellow-600">R$ {totalPending.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {accountsPayable.filter((a) => a.status === "pending").length} contas
          </p>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Vencidas
          </p>
          <p className="text-2xl font-bold text-red-600">R$ {totalOverdue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {accountsPayable.filter((a) => a.status === "overdue").length} contas
          </p>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Pagas
          </p>
          <p className="text-2xl font-bold text-green-600">R$ {totalPaid.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {accountsPayable.filter((a) => a.status === "paid").length} contas
          </p>
        </Card>
      </div>

      {showForm && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">{editingAccount ? "Editar Conta" : "Adicionar Nova Conta a Pagar"}</h3>
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
              <label className="block text-sm font-medium mb-2">Fornecedor</label>
              <select
                value={newAccount.supplier}
                onChange={(e) => setNewAccount({ ...newAccount, supplier: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Selecione um fornecedor</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.name}>
                    {sup.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">Cadastre fornecedores em Fornecedores</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Banco</label>
              <select
                value={newAccount.bank}
                onChange={(e) => setNewAccount({ ...newAccount, bank: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Selecione um banco (opcional)</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name} {b.code ? `(${b.code})` : ""}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground mt-1">Cadastre bancos no botão &quot;Bancos&quot; acima</p>
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
              <p className="text-xs text-muted-foreground mt-1">Cadastre em Categorias → Contas a Pagar</p>
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
                  supplier: "",
                  bank: "",
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
                <th className="px-6 py-3 text-left text-sm font-semibold">Fornecedor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Banco</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Categoria</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Valor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Vencimento</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Parcelas</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {accountsPayable.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhuma conta a pagar
                  </td>
                </tr>
              ) : (
                accountsPayable.map((account) => (
                  <tr key={account.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-3 text-sm font-medium">{account.description}</td>
                    <td className="px-6 py-3 text-sm">{account.supplier}</td>
                    <td className="px-6 py-3 text-sm">{account.bank ?? "—"}</td>
                    <td className="px-6 py-3 text-sm">{account.category}</td>
                    <td className="px-6 py-3 text-sm font-semibold">R$ {account.amount.toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm">{new Date(account.dueDate).toLocaleDateString("pt-BR")}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          account.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : account.status === "overdue"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {account.status === "paid" ? "Paga" : account.status === "overdue" ? "Vencida" : "Pendente"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">{account.installments}x</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        {account.status !== "paid" && (
                          <Button size="sm" variant="outline" onClick={() => handlePayAccount(account.id)}>
                            Pagar
                          </Button>
                        )}
                        {account.status === "paid" && (
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
