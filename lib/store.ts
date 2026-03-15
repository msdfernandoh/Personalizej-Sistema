import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Product {
  id: string
  name: string
  description: string
  costPrice: number // Preço de custo
  salePrice: number // Preço de venda
  stock: number
  category: string
  sku: string
  image?: string
  weight?: number // em kg
  height?: number // em cm
  width?: number // em cm
  length?: number // em cm (comprimento)
  size?: string
  color?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  personType: "fisica" | "juridica"
  document: string // CPF ou CNPJ
  address: string
  addressNumber: string
  city: string
  state: string
  zipCode: string
  country: string
  status: "active" | "inactive" | "prospect"
  totalSpent: number
  createdAt: Date
  notes?: string
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  total: number
  shippingCost?: number // Added shipping cost field
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "refunded"
  shippingAddress: string
  trackingNumber?: string
  attachments?: { name: string; url: string; uploadedAt: Date }[]
  createdAt: Date
  updatedAt: Date
  notes?: string
}

export interface Shipment {
  id: string
  orderId: string
  carrier: string
  trackingNumber: string
  status: "pending" | "shipped" | "in_transit" | "delivered" | "returned"
  estimatedDelivery: Date
  actualDelivery?: Date
  createdAt: Date
}

export interface Financial {
  id: string
  type: "entrada" | "recebimento_cartao" | "recebimento_pix" | "recebimento_dinheiro" | "recebimento_boleto" | "expense"
  orderId?: string
  amount: number
  description: string
  category: string
  paymentMethod?: string
  status: "pending" | "completed" | "cancelled"
  dueDate?: Date
  date: Date // Campo de data para filtros
  createdAt: Date
}

export interface ScheduleEvent {
  id: string
  title: string
  description?: string
  date: Date
  startTime: string
  endTime: string
  type: "meeting" | "call" | "task" | "reminder"
  customerId?: string
  status: "scheduled" | "completed" | "cancelled"
}

export interface Task {
  id: string
  title: string
  description?: string
  status: "todo" | "in_progress" | "review" | "completed"
  priority: "low" | "medium" | "high"
  assignedTo?: string
  dueDate?: Date
  customerId?: string
  orderId?: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "manager" | "staff"
  authenticated: boolean
}

export interface AccountPayable {
  id: string
  description: string
  amount: number
  category: string
  dueDate: Date
  status: "pending" | "paid" | "overdue"
  supplier: string
  bank?: string // Banco para pagamento
  createdAt: Date
  installments?: number // Added installments field
}

export interface Category {
  id: string
  name: string
  type: "product" | "financial"
  createdAt: Date
}

export interface Purchase {
  id: string
  supplierId: string
  supplierName: string
  items: PurchaseItem[]
  total: number
  status: "draft" | "confirmed" | "received"
  paymentStatus: "pending" | "paid"
  createdAt: Date
  updatedAt: Date
  notes?: string
}

export interface PurchaseItem {
  productId: string
  productName: string
  quantity: number
  costPrice: number
  salePrice: number
  total: number
}

export interface UniversalCategory {
  id: string
  name: string
  module: "financial" | "orders" | "accounts_payable" | "products" | "shipping" | "calendar" // Added calendar module
  createdAt: Date
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  document: string // CNPJ
  address: string
  addressNumber: string
  city: string
  state: string
  zipCode: string
  notes?: string
  createdAt: Date
}

export interface Bank {
  id: string
  name: string
  code?: string // Código do banco (ex: 001, 341)
  titular?: string
  agencia?: string
  conta?: string
  pix?: string
  createdAt: Date
}

export interface AccountReceivable {
  id: string
  description: string
  amount: number
  category: string
  dueDate: Date
  status: "pending" | "received" | "overdue"
  customer: string
  orderId?: string
  paymentMethod?: "boleto" | "cartao" | "pix" | "dinheiro" | "transferencia"
  createdAt: Date
  installments?: number
}

interface StoreState {
  // User & Auth
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  loginDemo: () => void

