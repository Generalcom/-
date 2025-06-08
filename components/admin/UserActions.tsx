"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, CheckCircle, AlertCircle, UserCog, Trash2, Mail } from "lucide-react"
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

export default function UserActions({
  userId,
  isVerified,
}: {
  userId: string
  isVerified: boolean
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function updateVerificationStatus(verified: boolean) {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/users/${userId}/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ verified }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user verification status")
      }

      toast({
        title: verified ? "User verified" : "User unverified",
        description: `The user has been ${verified ? "verified" : "unverified"} successfully.`,
      })

      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update user verification status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
        <DropdownMenuItem onClick={() => router.push(`/admin/users/${userId}`)}>
          <UserCog className="h-4 w-4 mr-2" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/users/${userId}/email`)}>
          <Mail className="h-4 w-4 mr-2" />
          Send Email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {isVerified ? (
          <DropdownMenuItem onClick={() => updateVerificationStatus(false)}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Mark as Unverified
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => updateVerificationStatus(true)}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Verify User
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => {
            // Implement delete user functionality
            toast({
              title: "Not implemented",
              description: "User deletion functionality is not yet implemented",
            })
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
