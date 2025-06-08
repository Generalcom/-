import { createServerSupabaseClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, CreditCard, CheckCircle, AlertCircle, Calendar } from "lucide-react"

async function getDashboardStats() {
  const supabase = createServerSupabaseClient()

  // Get user stats
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: verifiedUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("is_verified", true)

  // Get contact stats
  const { count: totalContacts } = await supabase.from("contacts").select("*", { count: "exact", head: true })

  const { count: newContacts } = await supabase
    .from("contacts")
    .select("*", { count: "exact", head: true })
    .eq("status", "new")

  // Get consultation stats
  const { count: totalConsultations } = await supabase.from("consultations").select("*", { count: "exact", head: true })

  // Get payment stats
  const { data: payments } = await supabase.from("payments").select("amount")

  const totalRevenue = payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0

  return {
    users: {
      total: totalUsers || 0,
      verified: verifiedUsers || 0,
      unverified: (totalUsers || 0) - (verifiedUsers || 0),
    },
    contacts: {
      total: totalContacts || 0,
      new: newContacts || 0,
    },
    consultations: {
      total: totalConsultations || 0,
    },
    payments: {
      total: payments?.length || 0,
      revenue: totalRevenue,
    },
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                <span>{stats.users.verified} verified</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-3 w-3 mr-1 text-amber-500" />
                <span>{stats.users.unverified} unverified</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Contact Requests</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contacts.total}</div>
            <p className="text-xs text-muted-foreground mt-2">{stats.contacts.new} new requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consultations.total}</div>
            <p className="text-xs text-muted-foreground mt-2">Total consultation requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-ZA", {
                style: "currency",
                currency: "ZAR",
              }).format(stats.payments.revenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{stats.payments.total} total payments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentUsers />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentPayments />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

async function RecentUsers() {
  const supabase = createServerSupabaseClient()

  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, email, created_at, is_verified")
    .order("created_at", { ascending: false })
    .limit(5)

  if (!users?.length) {
    return <p className="text-sm text-muted-foreground">No users found</p>
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between">
          <div>
            <p className="font-medium">{user.full_name || "Unnamed User"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center">
            {user.is_verified ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                <AlertCircle className="h-3 w-3 mr-1" />
                Unverified
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

async function RecentPayments() {
  const supabase = createServerSupabaseClient()

  const { data: payments } = await supabase
    .from("payments")
    .select(`
      id, 
      amount, 
      status, 
      created_at,
      profiles:user_id (full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  if (!payments?.length) {
    return <p className="text-sm text-muted-foreground">No payments found</p>
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div key={payment.id} className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              {new Intl.NumberFormat("en-ZA", {
                style: "currency",
                currency: "ZAR",
              }).format(payment.amount || 0)}
            </p>
            <p className="text-sm text-muted-foreground">{payment.profiles?.full_name || "Unknown User"}</p>
          </div>
          <div>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                payment.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : payment.status === "pending"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {payment.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
