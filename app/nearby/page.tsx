"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPinIcon, SearchIcon, PhoneIcon, ClockIcon, StarIcon, NavigationIcon, Loader2Icon } from "lucide-react"

// Mock data for nearby services
const mockPharmacies = [
  {
    id: 1,
    name: "MediCare Pharmacy",
    address: "123 Health Street, Medical District",
    phone: "+1 (555) 123-4567",
    distance: 0.8,
    rating: 4.7,
    hours: "8:00 AM - 10:00 PM",
    isOpen: true,
  },
  {
    id: 2,
    name: "QuickMeds Pharmacy",
    address: "456 Wellness Avenue, Downtown",
    phone: "+1 (555) 987-6543",
    distance: 1.2,
    rating: 4.5,
    hours: "24 hours",
    isOpen: true,
  },
  {
    id: 3,
    name: "Community Health Pharmacy",
    address: "789 Care Lane, Uptown",
    phone: "+1 (555) 456-7890",
    distance: 1.5,
    rating: 4.3,
    hours: "9:00 AM - 9:00 PM",
    isOpen: true,
  },
  {
    id: 4,
    name: "Family Wellness Pharmacy",
    address: "321 Healing Road, Westside",
    phone: "+1 (555) 234-5678",
    distance: 2.1,
    rating: 4.8,
    hours: "8:00 AM - 8:00 PM",
    isOpen: false,
  },
  {
    id: 5,
    name: "City Central Pharmacy",
    address: "555 Urban Plaza, City Center",
    phone: "+1 (555) 876-5432",
    distance: 2.4,
    rating: 4.2,
    hours: "7:00 AM - 11:00 PM",
    isOpen: true,
  },
]

const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    address: "123 Medical Center, Health District",
    phone: "+1 (555) 111-2222",
    distance: 1.0,
    rating: 4.9,
    hours: "9:00 AM - 5:00 PM",
    isOpen: true,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Pediatrician",
    address: "456 Children's Clinic, Northside",
    phone: "+1 (555) 333-4444",
    distance: 1.3,
    rating: 4.8,
    hours: "8:00 AM - 6:00 PM",
    isOpen: true,
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Family Medicine",
    address: "789 Family Health Center, Eastside",
    phone: "+1 (555) 555-6666",
    distance: 1.7,
    rating: 4.6,
    hours: "10:00 AM - 7:00 PM",
    isOpen: true,
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Internal Medicine",
    address: "321 Internal Health Clinic, Southside",
    phone: "+1 (555) 777-8888",
    distance: 2.2,
    rating: 4.7,
    hours: "9:00 AM - 4:00 PM",
    isOpen: false,
  },
  {
    id: 5,
    name: "Dr. Lisa Patel",
    specialty: "Dermatologist",
    address: "555 Skin Care Center, Westside",
    phone: "+1 (555) 999-0000",
    distance: 2.5,
    rating: 4.9,
    hours: "8:30 AM - 5:30 PM",
    isOpen: true,
  },
]

export default function NearbyPage() {
  const [activeTab, setActiveTab] = useState("pharmacies")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("distance")
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Simulate loading location data
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Mock user location (would use geolocation API in a real app)
      setUserLocation({ lat: 37.7749, lng: -122.4194 })
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const filteredPharmacies = mockPharmacies
    .filter(
      (pharmacy) =>
        pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (filterType === "distance") {
        return a.distance - b.distance
      } else if (filterType === "rating") {
        return b.rating - a.rating
      }
      return 0
    })

  const filteredDoctors = mockDoctors
    .filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.address.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (filterType === "distance") {
        return a.distance - b.distance
      } else if (filterType === "rating") {
        return b.rating - a.rating
      }
      return 0
    })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nearby Healthcare Services</h1>

      {isLoading ? (
        <Card className="flex items-center justify-center p-12">
          <div className="text-center">
            <Loader2Icon className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium">Locating nearby services...</p>
            <p className="text-muted-foreground mt-2">Please wait while we find healthcare services near you</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, specialty, or location..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="pharmacies" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
            </TabsList>

            <TabsContent value="pharmacies">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPharmacies.length > 0 ? (
                  filteredPharmacies.map((pharmacy) => (
                    <Card key={pharmacy.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{pharmacy.name}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <MapPinIcon className="h-3 w-3 mr-1" />
                              {pharmacy.address}
                            </CardDescription>
                          </div>
                          <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-sm font-medium">
                            {pharmacy.distance} mi
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <PhoneIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{pharmacy.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{pharmacy.hours}</span>
                            <span
                              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${pharmacy.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {pharmacy.isOpen ? "Open" : "Closed"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 mr-2 text-amber-500" />
                            <span>{pharmacy.rating}/5.0</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-2 w-full">
                          <Button variant="outline" className="flex-1">
                            <PhoneIcon className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                          <Button className="flex-1">
                            <NavigationIcon className="h-4 w-4 mr-2" />
                            Directions
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-muted-foreground mb-2">No pharmacies found</p>
                    <p className="text-sm text-muted-foreground">
                      Try searching with different terms or adjusting your filters
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="doctors">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <Card key={doctor.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{doctor.name}</CardTitle>
                            <CardDescription className="mt-1">{doctor.specialty}</CardDescription>
                          </div>
                          <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-sm font-medium">
                            {doctor.distance} mi
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{doctor.address}</span>
                          </div>
                          <div className="flex items-center">
                            <PhoneIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{doctor.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{doctor.hours}</span>
                            <span
                              className={`ml-2 text-xs px-2 py-0.5 rounded-full ${doctor.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {doctor.isOpen ? "Open" : "Closed"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 mr-2 text-amber-500" />
                            <span>{doctor.rating}/5.0</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-2 w-full">
                          <Button variant="outline" className="flex-1">
                            <PhoneIcon className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                          <Button className="flex-1">
                            <NavigationIcon className="h-4 w-4 mr-2" />
                            Directions
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-muted-foreground mb-2">No doctors found</p>
                    <p className="text-sm text-muted-foreground">
                      Try searching with different terms or adjusting your filters
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

