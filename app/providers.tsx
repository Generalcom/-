"use client"

import type React from "react"

import { AuthProvider } from "@/hooks/useAuth"
import Script from "next/script"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}

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
    </AuthProvider>
  )
}