  // Products
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Customers
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, "id" | "createdAt" | "totalSpent">) => void
  updateCustomer: (id: string, updates: Partial<Customer>) => void
  deleteCustomer: (id: string) => void

  // Orders
  orders: Order[]
  createOrder: (order: Omit<Order, "id" | "createdAt" | "updatedAt">) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  deleteOrder: (id: string) => void
  addOrderAttachment: (orderId: string, attachment: { name: string; url: string }) => void
  removeOrderAttachment: (orderId: string, attachmentIndex: number) => void

  // Shipments
  shipments: Shipment[]
  createShipment: (shipment: Omit<Shipment, "id" | "createdAt">) => void
  updateShipment: (id: string, updates: Partial<Shipment>) => void
  deleteShipment: (id: string) => void // Added deleteShipment

  // Financial
  financials: Financial[]
  addFinancial: (financial: Omit<Financial, "id" | "createdAt">) => void
  deleteFinancial: (id: string) => void

  // Schedule
  events: ScheduleEvent[]
  addEvent: (event: Omit<ScheduleEvent, "id">) => void
  updateEvent: (id: string, updates: Partial<ScheduleEvent>) => void
  deleteEvent: (id: string) => void

  // Tasks
  tasks: Task[]
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void

  // Universal Categories
  universalCategories: UniversalCategory[]
  addUniversalCategory: (category: Omit<UniversalCategory, "id" | "createdAt">) => void
  updateUniversalCategory: (id: string, updates: Partial<UniversalCategory>) => void // Added update function
  deleteUniversalCategory: (id: string) => void
  getCategoriesByModule: (module: string) => UniversalCategory[]

  // Accounts Payable
  accountsPayable: AccountPayable[]
  addAccountPayable: (account: Omit<AccountPayable, "id" | "createdAt">) => void
  updateAccountPayable: (id: string, updates: Partial<AccountPayable>) => void
  deleteAccountPayable: (id: string) => void

  // Purchases
  purchases: Purchase[]
  createPurchase: (purchase: Omit<Purchase, "id" | "createdAt" | "updatedAt">) => void
  updatePurchase: (id: string, updates: Partial<Purchase>) => void
  confirmPurchase: (id: string) => void
  deletePurchase: (id: string) => void // Added deletePurchase

  // Suppliers
  suppliers: Supplier[]
  addSupplier: (supplier: Omit<Supplier, "id" | "createdAt">) => void
  updateSupplier: (id: string, updates: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void

  // Banks (Contas a Pagar)
  banks: Bank[]
  addBank: (bank: Omit<Bank, "id" | "createdAt">) => void
  updateBank: (id: string, updates: Partial<Bank>) => void
  deleteBank: (id: string) => void

  // Accounts Receivable
  accountsReceivable: AccountReceivable[]
  addAccountReceivable: (account: Omit<AccountReceivable, "id" | "createdAt">) => void
  updateAccountReceivable: (id: string, updates: Partial<AccountReceivable>) => void
  deleteAccountReceivable: (id: string) => void

  // UI
  currentPage: string
  setCurrentPage: (page: string) => void
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    sku: "PROD-001",
    name: "Premium Analytics Suite",
    description: "Advanced analytics and reporting tools",
    costPrice: 150,
    salePrice: 299,
    stock: 50,
    category: "Software",
  },
  {
    id: "2",
    sku: "PROD-002",
    name: "CRM System",
    description: "Complete customer relationship management",
    costPrice: 250,
    salePrice: 499,
    stock: 35,
    category: "Software",
  },
  {
    id: "3",
    sku: "PROD-003",
    name: "Inventory Manager",
    description: "Real-time inventory tracking",
    costPrice: 100,
    salePrice: 199,
    stock: 100,
    category: "Software",
  },
]

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "(555) 123-4567",
    personType: "juridica",
    document: "12.345.678/0001-90",
    address: "123 Business St",
    addressNumber: "1000",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    status: "active",
    totalSpent: 5000,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "c2",
    name: "Tech Startup Inc",
    email: "hello@techstartup.com",
    phone: "(555) 987-6543",
    personType: "juridica",
    document: "98.765.432/0001-10",
    address: "456 Innovation Ave",
    addressNumber: "500",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    country: "USA",
    status: "active",
    totalSpent: 12000,
    createdAt: new Date("2024-02-20"),
  },
]

