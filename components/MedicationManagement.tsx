"use client"

import { useState } from "react"
import { Pill, Plus, Clock, Check, X, User, Calendar, TrendingUp, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Mock data for demonstration
const mockPatient = {
  id: "P001",
  name: "John Smith",
  medications: [
    {
      id: "M1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      instructions: "Take with food in the morning",
      prescribedBy: "Dr. Johnson",
      prescribedDate: "2024-01-15",
      status: "active",
      schedule: [
        { date: "2025-08-05", time: "08:00", taken: true },
        { date: "2025-08-06", time: "08:00", taken: false },
        { date: "2025-08-07", time: "08:00", taken: false },
        { date: "2025-08-08", time: "08:00", taken: false },
        { date: "2025-08-09", time: "08:00", taken: false },
        { date: "2025-08-10", time: "08:00", taken: false },
        { date: "2025-08-11", time: "08:00", taken: false }
      ]
    },
    {
      id: "M2",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      instructions: "Take with meals",
      prescribedBy: "Dr. Wilson",
      prescribedDate: "2024-02-01",
      status: "active",
      schedule: [
        { date: "2025-08-05", time: "08:00", taken: true },
        { date: "2025-08-05", time: "20:00", taken: true },
        { date: "2025-08-06", time: "08:00", taken: false },
        { date: "2025-08-06", time: "20:00", taken: false },
        { date: "2025-08-07", time: "08:00", taken: false },
        { date: "2025-08-07", time: "20:00", taken: false }
      ]
    }
  ]
}

export default function MedicationManagement() {
  const [selectedPatient, setSelectedPatient] = useState(mockPatient)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    instructions: "",
    prescribedBy: "",
  })

  if (!selectedPatient) return null

  const handleMarkTaken = (medicationId: string, scheduleIndex: number, taken: boolean) => {
    setSelectedPatient(prev => ({
      ...prev,
      medications: prev.medications.map(med => 
        med.id === medicationId 
          ? {
              ...med,
              schedule: med.schedule.map((s, idx) => 
                idx === scheduleIndex ? { ...s, taken } : s
              )
            }
          : med
      )
    }))
  }

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency) return

    const medication = {
      id: `M${Date.now()}`,
      ...newMedication,
      prescribedDate: new Date().toISOString().split("T")[0],
      status: "active",
      schedule: generateSchedule(newMedication.frequency),
    }

    setSelectedPatient(prev => ({
      ...prev,
      medications: [...prev.medications, medication]
    }))
    setNewMedication({ name: "", dosage: "", frequency: "", instructions: "", prescribedBy: "" })
    setShowAddForm(false)
  }

  const generateSchedule = (frequency: string) => {
    const schedule = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]

      if (frequency === "Once daily") {
        schedule.push({ date: dateStr, time: "08:00", taken: false })
      } else if (frequency === "Twice daily") {
        schedule.push({ date: dateStr, time: "08:00", taken: false })
        schedule.push({ date: dateStr, time: "20:00", taken: false })
      } else if (frequency === "Three times daily") {
        schedule.push({ date: dateStr, time: "08:00", taken: false })
        schedule.push({ date: dateStr, time: "14:00", taken: false })
        schedule.push({ date: dateStr, time: "20:00", taken: false })
      }
    }
    return schedule
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100"
      case "paused":
        return "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100"
      case "discontinued":
        return "bg-rose-50 text-rose-700 border-rose-200 shadow-rose-100"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 shadow-slate-100"
    }
  }

  const getAdherenceRate = (schedule: Array<{ taken: boolean }>) => {
    if (schedule.length === 0) return 0
    return Math.round((schedule.filter((s) => s.taken).length / schedule.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        {/* Animated Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-2xl sm:rounded-3xl transform -rotate-1"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse">
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-bounce" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      Medication Management
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600">Smart prescription tracking & adherence monitoring</p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setShowAddForm(true)} 
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center sm:justify-start space-x-2">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-semibold text-sm sm:text-base">Add Prescription</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Animated Add Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-xs sm:max-w-lg md:max-w-2xl animate-in slide-in-from-bottom-4 duration-500 max-h-[90vh] overflow-y-auto">
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100/50 p-4 sm:p-6">
                  <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Add New Prescription
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowAddForm(false)} 
                      className="hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 hover:scale-110 h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3 group">
                      <Label htmlFor="medName" className="text-sm font-semibold text-slate-700">Medication Name</Label>
                      <Input
                        id="medName"
                        value={newMedication.name}
                        onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                        placeholder="e.g., Lisinopril"
                        className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-300 group-hover:border-slate-300"
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-3 group">
                      <Label htmlFor="dosage" className="text-sm font-semibold text-slate-700">Dosage</Label>
                      <Input
                        id="dosage"
                        value={newMedication.dosage}
                        onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                        placeholder="e.g., 10mg"
                        className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-300 group-hover:border-slate-300"
                      />
                    </div>
                    <div className="space-y-2 sm:space-y-3 group">
                      <Label htmlFor="frequency" className="text-sm font-semibold text-slate-700">Frequency</Label>
                      <Select
                        value={newMedication.frequency}
                        onValueChange={(value) => setNewMedication({ ...newMedication, frequency: value })}
                      >
                        <SelectTrigger className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-300 group-hover:border-slate-300">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-200">
                          <SelectItem value="Once daily">Once daily</SelectItem>
                          <SelectItem value="Twice daily">Twice daily</SelectItem>
                          <SelectItem value="Three times daily">Three times daily</SelectItem>
                          <SelectItem value="As needed">As needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:space-y-3 group">
                      <Label htmlFor="prescribedBy" className="text-sm font-semibold text-slate-700">Prescribed By</Label>
                      <Input
                        id="prescribedBy"
                        value={newMedication.prescribedBy}
                        onChange={(e) => setNewMedication({ ...newMedication, prescribedBy: e.target.value })}
                        placeholder="e.g., Dr. Smith"
                        className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-300 group-hover:border-slate-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3 group col-span-full">
                    <Label htmlFor="instructions" className="text-sm font-semibold text-slate-700">Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={newMedication.instructions}
                      onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                      placeholder="e.g., Take with food"
                      rows={3}
                      className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl transition-all duration-300 group-hover:border-slate-300 resize-none"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAddForm(false)} 
                      className="px-6 py-2.5 rounded-xl border-slate-200 hover:bg-slate-50 transition-all duration-300 hover:scale-105 order-2 sm:order-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddMedication} 
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:scale-105 order-1 sm:order-2"
                    >
                      Add Medication
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Medications Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
          {selectedPatient.medications.map((medication, index) => {
            const adherenceRate = getAdherenceRate(medication.schedule)
            const todaySchedule = medication.schedule.filter((s) => s.date === new Date().toISOString().split("T")[0])

            return (
              <div
                key={medication.id}
                className="group animate-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group-hover:bg-white">
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                        <div className="relative">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
                            <Pill className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-300 truncate">
                            {medication.name}
                          </h3>
                          <p className="text-slate-600 font-medium text-base sm:text-lg">
                            {medication.dosage} • {medication.frequency}
                          </p>
                          <div className="flex items-center space-x-2 text-slate-500">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm truncate">Prescribed by {medication.prescribedBy}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end space-x-4 sm:space-x-0 sm:space-y-4 w-full sm:w-auto">
                        <Badge className={cn("px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl shadow-sm flex-shrink-0", getStatusColor(medication.status))}>
                          {medication.status}
                        </Badge>
                        <div className="text-right space-y-1">
                          <div className="flex items-center space-x-2 text-slate-600 justify-end">
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-xs sm:text-sm font-medium">Adherence</span>
                          </div>
                          <div className="relative">
                            <p className={cn(
                              "text-2xl sm:text-3xl font-bold transition-colors duration-300",
                              adherenceRate >= 80 ? "text-emerald-600" : adherenceRate >= 60 ? "text-amber-600" : "text-rose-600"
                            )}>
                              {adherenceRate}%
                            </p>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    {medication.instructions && (
                      <div className="mb-6 sm:mb-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl transform rotate-1"></div>
                        <div className="relative bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-blue-100/50">
                          <p className="text-blue-800 font-medium text-sm sm:text-base">
                            <strong className="text-blue-900">Instructions:</strong> {medication.instructions}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Today's Schedule */}
                    <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                      <h4 className="font-bold text-slate-900 flex items-center space-x-2 sm:space-x-3 text-base sm:text-lg">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <span>Today's Schedule</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {todaySchedule.map((schedule, index) => (
                          <div
                            key={index}
                            className={cn(
                              "group/schedule relative overflow-hidden p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 hover:scale-105",
                              schedule.taken 
                                ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-emerald-100" 
                                : "bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 hover:border-blue-300 hover:shadow-lg"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="space-y-1 flex-1 min-w-0">
                                <p className="font-bold text-slate-900 text-base sm:text-lg">{schedule.time}</p>
                                <p className="text-slate-600 font-medium text-sm sm:text-base truncate">{medication.dosage}</p>
                              </div>
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                {schedule.taken ? (
                                  <div className="flex items-center space-x-2 text-emerald-600">
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                    </div>
                                    <span className="font-semibold text-sm sm:text-base hidden sm:inline">Taken</span>
                                  </div>
                                ) : (
                                  <div className="flex space-x-1 sm:space-x-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleMarkTaken(medication.id, index, true)}
                                      className="w-6 h-6 sm:w-8 sm:h-8 p-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-110"
                                    >
                                      <Check className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleMarkTaken(medication.id, index, false)}
                                      className="w-6 h-6 sm:w-8 sm:h-8 p-0 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-lg hover:shadow-rose-500/40 transition-all duration-300 hover:scale-110"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 7-Day Timeline */}
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="font-bold text-slate-900 flex items-center space-x-2 sm:space-x-3 text-base sm:text-lg">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <span>7-Day Schedule Timeline</span>
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        {Array.from(new Set(medication.schedule.map((s) => s.date))).map((date, dateIndex) => {
                          const daySchedule = medication.schedule.filter((s) => s.date === date)
                          const dayTaken = daySchedule.filter((s) => s.taken).length
                          const dayTotal = daySchedule.length

                          return (
                            <div 
                              key={date} 
                              className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 group/day"
                              style={{ animationDelay: `${dateIndex * 100}ms` }}
                            >
                              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl shadow-sm flex items-center justify-center font-bold text-slate-700 group-hover/day:bg-blue-50 transition-colors duration-300 flex-shrink-0">
                                  <span className="text-sm sm:text-base">{new Date(date).getDate()}</span>
                                </div>
                                <div className="space-y-1 flex-1 min-w-0">
                                  <span className="font-bold text-slate-900 text-sm sm:text-base block truncate">
                                    {new Date(date).toLocaleDateString("en-US", {
                                      weekday: window.innerWidth < 640 ? "short" : "long",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                  <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
                                    {daySchedule.map((schedule, idx) => (
                                      <div
                                        key={idx}
                                        className={cn(
                                          "w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 hover:scale-125 shadow-sm flex-shrink-0",
                                          schedule.taken 
                                            ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-200" 
                                            : "bg-gradient-to-br from-slate-300 to-slate-400"
                                        )}
                                        title={`${schedule.time} - ${schedule.taken ? "Taken" : "Not taken"}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <span className="font-bold text-slate-600 text-sm sm:text-base">
                                  {dayTaken}/{dayTotal}
                                </span>
                                <p className="text-xs sm:text-sm text-slate-500">taken</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {selectedPatient.medications.length === 0 && (
          <div className="animate-in fade-in duration-1000">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden">
              <CardContent className="text-center py-12 sm:py-16 md:py-20 px-4 sm:px-8">
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl sm:rounded-3xl flex items-center justify-center animate-pulse">
                      <Pill className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center animate-bounce">
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">No medications prescribed</h3>
                    <p className="text-slate-600 text-base sm:text-lg px-4">Add your first prescription to get started with smart medication tracking</p>
                  </div>
                  <Button 
                    onClick={() => setShowAddForm(true)} 
                    className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:scale-105 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-semibold text-base sm:text-lg">Add First Medication</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}