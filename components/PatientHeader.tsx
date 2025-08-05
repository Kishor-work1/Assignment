import React, { useState, useEffect } from 'react';
import { User, Phone, Calendar, MapPin, Shield, AlertCircle, CheckCircle, Clock, Zap } from "lucide-react"
import { usePatient } from "@/context/PatientContext"

export function PatientHeader() {
  const { selectedPatient } = usePatient()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!selectedPatient) return null

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "critical":
        return {
          color: "bg-gradient-to-r from-red-500 to-rose-500 text-white border-red-300",
          bgColor: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200",
          icon: <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />,
          pulse: "animate-pulse"
        }
      case "monitoring":
        return {
          color: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300",
          bgColor: "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200",
          icon: <Clock className="w-3 h-3 sm:w-4 sm:h-4" />,
          pulse: "animate-bounce"
        }
      case "stable":
        return {
          color: "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-300",
          bgColor: "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200",
          icon: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />,
          pulse: ""
        }
      default:
        return {
          color: "bg-gradient-to-r from-gray-500 to-slate-500 text-white border-gray-300",
          bgColor: "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200",
          icon: <Shield className="w-3 h-3 sm:w-4 sm:h-4" />,
          pulse: ""
        }
    }
  }

  const statusConfig = getStatusConfig(selectedPatient.status)

  return (
    <div className={`
      relative overflow-hidden bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 
      rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/60 backdrop-blur-sm
      transition-all duration-700 hover:shadow-2xl
      ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}
    `}>
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-xl sm:blur-2xl -translate-y-10 sm:-translate-y-12 lg:-translate-y-16 translate-x-10 sm:translate-x-12 lg:translate-x-16 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-tr from-emerald-100/30 to-cyan-100/30 rounded-full blur-lg sm:blur-xl translate-y-8 sm:translate-y-10 lg:translate-y-12 -translate-x-8 sm:-translate-x-10 lg:-translate-x-12"></div>
      
      {/* Floating particles */}
      <div className="absolute top-3 sm:top-6 right-10 sm:right-20 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-300/50 rounded-full animate-ping"></div>
      <div className="absolute bottom-4 sm:bottom-8 right-16 sm:right-32 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-300/60 rounded-full animate-bounce"></div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
            {/* Enhanced Avatar */}
            <div className="relative group self-start sm:self-auto">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                <User className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-white drop-shadow-sm" />
              </div>
              <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
              </div>
              {/* Status indicator ring */}
              <div className={`absolute inset-0 rounded-xl sm:rounded-2xl border-2 ${statusConfig.color.includes('red') ? 'border-red-400/50' : statusConfig.color.includes('amber') ? 'border-amber-400/50' : 'border-emerald-400/50'} ${statusConfig.pulse}`}></div>
            </div>

            {/* Patient Info */}
            <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                {selectedPatient.name}
              </h1>
              <p className="text-gray-600 font-medium text-base sm:text-lg">
                {selectedPatient.age} years old • {selectedPatient.gender}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-xs sm:text-sm">
                <div className="flex items-center space-x-2 bg-blue-50 px-2 sm:px-3 py-1 rounded-full border border-blue-200 self-start">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="font-semibold text-blue-800 truncate">Blood Type: {selectedPatient.bloodType}</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-50 px-2 sm:px-3 py-1 rounded-full border border-purple-200 self-start">
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-600 flex-shrink-0" />
                  <span className="font-semibold text-purple-800 truncate">Room: {selectedPatient.room}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Status Badge */}
          <div className="relative self-start sm:self-auto">
            <div className={`
              flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border-2 shadow-lg
              transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm
              ${statusConfig.color}
            `}>
              <div className={statusConfig.pulse}>
                {statusConfig.icon}
              </div>
              <span className="whitespace-nowrap">{selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1)}</span>
            </div>
            {/* Status glow effect */}
            <div className={`absolute inset-0 rounded-lg sm:rounded-xl blur-md opacity-25 ${statusConfig.color} -z-10`}></div>
          </div>
        </div>

        {/* Enhanced Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 pt-4 sm:pt-6 border-t border-gray-200/60">
          {[
            {
              icon: <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />,
              label: "Emergency Contact",
              value: selectedPatient.emergencyContact,
              bgColor: "from-emerald-50 to-green-50",
              borderColor: "border-emerald-200"
            },
            {
              icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />,
              label: "Admission Date",
              value: new Date(selectedPatient.admissionDate).toLocaleDateString(),
              bgColor: "from-blue-50 to-cyan-50",
              borderColor: "border-blue-200"
            },
            {
              icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />,
              label: "Allergies",
              value: selectedPatient.allergies.length > 0 ? selectedPatient.allergies.join(", ") : "None",
              bgColor: selectedPatient.allergies.length > 0 ? "from-red-50 to-rose-50" : "from-gray-50 to-slate-50",
              borderColor: selectedPatient.allergies.length > 0 ? "border-red-200" : "border-gray-200"
            }
          ].map((item, index) => (
            <div 
              key={item.label}
              className={`
                group p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.bgColor} border ${item.borderColor}
                shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1
                ${isVisible ? `animate-fade-in-up` : 'opacity-0'}
              `}
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{item.label}</p>
                  <p className="text-xs sm:text-sm text-gray-700 break-words font-medium leading-relaxed">{item.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}