import { createServerSupabaseClient } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Search } from "lucide-react"
import Link from "next/link"
import UserActions from "@/components/admin/UserActions"

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { tab?: string; q?: string }
}) {
  const tab = searchParams.tab || "all"
  const query = searchParams.q || ""

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users Management</h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <form>
              <input
                type="search"
                name="q"
                placeholder="Search users..."
                defaultValue={query}
                className="pl-8 h-9 w-[200px] lg:w-[300px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </form>
          </div>

          <Button asChild>
            <Link href="/admin/users/new">Add User</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" asChild>
            <Link href="/admin/users?tab=all">All Users</Link>
          </TabsTrigger>
          <TabsTrigger value="verified" asChild>
            <Link href="/admin/users?tab=verified">Verified</Link>
          </TabsTrigger>
          <TabsTrigger value="unverified" asChild>
            <Link href="/admin/users?tab=unverified">Unverified</Link>
          </TabsTrigger>
          <TabsTrigger value="admins" asChild>
            <Link href="/admin/users?tab=admins">Admins</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <UsersList filter="all" query={query} />
        </TabsContent>

        <TabsContent value="verified" className="space-y-4">
          <UsersList filter="verified" query={query} />
        </TabsContent>

        <TabsContent value="unverified" className="space-y-4">
          <UsersList filter="unverified" query={query} />
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          <UsersList filter="admins" query={query} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

async function UsersList({ filter, query }: { filter: string; query: string }) {
  const supabase = createServerSupabaseClient()

  let usersQuery = supabase
    .from("profiles")
    .select("id, full_name, email, created_at, is_verified, role")
    .order("created_at", { ascending: false })

  // Apply filters
  if (filter === "verified") {
    usersQuery = usersQuery.eq("is_verified", true)
  } else if (filter === "unverified") {
    usersQuery = usersQuery.eq("is_verified", false)
  } else if (filter === "admins") {
    usersQuery = usersQuery.eq("role", "admin")
  }

  // Apply search
  if (query) {
    usersQuery = usersQuery.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
  }

  const { data: users, error } = await usersQuery

  if (error) {
    console.error("Error fetching users:", error)
    return <p>Error loading users</p>
  }

  if (!users?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No users found</p>
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
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Joined</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <Link href={`/admin/users/${user.id}`} className="font-medium hover:underline">
                      {user.full_name || "Unnamed User"}
                    </Link>
                  </td>
                  <td className="p-4 align-middle">{user.email}</td>
                  <td className="p-4 align-middle">
                    {user.is_verified ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Unverified
                      </Badge>
                    )}
                  </td>
                  <td className="p-4 align-middle">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role || "user"}</Badge>
                  </td>
                  <td className="p-4 align-middle">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="p-4 align-middle text-right">
                    <UserActions userId={user.id} isVerified={user.is_verified} />
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
