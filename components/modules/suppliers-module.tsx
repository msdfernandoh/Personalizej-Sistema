"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit2, Trash2, Building2, Phone, Mail } from "lucide-react"
import { useState } from "react"
import { applyCNPJMask, applyCEPMask, applyPhoneMask } from "@/lib/masks"

export function SuppliersModule() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null)
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    address: "",
    addressNumber: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  })

  const handleAddSupplier = () => {
    if (newSupplier.name && newSupplier.document) {
      if (editingSupplier) {
        updateSupplier(editingSupplier, newSupplier)
        setEditingSupplier(null)
      } else {
        addSupplier(newSupplier)
      }
      setNewSupplier({
        name: "",
        email: "",
        phone: "",
        document: "",
        address: "",
        addressNumber: "",
        city: "",
        state: "",
        zipCode: "",
        notes: "",
      })
      setShowForm(false)
    }
  }

  const handleEdit = (supplier: any) => {
    setEditingSupplier(supplier.id)
    setNewSupplier({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      document: supplier.document,
      address: supplier.address,
      addressNumber: supplier.addressNumber,
      city: supplier.city,
      state: supplier.state,
      zipCode: supplier.zipCode,
      notes: supplier.notes || "",
    })
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    deleteSupplier(id)
  }

  const fetchAddressByCEP = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, "")
    if (cleanCEP.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
        const data = await response.json()
        if (!data.erro) {
          setNewSupplier((prev) => ({
            ...prev,
            address: data.logradouro,
            city: data.localidade,
            state: data.uf,
          }))
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error)
      }
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fornecedores</h2>
          <p className="text-sm text-muted-foreground">Gerencie seus fornecedores</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Fornecedor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total de Fornecedores</p>
              <p className="text-2xl font-bold">{suppliers.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {showForm && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">{editingSupplier ? "Editar Fornecedor" : "Novo Fornecedor"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome do Fornecedor</label>
              <input
                placeholder="Nome completo ou razão social"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">CNPJ</label>
              <input
                placeholder="00.000.000/0000-00"
                value={newSupplier.document}
                onChange={(e) => setNewSupplier({ ...newSupplier, document: applyCNPJMask(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="email@fornecedor.com"
                value={newSupplier.email}
                onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Telefone</label>
              <input
                placeholder="(00) 00000-0000"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier({ ...newSupplier, phone: applyPhoneMask(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">CEP</label>
              <input
                placeholder="00000-000"
                value={newSupplier.zipCode}
                onChange={(e) => {
                  const masked = applyCEPMask(e.target.value)
                  setNewSupplier({ ...newSupplier, zipCode: masked })
                  if (masked.replace(/\D/g, "").length === 8) {
                    fetchAddressByCEP(masked)
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Número</label>
              <input
                placeholder="123"
                value={newSupplier.addressNumber}
                onChange={(e) => setNewSupplier({ ...newSupplier, addressNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Endereço</label>
              <input
                placeholder="Rua, avenida..."
                value={newSupplier.address}
                onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cidade</label>
              <input
                placeholder="Cidade"
                value={newSupplier.city}
                onChange={(e) => setNewSupplier({ ...newSupplier, city: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <input
                placeholder="UF"
                maxLength={2}
                value={newSupplier.state}
                onChange={(e) => setNewSupplier({ ...newSupplier, state: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border rounded-lg uppercase"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Observações</label>
              <textarea
                placeholder="Informações adicionais sobre o fornecedor"
                value={newSupplier.notes}
                onChange={(e) => setNewSupplier({ ...newSupplier, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false)
                setEditingSupplier(null)
                setNewSupplier({
                  name: "",
                  email: "",
                  phone: "",
                  document: "",
                  address: "",
                  addressNumber: "",
                  city: "",
                  state: "",
                  zipCode: "",
                  notes: "",
                })
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddSupplier}>{editingSupplier ? "Atualizar" : "Adicionar"} Fornecedor</Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">CNPJ</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Contato</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Cidade/Estado</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    Nenhum fornecedor cadastrado
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{supplier.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm font-mono">{supplier.document}</td>
                    <td className="px-6 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {supplier.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {supplier.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {supplier.city}, {supplier.state}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(supplier)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(supplier.id)}>
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
