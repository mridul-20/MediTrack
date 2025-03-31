import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, PillIcon, CameraIcon, MessageSquareIcon, MapPinIcon, HeartPulseIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">MediTrack</h1>
        <p className="text-xl text-muted-foreground">Your Personal Medicine Management System</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CameraIcon className="h-5 w-5" />
              Medicine Detection
            </CardTitle>
            <CardDescription>Upload photos of your medicines for automatic identification</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Our OCR technology extracts medicine names and details from photos, making inventory management
              effortless.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/scan" className="w-full">
              <Button className="w-full">Scan Medicine</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PillIcon className="h-5 w-5" />
              Medicine Inventory
            </CardTitle>
            <CardDescription>Track and manage your medicine collection</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Keep a digital record of all your medicines, including dosage, expiry dates, and quantity remaining.</p>
          </CardContent>
          <CardFooter>
            <Link href="/inventory" className="w-full">
              <Button className="w-full">View Inventory</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Expiry Tracking
            </CardTitle>
            <CardDescription>Never use expired medicines again</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Get timely notifications about medicines nearing expiration to ensure safety and reduce waste.</p>
          </CardContent>
          <CardFooter>
            <Link href="/expiry" className="w-full">
              <Button className="w-full">Check Expiry Dates</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulseIcon className="h-5 w-5" />
              AI Recommendations
            </CardTitle>
            <CardDescription>Get personalized medicine suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Our AI analyzes your symptoms and recommends appropriate medicines from your inventory or alternatives.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/recommendations" className="w-full">
              <Button className="w-full">Get Recommendations</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareIcon className="h-5 w-5" />
              Health Assistant
            </CardTitle>
            <CardDescription>AI-powered chatbot for health queries</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Chat with our AI assistant to diagnose symptoms, get medicine information, or learn about home remedies.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/assistant" className="w-full">
              <Button className="w-full">Chat Now</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5" />
              Nearby Services
            </CardTitle>
            <CardDescription>Find doctors and pharmacies near you</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Locate nearby healthcare services when you need immediate assistance or medicine refills.</p>
          </CardContent>
          <CardFooter>
            <Link href="/nearby" className="w-full">
              <Button className="w-full">Find Services</Button>
            </Link>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}

