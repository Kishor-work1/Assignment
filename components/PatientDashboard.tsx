"use client"

import { Sidebar } from "@/components/Sidebar"
import VitalsChart from "./VitalsChart"
import { MedicationCard } from "@/components/MedicationCard"
import { AppointmentCalendar } from "@/components/AppointmentCalendar"
import { PatientSelector } from "@/components/PatientSelector"
import { AddVitalForm } from "@/components/AddVitalForm"
import { SearchAndFilter } from "@/components/SearchAndFilter"
import HealthScore from "./HealthScore"
import { SmartAlerts } from "@/components/SmartAlerts"
import MedicationManagement from "./MedicationManagement"
import { usePatient } from "@/context/PatientContext"
import { PatientHeader } from "./PatientHeader"

export function PatientDashboard() {
  const { selectedPatient, activeSection, normalRanges, criticalRanges, filteredData, searchQuery } =
    usePatient()

  if (!selectedPatient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No patient selected</p>
      </div>
    )
  }

  const getSmartAlerts = () => {
    const alerts = []
    const latestVitals = selectedPatient.vitals[selectedPatient.vitals.length - 1]
    const now = new Date()

    // Critical vital signs alerts
    if (latestVitals) {
      if (latestVitals.bloodPressure.systolic > criticalRanges.bloodPressure.systolic.critical_high) {
        alerts.push({ type: "critical" as const, message: "Critical: Systolic BP dangerously high", category: "vitals" as const })
      }
      if (latestVitals.heartRate > criticalRanges.heartRate.critical_high) {
        alerts.push({ type: "critical" as const, message: "Critical: Heart rate dangerously elevated", category: "vitals" as const })
      }
      if (latestVitals.temperature > criticalRanges.temperature.critical_high) {
        alerts.push({ type: "critical" as const, message: "Critical: High fever detected", category: "vitals" as const })
      }
    }

    // Medication reminders
    selectedPatient.medications.forEach((med) => {
      const overdueSchedules = med.schedule.filter((s: { date: string; time: string; taken: boolean }) => {
        const scheduleDateTime = new Date(`${s.date}T${s.time}`)
        return !s.taken && scheduleDateTime < now
      })
      if (overdueSchedules.length > 0) {
        alerts.push({
          type: "warning" as const,
          message: `Medication overdue: ${med.name} (${overdueSchedules.length} missed doses)`,
          category: "medication" as const,
        })
      }
    })

    // Appointment reminders
    selectedPatient.appointments.forEach((apt) => {
      const aptDate = new Date(`${apt.date}T${apt.time}`)
      const timeDiff = aptDate.getTime() - now.getTime()
      const hoursDiff = timeDiff / (1000 * 3600)

      if (apt.status === "scheduled" && hoursDiff > 0 && hoursDiff <= 24) {
        alerts.push({
          type: "info" as const,
          message: `Upcoming appointment: ${apt.type} with ${apt.doctor} in ${Math.round(hoursDiff)} hours`,
          category: "appointment" as const,
        })
      }
    })

    return alerts
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <AddVitalForm />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VitalsChart />
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Medications</h3>
                  <div className="space-y-3">
                    {selectedPatient.medications.slice(0, 2).map((medication) => (
                      <MedicationCard key={medication.id} medication={medication} />
                    ))}
                  </div>
                </div>
                <AppointmentCalendar appointments={selectedPatient.appointments} />
              </div>
            </div>
          </div>
        )

      case "vitals":
        return <VitalsChart detailed={true} />

      case "medications":
        return <MedicationManagement />

      case "appointments":
        const appointmentData = activeSection === "appointments" ? filteredData : selectedPatient.appointments
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
            {appointmentData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No appointments found matching your search criteria</p>
              </div>
            ) : (
              <AppointmentCalendar appointments={appointmentData} detailed={true} />
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className={`flex flex-col sm:flex-row items-center bg-white border-b border-gray-200 p-4 gap-4 lg:pl-4 ${activeSection === "overview" ? "pl-16" : "pl-4"}`}>
          <div className="w-full sm:flex-1 items-center">
            <PatientSelector />
          </div>
          {activeSection !== "overview" && (
            <div className="w-full sm:flex-1">
              <SearchAndFilter />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {activeSection === "overview" && (
              <>
                <SmartAlerts alerts={getSmartAlerts()} />
                <PatientHeader />
                <HealthScore/>
              </>
            )}
            {renderSectionContent()}                                                                           
          </div>
        </div>
      </div>
    </div>
  )
}
