"use client"

import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { ArrowRight, CheckCircle } from "lucide-react"

export function LandingPage() {
  const { setCurrentPage } = useStore()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 text-foreground">
            Enterprise Solutions for Modern Business
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Streamline your operations with our comprehensive suite of business management tools. From analytics to CRM,
            we have everything you need to scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setCurrentPage("shop")}
              size="lg"
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              Explore Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => setCurrentPage("shop")}
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              View Catalog
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Why Choose Our Platform</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Comprehensive Tools",
                description: "Everything you need in one integrated platform",
              },
              {
                title: "Enterprise Grade",
                description: "Built for scalability and reliability",
              },
              {
                title: "24/7 Support",
                description: "Our team is always ready to help you succeed",
              },
              {
                title: "Easy Integration",
                description: "Seamlessly connect with your existing systems",
              },
              {
                title: "Advanced Analytics",
                description: "Make data-driven decisions with real-time insights",
              },
              {
                title: "Security First",
                description: "Industry-leading security standards and compliance",
              },
            ].map((feature, index) => (
              <div key={index} className="p-8 rounded-lg border border-border bg-background hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-lg opacity-90 mb-8">Join hundreds of companies already using our platform</p>
          <Button
            onClick={() => setCurrentPage("shop")}
            size="lg"
            className="bg-primary-foreground text-primary hover:opacity-90"
          >
            Start Shopping Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
