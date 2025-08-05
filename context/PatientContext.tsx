"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  bloodType: string
  allergies: string[]
  emergencyContact: string
  admissionDate: string
  room: string
  status: string
  vitals: any[]
  medications: any[]
  appointments: any[]
}

interface PatientContextType {
  patients: Patient[]
  normalRanges: any
  criticalRanges: any
  selectedPatientId: string
  activeSection: string
  searchQuery: string
  selectedPatient: Patient | null
  filteredData: any[]
  setSelectedPatientId: (id: string) => void
  setActiveSection: (section: string) => void
  setSearchQuery: (query: string) => void
  addVitalSigns: (patientId: string, vital: any) => void
  updateMedicationSchedule: (patientId: string, medicationId: string, scheduleIndex: number, taken: boolean) => void
  addNewMedication: (patientId: string, medication: any) => void
  addNewAppointment: (patientId: string, appointment: any) => void
  updateAppointmentStatus: (patientId: string, appointmentId: string, status: string) => void
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)

interface PatientProviderProps {
  children: ReactNode
  initialData: {
    patients: Patient[]
    normalRanges: any
    criticalRanges: any
  }
}

export function PatientProvider({ children, initialData }: PatientProviderProps) {
  const [patients, setPatients] = useState<Patient[]>(initialData.patients)
  const [selectedPatientId, setSelectedPatientId] = useState(initialData.patients[0]?.id || "")
  const [activeSection, setActiveSection] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || null

  const getFilteredData = () => {
    if (!selectedPatient) return []

    let data: any[] = []

    switch (activeSection) {
      case "medications":
        data = selectedPatient.medications || []
        break
      case "appointments":
        data = selectedPatient.appointments || []
        break
      case "vitals":
        data = selectedPatient.vitals || []
        break
      default:
        return []
    }

    // Apply search filter
    if (searchQuery) {
      data = data.filter((item) => {
        const searchLower = searchQuery.toLowerCase()

        if (activeSection === "medications") {
          return (
            item.name?.toLowerCase().includes(searchLower) ||
            item.prescribedBy?.toLowerCase().includes(searchLower) ||
            item.instructions?.toLowerCase().includes(searchLower)
          )
        } else if (activeSection === "appointments") {
          return (
            item.doctor?.toLowerCase().includes(searchLower) ||
            item.specialty?.toLowerCase().includes(searchLower) ||
            item.type?.toLowerCase().includes(searchLower) ||
            item.notes?.toLowerCase().includes(searchLower)
          )
        } else if (activeSection === "vitals") {
          return item.date?.toLowerCase().includes(searchLower)
        }

        return true
      })
    }

    return data
  }

  const addVitalSigns = (patientId: string, vital: any) => {
    setPatients((prev) =>
      prev.map((patient) => (patient.id === patientId ? { ...patient, vitals: [...patient.vitals, vital] } : patient)),
    )
  }

  const updateMedicationSchedule = (patientId: string, medicationId: string, scheduleIndex: number, taken: boolean) => {
    setPatients((prev) =>
      prev.map((patient) => {
        if (patient.id !== patientId) return patient

        return {
          ...patient,
          medications: patient.medications.map((med) => {
            if (med.id !== medicationId) return med

            const updatedSchedule = [...med.schedule]
            if (updatedSchedule[scheduleIndex]) {
              updatedSchedule[scheduleIndex] = { ...updatedSchedule[scheduleIndex], taken }
            }

            return { ...med, schedule: updatedSchedule }
          }),
        }
      }),
    )
  }

  const addNewMedication = (patientId: string, medication: any) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === patientId ? { ...patient, medications: [...patient.medications, medication] } : patient,
      ),
    )
  }

  const addNewAppointment = (patientId: string, appointment: any) => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === patientId ? { ...patient, appointments: [...patient.appointments, appointment] } : patient,
      ),
    )
  }

  const updateAppointmentStatus = (patientId: string, appointmentId: string, status: string) => {
    setPatients((prev) =>
      prev.map((patient) => {
        if (patient.id !== patientId) return patient

        return {
          ...patient,
          appointments: patient.appointments.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt)),
        }
      }),
    )
  }

  const value: PatientContextType = {
    patients,
    normalRanges: initialData.normalRanges,
    criticalRanges: initialData.criticalRanges,
    selectedPatientId,
    activeSection,
    searchQuery,
    selectedPatient,
    filteredData: getFilteredData(),
    setSelectedPatientId,
    setActiveSection,
    setSearchQuery,
    addVitalSigns,
    updateMedicationSchedule,
    addNewMedication,
    addNewAppointment,
    updateAppointmentStatus,
  }

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>
}

export function usePatient() {
  const context = useContext(PatientContext)
  if (context === undefined) {
    throw new Error("usePatient must be used within a PatientProvider")
  }
  return context
}
