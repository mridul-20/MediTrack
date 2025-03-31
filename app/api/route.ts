import { NextResponse } from "next/server"

// Simple API route to verify the API is working
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "MediTrack API is running",
    timestamp: new Date().toISOString(),
  })
}

