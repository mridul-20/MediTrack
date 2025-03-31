"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  CameraIcon,
  UploadIcon,
  Loader2Icon,
  InfoIcon,
  AlertTriangleIcon,
  PencilIcon,
  CalendarIcon,
  PillIcon,
} from "lucide-react"
import { aiService, type MedicineInfo } from "@/lib/ai-service"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

// Define a type for medicine form data
type MedicineFormData = {
  name: string
  activeIngredient: string
  dosage: string
  quantity: string
  expiryDate: Date | undefined
  frequency: string
  notes: string
}

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState("camera")
  const [image, setImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [formData, setFormData] = useState<MedicineFormData>({
    name: "",
    activeIngredient: "",
    dosage: "",
    quantity: "",
    expiryDate: undefined,
    frequency: "",
    notes: "",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setMedicineInfo(null)
        setError(null)
        setShowConfirmation(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const processImage = async () => {
    if (!image) return

    setIsProcessing(true)
    setError(null)

    try {
      // In a real app, this would send the image to an OCR service
      // For demo, we'll use a mock description and the AI service
      const mockImageDescription = "Round white pill with 'TYLENOL 500' imprinted on one side"

      const result = await aiService.identifyMedicine(mockImageDescription)
      setMedicineInfo(result)

      // Pre-fill the form with detected information
      setFormData({
        name: result.name,
        activeIngredient: result.activeIngredient,
        dosage: result.dosage,
        quantity: "",
        expiryDate: undefined,
        frequency: "",
        notes: "",
      })

      // Show confirmation form
      setShowConfirmation(true)
    } catch (err) {
      console.error("Error processing image:", err)
      setError("Failed to process the image. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, expiryDate: date }))
  }

  const addToInventory = () => {
    // In a real app, this would add the medicine to the user's inventory in the backend
    console.log("Adding medicine to inventory:", formData)
    alert("Medicine added to inventory!")

    // Reset form and state
    setFormData({
      name: "",
      activeIngredient: "",
      dosage: "",
      quantity: "",
      expiryDate: undefined,
      frequency: "",
      notes: "",
    })
    setImage(null)
    setMedicineInfo(null)
    setShowConfirmation(false)
    setActiveTab("camera")
  }

  const renderMedicineForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Medicine Name*</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Tylenol, Advil"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="activeIngredient">Active Ingredient</Label>
          <Input
            id="activeIngredient"
            name="activeIngredient"
            value={formData.activeIngredient}
            onChange={handleInputChange}
            placeholder="e.g., Acetaminophen"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage*</Label>
          <Input
            id="dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleInputChange}
            placeholder="e.g., 500mg"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity*</Label>
          <Input
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="e.g., 30 tablets"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date*</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.expiryDate ? format(formData.expiryDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={formData.expiryDate} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Select onValueChange={(value) => handleSelectChange("frequency", value)} value={formData.frequency}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="once-daily">Once Daily</SelectItem>
              <SelectItem value="twice-daily">Twice Daily</SelectItem>
              <SelectItem value="three-times-daily">Three Times Daily</SelectItem>
              <SelectItem value="four-times-daily">Four Times Daily</SelectItem>
              <SelectItem value="as-needed">As Needed</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Additional information about this medicine"
          rows={3}
        />
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add Medicine</h1>

      <Tabs defaultValue="camera" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="camera">
            <CameraIcon className="h-4 w-4 mr-2" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="manual">
            <PencilIcon className="h-4 w-4 mr-2" />
            Manual Entry
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TabsContent value="camera" className="mt-0">
            {!showConfirmation ? (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Medicine Image</CardTitle>
                  <CardDescription>Take a photo or upload an image of your medicine</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div
                      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={handleCameraClick}
                    >
                      {image ? (
                        <img src={image || "/placeholder.svg"} alt="Medicine" className="max-h-64 mx-auto rounded-md" />
                      ) : (
                        <div className="py-8">
                          <CameraIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <p>Click to take a photo or upload an image</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button variant="outline" className="mr-2" onClick={handleCameraClick}>
                        <CameraIcon className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <UploadIcon className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={processImage} disabled={!image || isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Scan Medicine"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Confirm Medicine Details</CardTitle>
                  <CardDescription>Review and complete the medicine information</CardDescription>
                </CardHeader>
                <CardContent>{renderMedicineForm()}</CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button className="w-full" onClick={addToInventory}>
                    Add to Inventory
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setShowConfirmation(false)}>
                    Back to Scan
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="manual" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Manual Medicine Entry</CardTitle>
                <CardDescription>Enter medicine details manually</CardDescription>
              </CardHeader>
              <CardContent>{renderMedicineForm()}</CardContent>
              <CardFooter>
                <Button className="w-full" onClick={addToInventory}>
                  Add to Inventory
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {!showConfirmation && (
            <Card>
              <CardHeader>
                <CardTitle>Medicine Information</CardTitle>
                <CardDescription>Detected medicine details and information</CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2Icon className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Processing image...</p>
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : medicineInfo ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{medicineInfo.name}</h3>
                      <p className="text-sm text-muted-foreground">{medicineInfo.activeIngredient}</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="dosage">
                        <AccordionTrigger>Dosage</AccordionTrigger>
                        <AccordionContent>{medicineInfo.dosage}</AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="usages">
                        <AccordionTrigger>Uses</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-5 space-y-1">
                            {medicineInfo.usages.map((usage, index) => (
                              <li key={index}>{usage}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="sideEffects">
                        <AccordionTrigger>Side Effects</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-5 space-y-1">
                            {medicineInfo.sideEffects.map((effect, index) => (
                              <li key={index}>{effect}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="interactions">
                        <AccordionTrigger>Interactions</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-5 space-y-1">
                            {medicineInfo.interactions.map((interaction, index) => (
                              <li key={index}>{interaction}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="precautions">
                        <AccordionTrigger>Precautions</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-5 space-y-1">
                            {medicineInfo.precautions.map((precaution, index) => (
                              <li key={index}>{precaution}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <Alert>
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>Disclaimer</AlertTitle>
                      <AlertDescription>
                        This information is provided for educational purposes only and should not replace professional
                        medical advice.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <PillIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">No medicine scanned yet</p>
                    <p className="text-sm text-muted-foreground">
                      Take a photo of your medicine packaging to get detailed information
                    </p>
                  </div>
                )}
              </CardContent>
              {medicineInfo && !showConfirmation && (
                <CardFooter>
                  <Button className="w-full" onClick={() => setShowConfirmation(true)}>
                    Continue to Add Details
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
        </div>
      </Tabs>
    </div>
  )
}

