import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Search, Download } from "lucide-react"
import Link from "next/link"

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: { tab?: string; q?: string }
}) {
  const tab = searchParams.tab || "all"
  const query = searchParams.q || ""
  
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
      
      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" asChild>
            <Link href="/admin/payments?tab=all">All Payments</Link>
          </TabsTrigger>
          <TabsTrigger value="completed"\
