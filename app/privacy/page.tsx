import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Vort",
  description: "Privacy Policy for Vort - AI training and development platform",
  robots: "index, follow",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-foreground">
              Vort
            </a>
            <div className="flex items-center space-x-6">
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </a>
              <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card border border-border rounded-lg p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

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
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
                <p className="text-muted-foreground mb-4">
                  Vort ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how
                  we collect, use, disclose, and safeguard your information when you visit our website
                  https://vort.co.za and use our AI training and development services.
                </p>
                <p className="text-muted-foreground">
                  By using our services, you agree to the collection and use of information in accordance with this
                  policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>

                <h3 className="text-xl font-medium text-foreground mb-3">2.1 Personal Information</h3>
                <p className="text-muted-foreground mb-4">
                  We may collect personally identifiable information that you voluntarily provide, including:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Company information and job title</li>
                  <li>Payment and billing information</li>
                  <li>Account credentials and profile information</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-xl font-medium text-foreground mb-3">2.2 Usage Information</h3>
                <p className="text-muted-foreground mb-4">
                  We automatically collect information about your interaction with our services:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Referring website addresses</li>
                  <li>Usage patterns and preferences</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use the collected information for various purposes:</p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>Provide and maintain our AI training and development services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send administrative information and service updates</li>
                  <li>Respond to customer service requests and support needs</li>
                  <li>Improve our website and services</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your
                  information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>
                    <strong>Service Providers:</strong> With trusted third-party service providers who assist in
                    operating our business
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
                  </li>
                  <li>
                    <strong>Consent:</strong> With your explicit consent for specific purposes
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
                <p className="text-muted-foreground mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or destruction. These measures
                  include:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights and Choices</h2>
                <p className="text-muted-foreground mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4">
                  <li>
                    <strong>Access:</strong> Request access to your personal information
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of inaccurate information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal information
                  </li>
                  <li>
                    <strong>Portability:</strong> Request transfer of your data
                  </li>
                  <li>
                    <strong>Opt-out:</strong> Unsubscribe from marketing communications
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  To exercise these rights, please contact us at support@vort.co.za
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies and Tracking Technologies</h2>
                <p className="text-muted-foreground mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on our website. You can
                  control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Third-Party Services</h2>
                <p className="text-muted-foreground mb-4">
                  Our website may contain links to third-party websites or integrate with third-party services (such as
                  Google OAuth). We are not responsible for the privacy practices of these third parties.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. International Data Transfers</h2>
                <p className="text-muted-foreground mb-4">
                  Your information may be transferred to and processed in countries other than South Africa. We ensure
                  appropriate safeguards are in place for such transfers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Children's Privacy</h2>
                <p className="text-muted-foreground mb-4">
                  Our services are not intended for children under 18 years of age. We do not knowingly collect personal
                  information from children under 18.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">11. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-4">12. Contact Information</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
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
