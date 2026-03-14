"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ShoppingCart, LogOut } from "lucide-react"

export function Navigation() {
  const { currentPage, setCurrentPage, adminAuth, setAdminAuth, cart } = useStore()

  return (
    <nav className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <button onClick={() => setCurrentPage("home")} className="text-2xl font-bold hover:opacity-80 transition">
              SaaS Store
            </button>
            {!adminAuth.authenticated && (
              <>
                <button
                  onClick={() => setCurrentPage("home")}
                  className={`transition ${currentPage === "home" ? "font-semibold" : "hover:opacity-80"}`}
                >
                  Home
                </button>
                <button
                  onClick={() => setCurrentPage("shop")}
                  className={`transition ${currentPage === "shop" ? "font-semibold" : "hover:opacity-80"}`}
                >
                  Shop
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!adminAuth.authenticated ? (
              <>
                <button onClick={() => setCurrentPage("cart")} className="relative p-2 hover:opacity-80 transition">
                  <ShoppingCart size={24} />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
                <Button
                  onClick={() => {
                    setAdminAuth(true)
                    setCurrentPage("admin-orders")
                  }}
                  variant="outline"
                  className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Admin Access
                </Button>
              </>
            ) : (
              <>
                <span className="text-sm opacity-80">Admin</span>
                <Button
                  onClick={() => {
                    setAdminAuth(false)
                    setCurrentPage("home")
                  }}
                  variant="outline"
                  size="sm"
                  className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
