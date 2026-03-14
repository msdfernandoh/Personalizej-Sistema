"use client"

import type React from "react"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  Truck,
  Calendar,
  CheckSquare,
  LogOut,
  Menu,
  DollarSign,
  Home,
  ShoppingBag,
  Tag,
  TrendingUp,
} from "lucide-react"
import { useState } from "react"

interface NavItem {
  id: string
  icon: React.ReactNode
  label: string
  page: string
}

const NAV_ITEMS: NavItem[] = [
  { id: "orders", icon: <ShoppingCart className="w-5 h-5" />, label: "Pedidos", page: "orders" },
  { id: "crm", icon: <Users className="w-5 h-5" />, label: "Clientes", page: "crm" },
  { id: "inventory", icon: <Package className="w-5 h-5" />, label: "Estoque", page: "inventory" },
  { id: "purchases", icon: <ShoppingBag className="w-5 h-5" />, label: "Compras", page: "purchases" },
  { id: "financial", icon: <BarChart3 className="w-5 h-5" />, label: "Financeiro", page: "financial" },
  {
    id: "accounts-payable",
    icon: <DollarSign className="w-5 h-5" />,
    label: "Contas a Pagar",
    page: "accounts-payable",
  },
  {
    id: "accounts-receivable",
    icon: <TrendingUp className="w-5 h-5" />,
    label: "Contas a Receber",
    page: "accounts-receivable",
  },
  { id: "categories", icon: <Tag className="w-5 h-5" />, label: "Categorias", page: "categories" },
  { id: "shipping", icon: <Truck className="w-5 h-5" />, label: "Envios", page: "shipping" },
  { id: "calendar", icon: <Calendar className="w-5 h-5" />, label: "Agenda", page: "calendar" },
  { id: "tasks", icon: <CheckSquare className="w-5 h-5" />, label: "Tarefas", page: "tasks" },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, setCurrentPage, currentPage } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    setCurrentPage("landing")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col shadow-sm`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-sidebar-border flex items-center px-4 gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
            GE
          </div>
          {sidebarOpen && (
            <div>
              <span className="font-bold text-sidebar-foreground text-base block">Gestão Empresarial</span>
              <span className="text-xs text-muted-foreground">Sistema Completo</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            onClick={() => setCurrentPage("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
              currentPage === "dashboard"
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
            title={sidebarOpen ? undefined : "Dashboard"}
          >
            <Home className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm font-medium">Dashboard</span>}
          </button>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.page)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                currentPage === item.page
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
              title={sidebarOpen ? undefined : item.label}
            >
              {item.icon}
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2.5 hover:bg-sidebar-accent rounded-lg text-sidebar-foreground transition-colors"
            title={sidebarOpen ? "Minimizar" : "Expandir"}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Button
            variant="ghost"
            className="w-full flex items-center gap-2 justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Sair</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Painel de Controle
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-primary-foreground font-semibold shadow-md">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-background">{children}</div>
      </main>
    </div>
  )
}
