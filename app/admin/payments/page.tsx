import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Download, DollarSign, TrendingUp, Users, CreditCard } from "lucide-react"
import Link from "next/link"

async function getPayments() {
  const supabase = createServerComponentClient({ cookies })

  const { data: payments, error } = await supabase
    .from("payments")
    .select(`
      *,
      profiles:user_id (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payments:", error)
    return []
  }

  return payments || []
}

async function getPaymentStats() {
  const supabase = createServerComponentClient({ cookies })

  const { data: payments } = await supabase.from("payments").select("amount, status, created_at")

  if (!payments)
    return {
      totalRevenue: 0,
      completedPayments: 0,
      pendingPayments: 0,
      failedPayments: 0,
    }

  const totalRevenue = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + (p.amount || 0), 0)

  const completedPayments = payments.filter((p) => p.status === "completed").length
  const pendingPayments = payments.filter((p) => p.status === "pending").length
  const failedPayments = payments.filter((p) => p.status === "failed").length

  return {
    totalRevenue,
    completedPayments,
    pendingPayments,
    failedPayments,
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount / 100) // Convert from cents
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "failed":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: { tab?: string; q?: string }
}) {
  const tab = searchParams.tab || "all"
  const query = searchParams.q || ""

  const [payments, stats] = await Promise.all([getPayments(), getPaymentStats()])

  const filteredPayments = payments.filter((payment) => {
    const matchesQuery =
      query === "" ||
      payment.profiles?.full_name?.toLowerCase().includes(query.toLowerCase()) ||
      payment.profiles?.email?.toLowerCase().includes(query.toLowerCase()) ||
      payment.payment_id?.toLowerCase().includes(query.toLowerCase())

    const matchesTab = tab === "all" || payment.status === tab

    return matchesQuery && matchesTab
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payment Management</h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <form>
              <input
                type="search"
                name="q"
                placeholder="Search payments..."
                defaultValue={query}
                className="pl-8 h-9 w-[200px] lg:w-[300px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </form>
          </div>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedPayments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedPayments}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" asChild>
            <Link href="/admin/payments?tab=all">All Payments</Link>
          </TabsTrigger>
          <TabsTrigger value="completed" asChild>
            <Link href="/admin/payments?tab=completed">Completed</Link>
          </TabsTrigger>
          <TabsTrigger value="pending" asChild>
            <Link href="/admin/payments?tab=pending">Pending</Link>
          </TabsTrigger>
          <TabsTrigger value="failed" asChild>
            <Link href="/admin/payments?tab=failed">Failed</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>
                {filteredPayments.length} payment{filteredPayments.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No payments found matching your criteria.</div>
              ) : (
                <div className="space-y-4">
                  {filteredPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{payment.profiles?.full_name || "Unknown User"}</p>
                          <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{payment.profiles?.email}</p>
                        <p className="text-xs text-muted-foreground">Payment ID: {payment.payment_id}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.created_at).toLocaleDateString("en-ZA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-muted-foreground">{payment.service_type || "Service"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
