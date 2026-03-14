"use client"

import { useStore } from "@/lib/store"
import { LandingPage } from "@/components/landing-page"
import { LoginPage } from "@/components/login-page"
import { DashboardLayout } from "@/components/dashboard-layout"
import { OrdersModule } from "@/components/modules/orders-module"
import { CRMModule } from "@/components/modules/crm-module"
import { InventoryModule } from "@/components/modules/inventory-module"
import { FinancialModule } from "@/components/modules/financial-module"
import { ShippingModule } from "@/components/modules/shipping-module"
import { CalendarModule } from "@/components/modules/calendar-module"
import { TasksModule } from "@/components/modules/tasks-module"
import { AccountsPayableModule } from "@/components/modules/accounts-payable-module"
import { ProductRegistrationPage } from "@/components/product-registration-page"
import { PurchasesModule } from "@/components/modules/purchases-module"
import { CategoriesModule } from "@/components/modules/categories-module"
import { DashboardModule } from "@/components/modules/dashboard-module"
import { AccountsReceivableModule } from "@/components/modules/accounts-receivable-module"

export default function Home() {
  const { user, currentPage } = useStore()

  if (!user) {
    if (currentPage === "login") {
      return <LoginPage />
    }
    return <LandingPage />
  }

  // Render dashboard with modules
  const renderModule = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardModule />
      case "orders":
        return <OrdersModule />
      case "crm":
        return <CRMModule />
      case "inventory":
        return <InventoryModule />
      case "product-registration":
        return <ProductRegistrationPage />
      case "purchases":
        return <PurchasesModule />
      case "financial":
        return <FinancialModule />
      case "accounts-payable":
        return <AccountsPayableModule />
      case "accounts-receivable":
        return <AccountsReceivableModule />
      case "categories":
        return <CategoriesModule />
      case "shipping":
        return <ShippingModule />
      case "calendar":
        return <CalendarModule />
      case "tasks":
        return <TasksModule />
      default:
        return <DashboardModule />
    }
  }

  return <DashboardLayout>{renderModule()}</DashboardLayout>
}
