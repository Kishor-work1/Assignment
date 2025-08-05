"use client"

import { AlertTriangle, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Alert {
  type: "critical" | "warning" | "info"
  message: string
}

interface AlertBannerProps {
  alerts: Alert[]
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.has(alert.message))

  const dismissAlert = (message: string) => {
    setDismissedAlerts((prev) => new Set([...prev, message]))
  }

  if (visibleAlerts.length === 0) return null

  return (
    <div className="space-y-2">
      {visibleAlerts.map((alert, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center justify-between p-4 rounded-lg border",
            alert.type === "critical"
              ? "bg-red-50 border-red-200 text-red-800"
              : alert.type === "warning"
                ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                : "bg-blue-50 border-blue-200 text-blue-800",
          )}
        >
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">{alert.message}</span>
          </div>
          <button onClick={() => dismissAlert(alert.message)} className="p-1 hover:bg-black/10 rounded cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
