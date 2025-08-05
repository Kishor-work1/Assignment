"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts"
import { Activity, Heart, Thermometer, Weight, TrendingUp, TrendingDown, Minus, AlertTriangle, User } from "lucide-react"
import { useState, useEffect } from "react"
import { usePatient } from "@/context/PatientContext"

interface VitalReading {
  date: string
  bloodPressure: { systolic: number; diastolic: number }
  heartRate: number
  temperature: number
  weight: number
}

interface Patient {
  id: string
  name: string
  vitals: VitalReading[]
}

interface VitalsChartProps {
  detailed?: boolean
  patientData?: Patient
  vitalsData?: VitalReading[]
}

const normalRanges = {
  heartRate: { min: 60, max: 100 },
  temperature: { min: 97.0, max: 99.0 },
  bloodPressure: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } }
}

const criticalRanges = {
  heartRate: { critical_low: 50, critical_high: 120 },
  temperature: { critical_low: 95.0, critical_high: 102.0 },
  bloodPressure: { systolic: { critical_low: 70, critical_high: 180 }, diastolic: { critical_low: 40, critical_high: 110 } }
}

export default function VitalsChart({ detailed = false }: { detailed?: boolean }) {
  const { selectedPatient } = usePatient()
  const [activeVital, setActiveVital] = useState("all")
  const [animateCards, setAnimateCards] = useState(false)

  useEffect(() => {
    setAnimateCards(true)
  }, [])

  // Use context data
  const patient = selectedPatient
  const vitals = selectedPatient?.vitals || []

  if (!vitals.length) {
    return (
      <div className="bg-gray-50 min-h-screen p-2 sm:p-4 lg:p-6 xl:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 lg:p-12">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Vital Signs Data</h2>
              <p className="text-sm sm:text-base text-gray-600">
                Please provide patient vitals data to display the dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const latestVitals = vitals[vitals.length - 1]
  const previousVitals = vitals[vitals.length - 2]

  const formatChartData = () => {
    return vitals.map((vital) => ({
      date: new Date(vital.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      systolic: vital.bloodPressure.systolic,
      diastolic: vital.bloodPressure.diastolic,
      heartRate: vital.heartRate,
      temperature: vital.temperature,
      weight: vital.weight,
    }))
  }

  const getVitalStatus = (value: number, type: string) => {
    if (type === "bloodPressure") {
      const systolic = latestVitals.bloodPressure.systolic
      const diastolic = latestVitals.bloodPressure.diastolic
      
      if (systolic <= criticalRanges.bloodPressure.systolic.critical_low || 
          systolic >= criticalRanges.bloodPressure.systolic.critical_high ||
          diastolic <= criticalRanges.bloodPressure.diastolic.critical_low || 
          diastolic >= criticalRanges.bloodPressure.diastolic.critical_high) return "critical"
      
      if (systolic < normalRanges.bloodPressure.systolic.min || 
          systolic > normalRanges.bloodPressure.systolic.max ||
          diastolic < normalRanges.bloodPressure.diastolic.min || 
          diastolic > normalRanges.bloodPressure.diastolic.max) return "warning"
      
      return "normal"
    }

    const normal = normalRanges[type as keyof typeof normalRanges]
    const critical = criticalRanges[type as keyof typeof criticalRanges]

    if ('critical_low' in critical && 'critical_high' in critical && 'min' in normal && 'max' in normal) {
      if (value <= critical.critical_low || value >= critical.critical_high) return "critical"
      if (value < normal.min || value > normal.max) return "warning"
      return "normal"
    }
    
    return "normal"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-700 bg-red-50 border-red-200"
      case "warning":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "normal":
        return "text-green-700 bg-green-50 border-green-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
    }
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (!previous) return <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
    if (current > previous) return <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
    if (current < previous) return <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
    return <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
  }

  const getTrendColor = (current: number, previous: number) => {
    if (!previous) return "text-gray-600"
    if (current > previous) return "text-green-600"
    if (current < previous) return "text-red-600"
    return "text-gray-600"
  }

  const getTrendPercentage = (current: number, previous: number) => {
    if (!previous) return "0.0"
    return ((current - previous) / previous * 100).toFixed(1)
  }

  const chartData = formatChartData()

  const vitalsConfig = [
    {
      key: "bloodPressure",
      icon: Activity,
      title: "Blood Pressure",
      value: `${latestVitals.bloodPressure.systolic}/${latestVitals.bloodPressure.diastolic}`,
      unit: "mmHg",
      color: "#2563eb",
      current: latestVitals.bloodPressure.systolic,
      previous: previousVitals?.bloodPressure.systolic,
      status: getVitalStatus(latestVitals.bloodPressure.systolic, "bloodPressure")
    },
    {
      key: "heartRate",
      icon: Heart,
      title: "Heart Rate",
      value: latestVitals.heartRate,
      unit: "bpm",
      color: "#dc2626",
      current: latestVitals.heartRate,
      previous: previousVitals?.heartRate,
      status: getVitalStatus(latestVitals.heartRate, "heartRate")
    },
    {
      key: "temperature",
      icon: Thermometer,
      title: "Temperature",
      value: latestVitals.temperature,
      unit: "°F",
      color: "#ea580c",
      current: latestVitals.temperature,
      previous: previousVitals?.temperature,
      status: getVitalStatus(latestVitals.temperature, "temperature")
    },
    {
      key: "weight",
      icon: Weight,
      title: "Weight",
      value: latestVitals.weight,
      unit: "kg",
      color: "#16a34a",
      current: latestVitals.weight,
      previous: previousVitals?.weight,
      status: "normal"
    }
  ]

  return (
    <div className="bg-gray-50 min-h-screen p-2 sm:p-4 lg:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                  {patient ? `${patient.name} - Vital Signs` : 'Patient Vital Signs'}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">Real-time monitoring and analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap">Active Monitoring</span>
            </div>
          </div>
          {patient && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Patient ID: {patient.id}</span>
              </div>
            </div>
          )}
        </div>

        {/* Vitals Cards */}
        {!detailed && latestVitals && (
          <div className="grid gap-4"
               style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {vitalsConfig.map((vital, index) => {
              const IconComponent = vital.icon
              return (
                <div
                  key={vital.key}
                  className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full ${animateCards ? 'animate-in slide-in-from-bottom-4' : ''}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                    {/* Status Indicator */}
                    {vital.status === 'critical' && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 animate-pulse" />
                      </div>
                    )}
                    
                    {/* Icon */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" 
                           style={{ backgroundColor: vital.color + '20', color: vital.color }}>
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(vital.current, vital.previous)}
                        <span className={`text-xs font-medium ${getTrendColor(vital.current, vital.previous)}`}>
                          {getTrendPercentage(vital.current, vital.previous)}%
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{vital.title}</p>
                      <div className="flex items-end justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                            {vital.value}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">{vital.unit}</p>
                        </div>
                        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(vital.status)}`}>
                          {vital.status.charAt(0).toUpperCase() + vital.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          {/* Chart Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Trend Analysis</h2>
                <p className="text-gray-600 text-xs sm:text-sm">{vitals.length}-day vital signs progression</p>
              </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="bg-gray-100 p-1 rounded-lg overflow-hidden">
              <div className="flex space-x-1 overflow-x-auto">
                {["all", "bloodPressure", "heartRate", "temperature"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveVital(filter)}
                    className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                      activeVital === filter
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    type="button"
                  >
                    {filter === "all" ? "All" : 
                     filter === "bloodPressure" ? "BP" : 
                     filter === "heartRate" ? "HR" :
                     "Temp"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 sm:h-72 lg:h-80 xl:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={10}
                  fontWeight={500}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={10}
                  fontWeight={500}
                  width={35}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '16px',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}
                />
                {(activeVital === "all" || activeVital === "bloodPressure") && (
                  <>
                    <Area 
                      type="monotone" 
                      dataKey="systolic" 
                      stroke="#2563eb" 
                      fill="url(#systolicGradient)"
                      strokeWidth={2} 
                      name="Systolic BP"
                      dot={{ fill: '#2563eb', strokeWidth: 2, r: 2 }}
                      activeDot={{ r: 4, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="diastolic" 
                      stroke="#1d4ed8" 
                      fill="url(#diastolicGradient)"
                      strokeWidth={2} 
                      name="Diastolic BP"
                      dot={{ fill: '#1d4ed8', strokeWidth: 2, r: 2 }}
                      activeDot={{ r: 4, stroke: '#1d4ed8', strokeWidth: 2, fill: '#fff' }}
                    />
                  </>
                )}
                {(activeVital === "all" || activeVital === "heartRate") && (
                  <Area 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="#dc2626" 
                    fill="url(#heartRateGradient)"
                    strokeWidth={2} 
                    name="Heart Rate"
                    dot={{ fill: '#dc2626', strokeWidth: 2, r: 2 }}
                    activeDot={{ r: 4, stroke: '#dc2626', strokeWidth: 2, fill: '#fff' }}
                  />
                )}
                {(activeVital === "all" || activeVital === "temperature") && (
                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ea580c" 
                    fill="url(#temperatureGradient)"
                    strokeWidth={2} 
                    name="Temperature"
                    dot={{ fill: '#ea580c', strokeWidth: 2, r: 2 }}
                    activeDot={{ r: 4, stroke: '#ea580c', strokeWidth: 2, fill: '#fff' }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed View */}
        {detailed && latestVitals && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {vitalsConfig.map((vital, index) => {
              const IconComponent = vital.icon
              return (
                <div
                  key={vital.key}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 animate-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`p-4 sm:p-5 lg:p-6 border-l-4 ${
                    vital.status === 'critical' ? 'border-red-500' :
                    vital.status === 'warning' ? 'border-amber-500' :
                    'border-green-500'
                  }`}>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0" 
                           style={{ backgroundColor: vital.color + '20', color: vital.color }}>
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      {vital.status === 'critical' && (
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 animate-pulse flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{vital.title}</h3>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                        {vital.value}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm text-gray-600">{vital.unit}</p>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(vital.current, vital.previous)}
                          <span className={`text-xs font-medium ${getTrendColor(vital.current, vital.previous)}`}>
                            {getTrendPercentage(vital.current, vital.previous)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-3 sm:mt-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                        vital.status === 'critical' ? 'bg-red-100 text-red-800' :
                        vital.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {vital.status}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}