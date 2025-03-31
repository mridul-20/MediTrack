"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, Loader2Icon } from "lucide-react"
import { medicinesApi, type Medicine } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Medicine[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newMedicine, setNewMedicine] = useState<Omit<Medicine, "id" | "userId" | "createdAt" | "updatedAt">>({
    name: "",
    category: "",
    expiryDate: "",
    quantity: 0,
    dosage: "",
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchMedicines()
  }, [])

  const fetchMedicines = async () => {
    setIsLoading(true)
    try {
      const result = await medicinesApi.getAll()
      if (result.data) {
        setInventory(result.data)
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching medicines:", error)
      toast({
        title: "Error",
        description: "Failed to fetch medicines. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddMedicine = async () => {
    setIsSubmitting(true)
    try {
      const result = await medicinesApi.create(newMedicine)
      if (result.data) {
        setInventory([...inventory, result.data as Medicine])
        setNewMedicine({
          name: "",
          category: "",
          expiryDate: "",
          quantity: 0,
          dosage: "",
        })
        setIsAddDialogOpen(false)
        toast({
          title: "Success",
          description: "Medicine added successfully",
        })
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding medicine:", error)
      toast({
        title: "Error",
        description: "Failed to add medicine. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteMedicine = async (id: string) => {
    try {
      const result = await medicinesApi.delete(id)
      if (result.data) {
        setInventory(inventory.filter((item) => item.id !== id))
        toast({
          title: "Success",
          description: "Medicine deleted successfully",
        })
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting medicine:", error)
      toast({
        title: "Error",
        description: "Failed to delete medicine. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isExpiringSoon = (date: string) => {
    const expiryDate = new Date(date)
    const today = new Date()
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(today.getMonth() + 3)

    return expiryDate <= threeMonthsFromNow && expiryDate >= today
  }

  const isExpired = (date: string) => {
    const expiryDate = new Date(date)
    const today = new Date()

    return expiryDate < today
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader2Icon className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Medicine Inventory</h1>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medicines..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Medicine</DialogTitle>
                <DialogDescription>Enter the details of the medicine to add to your inventory.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Medicine Name</Label>
                  <Input
                    id="name"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                    placeholder="Enter medicine name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newMedicine.category}
                    onValueChange={(value) => setNewMedicine({ ...newMedicine, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="over-the-counter">Over the Counter</SelectItem>
                      <SelectItem value="vitamins">Vitamins</SelectItem>
                      <SelectItem value="supplements">Supplements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newMedicine.expiryDate}
                    onChange={(e) => setNewMedicine({ ...newMedicine, expiryDate: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={newMedicine.quantity}
                    onChange={(e) => setNewMedicine({ ...newMedicine, quantity: parseInt(e.target.value) })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={newMedicine.dosage}
                    onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                    placeholder="e.g., 500mg"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMedicine} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Medicine"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell className="font-medium">{medicine.name}</TableCell>
                  <TableCell>{medicine.category}</TableCell>
                  <TableCell>
                    <span
                      className={
                        isExpired(medicine.expiryDate)
                          ? "text-destructive"
                          : isExpiringSoon(medicine.expiryDate)
                          ? "text-warning"
                          : ""
                      }
                    >
                      {new Date(medicine.expiryDate).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>{medicine.quantity}</TableCell>
                  <TableCell>{medicine.dosage}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteMedicine(medicine.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

