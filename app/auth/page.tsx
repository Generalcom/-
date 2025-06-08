import type { Metadata } from "next"
import AuthPageClient from "./AuthPageClient"

export const metadata: Metadata = {
  title: "Sign In — Vort",
  description: "Access your Vort account to manage AI training projects, view billing, and access premium features.",
  keywords: "sign in, login, account access, user authentication, Vort account",
  openGraph: {
    title: "Sign In — Vort",
    description: "Access your Vort account for AI training and development services.",
    url: "https://vort.co.za/auth",
  },
  alternates: {
    canonical: "https://vort.co.za/auth",
  },
  robots: "noindex, nofollow", // Private auth page
}

export default function AuthPage() {
  return <AuthPageClient />
}
