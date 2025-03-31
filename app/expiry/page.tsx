"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"

// Mock data for expiry tracking
const medicineData = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    expiryDate: "2025-12-31",
    quantity: 24,
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    category: "Antibiotic",
    expiryDate: "2024-10-15",
    quantity: 10,
  },
  {
    id: 3,
    name: "Cetirizine 10mg",
    category: "Antihistamine",
    expiryDate: "2026-05-20",
    quantity: 30,
  },
  {
    id: 4,
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    expiryDate: "2025-08-10",
    quantity: 16,
  },
  {
    id: 5,
    name: "Omeprazole 20mg",
    category: "Antacid",
    expiryDate: "2024-11-30",
    quantity: 14,
  },
  {
    id: 6,
    name: "Aspirin 75mg",
    category: "Blood Thinner",
    expiryDate: "2023-12-31",
    quantity: 28,
  },
  {
    id: 7,
    name: "Loratadine 10mg",
    category: "Antihistamine",
    expiryDate: "2024-03-15",
    quantity: 7,
  },
  {
    id: 8,
    name: "Vitamin D3 1000IU",
    category: "Vitamin",
    expiryDate: "2026-01-20",
    quantity: 60,
  },
]

export default function ExpiryPage() {
  const [activeTab, setActiveTab] = useState("all")

  const today = new Date()
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(today.getMonth() + 3)

  const isExpired = (date: string) => {
    return new Date(date) < today
  }

  const isExpiringSoon = (date: string) => {
    const expiryDate = new Date(date)
    return expiryDate <= threeMonthsFromNow && expiryDate >= today
  }

  const expiredMedicines = medicineData.filter((med) => isExpired(med.expiryDate))
  const expiringSoonMedicines = medicineData.filter((med) => isExpiringSoon(med.expiryDate))
  const validMedicines = medicineData.filter((med) => !isExpired(med.expiryDate) && !isExpiringSoon(med.expiryDate))

  const getStatusBadge = (expiryDate: string) => {
    if (isExpired(expiryDate)) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircleIcon className="h-3 w-3" />
          Expired
        </Badge>
      )
    } else if (isExpiringSoon(expiryDate)) {
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1">
          <AlertTriangleIcon className="h-3 w-3" />
          Expiring Soon
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
          <CheckCircleIcon className="h-3 w-3" />
          Valid
        </Badge>
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Expiry Tracking</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <XCircleIcon className="h-5 w-5" />
              Expired
            </CardTitle>
            <CardDescription className="text-red-700">Medicines that have passed their expiry date</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-800">{expiredMedicines.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <AlertTriangleIcon className="h-5 w-5" />
              Expiring Soon
            </CardTitle>
            <CardDescription className="text-amber-700">Medicines expiring in the next 3 months</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-amber-800">{expiringSoonMedicines.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5" />
              Valid
            </CardTitle>
            <CardDescription className="text-green-700">Medicines with valid expiry dates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-800">{validMedicines.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Medicines</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="expiring-soon">Expiring Soon</TabsTrigger>
          <TabsTrigger value="valid">Valid</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ExpiryTable medicines={medicineData} getStatusBadge={getStatusBadge} />
        </TabsContent>

        <TabsContent value="expired">
          <ExpiryTable
            medicines={expiredMedicines}
            getStatusBadge={getStatusBadge}
            emptyMessage="No expired medicines found."
          />
        </TabsContent>

        <TabsContent value="expiring-soon">
          <ExpiryTable
            medicines={expiringSoonMedicines}
            getStatusBadge={getStatusBadge}
            emptyMessage="No medicines expiring soon."
          />
        </TabsContent>

        <TabsContent value="valid">
          <ExpiryTable
            medicines={validMedicines}
            getStatusBadge={getStatusBadge}
            emptyMessage="No valid medicines found."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

type ExpiryTableProps = {
  medicines: typeof medicineData
  getStatusBadge: (expiryDate: string) => React.ReactNode
  emptyMessage?: string
}

function ExpiryTable({ medicines, getStatusBadge, emptyMessage = "No medicines found." }: ExpiryTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.length > 0 ? (
                medicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell>{medicine.name}</TableCell>
                    <TableCell>{medicine.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {new Date(medicine.expiryDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(medicine.expiryDate)}</TableCell>
                    <TableCell>{medicine.quantity}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Replace
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <p className="text-muted-foreground">{emptyMessage}</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

