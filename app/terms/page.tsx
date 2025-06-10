import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | Vort",
  description: "Terms of Service for Vort - AI training and development platform",
  robots: "index, follow",
}

export default function TermsPage() {
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
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card border border-border rounded-lg p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Terms of Service</h1>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-6">
                <strong>Last updated:</strong>{" "}
                {new Date().toLocaleDateString("en-ZA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground mb-4">
                  By accessing and using Vort's website (https://vort.co.za) and services, you accept and agree to be
                  bound by the terms and provision of this agreement. If you do not agree to abide by the above, please
                  do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground mb-4">
                  Vort provides AI training solutions, custom application development, and digital marketing AI
                  services. Our services include but are not limited to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>Custom AI model development and training</li>
                  <li>Full-stack web and mobile application development</li>
                  <li>AI-powered marketing automation and analytics</li>
                  <li>Consultation and support services</li>
                  <li>Educational content and training materials</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Accounts and Registration</h2>
                <p className="text-muted-foreground mb-4">
                  To access certain features of our services, you may be required to create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Acceptable Use Policy</h2>
                <p className="text-muted-foreground mb-4">You agree not to use our services to:</p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Distribute spam, malware, or other harmful content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt our services</li>
                  <li>Use our services for any illegal or unauthorized purpose</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property Rights</h2>
                <p className="text-muted-foreground mb-4">
                  All content, features, and functionality of our services, including but not limited to text, graphics,
                  logos, icons, images, audio clips, video clips, data compilations, and software, are the exclusive
                  property of Vort and are protected by South African and international copyright, trademark, patent,
                  trade secret, and other intellectual property laws.
                </p>
                <p className="text-muted-foreground mb-4">
                  Custom work developed specifically for clients remains the intellectual property of the client upon
                  full payment, unless otherwise specified in a separate agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Payment Terms</h2>
                <p className="text-muted-foreground mb-4">
                  All prices are listed in South African Rand (ZAR) unless otherwise specified. Payment terms include:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>Payment is due as specified in individual service agreements</li>
                  <li>Late payments may incur additional fees</li>
                  <li>Refunds are subject to our refund policy</li>
                  <li>We reserve the right to suspend services for non-payment</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Service Level Agreement</h2>
                <p className="text-muted-foreground mb-4">
                  We strive to provide reliable services with minimal downtime. However, we do not guarantee
                  uninterrupted service and are not liable for any downtime or service interruptions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Privacy and Data Protection</h2>
                <p className="text-muted-foreground mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our
                  services, to understand our practices regarding the collection and use of your information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Limitation of Liability</h2>
                <p className="text-muted-foreground mb-4">
                  To the maximum extent permitted by law, Vort shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred
                  directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Indemnification</h2>
                <p className="text-muted-foreground mb-4">
                  You agree to defend, indemnify, and hold harmless Vort and its officers, directors, employees, and
                  agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses,
                  or fees arising out of or relating to your violation of these Terms or your use of our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. Termination</h2>
                <p className="text-muted-foreground mb-4">
                  We may terminate or suspend your account and bar access to our services immediately, without prior
                  notice or liability, under our sole discretion, for any reason whatsoever, including but not limited
                  to a breach of these Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">12. Governing Law</h2>
                <p className="text-muted-foreground mb-4">
                  These Terms shall be interpreted and governed by the laws of South Africa. Any disputes arising from
                  these Terms or your use of our services shall be subject to the exclusive jurisdiction of the courts
                  of South Africa.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">13. Changes to Terms</h2>
                <p className="text-muted-foreground mb-4">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
                  provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">14. Contact Information</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-secondary p-4 rounded-lg">
                  <p className="text-foreground mb-2">
                    <strong>Vort</strong>
                  </p>
                  <p className="text-muted-foreground">Email: support@vort.co.za</p>
                  <p className="text-muted-foreground">Phone: 011 766 3892</p>
                  <p className="text-muted-foreground">
                    Address: 132 Corner Lovaday and Fox Street, Marshall, South Africa
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4 sm:px-6">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Vort. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
