"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Role = "parent" | "child" | "grandparent"

type FamilyMember = {
  id: string
  name: string
  role: Role
  avatar: string
  age?: number
}

type User = {
  id: string
  name: string
  email: string
  role: Role
  avatar: string
  notificationsEnabled: boolean
  familyMembers: FamilyMember[]
}

type UserContextType = {
  user: User
  switchUser: (userId: string) => void
  updateUser: (userData: Partial<User>) => void
}

const defaultUser: User = {
  id: "1",
  name: "Default User",
  email: "user@example.com",
  role: "parent",
  avatar: "/placeholder.svg?height=100&width=100",
  notificationsEnabled: true,
  familyMembers: []
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser)

  const switchUser = (userId: string) => {
    const targetMember = user.familyMembers.find(member => member.id === userId)
    if (!targetMember) return

    const newUser = {
      ...user,
      id: targetMember.id,
      name: targetMember.name,
      role: targetMember.role,
      avatar: targetMember.avatar,
      familyMembers: [
        {
          id: user.id,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        },
        ...user.familyMembers.filter(member => member.id !== userId)
      ]
    }

    setUser(newUser)
  }

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => ({ ...prev, ...userData }))
  }

  return (
    <UserContext.Provider value={{ user, switchUser, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

