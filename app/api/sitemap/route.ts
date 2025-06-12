import { NextResponse } from "next/server"

export async function GET() {
  const baseUrl = "https://vort.co.za"
  const currentDate = new Date().toISOString().split("T")[0]

  const staticPages = [
    { url: "", priority: "1.0", changefreq: "weekly" },
    { url: "/store", priority: "0.9", changefreq: "weekly" },
    { url: "/train-ai", priority: "0.9", changefreq: "weekly" },
    { url: "/about", priority: "0.8", changefreq: "monthly" },
    { url: "/contact", priority: "0.8", changefreq: "monthly" },
    { url: "/careers", priority: "0.8", changefreq: "weekly" },
    { url: "/billing", priority: "0.7", changefreq: "monthly" },
    { url: "/auth", priority: "0.6", changefreq: "monthly" },
    { url: "/privacy", priority: "0.5", changefreq: "yearly" },
    { url: "/terms", priority: "0.5", changefreq: "yearly" },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
