import BillingClientPage from "./BillingClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Billing & Payments — Vort",
  description:
    "Secure payment processing with custom UI. No redirects, seamless checkout experience for AI services and development packages.",
  keywords:
    "secure payments, custom checkout, billing, payment processing, no redirect payments, seamless UI, South Africa payments",
  openGraph: {
    title: "Billing & Payments — Vort",
    description: "Secure, seamless payment processing with custom UI. No redirects required.",
    url: "https://vort.co.za/billing",
    images: [
      {
        url: "https://vort.co.za/og-billing.png",
        width: 1200,
        height: 630,
        alt: "Vort Secure Billing",
      },
    ],
  },
  alternates: {
    canonical: "https://vort.co.za/billing",
  },
  robots: "noindex, nofollow", // Private billing page
}

export default function BillingPage() {
  return <BillingClientPage />
}
