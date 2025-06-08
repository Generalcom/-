"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, CheckCircle, Clock, Mail, XCircle, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export default function ContactActions({
  id,
  type,
  status,
}: {
  id: string
  type: "contact" | "consultation"
  status: string
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function updateStatus(newStatus: string) {
    setIsLoading(true)

    try {
      const endpoint = type === "contact" ? `/api/admin/contacts/${id}/status` : `/api/admin/consultations/${id}/status`

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update ${type} status`)
      }

      toast({
        title: "Status updated",
        description: `The ${type} status has been updated to ${formatStatus(newStatus)}.`,
      })

      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: `Failed to update ${type} status`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const viewPath = type === "contact" ? `/admin/contacts/${id}` : `/admin/consultations/${id}`

  const replyPath = type === "contact" ? `/admin/contacts/${id}/reply` : `/admin/consultations/${id}/reply`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(viewPath)}>
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(replyPath)}>
          <Mail className="h-4 w-4 mr-2" />
          Send Reply
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {/* Status update options based on current status */}
        {(status === "new" || status === "in_progress") && (
          <DropdownMenuItem onClick={() => updateStatus(type === "contact" ? "resolved" : "completed")}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as {type === "contact" ? "Resolved" : "Completed"}
          </DropdownMenuItem>
        )}

        {status === "new" && (
          <DropdownMenuItem onClick={() => updateStatus(type === "contact" ? "in_progress" : "contacted")}>
            <Clock className="h-4 w-4 mr-2" />
            Mark as {type === "contact" ? "In Progress" : "Contacted"}
          </DropdownMenuItem>
        )}

        {type === "consultation" && status === "contacted" && (
          <DropdownMenuItem onClick={() => updateStatus("scheduled")}>
            <Clock className="h-4 w-4 mr-2" />
            Mark as Scheduled
          </DropdownMenuItem>
        )}

        {status !== "closed" && status !== "cancelled" && (
          <DropdownMenuItem onClick={() => updateStatus(type === "contact" ? "closed" : "cancelled")}>
            <XCircle className="h-4 w-4 mr-2" />
            Mark as {type === "contact" ? "Closed" : "Cancelled"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
