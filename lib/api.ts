// Types
export type Medicine = {
  id?: string
  name: string
  category: string
  expiryDate: string
  quantity: number
  dosage: string
  uses?: string
  notes?: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export type UserProfile = {
  id: string
  name: string
  email: string
  role: "parent" | "child" | "grandparent"
  avatar?: string
  notificationsEnabled: boolean
}

export type FamilyMember = {
  id: string
  name: string
  role: "parent" | "child" | "grandparent"
  avatar?: string
  age?: number
}

// API client for interacting with the backend
type ApiResponse<T> = {
  data?: T
  error?: string
}

// Local storage keys
const STORAGE_KEYS = {
  MEDICINES: "medicines",
  PROFILE: "profile",
  FAMILY_MEMBERS: "family_members",
}

// Helper functions for local storage
const getLocalStorage = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

const setLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

// API endpoints for medicines
export const medicinesApi = {
  // Get all medicines
  async getAll() {
    try {
      const medicines = getLocalStorage<Medicine[]>(STORAGE_KEYS.MEDICINES) || []
      return { data: medicines }
    } catch (error) {
      console.error("Error fetching medicines:", error)
      return { error: error instanceof Error ? error.message : "Failed to fetch medicines" }
    }
  },

  // Get a specific medicine by ID
  async getById(id: string) {
    try {
      const medicines = getLocalStorage<Medicine[]>(STORAGE_KEYS.MEDICINES) || []
      const medicine = medicines.find((m) => m.id === id)

      if (!medicine) {
        throw new Error("Medicine not found")
      }

      return { data: medicine }
    } catch (error) {
      console.error("Error fetching medicine:", error)
      return { error: error instanceof Error ? error.message : "Failed to fetch medicine" }
    }
  },

  // Create a new medicine
  async create(medicineData: Omit<Medicine, "id" | "createdAt" | "updatedAt">) {
    try {
      const medicines = getLocalStorage<Medicine[]>(STORAGE_KEYS.MEDICINES) || []
      const newMedicine: Medicine = {
        ...medicineData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      medicines.push(newMedicine)
      setLocalStorage(STORAGE_KEYS.MEDICINES, medicines)

      return { data: newMedicine }
    } catch (error) {
      console.error("Error creating medicine:", error)
      return { error: error instanceof Error ? error.message : "Failed to create medicine" }
    }
  },

  // Update an existing medicine
  async update(id: string, medicineData: Partial<Medicine>) {
    try {
      const medicines = getLocalStorage<Medicine[]>(STORAGE_KEYS.MEDICINES) || []
      const index = medicines.findIndex((m) => m.id === id)

      if (index === -1) {
        throw new Error("Medicine not found")
      }

      const updatedMedicine = {
        ...medicines[index],
        ...medicineData,
        updatedAt: new Date().toISOString(),
      }

      medicines[index] = updatedMedicine
      setLocalStorage(STORAGE_KEYS.MEDICINES, medicines)

      return { data: updatedMedicine }
    } catch (error) {
      console.error("Error updating medicine:", error)
      return { error: error instanceof Error ? error.message : "Failed to update medicine" }
    }
  },

  // Delete a medicine
  async delete(id: string) {
    try {
      const medicines = getLocalStorage<Medicine[]>(STORAGE_KEYS.MEDICINES) || []
      const filteredMedicines = medicines.filter((m) => m.id !== id)

      if (filteredMedicines.length === medicines.length) {
        throw new Error("Medicine not found")
      }

      setLocalStorage(STORAGE_KEYS.MEDICINES, filteredMedicines)
      return { data: true }
    } catch (error) {
      console.error("Error deleting medicine:", error)
      return { error: error instanceof Error ? error.message : "Failed to delete medicine" }
    }
  },
}

// API endpoints for user profile
export const profileApi = {
  // Get current user profile
  async getProfile() {
    try {
      const profile = getLocalStorage<UserProfile>(STORAGE_KEYS.PROFILE) || {
        id: "1",
        name: "Default User",
        email: "user@example.com",
        role: "parent",
        avatar: "/placeholder.svg?height=100&width=100",
        notificationsEnabled: true,
      }
      return { data: profile }
    } catch (error) {
      console.error("Error fetching profile:", error)
      return { error: error instanceof Error ? error.message : "Failed to fetch profile" }
    }
  },

  // Update user profile
  async updateProfile(profileData: Partial<UserProfile>) {
    try {
      const currentProfile = getLocalStorage<UserProfile>(STORAGE_KEYS.PROFILE) || {
        id: "1",
        name: "Default User",
        email: "user@example.com",
        role: "parent",
        avatar: "/placeholder.svg?height=100&width=100",
        notificationsEnabled: true,
      }

      const updatedProfile = { ...currentProfile, ...profileData }
      setLocalStorage(STORAGE_KEYS.PROFILE, updatedProfile)

      return { data: updatedProfile }
    } catch (error) {
      console.error("Error updating profile:", error)
      return { error: error instanceof Error ? error.message : "Failed to update profile" }
    }
  },
}

// API endpoints for family members
export const familyApi = {
  // Get all family members
  async getAll() {
    try {
      const members = getLocalStorage<FamilyMember[]>(STORAGE_KEYS.FAMILY_MEMBERS) || []
      return { data: members }
    } catch (error) {
      console.error("Error fetching family members:", error)
      return { error: error instanceof Error ? error.message : "Failed to fetch family members" }
    }
  },

  // Add a new family member
  async add(memberData: Omit<FamilyMember, "id">) {
    try {
      const members = getLocalStorage<FamilyMember[]>(STORAGE_KEYS.FAMILY_MEMBERS) || []
      const newMember: FamilyMember = {
        ...memberData,
        id: Date.now().toString(),
      }

      members.push(newMember)
      setLocalStorage(STORAGE_KEYS.FAMILY_MEMBERS, members)

      return { data: newMember }
    } catch (error) {
      console.error("Error adding family member:", error)
      return { error: error instanceof Error ? error.message : "Failed to add family member" }
    }
  },

  // Update a family member
  async update(id: string, memberData: Partial<FamilyMember>) {
    try {
      const members = getLocalStorage<FamilyMember[]>(STORAGE_KEYS.FAMILY_MEMBERS) || []
      const index = members.findIndex((m) => m.id === id)

      if (index === -1) {
        throw new Error("Family member not found")
      }

      const updatedMember = { ...members[index], ...memberData }
      members[index] = updatedMember
      setLocalStorage(STORAGE_KEYS.FAMILY_MEMBERS, members)

      return { data: updatedMember }
    } catch (error) {
      console.error("Error updating family member:", error)
      return { error: error instanceof Error ? error.message : "Failed to update family member" }
    }
  },

  // Delete a family member
  async delete(id: string) {
    try {
      const members = getLocalStorage<FamilyMember[]>(STORAGE_KEYS.FAMILY_MEMBERS) || []
      const filteredMembers = members.filter((m) => m.id !== id)

      if (filteredMembers.length === members.length) {
        throw new Error("Family member not found")
      }

      setLocalStorage(STORAGE_KEYS.FAMILY_MEMBERS, filteredMembers)
      return { data: true }
    } catch (error) {
      console.error("Error deleting family member:", error)
      return { error: error instanceof Error ? error.message : "Failed to delete family member" }
    }
  },
}

