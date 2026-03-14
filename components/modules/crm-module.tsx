"use client"

import type React from "react"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit2, Trash2, Upload } from "lucide-react"
import { useState } from "react"
import { maskPhone, maskDocument, maskCEP } from "@/lib/masks"

export function CRMModule() {
  const { customers, addCustomer } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importResults, setImportResults] = useState<{ success: number; errors: string[] } | null>(null)

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    personType: "fisica" as "fisica" | "juridica",
    document: "",
    address: "",
    addressNumber: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Brasil",
  })
  const [loadingCep, setLoadingCep] = useState(false)

  const fetchAddressByCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "")
    if (cleanCep.length !== 8) return

    setLoadingCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await response.json()
      if (!data.erro) {
        setNewCustomer({
          ...newCustomer,
          address: data.logradouro,
          city: data.localidade,
          state: data.uf,
          zipCode: cep,
        })
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
    } finally {
      setLoadingCep(false)
    }
  }

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email && newCustomer.document) {
      addCustomer({
        ...newCustomer,
        status: "prospect",
      })
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        personType: "fisica",
        document: "",
        address: "",
        addressNumber: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Brasil",
      })
      setShowForm(false)
    }
  }

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = e.target?.result as string
      const errors: string[] = []
      let successCount = 0

      try {
        // Parse CSV (simple implementation - assumes comma-separated with headers)
        const lines = text.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

        // Expected headers: name, email, phone, personType, document, address, addressNumber, city, state, zipCode
        for (let i = 1; i < lines.length; i++) {
          try {
            const values = lines[i].split(",").map((v) => v.trim())
            const customer: any = {}

            headers.forEach((header, index) => {
              customer[header] = values[index] || ""
            })

            // Validate required fields
            if (!customer.name || !customer.email || !customer.document) {
              errors.push(`Linha ${i + 1}: Campos obrigatórios faltando (nome, email, documento)`)
              continue
            }

            // Set defaults
            customer.personType = customer.persontype || customer.personType || "fisica"
            customer.addressNumber = customer.addressnumber || customer.addressNumber || ""
            customer.zipCode = customer.zipcode || customer.zipCode || ""
            customer.country = customer.country || "Brasil"

            addCustomer({
              name: customer.name,
              email: customer.email,
              phone: customer.phone || "",
              personType: customer.personType,
              document: customer.document,
              address: customer.address || "",
              addressNumber: customer.addressNumber,
              city: customer.city || "",
              state: customer.state || "",
              zipCode: customer.zipCode,
              country: customer.country,
              status: "prospect",
            })
            successCount++
          } catch (err) {
            errors.push(`Linha ${i + 1}: Erro ao processar dados`)
          }
        }

        setImportResults({ success: successCount, errors })
      } catch (error) {
        setImportResults({
          success: 0,
          errors: ["Erro ao ler o arquivo. Certifique-se de que é um arquivo CSV válido."],
        })
      }
    }

    reader.readAsText(file)
    event.target.value = "" // Reset input
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <div className="flex gap-2">
          {/* Import Button */}
          <Button onClick={() => setShowImportModal(true)} variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Importar CSV/XLS
          </Button>
          {/* Add New Customer Button */}
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total de Clientes</p>
          <p className="text-2xl font-bold">{customers.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Ativos</p>
          <p className="text-2xl font-bold">{customers.filter((c) => c.status === "active").length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Receita Total</p>
          <p className="text-2xl font-bold">R$ {customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}</p>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Adicionar Novo Cliente</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Tipo de Pessoa</label>
              <select
                value={newCustomer.personType}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, personType: e.target.value as "fisica" | "juridica" })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="fisica">Pessoa Física</option>
                <option value="juridica">Pessoa Jurídica</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">
                Nome {newCustomer.personType === "juridica" && "/ Razão Social"}
              </label>
              <input
                placeholder={newCustomer.personType === "fisica" ? "Nome Completo" : "Razão Social"}
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">
                {newCustomer.personType === "fisica" ? "CPF" : "CNPJ"}
              </label>
              <input
                placeholder={newCustomer.personType === "fisica" ? "000.000.000-00" : "00.000.000/0000-00"}
                value={newCustomer.document}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    document: maskDocument(e.target.value, newCustomer.personType),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="email@exemplo.com"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Telefone</label>
              <input
                placeholder="(00) 00000-0000"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    phone: maskPhone(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">CEP</label>
              <div className="flex gap-2">
                <input
                  placeholder="00000-000"
                  value={newCustomer.zipCode}
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      zipCode: maskCEP(e.target.value),
                    })
                  }
                  onBlur={(e) => fetchAddressByCep(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fetchAddressByCep(newCustomer.zipCode)}
                  disabled={loadingCep}
                >
                  {loadingCep ? "Buscando..." : "Buscar"}
                </Button>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-2">Endereço</label>
              <input
                placeholder="Rua, Avenida, etc"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Número</label>
              <input
                placeholder="Número"
                value={newCustomer.addressNumber}
                onChange={(e) => setNewCustomer({ ...newCustomer, addressNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cidade</label>
              <input
                placeholder="Cidade"
                value={newCustomer.city}
                onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estado</label>
              <input
                placeholder="UF"
                value={newCustomer.state}
                onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCustomer}>Adicionar Cliente</Button>
          </div>
        </Card>
      )}

      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Importar Clientes (CSV/XLS)</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowImportModal(false)
                  setImportResults(null)
                }}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">Formato esperado do arquivo CSV:</p>
                <code className="block bg-white p-2 rounded text-xs overflow-x-auto">
                  name,email,phone,personType,document,address,addressNumber,city,state,zipCode
                  <br />
                  João Silva,joao@email.com,(11) 98765-4321,fisica,123.456.789-00,Rua A,100,São Paulo,SP,01234-567
                </code>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• Campos obrigatórios: name, email, document</li>
                  <li>• personType: "fisica" ou "juridica"</li>
                  <li>• Separador: vírgula (,)</li>
                  <li>• Primeira linha deve conter os cabeçalhos</li>
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Selecione o arquivo CSV</label>
                <input
                  type="file"
                  accept=".csv,.xls,.xlsx,text/csv"
                  onChange={handleFileImport}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                />
              </div>

              {importResults && (
                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-lg ${importResults.success > 0 ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}
                  >
                    <p className="font-semibold">{importResults.success} cliente(s) importado(s) com sucesso</p>
                  </div>

                  {importResults.errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="font-semibold mb-2">Erros encontrados:</p>
                      <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
                        {importResults.errors.map((error, i) => (
                          <li key={i} className="text-red-700">
                            • {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      setShowImportModal(false)
                      setImportResults(null)
                    }}
                    className="w-full"
                  >
                    Fechar
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Customers Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Nome</th>
                <th className="text-left p-3 font-semibold">Tipo</th>
                <th className="text-left p-3 font-semibold">Documento</th>
                <th className="text-left p-3 font-semibold">Email</th>
                <th className="text-left p-3 font-semibold">Telefone</th>
                <th className="text-left p-3 font-semibold">Cidade/UF</th>
                <th className="text-right p-3 font-semibold">Total Gasto</th>
                <th className="text-center p-3 font-semibold">Status</th>
                <th className="text-center p-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{customer.name}</td>
                  <td className="p-3 text-sm">
                    {customer.personType === "fisica" ? "Pessoa Física" : "Pessoa Jurídica"}
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{customer.document}</td>
                  <td className="p-3 text-sm text-muted-foreground">{customer.email}</td>
                  <td className="p-3 text-sm text-muted-foreground">{customer.phone}</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {customer.city}, {customer.state}
                  </td>
                  <td className="p-3 text-right font-semibold">R$ {customer.totalSpent.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {customer.status === "active" ? "Ativo" : "Prospecto"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setNewCustomer({
                            name: customer.name,
                            email: customer.email,
                            phone: customer.phone,
                            personType: customer.personType,
                            document: customer.document,
                            address: customer.address,
                            addressNumber: customer.addressNumber,
                            city: customer.city,
                            state: customer.state,
                            zipCode: customer.zipCode,
                            country: customer.country,
                          })
                          setShowForm(true)
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja excluir este cliente?")) {
                            // deleteCustomer(customer.id) // Need to add this to store
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum cliente cadastrado</p>
          )}
        </div>
      </Card>
    </div>
  )
}
