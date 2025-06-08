import { notFound } from "next/navigation"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, AlertCircle, Mail, Calendar, CreditCard, ShoppingCart, Clock } from "lucide-react"

export default async function UserDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()

  // Get user profile
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", params.id).single()

  if (error || !profile) {
    notFound()
  }

  // Get user's auth data
  const {
    data: { user },
  } = await supabase.auth.admin.getUserById(params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">User Details</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/users/${params.id}/email`}>
              <Mail className="h-4 w-4 mr-2" />
              Email User
            </Link>
          </Button>
          <Button>Edit Profile</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>User account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Status</p>
              {profile.is_verified ? (
                <Badge variant="outline" className="w-fit bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="w-fit bg-amber-50 text-amber-700 border-amber-200">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Unverified
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge variant={profile.role === "admin" ? "default" : "secondary"} className="w-fit">
                {profile.role || "user"}
              </Badge>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{profile.full_name || "Not provided"}</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{profile.phone || "Not provided"}</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="font-medium">{profile.company || "Not provided"}</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Joined</p>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <p>{new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <p>{new Date(profile.updated_at).toLocaleDateString()}</p>
              </div>
            </div>

            {user && (
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">Email Confirmed</p>
                <p className="font-medium">
                  {user.email_confirmed_at ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-amber-600">No</span>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4 pt-4">
              <UserOrders userId={params.id} />
            </TabsContent>

            <TabsContent value="payments" className="space-y-4 pt-4">
              <UserPayments userId={params.id} />
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 pt-4">
              <UserActivity userId={params.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

async function UserOrders({ userId }: { userId: string }) {
  const supabase = createServerSupabaseClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      total_amount,
      created_at,
      order_items (
        id,
        product_id,
        quantity,
        price
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return <p>Error loading orders</p>
  }

  if (!orders?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No orders found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>User's purchase history</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Items</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                      #{order.id.substring(0, 8)}
                    </Link>
                  </td>
                  <td className="p-4 align-middle">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "processing"
                            ? "secondary"
                            : order.status === "cancelled"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">{order.order_items?.length || 0} items</td>
                  <td className="p-4 align-middle text-right">
                    {new Intl.NumberFormat("en-ZA", {
                      style: "currency",
                      currency: "ZAR",
                    }).format(order.total_amount || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

async function UserPayments({ userId }: { userId: string }) {
  const supabase = createServerSupabaseClient()

  const { data: payments, error } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching payments:", error)
    return <p>Error loading payments</p>
  }

  if (!payments?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No payments found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>User's payment transactions</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Transaction ID</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Method</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <Link href={`/admin/payments/${payment.id}`} className="font-medium hover:underline">
                      {payment.payment_id || payment.id.substring(0, 8)}
                    </Link>
                  </td>
                  <td className="p-4 align-middle">{new Date(payment.created_at).toLocaleDateString()}</td>
                  <td className="p-4 align-middle">{payment.payment_method || "Unknown"}</td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={
                        payment.status === "completed"
                          ? "default"
                          : payment.status === "pending"
                            ? "secondary"
                            : payment.status === "failed"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle text-right">
                    {new Intl.NumberFormat("en-ZA", {
                      style: "currency",
                      currency: "ZAR",
                    }).format(payment.amount || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

async function UserActivity({ userId }: { userId: string }) {
  const supabase = createServerSupabaseClient()

  const { data: activities, error } = await supabase
    .from("user_activity")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("Error fetching activity:", error)
    return <p>Error loading activity</p>
  }

  if (!activities?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No activity found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>User's recent actions and events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="flex">
              <div className="flex-shrink-0 mr-4">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              <div className="flex-grow">
                <p className="font-medium">{getActivityTitle(activity)}</p>
                <p className="text-sm text-muted-foreground">{new Date(activity.created_at).toLocaleString()}</p>
                {activity.details && <p className="text-sm mt-1">{activity.details}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function getActivityIcon(type: string) {
  switch (type) {
    case "login":
      return <CheckCircle className="h-4 w-4 text-blue-600" />
    case "order":
      return <ShoppingCart className="h-4 w-4 text-green-600" />
    case "payment":
      return <CreditCard className="h-4 w-4 text-purple-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

function getActivityTitle(activity: any) {
  switch (activity.type) {
    case "login":
      return "User logged in"
    case "order":
      return `Placed order #${activity.reference}`
    case "payment":
      return `Made payment of R${activity.amount}`
    default:
      return activity.description || "Unknown activity"
  }
}
