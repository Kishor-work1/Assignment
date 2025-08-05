import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle, Video, Phone, Building, Stethoscope, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePatient } from "@/context/PatientContext"

interface AppointmentCalendarProps {
  appointments?: Array<{
    id: string
    date: string
    time: string
    doctor: string
    specialty: string
    type: string
    status: string
    location: string
    notes: string
  }>
  detailed?: boolean
}

export function AppointmentCalendar({ appointments: propAppointments, detailed = false }: AppointmentCalendarProps) {
  const { selectedPatient } = usePatient()
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredAppointment, setHoveredAppointment] = useState<string | null>(null)

  // Use prop appointments if provided, otherwise use patient appointments from context
  const appointments = propAppointments || selectedPatient?.appointments || []

  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!Array.isArray(appointments)) {
    return (
      <div className="bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 rounded-2xl shadow-lg border border-gray-200/60 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
        <div className="text-center py-8 sm:py-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium text-sm sm:text-base">No appointment data available</p>
        </div>
      </div>
    )
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />,
          bgGradient: "from-emerald-50 to-green-50",
          borderColor: "border-emerald-200",
          badgeColor: "bg-gradient-to-r from-emerald-500 to-green-500 text-white",
          glowColor: "shadow-emerald-200",
          pulse: ""
        }
      case "scheduled":
        return {
          icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />,
          bgGradient: "from-blue-50 to-cyan-50",
          borderColor: "border-blue-200",
          badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
          glowColor: "shadow-blue-200",
          pulse: "animate-pulse"
        }
      case "cancelled":
        return {
          icon: <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />,
          bgGradient: "from-red-50 to-rose-50",
          borderColor: "border-red-200",
          badgeColor: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
          glowColor: "shadow-red-200",
          pulse: ""
        }
      default:
        return {
          icon: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />,
          bgGradient: "from-gray-50 to-slate-50",
          borderColor: "border-gray-200",
          badgeColor: "bg-gradient-to-r from-gray-500 to-slate-500 text-white",
          glowColor: "shadow-gray-200",
          pulse: ""
        }
    }
  }

  const getAppointmentTypeIcon = (type: string) => {
    const typeStr = type.toLowerCase()
    if (typeStr.includes('video') || typeStr.includes('virtual')) {
      return <Video className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
    }
    if (typeStr.includes('phone') || typeStr.includes('call')) {
      return <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
    }
    if (typeStr.includes('checkup') || typeStr.includes('consultation')) {
      return <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
    }
    return <Building className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
  }

  const sortedAppointments = [...appointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const displayAppointments = detailed ? sortedAppointments : sortedAppointments.slice(0, 3)

  return (
    <div className={cn(
      "relative overflow-hidden bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20",
      "rounded-2xl shadow-lg border border-gray-200/60 backdrop-blur-sm",
      "transition-all duration-700",
      isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4"
    )}>
      {/* Animated background elements - Responsive sizes */}
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-2xl -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-emerald-100/20 to-cyan-100/20 rounded-full blur-xl translate-y-8 -translate-x-8 sm:translate-y-12 sm:-translate-x-12"></div>
      
      {/* Floating particles - Hidden on mobile for performance */}
      <div className="hidden sm:block absolute top-6 right-20 w-2 h-2 bg-blue-300/50 rounded-full animate-ping"></div>
      <div className="hidden sm:block absolute bottom-8 right-32 w-1.5 h-1.5 bg-purple-300/60 rounded-full animate-bounce"></div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Enhanced Header - Responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-sm" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {detailed ? "All Appointments" : "Upcoming Appointments"}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                {displayAppointments.length} {displayAppointments.length === 1 ? 'appointment' : 'appointments'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-blue-50 px-3 sm:px-4 py-2 rounded-xl border border-blue-200 self-start sm:self-auto">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-blue-800">Live Schedule</span>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-3 sm:space-y-4">
          {displayAppointments.map((appointment, index) => {
            const statusConfig = getStatusConfig(appointment.status)
            const isHovered = hoveredAppointment === appointment.id
            
            return (
              <div 
                key={appointment.id}
                className={cn(
                  "relative overflow-hidden rounded-xl sm:rounded-2xl border-2 transition-all duration-500",
                  "bg-gradient-to-br", statusConfig.bgGradient, statusConfig.borderColor,
                  "hover:shadow-xl hover:-translate-y-1 group cursor-pointer",
                  statusConfig.glowColor,
                  isVisible ? `animate-fade-in-up` : 'opacity-0'
                )}
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
                onMouseEnter={() => setHoveredAppointment(appointment.id)}
                onMouseLeave={() => setHoveredAppointment(null)}
              >
                {/* Status indicator line */}
                <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", statusConfig.badgeColor.replace('bg-gradient-to-r', '').split(' ').slice(0, 4).join(' '))}></div>
                
                {/* Floating background elements - Hidden on mobile */}
                <div className="hidden sm:block absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-y-10 translate-x-10 transition-all duration-700 group-hover:scale-150"></div>
                
                <div className="relative z-10 p-4 sm:p-5 lg:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                      {/* Enhanced Type Icon - Responsive sizes */}
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                          {getAppointmentTypeIcon(appointment.type)}
                        </div>
                        <div className={cn(
                          "absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-sm",
                          statusConfig.badgeColor, statusConfig.pulse
                        )}>
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3">
                            {statusConfig.icon}
                          </div>
                        </div>
                      </div>

                      {/* Appointment Info - Responsive text sizes */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 truncate">{appointment.type}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                          <span className="px-2 sm:px-3 py-1 bg-white/70 text-gray-800 text-xs sm:text-sm font-semibold rounded-full border border-gray-200 truncate">
                            {appointment.specialty}
                          </span>
                          <div className={cn(
                            "px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-sm self-start",
                            statusConfig.badgeColor
                          )}>
                            {appointment.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Info Grid - Responsive grid layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      {
                        icon: <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />,
                        label: "Date & Time",
                        value: `${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}`,
                        bgColor: "from-blue-50 to-cyan-50"
                      },
                      {
                        icon: <User className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />,
                        label: "Doctor",
                        value: appointment.doctor,
                        bgColor: "from-emerald-50 to-green-50"
                      },
                      {
                        icon: <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />,
                        label: "Location",
                        value: appointment.location,
                        bgColor: "from-purple-50 to-pink-50"
                      },
                      {
                        icon: <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />,
                        label: "Status",
                        value: appointment.status,
                        bgColor: "from-amber-50 to-orange-50"
                      }
                    ].map((item, itemIndex) => (
                      <div 
                        key={item.label}
                        className={cn(
                          "p-2.5 sm:p-3 bg-gradient-to-r rounded-lg sm:rounded-xl border border-white/50 shadow-sm",
                          "hover:shadow-md transition-all duration-200 hover:-translate-y-0.5",
                          item.bgColor
                        )}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="p-1.5 sm:p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                            {item.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{item.label}</p>
                            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{item.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Notes Section for Detailed View - Responsive spacing */}
                  {detailed && appointment.notes && (
                    <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/50">
                      <div className="p-3 sm:p-4 bg-white/60 rounded-lg sm:rounded-xl border border-gray-100">
                        <h5 className="font-bold text-gray-900 mb-2 flex items-center space-x-2 text-sm sm:text-base">
                          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                          <span>Notes</span>
                        </h5>
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{appointment.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Empty State - Responsive sizing */}
          {displayAppointments.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">No appointments scheduled</h4>
              <p className="text-sm sm:text-base text-gray-500">Your calendar is clear at the moment</p>
            </div>
          )}
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