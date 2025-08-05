"use client"

import { Activity, Calendar, Pill, User, AlertTriangle, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePatient } from "@/context/PatientContext"
import { useState, useEffect, useRef } from "react"

export function Sidebar() {
  const { activeSection, setActiveSection, selectedPatient } = usePatient()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const menuItems = [
    { id: "overview", label: "Overview", icon: User, description: "Patient information" },
    { id: "vitals", label: "Vital Signs", icon: Activity, description: "Health metrics" },
    { id: "medications", label: "Medications", icon: Pill, description: "Prescriptions" },
    { id: "appointments", label: "Appointments", icon: Calendar, description: "Scheduled visits" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200 shadow-red-100"
      case "monitoring":
        return "bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-800 border-amber-200 shadow-amber-100"
      case "stable":
        return "bg-gradient-to-r from-emerald-50 to-green-100 text-emerald-800 border-emerald-200 shadow-emerald-100"
      default:
        return "bg-gradient-to-r from-slate-50 to-gray-100 text-slate-800 border-slate-200 shadow-slate-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="w-4 h-4" />
      case "monitoring":
        return <Activity className="w-4 h-4" />
      case "stable":
        return <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
      default:
        return <div className="w-4 h-4 bg-slate-400 rounded-full" />
    }
  }

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  if (!selectedPatient) return null

  const handleMenuClick = (sectionId: string) => {
    setActiveSection(sectionId)
    setIsMobileMenuOpen(false) 
  }

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-3 left-1 z-40 p-3 cursor-pointer bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm"
      >
        <Menu className="w-5 h-5 text-slate-700" />
      </button>

      {/* Mobile Overlay*/}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-30 animate-in fade-in duration-300"
          onClick={handleCloseMenu}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col transform transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none lg:bg-gradient-to-b lg:from-white lg:via-slate-50/50 lg:to-white lg:border-slate-200/60 lg:backdrop-blur-sm",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0", 
          "w-64 lg:w-64 md:w-56 sm:w-48"
        )}
      >
        {/* Header Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5 rounded-b-3xl transform rotate-1 hidden lg:block"></div>
          <div className="relative p-6 border-b border-slate-200 bg-white lg:bg-gradient-to-br lg:from-white/90 lg:to-slate-50/90 lg:backdrop-blur-sm lg:border-slate-200/60">
            <div className="flex items-center justify-between relative">
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/25 group-hover:shadow-blue-600/40 transition-all duration-300">
                    <Activity className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  {/* <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full animate-pulse"></div> */}
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    HealthCare
                  </h1>
                  <p className="text-sm text-slate-600 font-medium">Patient Dashboard</p>
                </div>
              </div>
              {/* Close button */}
              {isMobileMenuOpen && (
                <button
                  onClick={handleCloseMenu}
                  className="absolute top-1 right-1 lg:hidden p-2 cursor-pointer hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 hover:scale-110 group"
                >
                  <X className="w-5 h-5 text-slate-600 group-hover:text-red-600 transition-colors duration-300" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Patient Status */}
        <div className="p-4">
          <div className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
            <div className={cn(
              "relative px-4 py-3 rounded-xl text-sm font-semibold capitalize border shadow-sm transition-all duration-300 hover:shadow-md group-hover:scale-105",
              getStatusColor(selectedPatient.status)
            )}>
              <div className="flex items-center space-x-2">
                {getStatusIcon(selectedPatient.status)}
                <span>Patient Status: {selectedPatient.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 pb-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-2">
            Navigation
          </div>
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <div
                key={item.id}
                className="relative group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 text-sm lg:text-base cursor-pointer relative overflow-hidden group/btn",
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200/60 shadow-lg shadow-blue-100/50 scale-105"
                      : "text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:text-slate-900 hover:shadow-md hover:scale-102 border border-transparent hover:border-slate-200/60",
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl"></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-full group-hover/btn:translate-x-[-200%] transition-transform duration-700"></div>
                  
                  <div className={cn(
                    "relative w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                    isActive 
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25" 
                      : "bg-gradient-to-br from-slate-100 to-slate-200 group-hover/btn:from-blue-100 group-hover/btn:to-indigo-100"
                  )}>
                    <Icon className={cn(
                      "w-4 h-4 transition-all duration-300",
                      isActive 
                        ? "text-white scale-110" 
                        : "text-slate-600 group-hover/btn:text-blue-600 group-hover/btn:scale-110"
                    )} />
                  </div>
                  
                  <div className="relative flex-1 min-w-0">
                    <span className={cn(
                      "font-semibold truncate block transition-all duration-300",
                      isActive ? "text-blue-800" : "group-hover/btn:text-slate-900"
                    )}>
                      {item.label}
                    </span>
                    <span className={cn(
                      "text-xs truncate block transition-all duration-300",
                      isActive ? "text-blue-600" : "text-slate-500 group-hover/btn:text-slate-700"
                    )}>
                      {item.description}
                    </span>
                  </div>

                  {isActive && (
                    <div className="relative w-2 h-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
                  )}
                </button>
              </div>
            )
          })}
        </nav>

        {/* Footer Accent */}
        <div className="relative p-4">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-lg"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-sm"></div>
        </div>
      </div>
    </>
  )
}