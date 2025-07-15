import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Users, Award, Target } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | Vort",
  description: "Learn about Vort - South Africa's leading AI training and development platform",
  robots: "index, follow",
}

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Junior Zwane",
      role: "CEO & CTO",
      bio: "Former AI researcher with 5+ years in machine learning and business strategy.",
      image: "/placeholder.svg?width=200&height=200",
    },
    {
      name: "Sarah Chen",
      role: "Co-Founder",
      bio: "Full-stack developer and AI specialist with expertise in scalable systems.",
      image: "/placeholder.svg?width=200&height=200",
    },
    {
      name: "David Miller",
      role: "Head of AI Research",
      bio: "BHons in Computer Science, specializing in neural networks and deep learning.",
      image: "/placeholder.svg?width=200&height=200",
    },
  ]

  const values = [
    {
      icon: Brain,
      title: "Innovation First",
      description: "We push the boundaries of AI technology to deliver cutting-edge solutions.",
    },
    {
      icon: Users,
      title: "Client Success",
      description: "Your success is our success. We're committed to delivering measurable results.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from code to customer service.",
    },
    {
      icon: Target,
      title: "Impact",
      description: "We focus on creating solutions that make a real difference to your business.",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Vort
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/store" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Store
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 bg-secondary">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4 border-primary text-primary py-1 px-3 text-sm">
            About Vort
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Transforming Business with <span className="text-primary">Artificial Intelligence</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            Founded in Johannesburg, Vort is South Africa's premier AI training and development platform, empowering
            businesses to harness the power of artificial intelligence.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Story</h2>
            <p className="text-lg text-muted-foreground">How we started and where we're going</p>
          </div>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-6 text-lg">
              Vort was founded in 2020 with a simple mission: to make artificial intelligence accessible and practical
              for businesses across South Africa. What started as a small team of AI enthusiasts has grown into a
              leading technology company serving clients nationwide.
            </p>

            <p className="text-muted-foreground mb-6">
              Our founders recognized that while AI technology was advancing rapidly, many businesses struggled to
              implement these solutions effectively. We bridge that gap by providing comprehensive AI training, custom
              development services, and ongoing support.
            </p>

            <p className="text-muted-foreground mb-6">
              Today, we're proud to have helped over 46 businesses transform their operations through AI-powered
              solutions, from small startups to large enterprises across various industries.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-card border-border text-center p-6">
                <CardContent className="p-0">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The experts behind Vort's innovative AI solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-card border-border text-center p-6">
                <CardContent className="p-0">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Impact</h2>
            <p className="text-lg text-muted-foreground">Numbers that tell our story</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <p className="text-muted-foreground">Clients Served</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">AI Models Trained</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Custom Apps Built</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <p className="text-muted-foreground">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Work with Us?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help transform your business with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md font-medium">
                Get in Touch
              </button>
            </Link>
            <Link href="/store">
              <button className="border border-primary text-primary hover:bg-accent px-8 py-3 rounded-md font-medium">
                View Our Services
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Vort. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
