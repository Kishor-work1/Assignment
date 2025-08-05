"use client"

import { Search, Filter, X, Calendar, Pill, Activity } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePatient } from "@/context/PatientContext"
import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

interface FilterOptions {
  status?: string
  dateRange?: string
  type?: string
  priority?: string
}

export function SearchAndFilter() {
  const { searchQuery, setSearchQuery, activeSection, filteredData } = usePatient()
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({})

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Update context search query when debounced query changes
  useEffect(() => {
    setSearchQuery(debouncedQuery)
  }, [debouncedQuery, setSearchQuery])

  const getSearchPlaceholder = () => {
    switch (activeSection) {
      case "medications":
        return "Search medications, dosage, doctor..."
      case "appointments":
        return "Search appointments, doctors, specialty..."
      case "vitals":
        return "Search by date, values, type..."
      default:
        return "Search..."
    }
  }

  const getFilterOptions = () => {
    switch (activeSection) {
      case "medications":
        return {
          status: [
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "paused", label: "Paused" },
            { value: "discontinued", label: "Discontinued" }
          ],
          type: [
            { value: "all", label: "All Types" },
            { value: "Once daily", label: "Once Daily" },
            { value: "Twice daily", label: "Twice Daily" },
            { value: "Three times daily", label: "Three Times Daily" }
          ]
        }
      case "appointments":
        return {
          status: [
            { value: "all", label: "All Status" },
            { value: "scheduled", label: "Scheduled" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" }
          ],
          priority: [
            { value: "all", label: "All Priority" },
            { value: "high", label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" }
          ]
        }
      case "vitals":
        return {
          type: [
            { value: "all", label: "All Vitals" },
            { value: "bloodPressure", label: "Blood Pressure" },
            { value: "heartRate", label: "Heart Rate" },
            { value: "temperature", label: "Temperature" },
            { value: "weight", label: "Weight" }
          ],
          dateRange: [
            { value: "all", label: "All Time" },
            { value: "today", label: "Today" },
            { value: "week", label: "This Week" },
            { value: "month", label: "This Month" }
          ]
        }
      default:
        return {}
    }
  }

  const clearFilters = () => {
    setFilters({})
  }

  const hasActiveFilters = Object.values(filters).some(value => value && value !== "all")

  const filterOptions = getFilterOptions()

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={getSearchPlaceholder()}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2",
              showFilters && "bg-blue-50 border-blue-200 text-blue-700"
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Filter Options</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterOptions.status && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.status.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterOptions.type && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Type</label>
                <Select
                  value={filters.type || "all"}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.type.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterOptions.priority && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <Select
                  value={filters.priority || "all"}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.priority.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterOptions.dateRange && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date Range</label>
                <Select
                  value={filters.dateRange || "all"}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.dateRange.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Summary */}
      {searchQuery || hasActiveFilters ? (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>Showing {filteredData.length} results</span>
            {(searchQuery || hasActiveFilters) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  clearFilters()
                }}
                className="text-gray-500 hover:text-gray-700 h-auto p-1"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
          
          {searchQuery && (
            <div className="flex items-center gap-1">
              <Search className="w-3 h-3" />
              <span>"{searchQuery}"</span>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
