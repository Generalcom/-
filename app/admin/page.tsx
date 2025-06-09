import { createServerSupabaseClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, CreditCard, ShoppingBag } from "lucide-react"

async function getDashboardStats() {
  const supabase = createServerSupabaseClient()

  try {
    // Get user count
    const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

    // Get contact submissions count
    const { count: contactCount } = await supabase.from("contacts").select("*", { count: "exact", head: true })

    // Get consultation requests count
    const { count: consultationCount } = await supabase
      .from("consultations")
      .select("*", { count: "exact", head: true })

    // Get recent activity
    const { data: recentContacts } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    const { data: recentConsultations } = await supabase
      .from("consultations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    return {
      userCount: userCount || 0,
      contactCount: contactCount || 0,
      consultationCount: consultationCount || 0,
      recentContacts: recentContacts || [],
      recentConsultations: recentConsultations || [],
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      userCount: 0,
      contactCount: 0,
      consultationCount: 0,
      recentContacts: [],
      recentConsultations: [],
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: "Total Users",
      value: stats.userCount,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Contact Submissions",
      value: stats.contactCount,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Consultation Requests",
      value: stats.consultationCount,
      icon: ShoppingBag,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Revenue",
      value: "R 0", // Placeholder for now
      icon: CreditCard,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Recent Contact Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentContacts.length > 0 ? (
                stats.recentContacts.map((contact: any) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                      <p className="text-sm text-gray-500">{contact.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{new Date(contact.created_at).toLocaleDateString()}</p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          contact.status === "new"
                            ? "bg-red-100 text-red-800"
                            : contact.status === "in_progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent contact submissions</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Consultations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Recent Consultation Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentConsultations.length > 0 ? (
                stats.recentConsultations.map((consultation: any) => (
                  <div key={consultation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{consultation.name}</p>
                      <p className="text-sm text-gray-600">{consultation.email}</p>
                      <p className="text-sm text-gray-500">{consultation.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{new Date(consultation.created_at).toLocaleDateString()}</p>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          consultation.status === "new"
                            ? "bg-red-100 text-red-800"
                            : consultation.status === "contacted"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {consultation.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent consultation requests</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
