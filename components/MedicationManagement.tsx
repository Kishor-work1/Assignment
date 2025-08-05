"use client"

import { useState } from "react"
import { Pill, Plus, Clock, Check, X, User, Calendar, Shield, Activity, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { usePatient } from "@/context/PatientContext"

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  instructions: string
  prescribedBy: string
  prescribedDate: string
  status: string
  schedule: Schedule[]
}

interface Schedule {
  date: string
  time: string
  taken: boolean
}

interface NewMedication {
  name: string
  dosage: string
  frequency: string
  instructions: string
  prescribedBy: string
}

export default function MedicationManagement() {
  const { patients, selectedPatient, setSelectedPatientId, addNewMedication, updateMedicationSchedule } = usePatient()
  const [showAddForm, setShowAddForm] = useState<boolean>(false)
  const [newMedication, setNewMedication] = useState<NewMedication>({
    name: "",
    dosage: "",
    frequency: "",
    instructions: "",
    prescribedBy: "",
  })

  if (!selectedPatient) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white shadow-sm border border-gray-200">
          <CardContent className="text-center py-16 px-8 space-y-6">
            <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No patient selected</h3>
            <p className="text-gray-600 mb-6">Please select a patient to view their medication management.</p>
            <div className="space-y-2">
              <Label htmlFor="patient-select" className="sr-only">
                Select Patient
              </Label>
              {/* Removed explicit generic type */}
              <Select onValueChange={setSelectedPatientId} >
                <SelectTrigger
                  id="patient-select"
                  className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} (ID: {patient.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleMarkTaken = (medicationId: string, scheduleIndex: number, taken: boolean) => {
    updateMedicationSchedule(selectedPatient.id, medicationId, scheduleIndex, taken)
  }

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency) return

    const medication: Medication = {
      id: `M${Date.now()}`,
      ...newMedication,
      prescribedDate: new Date().toISOString().split("T")[0],
      status: "active",
      schedule: generateSchedule(newMedication.frequency),
    }
    addNewMedication(selectedPatient.id, medication)
    setNewMedication({ name: "", dosage: "", frequency: "", instructions: "", prescribedBy: "" })
    setShowAddForm(false)
  }

  const generateSchedule = (frequency: string): Schedule[] => {
    const schedule: Schedule[] = []
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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "paused":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "discontinued":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getAdherenceRate = (schedule: Schedule[]): number => {
    if (schedule.length === 0) return 0
    return Math.round((schedule.filter((s) => s.taken).length / schedule.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Medication Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Patient: <span className="font-medium">{selectedPatient.name}</span> • ID: {selectedPatient.id}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="flex items-center text-sm text-gray-500">
                <Shield className="w-4 h-4 mr-1.5" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-3">
                <Label htmlFor="patient-select-header" className="sr-only">
                  Select Patient
                </Label>
                {/* Removed explicit generic type */}
                <Select onValueChange={setSelectedPatientId} value={selectedPatient.id} >
                  <SelectTrigger
                    id="patient-select-header"
                    className="w-[180px] border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
              </div>
              <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Prescription
                </Button>
            </div>
          </div>
        </div>

        {/* Add Medication Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg">
              <Card className="bg-white shadow-xl border-0">
                <CardHeader className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                  <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center flex-shrink-0">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                      <span>Add New Prescription</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddForm(false)}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="medName" className="text-sm font-medium text-gray-700">
                        Medication Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="medName"
                        value={newMedication.name}
                        onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                        placeholder="e.g., Lisinopril"
                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dosage" className="text-sm font-medium text-gray-700">
                        Dosage <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dosage"
                        value={newMedication.dosage}
                        onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                        placeholder="e.g., 10mg"
                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="frequency" className="text-sm font-medium text-gray-700">
                        Frequency <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={newMedication.frequency}
                        onValueChange={(value) => setNewMedication({ ...newMedication, frequency: value })}
                      >
                        <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Once daily">Once daily</SelectItem>
                          <SelectItem value="Twice daily">Twice daily</SelectItem>
                          <SelectItem value="Three times daily">Three times daily</SelectItem>
                          <SelectItem value="As needed">As needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prescribedBy" className="text-sm font-medium text-gray-700">
                        Prescribed By
                      </Label>
                      <Input
                        id="prescribedBy"
                        value={newMedication.prescribedBy}
                        onChange={(e) => setNewMedication({ ...newMedication, prescribedBy: e.target.value })}
                        placeholder="e.g., Dr. Smith"
                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructions" className="text-sm font-medium text-gray-700">
                      Instructions
                    </Label>
                    <Textarea
                      id="instructions"
                      value={newMedication.instructions}
                      onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
                      placeholder="e.g., Take with food in the morning"
                      rows={3}
                      className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddMedication}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Add Medication
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Medications List */}
        <div className="space-y-6">
          {selectedPatient.medications.map((medication: Medication) => {
            const adherenceRate = getAdherenceRate(medication.schedule)
            const todaySchedule = medication.schedule.filter((s) => s.date === new Date().toISOString().split("T")[0])
            return (
              <Card key={medication.id} className="bg-white shadow-sm border border-gray-200">
                <CardContent className="p-6">
                  {/* Medication Header */}
                  <div className="flex flex-col lg:flex-row items-start justify-between mb-6 space-y-4 lg:space-y-0">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Pill className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-1 sm:space-y-0">
                          <h3 className="text-xl font-semibold text-gray-900">{medication.name}</h3>
                          <Badge className={cn("text-xs px-2 py-1 w-fit", getStatusColor(medication.status))}>
                            {medication.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 font-medium">
                          {medication.dosage} • {medication.frequency}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>Prescribed by {medication.prescribedBy}</span>
                          </div>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(medication.prescribedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Adherence Rate</div>
                        <div
                          className={cn(
                            "text-2xl font-bold",
                            adherenceRate >= 80
                              ? "text-emerald-600"
                              : adherenceRate >= 60
                                ? "text-amber-600"
                                : "text-red-600",
                          )}
                        >
                          {adherenceRate}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  {medication.instructions && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 mb-1">Instructions:</p>
                          <p className="text-sm text-blue-800">{medication.instructions}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Today's Schedule */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span>Today's Schedule</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {todaySchedule.map((schedule: Schedule, index: number) => (
                        <div
                          key={index}
                          className={cn(
                            "p-4 rounded-lg border-2 transition-all duration-200",
                            schedule.taken
                              ? "bg-emerald-50 border-emerald-200"
                              : "bg-gray-50 border-gray-200 hover:border-blue-300",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{schedule.time}</p>
                              <p className="text-sm text-gray-600">{medication.dosage}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {schedule.taken ? (
                                <div className="flex items-center space-x-2 text-emerald-600">
                                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                  <span className="text-sm font-medium hidden sm:inline">Taken</span>
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleMarkTaken(medication.id, index, true)}
                                    className="w-8 h-8 p-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
                                    aria-label="Mark as taken"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleMarkTaken(medication.id, index, false)}
                                    className="w-8 h-8 p-0 border-red-300 text-red-600 hover:bg-red-50 rounded-full"
                                    aria-label="Mark as not taken"
                                  >
                                    <X className="w-4 h-4" />
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
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span>7-Day Schedule Overview</span>
                    </h4>
                    <div className="space-y-3">
                      {Array.from(new Set(medication.schedule.map((s: Schedule) => s.date))).map((date: string) => {
                        const daySchedule = medication.schedule.filter((s: Schedule) => s.date === date)
                        const dayTaken = daySchedule.filter((s: Schedule) => s.taken).length
                        const dayTotal = daySchedule.length
                        return (
                          <div
                            key={date}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center font-semibold text-gray-700 border border-gray-200 flex-shrink-0">
                                {new Date(date).getDate()}
                              </div>
                              <div>
                                <span className="font-medium text-gray-900">
                                  {new Date(date).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                                <div className="flex space-x-1 mt-1">
                                  {daySchedule.map((schedule: Schedule, idx: number) => (
                                    <div
                                      key={idx}
                                      className={cn(
                                        "w-3 h-3 rounded-full",
                                        schedule.taken ? "bg-emerald-500" : "bg-gray-300",
                                      )}
                                      title={`${schedule.time} - ${schedule.taken ? "Taken" : "Not taken"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold text-gray-900">
                                {dayTaken}/{dayTotal}
                              </span>
                              <p className="text-sm text-gray-500">doses taken</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {selectedPatient.medications.length === 0 && (
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="text-center py-16 px-8">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                  <Pill className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No medications prescribed</h3>
                  <p className="text-gray-600 mb-6">
                    Add the first prescription to begin medication tracking and monitoring.
                  </p>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Medication
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
