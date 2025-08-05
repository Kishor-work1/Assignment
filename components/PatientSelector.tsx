"use client"

import { ChevronDown, User, Search, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { usePatient } from "@/context/PatientContext"

export function PatientSelector() {
  const { patients, selectedPatientId, setSelectedPatientId, selectedPatient } = usePatient()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Filter patients based on debounced search term
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    patient.room.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    patient.status.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    patient.age.toString().includes(debouncedSearchTerm)
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search 
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const getStatusColor = (status:string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "monitoring":
        return "bg-yellow-100 text-yellow-800"
      case "stable":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePatientSelect = (patientId:string) => {
    setSelectedPatientId(patientId)
    setIsOpen(false)
    setSearchTerm("")
  }

  const clearSearch = () => {
    setSearchTerm("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const highlightMatch = (text:string, searchTerm:string) => {
    if (!searchTerm.trim()) return text
    
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
          {part}
        </mark>
      ) : part
    )
  }

  if (!selectedPatient) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full max-w-md p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center ring-2 ring-blue-50">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">{selectedPatient.name}</p>
            <p className="text-sm text-gray-500">Room {selectedPatient.room}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(selectedPatient.status))}>
            {selectedPatient.status}
          </div>
          <ChevronDown 
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform duration-200", 
              isOpen && "rotate-180"
            )} 
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-w-md animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients by name, room, or status..."
                className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {debouncedSearchTerm && (
              <p className="text-xs text-gray-500 mt-2">
                {filteredPatients.length} patient{filteredPatients.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          {/* Patient List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredPatients.length > 0 ? (
              <div className="py-1">
                {filteredPatients.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 cursor-pointer transition-colors duration-150",
                      patient.id === selectedPatientId && "bg-blue-100 border-r-2 border-blue-500",
                    )}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center ring-2",
                        patient.id === selectedPatientId 
                          ? "bg-gradient-to-br from-blue-100 to-blue-200 ring-blue-100" 
                          : "bg-gradient-to-br from-gray-100 to-gray-200 ring-gray-50"
                      )}>
                        <User className={cn(
                          "w-4 h-4",
                          patient.id === selectedPatientId ? "text-blue-600" : "text-gray-500"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {highlightMatch(patient.name, debouncedSearchTerm)}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {patient.age} years • Room {highlightMatch(patient.room, debouncedSearchTerm)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium transition-all duration-150",
                        getStatusColor(patient.status),
                        patient.id === selectedPatientId && "ring-1 ring-blue-200"
                      )}>
                        {highlightMatch(patient.status, debouncedSearchTerm)}
                      </div>
                      {patient.id === selectedPatientId && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-8 px-4 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No patients found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try adjusting your search terms
                </p>
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 transition-colors duration-200"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats Footer */}
          {!debouncedSearchTerm && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Total patients: {patients.length}</span>
                <div className="flex space-x-3">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
                    Critical: {patients.filter(p => p.status === 'critical').length}
                  </span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
                    Monitoring: {patients.filter(p => p.status === 'monitoring').length}
                  </span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                    Stable: {patients.filter(p => p.status === 'stable').length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}