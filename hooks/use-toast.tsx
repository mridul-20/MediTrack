"use client"

import { useState, useEffect, ReactNode } from "react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"

type ToastProps = {
  title: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

type ToastState = ToastProps & {
  id: string
  visible: boolean
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const toast = ({ title, description, variant = "default", duration = 5000 }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    
    setToasts((prev) => [
      ...prev,
      {
        id,
        title,
        description,
        variant,
        duration,
        visible: true,
      },
    ])

    // Auto dismiss after duration
    setTimeout(() => {
      dismissToast(id)
    }, duration)
  }

  const dismissToast = (id: string) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, visible: false } : toast))
    )
    
    // Remove from DOM after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 300)
  }

  return { toast, toasts, dismissToast }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, dismissToast } = useToast()

  return (
    <>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              ${toast.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}
              ${toast.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-background"}
              rounded-md border shadow-lg transition-all duration-300 ease-in-out
              max-w-md
            `}
          >
            <div className="flex items-start gap-2 p-4">
              <div className="flex-1">
                <h3 className="font-medium">{toast.title}</h3>
                {toast.description && <p className="text-sm opacity-90 mt-1">{toast.description}</p>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => dismissToast(toast.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

