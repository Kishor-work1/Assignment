"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, AlertCircle } from "lucide-react"
import { usePatient } from "@/context/PatientContext"

export function AddVitalForm() {
  const { selectedPatient, addVitalSigns } = usePatient()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    systolic: "",
    diastolic: "",
    heartRate: "",
    temperature: "",
    weight: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!selectedPatient) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Blood pressure validation
    const systolic = Number.parseInt(formData.systolic)
    const diastolic = Number.parseInt(formData.diastolic)
    if (!systolic || systolic < 50 || systolic > 250) {
      newErrors.systolic = "Systolic BP must be between 50-250 mmHg"
    }
    if (!diastolic || diastolic < 30 || diastolic > 150) {
      newErrors.diastolic = "Diastolic BP must be between 30-150 mmHg"
    }
    if (systolic && diastolic && systolic <= diastolic) {
      newErrors.systolic = "Systolic must be higher than diastolic"
    }

    // Heart rate validation
    const heartRate = Number.parseInt(formData.heartRate)
    if (!heartRate || heartRate < 30 || heartRate > 200) {
      newErrors.heartRate = "Heart rate must be between 30-200 bpm"
    }

    // Temperature validation
    const temperature = Number.parseFloat(formData.temperature)
    if (!temperature || temperature < 90 || temperature > 110) {
      newErrors.temperature = "Temperature must be between 90-110°F"
    }

    // Weight validation
    const weight = Number.parseFloat(formData.weight)
    if (!weight || weight < 20 || weight > 300) {
      newErrors.weight = "Weight must be between 20-300 kg"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newVital = {
      date: new Date().toISOString().split("T")[0],
      bloodPressure: {
        systolic: Number.parseInt(formData.systolic),
        diastolic: Number.parseInt(formData.diastolic),
      },
      heartRate: Number.parseInt(formData.heartRate),
      temperature: Number.parseFloat(formData.temperature),
      weight: Number.parseFloat(formData.weight),
    }

    addVitalSigns(selectedPatient.id, newVital)
    setFormData({
      systolic: "",
      diastolic: "",
      heartRate: "",
      temperature: "",
      weight: "",
    })
    setIsSubmitting(false)
    setIsOpen(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (!isOpen) {
    return (
      <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="flex items-center justify-center p-6">
          <Button
            onClick={() => setIsOpen(true)}
            variant="ghost"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Vital Signs</span>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Add Vital Signs
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="systolic">Systolic BP (mmHg)</Label>
              <Input
                id="systolic"
                type="number"
                value={formData.systolic}
                onChange={(e) => handleInputChange("systolic", e.target.value)}
                className={errors.systolic ? "border-red-500" : ""}
                placeholder="120"
              />
              {errors.systolic && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.systolic}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diastolic">Diastolic BP (mmHg)</Label>
              <Input
                id="diastolic"
                type="number"
                value={formData.diastolic}
                onChange={(e) => handleInputChange("diastolic", e.target.value)}
                className={errors.diastolic ? "border-red-500" : ""}
                placeholder="80"
              />
              {errors.diastolic && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.diastolic}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
              <Input
                id="heartRate"
                type="number"
                value={formData.heartRate}
                onChange={(e) => handleInputChange("heartRate", e.target.value)}
                className={errors.heartRate ? "border-red-500" : ""}
                placeholder="72"
              />
              {errors.heartRate && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.heartRate}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°F)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => handleInputChange("temperature", e.target.value)}
                className={errors.temperature ? "border-red-500" : ""}
                placeholder="98.6"
              />
              {errors.temperature && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.temperature}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                className={errors.weight ? "border-red-500" : ""}
                placeholder="70.0"
              />
              {errors.weight && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.weight}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Adding..." : "Add Vital Signs"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
