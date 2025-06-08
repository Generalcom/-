import type { Metadata } from "next"
import StorePageClient from "./StorePageClient"

export const metadata: Metadata = {
  title: "AI Solutions Store — Vort",
  description:
    "Browse our collection of AI training models, custom development packages, and digital marketing solutions. Instant delivery, no redirects.",
  keywords:
    "AI store, machine learning models, custom development, digital marketing packages, AI solutions, business automation tools",
  openGraph: {
    title: "AI Solutions Store — Vort",
    description: "Browse premium AI training models and development packages with instant delivery.",
    url: "https://vort.co.za/store",
    images: [
      {
        url: "https://vort.co.za/og-store.png",
        width: 1200,
        height: 630,
        alt: "Vort AI Solutions Store",
      },
    ],
  },
  alternates: {
    canonical: "https://vort.co.za/store",
  },
}

export default function StorePage() {
  return <StorePageClient />
}
