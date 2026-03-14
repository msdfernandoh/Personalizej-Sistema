"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { AlertCircle } from "lucide-react"

export function AdminLogin() {
  const { setAdminAuth, setCurrentPage } = useStore()
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [error, setError] = useState("")

  const ADMIN_EMAIL = "admin@saasstore.com"
  const ADMIN_PASSWORD = "admin123"

  const handleLogin = () => {
    setError("")

    if (!credentials.email || !credentials.password) {
      setError("Please fill in all fields")
      return
    }

    if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
      setAdminAuth(true)
      setCurrentPage("admin-orders")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-border rounded-lg p-8 bg-card">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Admin Portal</h1>
          <p className="text-muted-foreground mb-8">Manage your SaaS store</p>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded bg-background text-foreground"
                placeholder="admin@saasstore.com"
              />
              <p className="text-xs text-muted-foreground mt-1">Demo: admin@saasstore.com</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded bg-background text-foreground"
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground mt-1">Demo: admin123</p>
            </div>
          </div>

          <Button onClick={handleLogin} className="w-full bg-primary text-primary-foreground hover:opacity-90 mb-4">
            Sign In
          </Button>

          <Button onClick={() => setCurrentPage("home")} variant="outline" className="w-full">
            Back
          </Button>
        </div>
      </div>
    </div>
  )
}
