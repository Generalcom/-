"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ArrowRight,
  Brain,
  Code,
  TrendingUp,
  Zap,
  CheckCircle,
  ShoppingCart,
  ShieldCheck,
  Users,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useAuth } from "@/hooks/useAuth"
import { useCart } from "@/hooks/useCart"
import CartSidebar from "@/components/CartSidebar"
import ConsultationModal from "@/components/ConsultationModal"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -30]) // Reduced parallax
  const { user, profile } = useAuth()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
  const { getTotalItems } = useCart()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const services = [
    {
      icon: Brain,
      title: "AI Training Solutions",
      description: "Custom AI models for financial forecasting, risk assessment, and commercial optimization.",
      price: "From R45,000", // Updated to ZAR
      features: [
        "Custom Model Development",
        "Data Analysis & Preprocessing",
        "Performance Optimization",
        "Deployment Support",
      ],
      link: "/store#ai-training-pro", // Link to specific product
    },
    {
      icon: Code,
      title: "Custom App Development",
      description: "Full-stack applications with AI integration and modern, scalable user experiences.",
      price: "From R75,000", // Updated to ZAR
      features: [
        "React/Next.js Web Apps",
        "Mobile App Development",
        "AI Model Integration",
        "Cloud Deployment & DevOps",
      ],
      link: "/store#app-development",
    },
    {
      icon: TrendingUp,
      title: "Digital Marketing AI",
      description: "AI-powered marketing automation, customer insights, and conversion optimization strategies.",
      price: "From R30,000", // Updated to ZAR
      features: [
        "AI Marketing Automation",
        "Customer Analytics & Segmentation",
        "Personalized Campaigns",
        "ROI Optimization",
      ],
      link: "/store#marketing-ai",
    },
  ]

  const testimonials = [
    {
      quote:
        "Vort's AI solutions revolutionized our data analysis, providing insights we never thought possible. Their team is top-notch!",
      name: "Lethabo Khumalo",
      title: "CEO, FinTech Innovators ZA",
      avatar: "/placeholder.svg?width=40&height=40",
    },
    {
      quote:
        "The custom app developed by Vort streamlined our operations and significantly improved customer engagement. Highly recommended.",
      name: "Sarah Chen",
      title: "Operations Director, Retail SA",
      avatar: "/placeholder.svg?width=40&height=40",
    },
    {
      quote:
        "Thanks to Vort's AI-driven marketing, our campaign ROI has increased by over 200%. Exceptional service and results.",
      name: "David Miller",
      title: "Marketing Head, E-commerce Solutions",
      avatar: "/placeholder.svg?width=40&height=40",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Vort
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Services
              </Link>
              <Link href="/store" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Store
              </Link>
              <Link href="/train-ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Train AI
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={() => setIsCartOpen(true)}
                    className="relative text-muted-foreground hover:text-foreground px-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 p-0 flex items-center justify-center rounded-full">
                        {getTotalItems()}
                      </Badge>
                    )}
                    <span className="sr-only">View Cart</span>
                  </Button>
                  <Link href="/auth" passHref>
                    <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-accent">
                      {profile?.full_name ? profile.full_name.split(" ")[0] : "Account"}
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href="/auth" passHref>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
            {/* Mobile Menu Trigger (functionality to be added if needed) */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)}
                className="relative text-muted-foreground hover:text-foreground mr-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 p-0 flex items-center justify-center rounded-full">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
              <Link href="/auth" passHref>
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-accent">
                  {user ? (profile?.full_name ? profile.full_name.split(" ")[0] : "Account") : "Sign In"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 bg-secondary">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.7 }}
            style={{ y: y1 }}
          >
            <Badge variant="outline" className="mb-4 border-primary text-primary py-1 px-3 text-sm">
              AI-Powered Business Transformation
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
              Intelligent Solutions, <br className="hidden sm:block" />
              <span className="text-primary">Measurable Growth.</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-muted-foreground max-w-3xl mx-auto">
              Vort empowers your business with cutting-edge AI training, bespoke application development, and
              data-driven marketing strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-3 w-full sm:w-auto"
                onClick={() => setIsConsultationOpen(true)}
              >
                Schedule Free Consultation
              </Button>
              <Link href="/store" passHref>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-accent text-base px-8 py-3 w-full sm:w-auto"
                >
                  Explore Our Store
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features/Why Choose Us Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Why Partner with Vort?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We deliver bespoke AI and software solutions that drive efficiency, innovation, and competitive advantage.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Expert Solutions",
                description:
                  "Leverage our deep expertise in AI and software engineering for tailored, high-impact results.",
              },
              {
                icon: Users,
                title: "Client-Centric Approach",
                description:
                  "We collaborate closely with you to understand your unique needs and deliver solutions that exceed expectations.",
              },
              {
                icon: BarChart3,
                title: "Data-Driven Results",
                description:
                  "Our solutions are designed to provide measurable outcomes, optimizing your operations and growth.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-card border-border h-full text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 px-4 sm:px-6 bg-secondary">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Core Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive AI and software solutions tailored for your business success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group"
              >
                <Card className="bg-card border-border h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="mb-4 flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                        <service.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-foreground">{service.title}</CardTitle>
                    </div>
                    <CardDescription className="text-muted-foreground text-sm flex-grow min-h-[60px]">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground mb-4">{service.price}</p>
                      <ul className="space-y-2 mb-6 text-sm">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link href={service.link} passHref>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-auto">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from businesses transformed by Vort's expertise.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Card className="bg-secondary border-border h-full flex flex-col p-6">
                  <CardContent className="flex-grow p-0">
                    <p className="text-foreground mb-4 italic">"{testimonial.quote}"</p>
                  </CardContent>
                  <div className="mt-auto pt-4 border-t border-border">
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-secondary">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="bg-card rounded-lg shadow-lg p-8 md:p-12 text-center border border-border"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Elevate Your Business with AI?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how Vort's tailored AI solutions can drive innovation and growth for your company.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-3"
                onClick={() => setIsConsultationOpen(true)}
              >
                <Zap className="mr-2 h-5 w-5" />
                Request a Consultation
              </Button>
              <Link href="/contact" passHref>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-accent text-base px-8 py-3"
                >
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-4">Vort</h3>
              <p className="text-sm text-muted-foreground">
                Empowering businesses with cutting-edge AI solutions and custom development services in South Africa.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/store#ai-training-pro"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    AI Training
                  </Link>
                </li>
                <li>
                  <Link
                    href="/store#app-development"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    App Development
                  </Link>
                </li>
                <li>
                  <Link
                    href="/store#marketing-ai"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Digital Marketing AI
                  </Link>
                </li>
                <li>
                  <Link
                    href="/store#ai-consultation"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    AI Consultation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://twitter.com/vort_ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/company/vort-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/vort-ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">support@vort.co.za</p>
                <p className="text-sm text-muted-foreground">+27 11 123 4567</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Vort. All rights reserved. Based in Johannesburg, South Africa.</p>
          </div>
        </div>
      </footer>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />

      {/* Structured Data for Homepage (already present, ensure it's up-to-date) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Vort",
            url: "https://vort.co.za", // Assuming this is the final domain
            potentialAction: {
              "@type": "SearchAction",
              target: "https://vort.co.za/store?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
            mainEntity: {
              "@type": "Organization",
              "@id": "https://vort.co.za/#organization",
              name: "Vort",
              description: "AI training and development platform with custom payment solutions, based in South Africa.",
              url: "https://vort.co.za",
              logo: "https://vort.co.za/og-image.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+27-11-123-4567",
                contactType: "customer support",
                email: "support@vort.co.za",
                areaServed: "ZA",
                availableLanguage: ["English", "Afrikaans"],
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 AI Street, Tech Park",
                addressLocality: "Johannesburg",
                addressRegion: "Gauteng",
                postalCode: "2000",
                addressCountry: "ZA",
              },
              sameAs: [
                "https://twitter.com/vort_ai",
                "https://linkedin.com/company/vort-ai",
                "https://github.com/vort-ai",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "AI Services and Products",
                itemListElement: services.map((service) => ({
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: service.title,
                    description: service.description,
                  },
                  priceCurrency: "ZAR",
                  // Extract numeric price if available, otherwise omit or use a placeholder
                  // price: service.price.replace(/[^0-9]/g, '') || "0"
                })),
              },
            },
          }),
        }}
      />
    </div>
  )
}
