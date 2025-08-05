"use client"

import { useState } from "react"
import { AlertTriangle, X, Pill, Calendar, TrendingDown, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface Alert {
  type: "critical" | "warning" | "info"
  message: string
  category: "vitals" | "medication" | "appointment" | "trend"
}

interface SmartAlertsProps {
  alerts: Alert[]
}

export function SmartAlerts({ alerts }: SmartAlertsProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  const dismissAlert = (message: string) => {
    setDismissedAlerts((prev) => new Set([...prev, message]))
  }

  const getAlertIcon = (category: string) => {
    switch (category) {
      case "vitals":
        return <AlertTriangle className="w-5 h-5" />
      case "medication":
        return <Pill className="w-5 h-5" />
      case "appointment":
        return <Calendar className="w-5 h-5" />
      case "trend":
        return <TrendingDown className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.has(alert.message))

  if (visibleAlerts.length === 0) return null

  return (
    <div className="space-y-2">
      {visibleAlerts.map((alert, index) => (
        <div
          key={index}
          className={cn("flex items-center justify-between p-4 rounded-lg border", getAlertColor(alert.type))}
        >
          <div className="flex items-center space-x-3">
            {getAlertIcon(alert.category)}
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
