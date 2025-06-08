import type { Metadata } from "next"
import TrainAIClientPage from "./TrainAIClientPage"

export const metadata: Metadata = {
  title: "AI Training Platform — Vort",
  description:
    "Train custom AI models for your business needs. Interactive AI training with real-time feedback and performance optimization.",
  keywords:
    "AI training, machine learning, custom AI models, business AI, model training, artificial intelligence, automated training",
  openGraph: {
    title: "AI Training Platform — Vort",
    description: "Train custom AI models with our interactive platform. Real-time feedback and optimization.",
    url: "https://vort.co.za/train-ai",
    images: [
      {
        url: "https://vort.co.za/og-train-ai.png",
        width: 1200,
        height: 630,
        alt: "Vort AI Training Platform",
      },
    ],
  },
  alternates: {
    canonical: "https://vort.co.za/train-ai",
  },
}

export default function TrainAIPage() {
  return <TrainAIClientPage />
}
