import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { AuthProvider } from "@/hooks/useAuth"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://vort.co.za"),
  title: {
    default: "Vort - AI-Powered Solutions for Your Business",
    template: "%s | Vort",
  },
  description:
    "Transform your business with cutting-edge AI solutions. Custom AI development, consulting, and implementation services in South Africa.",
  keywords: "AI solutions, artificial intelligence, machine learning, business automation, AI consulting, South Africa",
  authors: [{ name: "Vort" }],
  creator: "Vort",
  publisher: "Vort",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://vort.co.za",
    title: "Vort - AI-Powered Solutions for Your Business",
    description:
      "Transform your business with cutting-edge AI solutions. Custom AI development, consulting, and implementation services in South Africa.",
    siteName: "Vort",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vort - AI-Powered Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vort - AI-Powered Solutions for Your Business",
    description: "Transform your business with cutting-edge AI solutions.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />

        {/* Google OAuth Client ID */}
        <meta
          name="google-signin-client_id"
          content="660901719604-36sj46m2hdgnsep7jtll9eep43q96i4k.apps.googleusercontent.com"
        />

        {/* Theme and mobile optimization */}
        <meta name="theme-color" content="#1e293b" />
        <meta name="color-scheme" content="dark light" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Vort",
              url: "https://vort.co.za",
              logo: "https://vort.co.za/og-image.png",
              description: "AI solutions and digital services company based in South Africa",
              address: {
                "@type": "PostalAddress",
                addressCountry: "ZA",
                addressRegion: "Gauteng",
                addressLocality: "Johannesburg",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+27-11-123-4567",
                contactType: "customer service",
                areaServed: "ZA",
                availableLanguage: ["English", "Afrikaans"],
              },
              sameAs: ["https://twitter.com/vort_ai", "https://linkedin.com/company/vort-ai"],
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "ZAR",
                lowPrice: "4500",
                highPrice: "120000",
                offerCount: "6",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
