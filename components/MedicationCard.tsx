import React, { useState, useEffect } from 'react';
import { Pill, Clock, User, CheckCircle, XCircle, TrendingUp, TrendingDown, AlertTriangle, Calendar, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface MedicationCardProps {
  medication: {
    id: string
    name: string
    dosage: string
    frequency: string
    prescribedDate: string
    instructions: string
    prescribedBy: string
    status: string
    schedule: Array<{
      date: string
      time: string
      taken: boolean
    }>
  }
  detailed?: boolean
}

export function MedicationCard({ medication, detailed = false }: MedicationCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedAdherence, setAnimatedAdherence] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const adherenceRate =
    medication.schedule.length > 0
      ? Math.round((medication.schedule.filter((s) => s.taken).length / medication.schedule.length) * 100)
      : 0

  // Animation effects
  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedAdherence(prev => {
          if (prev < adherenceRate) {
            return prev + 1
          } else {
            clearInterval(interval)
            return adherenceRate
          }
        })
      }, 20)
      return () => clearInterval(interval)
    }, 300)
    return () => clearTimeout(timer)
  }, [adherenceRate])

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          color: "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-300",
          bgGradient: "from-emerald-50 to-green-50",
          borderColor: "border-emerald-200",
          icon: <CheckCircle className="w-4 h-4" />,
          pulse: ""
        }
      case "paused":
        return {
          color: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300",
          bgGradient: "from-amber-50 to-orange-50",
          borderColor: "border-amber-200",
          icon: <Clock className="w-4 h-4" />,
          pulse: "animate-pulse"
        }
      case "discontinued":
        return {
          color: "bg-gradient-to-r from-red-500 to-rose-500 text-white border-red-300",
          bgGradient: "from-red-50 to-rose-50",
          borderColor: "border-red-200",
          icon: <XCircle className="w-4 h-4" />,
          pulse: ""
        }
      default:
        return {
          color: "bg-gradient-to-r from-gray-500 to-slate-500 text-white border-gray-300",
          bgGradient: "from-gray-50 to-slate-50",
          borderColor: "border-gray-200",
          icon: <AlertTriangle className="w-4 h-4" />,
          pulse: ""
        }
    }
  }

  const getAdherenceConfig = (rate: number) => {
    if (rate >= 80) return {
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      gradient: "from-emerald-500 to-green-500",
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />
    }
    if (rate >= 60) return {
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      gradient: "from-amber-500 to-orange-500",
      icon: <TrendingDown className="w-4 h-4 text-amber-600" />
    }
    return {
      color: "text-red-600",
      bgColor: "bg-red-100",
      gradient: "from-red-500 to-rose-500",
      icon: <TrendingDown className="w-4 h-4 text-red-600" />
    }
  }

  const statusConfig = getStatusConfig(medication.status)
  const adherenceConfig = getAdherenceConfig(adherenceRate)
  const recentSchedule = medication.schedule.slice(-3)

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20",
        "rounded-2xl shadow-lg border border-gray-200/60 backdrop-blur-sm",
        "transition-all duration-500 hover:shadow-xl hover:-translate-y-1",
        "group cursor-pointer",
        isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-xl -translate-y-12 translate-x-12 transition-all duration-700 group-hover:scale-150"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-emerald-100/20 to-cyan-100/20 rounded-full blur-lg translate-y-8 -translate-x-8"></div>
      
      {/* Status indicator line */}
      <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", statusConfig.bgGradient)}></div>

      <div className="relative z-10 p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Enhanced Pill Icon */}
            <div className="relative">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300",
                "bg-gradient-to-br from-blue-500 to-purple-600 group-hover:scale-110 group-hover:rotate-3"
              )}>
                <Pill className="w-7 h-7 text-white drop-shadow-sm" />
              </div>
              {/* Floating status dot */}
              <div className={cn(
                "absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-md",
                statusConfig.color, statusConfig.pulse
              )}>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Medication Info */}
            <div className="space-y-1">
              <h4 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {medication.name}
              </h4>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-800 text-sm font-semibold rounded-full border border-blue-200">
                  {medication.dosage}
                </span>
                <span className="px-3 py-1 bg-purple-50 text-purple-800 text-sm font-semibold rounded-full border border-purple-200">
                  {medication.frequency}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Status Badge */}
          <div className="relative">
            <div className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-bold border-2 shadow-lg",
              "transition-all duration-300 hover:scale-105 backdrop-blur-sm",
              statusConfig.color
            )}>
              <div className={statusConfig.pulse}>
                {statusConfig.icon}
              </div>
              <span className="capitalize">{medication.status}</span>
            </div>
            {/* Status glow effect */}
            <div className={cn("absolute inset-0 rounded-xl blur-md opacity-25 -z-10", statusConfig.color)}></div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="p-2 bg-blue-50 rounded-lg">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prescribed by</p>
              <p className="text-sm font-semibold text-gray-900">{medication.prescribedBy}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Since</p>
              <p className="text-sm font-semibold text-gray-900">{new Date(medication.prescribedDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Adherence Section - Always visible with enhanced design */}
        <div className={cn(
          "p-4 rounded-xl border-2 transition-all duration-300",
          "bg-gradient-to-r", adherenceConfig.bgColor, "border-opacity-50"
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-gray-600" />
              <span className="font-bold text-gray-900">Adherence Rate</span>
            </div>
            <div className="flex items-center space-x-2">
              {adherenceConfig.icon}
              <span className={cn("text-xl font-bold", adherenceConfig.color)}>
                {animatedAdherence}%
              </span>
            </div>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000 bg-gradient-to-r shadow-sm",
                adherenceConfig.gradient
              )}
              style={{ width: `${animatedAdherence}%` }}
            ></div>
          </div>
        </div>

        {/* Detailed View */}
        {detailed && (
          <div className="mt-6 pt-6 border-t border-gray-200/60 space-y-4">
            {/* Instructions */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h5 className="font-bold text-blue-900 mb-2 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Instructions</span>
              </h5>
              <p className="text-sm text-blue-800">{medication.instructions}</p>
            </div>

            {/* Recent Schedule */}
            <div className="space-y-3">
              <h5 className="font-bold text-gray-900 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span>Recent Schedule</span>
              </h5>
              <div className="space-y-2">
                {recentSchedule.map((schedule, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-all duration-200 hover:shadow-md",
                      schedule.taken 
                        ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200" 
                        : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        schedule.taken ? "bg-emerald-500" : "bg-red-500"
                      )}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(schedule.date).toLocaleDateString()} at {schedule.time}
                      </span>
                    </div>
                    <div className={cn(
                      "p-1 rounded-full",
                      schedule.taken ? "bg-emerald-100" : "bg-red-100"
                    )}>
                      {schedule.taken ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}