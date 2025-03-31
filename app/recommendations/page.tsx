"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SearchIcon, PillIcon, HeartPulseIcon, Loader2Icon, CheckCircleIcon, InfoIcon } from 'lucide-react'
import { aiService } from "@/lib/ai-service"

// Mock data for medicine inventory
const medicineInventory = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    expiryDate: "2025-12-31",
    quantity: 24,
    dosage: "1-2 tablets every 4-6 hours",
    uses: "Fever, headache, mild pain",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    category: "Antibiotic",
    expiryDate: "2024-10-15",
    quantity: 10,
    dosage: "1 capsule three times daily",
    uses: "Bacterial infections",
  },
  {
    id: 3,
    name: "Cetirizine 10mg",
    category: "Antihistamine",
    expiryDate: "2026-05-20",
    quantity: 30,
    dosage: "1 tablet daily",
    uses: "Allergies, hay fever, itching",
  },
  {
    id: 4,
    name: "Ibuprofen 400mg",
    category: "Pain Relief",
    expiryDate: "2025-08-10",
    quantity: 16,
    dosage: "1 tablet every 6-8 hours",
    uses: "Pain, inflammation, fever",
  },
  {
    id: 5,
    name: "Omeprazole 20mg",
    category: "Antacid",
    expiryDate: "2024-11-30",
    quantity: 14,
    dosage: "1 capsule daily before breakfast",
    uses: "Acid reflux, heartburn, stomach ulcers",
  },
]

type Recommendation = {
  medicine: string
  reason: string
  dosage: string
  alternatives?: string[]
  homeRemedies?: string[]
}

export default function RecommendationsPage() {
  const [symptoms, setSymptoms] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null)
  const [activeTab, setActiveTab] = useState("symptoms")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMedicines = medicineInventory.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.uses.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleGetRecommendations = async () => {
    if (!symptoms.trim()) return

    setIsLoading(true)

    try {
      // Use our Gemini-based AI service to analyze symptoms
      const analysis = await aiService.analyzeSymptoms(symptoms, 35);
      
      // Transform the analysis into recommendations format
      const transformedRecommendations: Recommendation[] = analysis.recommendedMedicines.map((med, index) => {
        return {
          medicine: med,
          reason: analysis.possibleConditions[index % analysis.possibleConditions.length] || "May help with symptoms",
          dosage: "As directed on packaging",
          alternatives: analysis.recommendedMedicines.filter(m => m !== med).slice(0, 2),
          homeRemedies: analysis.selfCareAdvice.slice(0, 3)
        }
      });
      
      setRecommendations(transformedRecommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error)
      setRecommendations([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Medicine Recommendations</h1>

      <Tabs defaultValue="symptoms" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="symptoms">By Symptoms</TabsTrigger>
          <TabsTrigger value="search">Search Medicines</TabsTrigger>
        </TabsList>

        <TabsContent value="symptoms">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartPulseIcon className="h-5 w-5" />
                  Describe Your Symptoms
                </CardTitle>
                <CardDescription>Tell us what you're experiencing to get personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="Describe your symptoms in detail (e.g., headache, fever, sore throat)"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      rows={6}
                    />
                  </div>

                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Important Note</AlertTitle>
                    <AlertDescription>
                      These recommendations are based on your symptoms and available medicines. Always consult a
                      healthcare professional for medical advice.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleGetRecommendations} disabled={isLoading || !symptoms.trim()} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Get Recommendations"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PillIcon className="h-5 w-5" />
                  Recommendations
                </CardTitle>
                <CardDescription>Based on your symptoms and available medicines</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2Icon className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Analyzing your symptoms...</p>
                  </div>
                ) : recommendations ? (
                  recommendations.length > 0 ? (
                    <div className="space-y-6">
                      {recommendations.map((rec, index) => (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            <h3 className="font-semibold text-lg">{rec.medicine}</h3>
                          </div>

                          <div className="ml-7 space-y-2">
                            <p>
                              <span className="font-medium">Why:</span> {rec.reason}
                            </p>
                            <p>
                              <span className="font-medium">Dosage:</span> {rec.dosage}
                            </p>

                            {rec.alternatives && rec.alternatives.length > 0 && (
                              <div>
                                <p className="font-medium">Alternatives:</p>
                                <ul className="list-disc list-inside ml-2">
                                  {rec.alternatives.map((alt, i) => (
                                    <li key={i}>{alt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {rec.homeRemedies && rec.homeRemedies.length > 0 && (
                              <div>
                                <p className="font-medium">Home Remedies:</p>
                                <ul className="list-disc list-inside ml-2">
                                  {rec.homeRemedies.map((remedy, i) => (
                                    <li key={i}>{remedy}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {index < recommendations.length - 1 && <hr className="my-4" />}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-2">No specific recommendations found</p>
                      <p className="text-sm text-muted-foreground">
                        We couldn't find suitable medicines in your inventory for these symptoms. Consider consulting a
                        healthcare professional.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">No recommendations yet</p>
                    <p className="text-sm text-muted-foreground">
                      Describe your symptoms and click "Get Recommendations" to receive personalized suggestions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="h-5 w-5" />
                Search Medicines
              </CardTitle>
              <CardDescription>Find medicines by name, category, or use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, category, or use..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((medicine) => (
                      <Card key={medicine.id} className="overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="p-4 sm:p-6 flex-1">
                            <h3 className="font-semibold text-lg mb-2">{medicine.name}</h3>
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="font-medium">Category:</span> {medicine.category}
                              </p>
                              <p>
                                <span className="font-medium">Uses:</span> {medicine.uses}
                              </p>
                              <p>
                                <span className="font-medium">Dosage:</span> {medicine.dosage}
                              </p>
                              <p>
                                <span className="font-medium">Quantity:</span> {medicine.quantity} remaining
                              </p>
                              <p>
                                <span className="font-medium">Expires:</span>{" "}
                                {new Date(medicine.expiryDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-2">No medicines found</p>
                      <p className="text-sm text-muted-foreground">
                        Try searching with different terms or check your inventory
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

