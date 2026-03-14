"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { BarChart3, Users, Package, TrendingUp, Clock, CheckSquare } from "lucide-react"

export function LandingPage() {
  const { setCurrentPage, loginDemo } = useStore()

  const handleDemoAccess = () => {
    loginDemo()
    setCurrentPage("dashboard")
  }

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Pedidos e Entrega",
      description: "Gerencie pedidos, envios e entregas de clientes em tempo real",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Sistema CRM",
      description: "Gerenciamento completo de relacionamento com clientes",
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Gerenciamento de Estoque",
      description: "Controle de níveis de estoque e catálogo de produtos",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Relatórios Financeiros",
      description: "Rastreamento financeiro abrangente e análise de receita",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Agenda e Calendário",
      description: "Gerencie reuniões, chamadas e eventos comerciais importantes",
    },
    {
      icon: <CheckSquare className="w-8 h-8" />,
      title: "Gerenciamento de Tarefas",
      description: "Quadros Kanban e rastreamento de tarefas para colaboração",
    },
  ]

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-primary-foreground px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-balance">SaaS de Gestão Empresarial</h1>
          <p className="text-xl md:text-2xl opacity-90 text-balance">
            Plataforma completa para pedidos, clientes, estoque, finanças e colaboração em equipe
          </p>
          <div className="flex gap-4 justify-center pt-8 flex-wrap">
            <Button
              size="lg"
              onClick={() => setCurrentPage("login")}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Começar Agora
            </Button>
            <Button
              size="lg"
              onClick={handleDemoAccess}
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              Acessar Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Solução Empresarial Completa</h2>
            <p className="text-lg text-muted-foreground">
              Tudo o que você precisa para gerenciar suas operações comerciais
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Pronto para otimizar seu negócio?</h2>
          <p className="text-lg opacity-90">Comece a gerenciar suas operações de forma mais eficiente hoje</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => setCurrentPage("login")}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Entrar Agora
            </Button>
            <Button
              size="lg"
              onClick={handleDemoAccess}
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              Experimentar Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
