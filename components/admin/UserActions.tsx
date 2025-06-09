"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Edit, Trash2, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface User {
  id: string
  full_name: string | null
  email: string | null
  email_verified: boolean
  role: string | null
}

interface UserActionsProps {
  user: User
}

export default function UserActions({ user }: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleVerifyUser = async () => {
    setIsLoading(true)
    // TODO: Implement user verification
    console.log("Verify user:", user.id)
    setIsLoading(false)
  }

  const handleDeleteUser = async () => {
    if (confirm("Are you sure you want to delete this user?")) {
      setIsLoading(true)
      // TODO: Implement user deletion
      console.log("Delete user:", user.id)
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Edit User
        </DropdownMenuItem>
        {!user.email_verified && (
          <DropdownMenuItem onClick={handleVerifyUser} disabled={isLoading}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Verify Email
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleDeleteUser} disabled={isLoading} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
