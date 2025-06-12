import type { Metadata } from "next"
import CareersClientPage from "./CareersClientPage"

// Add metadata for SEO
export const metadata: Metadata = {
  title: "Careers - Join Our Team | Vort",
  description:
    "Join Vort and build the future of AI in Africa. Explore exciting career opportunities in AI development, engineering, and consulting.",
  keywords: "careers, jobs, AI careers, software engineer jobs, South Africa jobs, AI developer, machine learning jobs",
  openGraph: {
    title: "Careers - Join Our Team | Vort",
    description: "Join Vort and build the future of AI in Africa. Explore exciting career opportunities.",
    url: "https://vort.co.za/careers",
    images: [
      {
        url: "https://vort.co.za/og-careers.png",
        width: 1200,
        height: 630,
        alt: "Vort Careers - Join Our Team",
      },
    ],
  },
  alternates: {
    canonical: "https://vort.co.za/careers",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function CareersPage() {
  return <CareersClientPage />
}
