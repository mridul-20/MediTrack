"use client"

import { useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const currentUser = {
  name: "John Doe",
  role: "parent",
  avatar: "/placeholder.svg?height=100&width=100",
  familyMembers: [
    {
      id: "1",
      name: "John Doe",
      role: "parent",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      name: "Jane Doe",
      role: "parent",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "3",
      name: "Bob Smith",
      role: "grandparent",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ],
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [editMode, setEditMode] = useState(false)
  const [editedUser, setEditedUser] = useState(currentUser)

  const handleSaveProfile = () => {
    setEditMode(false)
    // In a real app, this would save to the backend
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Family Members</CardTitle>
              <CardDescription>Switch between family profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-2 bg-primary/10 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-sm text-muted-foreground">Active Profile</p>
                  </div>
                </div>
                {currentUser.familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-2 hover:bg-accent rounded-lg cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {member.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add profile editing form here */}
              <button
                onClick={() => setEditMode(!editMode)}
                className="bg-primary text-white px-4 py-2 rounded-lg"
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}