export const useStore = create<StoreState>(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      login: (email: string, password: string) => {
        if (email === "admin@saasstore.com" && password === "admin123") {
          set({
            user: {
              id: "1",
              email,
              name: "Admin User",
              role: "admin",
              authenticated: true,
            },
          })
          return true
        }
        return false
      },
      logout: () => set({ user: null }),
      loginDemo: () => {
        set({
          user: {
            id: "demo",
            email: "demo@saasstore.com",
            name: "Demo User",
            role: "admin",
            authenticated: true,
          },
        })
      },

      // Products
      products: DEFAULT_PRODUCTS,
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, { ...product, id: Date.now().toString() }],
        })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      // Customers
      customers: DEFAULT_CUSTOMERS,
      addCustomer: (customer) =>
        set((state) => ({
          customers: [
            ...state.customers,
            {
              ...customer,
              id: Date.now().toString(),
              createdAt: new Date(),
              totalSpent: 0,
            },
          ],
        })),
      updateCustomer: (id, updates) =>
        set((state) => ({
          customers: state.customers.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        })),

      // Orders
      orders: [],
      createOrder: (order) =>
        set((state) => ({
          orders: [
            ...state.orders,
            {
              ...order,
              id: Date.now().toString(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updateOrder: (id, updates) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, ...updates, updatedAt: new Date() } : o)),
        })),
      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        })),
      addOrderAttachment: (orderId, attachment) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  attachments: [...(o.attachments || []), { ...attachment, uploadedAt: new Date() }],
                  updatedAt: new Date(),
                }
              : o,
          ),
        })),
      removeOrderAttachment: (orderId, attachmentIndex) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  attachments: o.attachments?.filter((_, index) => index !== attachmentIndex),
                  updatedAt: new Date(),
                }
              : o,
          ),
        })),

      // Shipments
      shipments: [],
      createShipment: (shipment) =>
        set((state) => ({
          shipments: [...state.shipments, { ...shipment, id: Date.now().toString(), createdAt: new Date() }],
        })),
      updateShipment: (id, updates) =>
        set((state) => ({
          shipments: state.shipments.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
      deleteShipment: (id) =>
        set((state) => ({
          shipments: state.shipments.filter((s) => s.id !== id),
        })),

      // Financial
      financials: [],
      addFinancial: (financial) =>
        set((state) => ({
          financials: [...state.financials, { ...financial, id: Date.now().toString(), createdAt: new Date() }],
        })),
      deleteFinancial: (id) =>
        set((state) => ({
          financials: state.financials.filter((f) => f.id !== id),
        })),

      // Schedule
      events: [],
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, id: Date.now().toString() }],
        })),
      updateEvent: (id, updates) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      // Tasks
      tasks: [],
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, { ...task, id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() }],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      // Universal Categories
      universalCategories: [],
      addUniversalCategory: (category) =>
        set((state) => ({
          universalCategories: [
            ...state.universalCategories,
            { ...category, id: Date.now().toString(), createdAt: new Date() },
          ],
        })),
      updateUniversalCategory: (id, updates) =>
        set((state) => ({
          universalCategories: state.universalCategories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteUniversalCategory: (id) =>
        set((state) => ({
          universalCategories: state.universalCategories.filter((c) => c.id !== id),
        })),
      getCategoriesByModule: (module) => {
        return get().universalCategories.filter((c) => c.module === module)
      },

      // Accounts Payable
      accountsPayable: [],
      addAccountPayable: (account) =>
        set((state) => {
          const installments = account.installments || 1
          const installmentAmount = account.amount / installments

          const newAccounts: AccountPayable[] = []
          for (let i = 0; i < installments; i++) {
            const dueDate = new Date(account.dueDate)
            dueDate.setMonth(dueDate.getMonth() + i)

            newAccounts.push({
              ...account,
              id: `${Date.now()}-${i}`,
              amount: installmentAmount,
              dueDate,
              description: installments > 1 ? `${account.description} (${i + 1}/${installments})` : account.description,
              createdAt: new Date(),
            })
          }

          return {
            accountsPayable: [...state.accountsPayable, ...newAccounts],
          }
        }),
      updateAccountPayable: (id, updates) =>
        set((state) => {
          const account = state.accountsPayable.find((a) => a.id === id)
          const updatedAccount = { ...account, ...updates }

          if (account && updates.status === "paid" && account.status !== "paid") {
            const newFinancial: Financial = {
              id: Date.now().toString(),
              type: "expense",
              amount: account.amount,
              description: `Pagamento: ${account.description}`,
              category: account.category,
              status: "completed",
              date: new Date(),
              createdAt: new Date(),
            }

            return {
              accountsPayable: state.accountsPayable.map((a) => (a.id === id ? updatedAccount : a)),
              financials: [...state.financials, newFinancial],
            }
          }

          if (account && updates.status === "pending" && account.status === "paid") {
            return {
              accountsPayable: state.accountsPayable.map((a) => (a.id === id ? updatedAccount : a)),
              financials: state.financials.filter(
                (f) => !(f.description === `Pagamento: ${account.description}` && f.amount === account.amount),
              ),
            }
          }

          return {
            accountsPayable: state.accountsPayable.map((a) => (a.id === id ? updatedAccount : a)),
          }
        }),
      deleteAccountPayable: (id) =>
        set((state) => ({
          accountsPayable: state.accountsPayable.filter((a) => a.id !== id),
        })),

      // Purchases
      purchases: [],
      createPurchase: (purchase) =>
        set((state) => ({
          purchases: [
            ...state.purchases,
            {
              ...purchase,
              id: Date.now().toString(),
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        })),
      updatePurchase: (id, updates) =>
        set((state) => ({
          purchases: state.purchases.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p)),
        })),
      confirmPurchase: (id) =>
        set((state) => {
          const purchase = state.purchases.find((p) => p.id === id)
          if (!purchase) return state

          // Atualiza o status da compra
          const updatedPurchases = state.purchases.map((p) =>
            p.id === id ? { ...p, status: "confirmed" as const, updatedAt: new Date() } : p,
          )

          // Lança em contas a pagar
          const newAccountPayable: AccountPayable = {
            id: Date.now().toString(),
            description: `Compra de ${purchase.items.length} itens - ${purchase.supplierName}`,
            amount: purchase.total,
            category: "Compras",
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
            status: "pending",
            supplier: purchase.supplierName,
            bank: undefined,
            createdAt: new Date(),
          }

          return {
            purchases: updatedPurchases,
            accountsPayable: [...state.accountsPayable, newAccountPayable],
          }
        }),
      deletePurchase: (id) =>
        set((state) => ({
          purchases: state.purchases.filter((p) => p.id !== id),
        })),

      // Suppliers
      suppliers: [],
      addSupplier: (supplier) =>
        set((state) => ({
          suppliers: [...state.suppliers, { ...supplier, id: Date.now().toString(), createdAt: new Date() }],
        })),
      updateSupplier: (id, updates) =>
        set((state) => ({
          suppliers: state.suppliers.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),
      deleteSupplier: (id) =>
        set((state) => ({
          suppliers: state.suppliers.filter((s) => s.id !== id),
        })),

      // Banks
      banks: [],
      addBank: (bank) =>
        set((state) => ({
          banks: [...state.banks, { ...bank, id: Date.now().toString(), createdAt: new Date() }],
        })),
      updateBank: (id, updates) =>
        set((state) => ({
          banks: state.banks.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        })),
      deleteBank: (id) =>
        set((state) => ({
          banks: state.banks.filter((b) => b.id !== id),
        })),

      // Accounts Receivable
      accountsReceivable: [],
      addAccountReceivable: (account) =>
        set((state) => {
          const installments = account.installments || 1
          const installmentAmount = account.amount / installments

          const newAccounts: AccountReceivable[] = []
          for (let i = 0; i < installments; i++) {
            const dueDate = new Date(account.dueDate)
            dueDate.setMonth(dueDate.getMonth() + i)

            newAccounts.push({
              ...account,
              id: `${Date.now()}-${i}`,
              amount: installmentAmount,
              dueDate,
              description: installments > 1 ? `${account.description} (${i + 1}/${installments})` : account.description,
              createdAt: new Date(),
            })
          }

          return {
            accountsReceivable: [...state.accountsReceivable, ...newAccounts],
          }
        }),
      updateAccountReceivable: (id, updates) =>
        set((state) => {
          const account = state.accountsReceivable.find((a) => a.id === id)
          const updatedAccount = { ...account, ...updates }

          if (account && updates.status === "received" && account.status !== "received") {
            const newFinancial: Financial = {
              id: Date.now().toString(),
              type:
                account.paymentMethod === "cartao"
                  ? "recebimento_cartao"
                  : account.paymentMethod === "pix"
                    ? "recebimento_pix"
                    : account.paymentMethod === "dinheiro"
                      ? "recebimento_dinheiro"
                      : account.paymentMethod === "boleto"
                        ? "recebimento_boleto"
                        : "entrada",
              amount: account.amount,
              description: `Recebimento: ${account.description}`,
              category: account.category,
              status: "completed",
              date: new Date(),
              createdAt: new Date(),
            }

            return {
              accountsReceivable: state.accountsReceivable.map((a) => (a.id === id ? updatedAccount : a)),
              financials: [...state.financials, newFinancial],
            }
          }

          if (account && updates.status === "pending" && account.status === "received") {
            return {
              accountsReceivable: state.accountsReceivable.map((a) => (a.id === id ? updatedAccount : a)),
              financials: state.financials.filter(
                (f) => !(f.description === `Recebimento: ${account.description}` && f.amount === account.amount),
              ),
            }
          }

          return {
            accountsReceivable: state.accountsReceivable.map((a) => (a.id === id ? updatedAccount : a)),
          }
        }),
      deleteAccountReceivable: (id) =>
        set((state) => ({
          accountsReceivable: state.accountsReceivable.filter((a) => a.id !== id),
        })),

      // UI
      currentPage: "landing",
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: "saas-store",
    },
  ),
)
