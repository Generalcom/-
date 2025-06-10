"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, Briefcase, Loader2 } from "lucide-react"
import { createSupabaseClient } from "@/lib/supabase"
import JobApplicationForm from "@/components/JobApplicationForm"
import { useToast } from "@/components/ui/use-toast"

interface JobPosition {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
  created_at: string
}

export default function CareersPage() {
  const [positions, setPositions] = useState<JobPosition[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(null)
  const { toast } = useToast()

  const benefits = [
    "Competitive salary and equity package",
    "Comprehensive medical aid and benefits",
    "Flexible working arrangements",
    "Professional development budget",
    "Latest technology and equipment",
    "Team building and social events",
    "Opportunity to work on cutting-edge AI projects",
    "Collaborative and innovative work environment",
  ]

  useEffect(() => {
    fetchPositions()
  }, [])

  const fetchPositions = async () => {
    try {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from("job_positions")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching positions:", error)
        toast({
          title: "Error loading positions",
          description: "Failed to load job positions. Please refresh the page.",
          variant: "destructive",
        })
        return
      }

      setPositions(data || [])
    } catch (error) {
      console.error("Error fetching positions:", error)
      toast({
        title: "Error loading positions",
        description: "Failed to load job positions. Please refresh the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApplyClick = (position: JobPosition) => {
    setSelectedPosition(position)
  }

  const handleCloseApplication = () => {
    setSelectedPosition(null)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Vort
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
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
            Join Our Team
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Build the Future of <span className="text-primary">AI in Africa</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            Join Vort and be part of a team that's transforming businesses across South Africa with cutting-edge
            artificial intelligence solutions.
          </p>
        </div>
      </section>

      {/* Why Work at Vort */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Work at Vort?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're building something special, and we want you to be part of it
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-card border-border text-center p-6">
              <CardContent className="p-0">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Cutting-Edge Work</h3>
                <p className="text-muted-foreground text-sm">
                  Work on the latest AI technologies and solve complex problems for real businesses.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border text-center p-6">
              <CardContent className="p-0">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Amazing Team</h3>
                <p className="text-muted-foreground text-sm">
                  Collaborate with brilliant minds who are passionate about AI and innovation.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border text-center p-6">
              <CardContent className="p-0">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Work-Life Balance</h3>
                <p className="text-muted-foreground text-sm">
                  Flexible working arrangements and a culture that values your well-being.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="bg-secondary rounded-lg p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Benefits & Perks</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Open Positions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Find your next opportunity with us</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading positions...</span>
            </div>
          ) : positions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">No open positions at the moment.</p>
              <p className="text-muted-foreground">Check back soon or send us your resume for future opportunities!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {positions.map((position) => (
                <Card key={position.id} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl font-semibold text-foreground mb-2">{position.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {position.department}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {position.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {position.type}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleApplyClick(position)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{position.description}</p>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {position.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="text-muted-foreground text-sm flex items-start">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2 flex-shrink-0"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-secondary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Application Process</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Apply</h3>
              <p className="text-muted-foreground text-sm">Submit your application and resume</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">Review</h3>
              <p className="text-muted-foreground text-sm">We review your application carefully</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Interview</h3>
              <p className="text-muted-foreground text-sm">Meet with our team and showcase your skills</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold text-foreground mb-2">Welcome</h3>
              <p className="text-muted-foreground text-sm">Join the Vort family!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Don't See the Right Role?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals. Send us your resume and let us know how you'd like to
            contribute.
          </p>
          <Link href="/contact">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3">Get in Touch</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Vort. All rights reserved.</p>
        </div>
      </footer>

      {/* Job Application Modal */}
      {selectedPosition && <JobApplicationForm position={selectedPosition} onClose={handleCloseApplication} />}
    </div>
  )
}
