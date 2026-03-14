"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { AlertCircle } from "lucide-react"

export function LoginPage() {
  const { login, setCurrentPage } = useStore()
  const [email, setEmail] = useState("admin@saasstore.com")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (login(email, password)) {
      setCurrentPage("dashboard")
    } else {
      setError("Email ou senha inválidos")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted to-background px-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Painel de Controle</h1>
          <p className="text-muted-foreground">Faça login para gerenciar seu negócio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              placeholder="admin@saasstore.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Senha</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="pt-4 border-t text-center text-sm text-muted-foreground">
          <p>Credenciais de demonstração:</p>
          <p>Email: admin@saasstore.com</p>
          <p>Senha: admin123</p>
        </div>

        <Button variant="outline" className="w-full bg-transparent" onClick={() => setCurrentPage("landing")}>
          Voltar para Início
        </Button>
      </Card>
    </div>
  )
}
