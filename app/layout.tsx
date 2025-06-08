import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import { AuthProvider } from "@/hooks/useAuth"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vort - AI Solutions & Digital Services | South Africa",
  description:
    "Transform your business with cutting-edge AI solutions, custom app development, and digital marketing services. Based in South Africa, serving businesses nationwide with professional AI training and consultation.",
  keywords:
    "AI solutions, machine learning, app development, digital marketing, South Africa, artificial intelligence, business automation, custom software",
  authors: [{ name: "Vort" }],
  creator: "Vort",
  publisher: "Vort",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://vort.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vort - AI Solutions & Digital Services | South Africa",
    description:
      "Transform your business with cutting-edge AI solutions, custom app development, and digital marketing services. Professional AI training and consultation in South Africa.",
    url: "https://vort.ai",
    siteName: "Vort",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vort - AI Solutions & Digital Services",
      },
    ],
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vort - AI Solutions & Digital Services | South Africa",
    description:
      "Transform your business with cutting-edge AI solutions, custom app development, and digital marketing services in South Africa.",
    images: ["/og-image.png"],
    creator: "@vort_ai",
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
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-ZA">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <meta name="theme-color" content="#1e293b" />
        <meta name="color-scheme" content="dark light" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Vort",
              url: "https://vort.ai",
              logo: "https://vort.ai/og-image.png",
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
        <Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
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
