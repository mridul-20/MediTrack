"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PillIcon, MenuIcon, XIcon } from 'lucide-react'
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const routes = [
    { name: "Home", path: "/" },
    { name: "Scan", path: "/scan" },
    { name: "Inventory", path: "/inventory" },
    { name: "Expiry", path: "/expiry" },
    { name: "Recommendations", path: "/recommendations" },
    { name: "Assistant", path: "/assistant" },
    { name: "Nearby", path: "/nearby" },
  ]

  if (!mounted) {
    return null
  }

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <PillIcon className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">MediTrack</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {routes.map((route) => (
              <Link key={route.path} href={route.path}>
                <Button variant={pathname === route.path ? "default" : "ghost"} className="text-sm">
                  {route.name}
                </Button>
              </Link>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {routes.map((route) => (
                <Link key={route.path} href={route.path}>
                  <Button
                    variant={pathname === route.path ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {route.name}
                  </Button>
                </Link>
              ))}
              <div className="flex justify-between items-center px-3 py-2">
                <span>Toggle theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

