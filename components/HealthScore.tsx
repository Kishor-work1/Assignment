"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, Heart, Activity, Thermometer, Weight, Zap, Shield, AlertTriangle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePatient } from "@/context/PatientContext"

export function HealthScore() {
  const { selectedPatient, normalRanges, criticalRanges } = usePatient()
  const [animatedScore, setAnimatedScore] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  if (!selectedPatient) return null

  const calculateVitalScore = (value: number, type: string, subType?: string) => {
    let normal, critical

    if (type === "bloodPressure" && subType) {
      normal = normalRanges.bloodPressure[subType]
      critical = criticalRanges.bloodPressure[subType]
    } else {
      normal = normalRanges[type]
      critical = criticalRanges[type]
    }

    
    if (value >= normal.min && value <= normal.max) return 100


    if (value < normal.min) {
      const criticalLow = critical.critical_low
      if (value <= criticalLow) return 0
      return Math.max(0, (50 * (value - criticalLow)) / (normal.min - criticalLow))
    } else {
      const criticalHigh = critical.critical_high
      if (value >= criticalHigh) return 0
      return Math.max(0, (50 * (criticalHigh - value)) / (criticalHigh - normal.max))
    }
  }

  const getLatestVitals = () => {
    if (!selectedPatient.vitals || selectedPatient.vitals.length === 0) return null
    return selectedPatient.vitals[selectedPatient.vitals.length - 1]
  }

  const calculateOverallHealthScore = () => {
    const latestVitals = getLatestVitals()
    if (!latestVitals) return 0

    const systolicScore = calculateVitalScore(latestVitals.bloodPressure.systolic, "bloodPressure", "systolic")
    const diastolicScore = calculateVitalScore(latestVitals.bloodPressure.diastolic, "bloodPressure", "diastolic")
    const heartRateScore = calculateVitalScore(latestVitals.heartRate, "heartRate")
    const temperatureScore = calculateVitalScore(latestVitals.temperature, "temperature")

    
    const overallScore = systolicScore * 0.3 + diastolicScore * 0.3 + heartRateScore * 0.25 + temperatureScore * 0.15
    return Math.round(overallScore)
  }

  const getTrend = () => {
    if (!selectedPatient.vitals || selectedPatient.vitals.length < 2) return "stable"

    const latest = selectedPatient.vitals[selectedPatient.vitals.length - 1]
    const previous = selectedPatient.vitals[selectedPatient.vitals.length - 2]

    const latestScore = calculateOverallHealthScore()
    const previousScore =
      calculateVitalScore(previous.bloodPressure.systolic, "bloodPressure", "systolic") * 0.3 +
      calculateVitalScore(previous.bloodPressure.diastolic, "bloodPressure", "diastolic") * 0.3 +
      calculateVitalScore(previous.heartRate, "heartRate") * 0.25 +
      calculateVitalScore(previous.temperature, "temperature") * 0.15

    const diff = latestScore - previousScore
    if (diff > 5) return "improving"
    if (diff < -5) return "declining"
    return "stable"
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
    if (score >= 60) return "text-amber-600 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
    if (score >= 40) return "text-orange-600 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200"
    return "text-red-600 bg-gradient-to-br from-red-50 to-rose-50 border-red-200"
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-500 to-green-500"
    if (score >= 60) return "bg-gradient-to-r from-amber-500 to-yellow-500"
    if (score >= 40) return "bg-gradient-to-r from-orange-500 to-red-500"
    return "bg-gradient-to-r from-red-500 to-rose-500"
  }

  const getRiskIcon = (score: number) => {
    if (score >= 80) return <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
    if (score >= 60) return <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
    if (score >= 40) return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
    return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
  }

  const getRiskAssessment = (score: number) => {
    if (score >= 80) return { level: "Excellent Health", description: "All vitals are within optimal ranges" }
    if (score >= 60) return { level: "Good Health", description: "Minor vitals require attention" }
    if (score >= 40) return { level: "At Risk", description: "Multiple vitals need monitoring" }
    return { level: "Critical Alert", description: "Immediate medical intervention required" }
  }

  const healthScore = calculateOverallHealthScore()
  const trend = getTrend()
  const latestVitals = getLatestVitals()
  const riskAssessment = getRiskAssessment(healthScore)

  // Animation effects
  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedScore(prev => {
          if (prev < healthScore) {
            return prev + 1
          } else {
            clearInterval(interval)
            return healthScore
          }
        })
      }, 30)
      return () => clearInterval(interval)
    }, 200)
    return () => clearTimeout(timer)
  }, [healthScore])

  if (!latestVitals) {
    return (
      <Card className="overflow-hidden bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
        <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
          <p className="text-gray-500 mt-4 text-sm sm:text-base">No vital signs data available</p>
        </CardContent>
      </Card>
    )
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
      case "declining":
        return <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
      default:
        return <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
    }
  }

  return (
    <Card className={cn(
      "overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm transition-all duration-700",
      isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
    )}>
      <CardHeader className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-indigo-900/95"></div>
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl -translate-y-10 sm:-translate-y-16 lg:-translate-y-20 translate-x-10 sm:translate-x-16 lg:translate-x-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-tr from-indigo-400/15 to-cyan-400/15 rounded-full blur-lg translate-y-8 sm:translate-y-12 lg:translate-y-16 -translate-x-8 sm:-translate-x-12 lg:-translate-x-16 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-12 h-12 sm:w-18 sm:h-18 lg:w-24 lg:h-24 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-md -translate-x-6 sm:-translate-x-9 lg:-translate-x-12 -translate-y-6 sm:-translate-y-9 lg:-translate-y-12 animate-bounce"></div>
        
        {/* Floating particles */}
        <div className="absolute top-2 sm:top-4 right-10 sm:right-20 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-300/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-3 sm:bottom-6 right-16 sm:right-32 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-300/50 rounded-full animate-pulse"></div>
        <div className="absolute top-4 sm:top-8 left-20 sm:left-40 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-cyan-300/60 rounded-full animate-bounce"></div>
        
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between relative z-10 py-2 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-md border border-white/20 shadow-lg">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">Health Analytics</h2>
              <p className="text-blue-200/80 text-xs sm:text-sm font-medium">Real-time monitoring</p>
            </div>
          </div>
          
          <div className={cn(
            "flex items-center space-x-2 sm:space-x-3 rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md border shadow-lg transition-all duration-300 self-start sm:self-auto",
            trend === "improving" ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-100" :
            trend === "declining" ? "bg-red-500/20 border-red-400/30 text-red-100" :
            "bg-white/10 border-white/20 text-white"
          )}>
            <div className="relative">
              {getTrendIcon()}
              {trend === "improving" && (
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-300 rounded-full animate-ping"></div>
              )}
              {trend === "declining" && (
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-300 rounded-full animate-ping"></div>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs sm:text-sm font-bold capitalize block">{trend}</span>
              <span className="text-xs opacity-75 block sm:hidden lg:block">Trend Status</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Main Health Score Circle */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="relative inline-flex items-center justify-center">
            <div className={cn(
              "relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full flex items-center justify-center border-3 sm:border-4 shadow-2xl transition-all duration-1000",
              getScoreColor(healthScore),
              "hover:scale-105 hover:shadow-3xl"
            )}>
              <div className={cn(
                "absolute inset-1.5 sm:inset-2 rounded-full opacity-20",
                getScoreGradient(healthScore)
              )}></div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold relative z-10 transition-all duration-300">
                {animatedScore}
              </span>
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
                <div className={cn(
                  "p-1.5 sm:p-2 rounded-full shadow-lg transition-all duration-300",
                  getScoreColor(healthScore)
                )}>
                  {getRiskIcon(healthScore)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <div className="relative">
              <Progress 
                value={animatedScore} 
                className="w-full h-2 sm:h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner" 
              />
              <div className={cn(
                "absolute top-0 left-0 h-full rounded-full transition-all duration-1000 shadow-sm",
                getScoreGradient(healthScore)
              )} style={{ width: `${animatedScore}%` }}></div>
            </div>
            <p className="text-base sm:text-lg font-semibold text-gray-700">Overall Health Score</p>
          </div>
        </div>

        {/* Risk Assessment Card */}
        <div className={cn(
          "p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border-2 shadow-lg transition-all duration-500 hover:shadow-xl relative overflow-hidden",
          getScoreColor(healthScore)
        )}>
          <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/10 rounded-full -translate-y-6 sm:-translate-y-8 lg:-translate-y-10 translate-x-6 sm:translate-x-8 lg:translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
              {getRiskIcon(healthScore)}
              <h4 className="text-lg sm:text-xl font-bold">{riskAssessment.level}</h4>
            </div>
            <p className="text-xs sm:text-sm opacity-90">{riskAssessment.description}</p>
          </div>
        </div>

        {/* Individual Vital Scores Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[
            {
              icon: <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />,
              label: "Blood Pressure",
              value: Math.round(
                (calculateVitalScore(latestVitals.bloodPressure.systolic, "bloodPressure", "systolic") +
                  calculateVitalScore(latestVitals.bloodPressure.diastolic, "bloodPressure", "diastolic")) / 2
              ),
              gradient: "from-blue-500 to-cyan-500"
            },
            {
              icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />,
              label: "Heart Rate",
              value: Math.round(calculateVitalScore(latestVitals.heartRate, "heartRate")),
              gradient: "from-red-500 to-pink-500"
            },
            {
              icon: <Thermometer className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />,
              label: "Temperature",
              value: Math.round(calculateVitalScore(latestVitals.temperature, "temperature")),
              gradient: "from-orange-500 to-amber-500"
            },
            {
              icon: <Weight className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />,
              label: "Weight Trend",
              value: 85,
              gradient: "from-green-500 to-emerald-500"
            }
          ].map((vital, index) => (
            <div 
              key={vital.label}
              className={cn(
                "p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
                `animation-delay-${index * 100}`
              )}
            >
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                  {vital.icon}
                </div>
                <span className="font-semibold text-gray-700 text-xs sm:text-sm">{vital.label}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="relative flex-1 bg-gray-100 rounded-full h-1.5 sm:h-2 mr-2 sm:mr-3 overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000", vital.gradient)}
                      style={{ width: `${vital.value}%` }}
                    ></div>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-600">{vital.value}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Health Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <h4 className="font-bold text-blue-900 text-base sm:text-lg">AI Health Insights</h4>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {[
              healthScore >= 80 && "✨ Excellent vital signs - continue current care plan",
              healthScore < 80 && healthScore >= 60 && "📊 Monitor blood pressure trends closely",
              healthScore < 60 && "⚕️ Consider adjusting medication dosages",
              trend === "improving" && "📈 Patient showing positive health trends",
              trend === "declining" && "⚠️ Declining trend requires immediate attention",
              "🔄 Next assessment recommended within 24-48 hours"
            ].filter(Boolean).map((insight, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white/70 rounded-lg transition-all duration-300 hover:bg-white/90",
                  `animation-delay-${(index + 5) * 100}`
                )}
              >
                <span className="text-xs sm:text-sm text-blue-800 leading-relaxed">{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}