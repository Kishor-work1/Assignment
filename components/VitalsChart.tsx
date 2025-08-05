"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts"
import { Activity, Heart, Thermometer, Weight, TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

interface VitalsChartProps {
  detailed?: boolean
}

// Mock data for demonstration
const mockPatient = {
  id: "P001",
  name: "John Smith",
  vitals: [
    {
      date: "2025-08-01",
      bloodPressure: { systolic: 120, diastolic: 80 },
      heartRate: 72,
      temperature: 98.6,
      weight: 75.5
    },
    {
      date: "2025-08-02",
      bloodPressure: { systolic: 118, diastolic: 78 },
      heartRate: 68,
      temperature: 98.4,
      weight: 75.3
    },
    {
      date: "2025-08-03",
      bloodPressure: { systolic: 125, diastolic: 82 },
      heartRate: 75,
      temperature: 98.8,
      weight: 75.7
    },
    {
      date: "2025-08-04",
      bloodPressure: { systolic: 122, diastolic: 79 },
      heartRate: 70,
      temperature: 98.5,
      weight: 75.4
    },
    {
      date: "2025-08-05",
      bloodPressure: { systolic: 119, diastolic: 77 },
      heartRate: 73,
      temperature: 98.7,
      weight: 75.8
    }
  ]
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

export default function VitalsChart({ detailed = false }: VitalsChartProps) {
  const [selectedPatient] = useState(mockPatient)
  const [activeVital, setActiveVital] = useState("all")
  const [animateCards, setAnimateCards] = useState(false)

  useEffect(() => {
    setAnimateCards(true)
  }, [])

  if (!selectedPatient) return null

  const latestVitals = selectedPatient.vitals[selectedPatient.vitals.length - 1]
  const previousVitals = selectedPatient.vitals[selectedPatient.vitals.length - 2]

  const formatChartData = () => {
    return selectedPatient.vitals.map((vital) => ({
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
        return "text-rose-700 bg-gradient-to-br from-rose-50 to-red-50 border-rose-200 shadow-rose-100"
      case "warning":
        return "text-amber-700 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-amber-100"
      case "normal":
        return "text-emerald-700 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 shadow-emerald-100"
      default:
        return "text-slate-700 bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 shadow-slate-100"
    }
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
    if (current < previous) return <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-rose-600" />
    return <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
  }

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return "text-emerald-600"
    if (current < previous) return "text-rose-600"
    return "text-slate-600"
  }

  const chartData = formatChartData()

  const vitalsConfig = [
    {
      key: "bloodPressure",
      icon: Activity,
      title: "Blood Pressure",
      value: `${latestVitals.bloodPressure.systolic}/${latestVitals.bloodPressure.diastolic}`,
      unit: "mmHg",
      color: "blue",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      current: latestVitals.bloodPressure.systolic,
      previous: previousVitals?.bloodPressure.systolic || latestVitals.bloodPressure.systolic,
      status: getVitalStatus(latestVitals.bloodPressure.systolic, "bloodPressure")
    },
    {
      key: "heartRate",
      icon: Heart,
      title: "Heart Rate",
      value: latestVitals.heartRate,
      unit: "bpm",
      color: "red",
      gradient: "from-red-500 to-rose-600",
      bgGradient: "from-red-50 to-rose-50",
      current: latestVitals.heartRate,
      previous: previousVitals?.heartRate || latestVitals.heartRate,
      status: getVitalStatus(latestVitals.heartRate, "heartRate")
    },
    {
      key: "temperature",
      icon: Thermometer,
      title: "Temperature",
      value: latestVitals.temperature,
      unit: "°F",
      color: "orange",
      gradient: "from-orange-500 to-amber-600",
      bgGradient: "from-orange-50 to-amber-50",
      current: latestVitals.temperature,
      previous: previousVitals?.temperature || latestVitals.temperature,
      status: getVitalStatus(latestVitals.temperature, "temperature")
    },
    {
      key: "weight",
      icon: Weight,
      title: "Weight",
      value: latestVitals.weight,
      unit: "kg",
      color: "green",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      current: latestVitals.weight,
      previous: previousVitals?.weight || latestVitals.weight,
      status: "normal"
    }
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl sm:rounded-3xl transform -rotate-1"></div>
        <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Vital Signs Dashboard
                </h3>
                <p className="text-sm sm:text-base text-slate-600">Real-time monitoring & trend analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm text-slate-600 font-medium">Live monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vitals Cards */}
      {!detailed && latestVitals && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {vitalsConfig.map((vital, index) => {
            const IconComponent = vital.icon
            return (
              <div
                key={vital.key}
                className={`group relative overflow-hidden ${animateCards ? 'animate-in slide-in-from-bottom-4' : ''}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-50 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl" 
                     style={{ background: `linear-gradient(135deg, var(--${vital.color}-500), var(--${vital.color}-600))` }}></div>
                <div className={`relative p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border border-white/20 shadow-xl backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl ${vital.status === 'critical' ? 'ring-2 ring-rose-400 ring-opacity-50' : ''}`}
                     style={{ background: `linear-gradient(135deg, ${vital.bgGradient.replace('from-', 'var(--').replace(' to-', '), var(--').replace('-50', '-50)')})` }}>
                  
                  {/* Status Indicator */}
                  {vital.status === 'critical' && (
                    <div className="absolute top-2 right-2">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 animate-pulse" />
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br ${vital.gradient} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                      <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(vital.current, vital.previous)}
                      <span className={`text-xs font-medium ${getTrendColor(vital.current, vital.previous)}`}>
                        {((vital.current - vital.previous) / vital.previous * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <p className="text-xs sm:text-sm font-medium text-slate-600">{vital.title}</p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 group-hover:scale-110 transition-transform duration-300">
                          {vital.value}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500">{vital.unit}</p>
                      </div>
                      <div className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-xs font-semibold ${getStatusColor(vital.status)}`}>
                        {vital.status}
                      </div>
                    </div>
                  </div>

                  {/* Animated Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Chart Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl sm:rounded-3xl transform rotate-1"></div>
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-white/20">
          {/* Chart Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900">Trend Analysis</h4>
                <p className="text-slate-600 text-xs sm:text-sm">7-day vital signs progression</p>
              </div>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg sm:rounded-xl overflow-x-auto">
              <div className="flex space-x-1 sm:space-x-2 min-w-max">
                {["all", "bloodPressure", "heartRate", "temperature"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveVital(filter)}
                    className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg cursor-pointer text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                      activeVital === filter
                        ? "bg-white text-slate-900 shadow-md"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    {filter === "all" ? "All" : filter === "bloodPressure" ? "BP" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64 sm:h-72 lg:h-80 group">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={10}
                  fontWeight={500}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={10}
                  fontWeight={500}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    paddingTop: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                />
                {(activeVital === "all" || activeVital === "bloodPressure") && (
                  <>
                    <Area 
                      type="monotone" 
                      dataKey="systolic" 
                      stroke="#3b82f6" 
                      fill="url(#systolicGradient)"
                      strokeWidth={2} 
                      name="Systolic BP"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="diastolic" 
                      stroke="#1d4ed8" 
                      fill="url(#diastolicGradient)"
                      strokeWidth={2} 
                      name="Diastolic BP"
                      dot={{ fill: '#1d4ed8', strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, stroke: '#1d4ed8', strokeWidth: 2, fill: '#fff' }}
                    />
                  </>
                )}
                {(activeVital === "all" || activeVital === "heartRate") && (
                  <Area 
                    type="monotone" 
                    dataKey="heartRate" 
                    stroke="#ef4444" 
                    fill="url(#heartRateGradient)"
                    strokeWidth={2} 
                    name="Heart Rate"
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: '#ef4444', strokeWidth: 2, fill: '#fff' }}
                  />
                )}
                {(activeVital === "all" || activeVital === "temperature") && (
                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#f97316" 
                    fill="url(#temperatureGradient)"
                    strokeWidth={2} 
                    name="Temperature"
                    dot={{ fill: '#f97316', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: '#f97316', strokeWidth: 2, fill: '#fff' }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed View */}
      {detailed && latestVitals && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {vitalsConfig.map((vital, index) => {
            const IconComponent = vital.icon
            return (
              <div
                key={vital.key}
                className="group relative overflow-hidden animate-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border-2 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl ${getStatusColor(vital.status)}`}>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 bg-gradient-to-br ${vital.gradient} rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                      <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    {vital.status === 'critical' && (
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 animate-pulse" />
                    )}
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{vital.title}</h4>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 group-hover:scale-110 transition-transform duration-300">
                      {vital.value}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs sm:text-sm text-slate-600">{vital.unit}</p>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(vital.current, vital.previous)}
                        <span className={`text-xs font-medium ${getTrendColor(vital.current, vital.previous)}`}>
                          {((vital.current - vital.previous) / vital.previous * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-3 sm:mt-4 flex justify-center">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      vital.status === 'critical' ? 'bg-rose-100 text-rose-800' :
                      vital.status === 'warning' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {vital.status}
                    </span>
                  </div>

                  {/* Animated Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}