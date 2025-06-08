import type { Metadata } from "next"
import { Mail, Phone, MapPin, CheckCircle, Clock, Users, Award } from "lucide-react"
import ContactForm from "@/components/ContactForm"

export const metadata: Metadata = {
  title: "Contact Us - Vort",
  description: "Get in touch with Vort for AI solutions, app development, and digital marketing services.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Get in Touch</h1>
            <p className="text-lg text-muted-foreground">
              Ready to transform your business with AI? Contact our team of experts and let's discuss how Vort can help
              you achieve your goals.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details Card */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
                <Mail className="h-6 w-6 mr-3 text-primary" />
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Email</p>
                    <p className="text-foreground font-semibold">support@vort.co.za</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Phone</p>
                    <p className="text-foreground font-semibold">+27 11 123 4567</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Address</p>
                    <p className="text-foreground font-semibold">Johannesburg, South Africa</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Vort Card */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-primary" />
                Why Choose Vort?
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  Expert AI consultants with proven track record
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  Custom solutions tailored to your business
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  24/7 support and maintenance
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  Competitive pricing in South African Rands
                </li>
              </ul>
            </div>

            {/* Response Time Card */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Response Times
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">General Inquiries:</span>
                  <span className="text-foreground font-medium">Within 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Technical Support:</span>
                  <span className="text-foreground font-medium">Within 4 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sales Inquiries:</span>
                  <span className="text-foreground font-medium">Within 2 hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Send us a Message</h2>
            <p className="text-muted-foreground mb-6">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
            <ContactForm />
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-secondary/30 rounded-lg p-8 max-w-4xl mx-auto">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-4">Ready to Start Your AI Journey?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join hundreds of businesses that have transformed their operations with Vort's AI solutions. From small
              startups to enterprise companies, we deliver results that matter.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">98%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
