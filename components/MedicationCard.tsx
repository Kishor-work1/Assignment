import React, { useState, useEffect } from 'react';
import { Pill, Clock, User, CheckCircle, XCircle, TrendingUp, TrendingDown, AlertTriangle, Calendar, Target } from "lucide-react"

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

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function MedicationCard({ medication, detailed = false }: MedicationCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedAdherence, setAnimatedAdherence] = useState(0)

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
          color: "bg-green-600 text-white border-green-200",
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          icon: <CheckCircle className="w-4 h-4" />,
          pulse: ""
        }
      case "paused":
        return {
          color: "bg-amber-600 text-white border-amber-200", 
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          icon: <Clock className="w-4 h-4" />,
          pulse: "animate-pulse"
        }
      case "discontinued":
        return {
          color: "bg-red-600 text-white border-red-200",
          bgColor: "bg-red-50", 
          textColor: "text-red-700",
          icon: <XCircle className="w-4 h-4" />,
          pulse: ""
        }
      default:
        return {
          color: "bg-gray-600 text-white border-gray-200",
          bgColor: "bg-gray-50",
          textColor: "text-gray-700", 
          icon: <AlertTriangle className="w-4 h-4" />,
          pulse: ""
        }
    }
  }

  const getAdherenceConfig = (rate: number) => {
    if (rate >= 80) return {
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      barColor: "bg-green-500",
      icon: <TrendingUp className="w-4 h-4 text-green-600" />
    }
    if (rate >= 60) return {
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200", 
      barColor: "bg-amber-500",
      icon: <TrendingDown className="w-4 h-4 text-amber-600" />
    }
    return {
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      barColor: "bg-red-500", 
      icon: <TrendingDown className="w-4 h-4 text-red-600" />
    }
  }

  const statusConfig = getStatusConfig(medication.status)
  const adherenceConfig = getAdherenceConfig(adherenceRate)
  const recentSchedule = medication.schedule.slice(-3)

  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200",
        "w-full max-w-full",
        isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
      )}
    >
      {/* Status indicator line */}
      <div className={cn("h-1 w-full rounded-t-lg", statusConfig.bgColor)}></div>

      <div className="p-4 sm:p-5 lg:p-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 mb-4 sm:mb-6">
          <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
            {/* Pill Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center relative">
                <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                {/* Status dot */}
                <div className={cn(
                  "absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center border-2 border-white",
                  statusConfig.color, statusConfig.pulse
                )}>
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Medication Info */}
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate mb-2">
                {medication.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-blue-50 text-blue-800 text-xs sm:text-sm font-medium rounded-full border border-blue-200">
                  {medication.dosage}
                </span>
                <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-purple-50 text-purple-800 text-xs sm:text-sm font-medium rounded-full border border-purple-200">
                  {medication.frequency}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex-shrink-0">
            <div className={cn(
              "inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium border",
              statusConfig.color
            )}>
              <div className={statusConfig.pulse}>
                {statusConfig.icon}
              </div>
              <span className="capitalize whitespace-nowrap">{medication.status}</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Prescribed by</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{medication.prescribedBy}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Since</p>
              <p className="text-sm font-semibold text-gray-900">{new Date(medication.prescribedDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Adherence Section */}
        <div className={cn(
          "p-4 sm:p-5 rounded-lg border",
          adherenceConfig.bgColor,
          adherenceConfig.borderColor
        )}>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="text-sm sm:text-base font-semibold text-gray-900">Adherence Rate</span>
            </div>
            <div className="flex items-center space-x-2">
              {adherenceConfig.icon}
              <span className={cn("text-lg sm:text-xl font-bold", adherenceConfig.color)}>
                {animatedAdherence}%
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative w-full bg-gray-200 rounded-full h-2 sm:h-3">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                adherenceConfig.barColor
              )}
              style={{ width: `${animatedAdherence}%` }}
            ></div>
          </div>
        </div>

        {/* Detailed View */}
        {detailed && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 sm:space-y-6">
            {/* Instructions */}
            <div className="p-4 sm:p-5 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2 sm:mb-3 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Instructions</span>
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">{medication.instructions}</p>
            </div>

            {/* Recent Schedule */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span>Recent Schedule</span>
              </h4>
              <div className="space-y-2 sm:space-y-3">
                {recentSchedule.map((schedule, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border",
                      "space-y-2 sm:space-y-0",
                      schedule.taken 
                        ? "bg-green-50 border-green-200" 
                        : "bg-red-50 border-red-200"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        schedule.taken ? "bg-green-500" : "bg-red-500"
                      )}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(schedule.date).toLocaleDateString()} at {schedule.time}
                      </span>
                    </div>
                    <div className={cn(
                      "self-start sm:self-auto flex-shrink-0 p-1 rounded-full",
                      schedule.taken ? "bg-green-100" : "bg-red-100"
                    )}>
                      {schedule.taken ? (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
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

export default MedicationCard