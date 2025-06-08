import type { Metadata } from "next"
import ResetPasswordClient from "./ResetPasswordClient"

export const metadata: Metadata = {
  title: "Reset Admin Password — Vort",
  description: "Reset your admin password",
  robots: "noindex, nofollow",
}

export default function ResetPasswordPage() {
  return <ResetPasswordClient />
}
