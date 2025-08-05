"use client"

import { PatientProvider } from "@/context/PatientContext"
import { PatientDashboard } from "@/components/PatientDashboard"
import mockData from "@/data/mockData.json"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PatientProvider initialData={mockData}>
        <PatientDashboard />
      </PatientProvider>
    </div>
  )
}
