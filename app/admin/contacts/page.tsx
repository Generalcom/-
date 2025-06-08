import { createServerSupabaseClient } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react"
import Link from "next/link"
import ContactActions from "@/components/admin/ContactActions"

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: { tab?: string; q?: string }
}) {
  const tab = searchParams.tab || "contacts"
  const query = searchParams.q || ""

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contact Management</h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <form>
              <input
                type="search"
                name="q"
                placeholder="Search contacts..."
                defaultValue={query}
                className="pl-8 h-9 w-[200px] lg:w-[300px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </form>
          </div>

          <Button variant="outline">Export CSV</Button>
        </div>
      </div>

      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="contacts" asChild>
            <Link href="/admin/contacts?tab=contacts">Contact Messages</Link>
          </TabsTrigger>
          <TabsTrigger value="consultations" asChild>
            <Link href="/admin/contacts?tab=consultations">Consultation Requests</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          <ContactsList query={query} />
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4">
          <ConsultationsList query={query} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function ContactsList({ query }: { query: string }) {
  const supabase = createServerSupabaseClient()

  let contactsQuery = supabase.from("contacts").select("*").order("created_at", { ascending: false })

  // Apply search
  if (query) {
    contactsQuery = contactsQuery.or(
      `name.ilike.%${query}%,email.ilike.%${query}%,subject.ilike.%${query}%,message.ilike.%${query}%`,
    )
  }

  const { data: contacts, error } = await contactsQuery

  if (error) {
    console.error("Error fetching contacts:", error)
    return <p>Error loading contacts</p>
  }

  if (!contacts?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No contact messages found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Subject</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <Link href={`/admin/contacts/${contact.id}`} className="font-medium hover:underline">
                      {contact.name}
                    </Link>
                  </td>
                  <td className="p-4 align-middle">{contact.email}</td>
                  <td className="p-4 align-middle">{contact.subject}</td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={
                        contact.status === "resolved"
                          ? "default"
                          : contact.status === "in_progress"
                            ? "secondary"
                            : contact.status === "new"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {getStatusIcon(contact.status)}
                      {formatStatus(contact.status)}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">{new Date(contact.created_at).toLocaleDateString()}</td>
                  <td className="p-4 align-middle text-right">
                    <ContactActions id={contact.id} type="contact" status={contact.status} />
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

async function ConsultationsList({ query }: { query: string }) {
  const supabase = createServerSupabaseClient()

  let consultationsQuery = supabase.from("consultations").select("*").order("created_at", { ascending: false })

  // Apply search
  if (query) {
    consultationsQuery = consultationsQuery.or(
      `name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%,message.ilike.%${query}%`,
    )
  }

  const { data: consultations, error } = await consultationsQuery

  if (error) {
    console.error("Error fetching consultations:", error)
    return <p>Error loading consultations</p>
  }

  if (!consultations?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No consultation requests found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Company</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Service</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Budget</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {consultations.map((consultation) => (
                <tr
                  key={consultation.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <Link href={`/admin/consultations/${consultation.id}`} className="font-medium hover:underline">
                      {consultation.name}
                    </Link>
                  </td>
                  <td className="p-4 align-middle">{consultation.company || "N/A"}</td>
                  <td className="p-4 align-middle">{consultation.service}</td>
                  <td className="p-4 align-middle">
                    {consultation.budget
                      ? new Intl.NumberFormat("en-ZA", {
                          style: "currency",
                          currency: "ZAR",
                        }).format(Number.parseInt(consultation.budget.replace(/[^0-9]/g, "")) || 0)
                      : "N/A"}
                  </td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={
                        consultation.status === "completed"
                          ? "default"
                          : consultation.status === "scheduled"
                            ? "secondary"
                            : consultation.status === "contacted"
                              ? "outline"
                              : consultation.status === "new"
                                ? "outline"
                                : "destructive"
                      }
                    >
                      {getStatusIcon(consultation.status)}
                      {formatStatus(consultation.status)}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">{new Date(consultation.created_at).toLocaleDateString()}</td>
                  <td className="p-4 align-middle text-right">
                    <ContactActions id={consultation.id} type="consultation" status={consultation.status} />
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

function getStatusIcon(status: string) {
  switch (status) {
    case "resolved":
    case "completed":
      return <CheckCircle className="h-3 w-3 mr-1" />
    case "in_progress":
    case "scheduled":
    case "contacted":
      return <Clock className="h-3 w-3 mr-1" />
    case "new":
      return <AlertCircle className="h-3 w-3 mr-1" />
    case "closed":
    case "cancelled":
      return <XCircle className="h-3 w-3 mr-1" />
    default:
      return null
  }
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
