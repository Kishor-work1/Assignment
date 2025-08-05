"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  Activity,
  Thermometer,
  Weight,
  Zap,
  Shield,
  AlertTriangle,
  AlertCircle,
  Brain,
} from "lucide-react";
import { usePatient } from "@/context/PatientContext";

const normalRanges = {
  bloodPressure: {
    systolic: { min: 90, max: 120 },
    diastolic: { min: 60, max: 80 },
  },
  heartRate: { min: 60, max: 100 },
  temperature: { min: 97.0, max: 99.5 },
};

const criticalRanges = {
  bloodPressure: {
    systolic: { critical_low: 70, critical_high: 180 },
    diastolic: { critical_low: 40, critical_high: 110 },
  },
  heartRate: { critical_low: 40, critical_high: 150 },
  temperature: { critical_low: 95.0, critical_high: 104.0 },
};

export default function HealthScore() {
  const { selectedPatient } = usePatient();

  const [animatedScore, setAnimatedScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const calculateVitalScore = (
    value: number,
    type: string,
    subType?: string
  ) => {
    let normal: any, critical: any;

    if (type === "bloodPressure" && subType) {
      normal =
        normalRanges.bloodPressure[
          subType as keyof typeof normalRanges.bloodPressure
        ];
      critical =
        criticalRanges.bloodPressure[
          subType as keyof typeof criticalRanges.bloodPressure
        ];
    } else {
      normal = normalRanges[type as keyof typeof normalRanges];
      critical = criticalRanges[type as keyof typeof criticalRanges];
    }

    if (value >= normal.min && value <= normal.max) return 100;

    if (value < normal.min) {
      const criticalLow = critical.critical_low;
      if (value <= criticalLow) return 0;
      return Math.max(
        0,
        (50 * (value - criticalLow)) / (normal.min - criticalLow)
      );
    } else {
      const criticalHigh = critical.critical_high;
      if (value >= criticalHigh) return 0;
      return Math.max(
        0,
        (50 * (criticalHigh - value)) / (criticalHigh - normal.max)
      );
    }
  };

  const getLatestVitals = () => {
    if (!selectedPatient?.vitals || selectedPatient.vitals.length === 0)
      return null;
    return selectedPatient.vitals[selectedPatient.vitals.length - 1];
  };

  const calculateOverallHealthScore = () => {
    const latestVitals = getLatestVitals();
    if (!latestVitals) return 0;

    const systolicScore = calculateVitalScore(
      latestVitals.bloodPressure.systolic,
      "bloodPressure",
      "systolic"
    );
    const diastolicScore = calculateVitalScore(
      latestVitals.bloodPressure.diastolic,
      "bloodPressure",
      "diastolic"
    );
    const heartRateScore = calculateVitalScore(
      latestVitals.heartRate,
      "heartRate"
    );
    const temperatureScore = calculateVitalScore(
      latestVitals.temperature,
      "temperature"
    );

    const overallScore =
      systolicScore * 0.3 +
      diastolicScore * 0.3 +
      heartRateScore * 0.25 +
      temperatureScore * 0.15;
    return Math.round(overallScore);
  };

  const getTrend = () => {
    if (!selectedPatient?.vitals || selectedPatient.vitals.length < 2)
      return "stable";

    const latest = selectedPatient.vitals[selectedPatient.vitals.length - 1];
    const previous = selectedPatient.vitals[selectedPatient.vitals.length - 2];

    const latestScore = calculateOverallHealthScore();
    const previousScore =
      calculateVitalScore(
        previous.bloodPressure.systolic,
        "bloodPressure",
        "systolic"
      ) *
        0.3 +
      calculateVitalScore(
        previous.bloodPressure.diastolic,
        "bloodPressure",
        "diastolic"
      ) *
        0.3 +
      calculateVitalScore(previous.heartRate, "heartRate") * 0.25 +
      calculateVitalScore(previous.temperature, "temperature") * 0.15;

    const diff = latestScore - previousScore;
    if (diff > 5) return "improving";
    if (diff < -5) return "declining";
    return "stable";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-100";
    if (score >= 60) return "bg-amber-50 border-amber-100";
    if (score >= 40) return "bg-orange-50 border-orange-100";
    return "bg-red-50 border-red-100";
  };

  const getRiskIcon = (score: number) => {
    if (score >= 80) return <Shield className="w-4 h-4 text-emerald-600" />;
    if (score >= 60) return <Zap className="w-4 h-4 text-amber-600" />;
    if (score >= 40)
      return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  const getRiskAssessment = (score: number) => {
    if (score >= 80)
      return {
        level: "Excellent",
        description: "All vital signs within optimal range",
        color: "text-emerald-700",
      };
    if (score >= 60)
      return {
        level: "Good",
        description: "Minor attention may be needed",
        color: "text-amber-700",
      };
    if (score >= 40)
      return {
        level: "At Risk",
        description: "Active monitoring required",
        color: "text-orange-700",
      };
    return {
      level: "Critical",
      description: "Immediate medical attention needed",
      color: "text-red-700",
    };
  };

  const healthScore = calculateOverallHealthScore();
  const trend = getTrend();
  const latestVitals = getLatestVitals();
  const riskAssessment = getRiskAssessment(healthScore);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedScore((prev) => {
          if (prev < healthScore) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return healthScore;
          }
        });
      }, 30);
      return () => clearInterval(interval);
    }, 200);
    return () => clearTimeout(timer);
  }, [healthScore]);

  if (!selectedPatient) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50">
        <Card className="p-8 text-center border-0 shadow-sm bg-white">
          <div className="animate-pulse space-y-4">
            <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
          </div>
          <p className="text-slate-500 mt-4 font-medium">No patient selected</p>
        </Card>
      </div>
    );
  }

  if (!latestVitals) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50">
        <Card className="p-8 text-center border-0 shadow-sm bg-white">
          <div className="animate-pulse space-y-4">
            <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
          </div>
          <p className="text-slate-500 mt-4 font-medium">
            No vital signs data available for {selectedPatient.name}
          </p>
        </Card>
      </div>
    );
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case "declining":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-slate-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "improving":
        return "text-emerald-700 bg-emerald-50 border-emerald-100";
      case "declining":
        return "text-red-700 bg-red-50 border-red-100";
      default:
        return "text-slate-700 bg-slate-50 border-slate-100";
    }
  };

  // Calculate weight trend from vitals data
  const getWeightTrend = () => {
    if (!selectedPatient.vitals || selectedPatient.vitals.length < 2) return 85;

    const latest = selectedPatient.vitals[selectedPatient.vitals.length - 1];
    const previous = selectedPatient.vitals[selectedPatient.vitals.length - 2];

    if (latest.weight === previous.weight) return 100;
    if (latest.weight < previous.weight) return 90;
    return 70;
  };

  const individualVitalScores = [
    {
      icon: <Activity className="w-5 h-5 text-blue-600" />,
      label: "Blood Pressure",
      value: Math.round(
        (calculateVitalScore(
          latestVitals.bloodPressure.systolic,
          "bloodPressure",
          "systolic"
        ) +
          calculateVitalScore(
            latestVitals.bloodPressure.diastolic,
            "bloodPressure",
            "diastolic"
          )) /
          2
      ),
      gradient: "from-blue-500 to-blue-600",
      actual: `${latestVitals.bloodPressure.systolic}/${latestVitals.bloodPressure.diastolic}`,
      unit: "mmHg",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Heart className="w-5 h-5 text-red-600" />,
      label: "Heart Rate",
      value: Math.round(
        calculateVitalScore(latestVitals.heartRate, "heartRate")
      ),
      gradient: "from-red-500 to-red-600",
      actual: latestVitals.heartRate,
      unit: "bpm",
      bgColor: "bg-red-50",
    },
    {
      icon: <Thermometer className="w-5 h-5 text-orange-600" />,
      label: "Temperature",
      value: Math.round(
        calculateVitalScore(latestVitals.temperature, "temperature")
      ),
      gradient: "from-orange-500 to-orange-600",
      actual: latestVitals.temperature,
      unit: "°F",
      bgColor: "bg-orange-50",
    },
    {
      icon: <Weight className="w-5 h-5 text-green-600" />,
      label: "Weight Trend",
      value: getWeightTrend(),
      gradient: "from-green-500 to-green-600",
      actual: latestVitals.weight,
      unit: "kg",
      bgColor: "bg-green-50",
    },
  ];

  const insights = [
    healthScore >= 80 && "All vital parameters are within optimal ranges",
    healthScore < 80 &&
      healthScore >= 60 &&
      "Blood pressure monitoring recommended",
    healthScore < 60 && "Consider medication adjustment consultation",
    trend === "improving" && "Patient showing positive health progression",
    trend === "declining" && "Declining trend requires medical review",
    "Schedule next assessment within 24-48 hours",
  ].filter(Boolean);

  return (
    <div
      className={`space-y-6 p-6 bg-slate-50 min-h-screen transition-all duration-700 ${
        isVisible
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-4"
      }`}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Patient Health Dashboard
        </h1>
        <p className="text-slate-600">
          Real-time vital signs monitoring and health assessment
        </p>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Health Score */}
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Overall Health Score
                </span>
              </div>

              <div className="relative">
                <div
                  className={`relative w-24 h-24 mx-auto rounded-full flex items-center justify-center border-2 transition-all duration-1000 ${getScoreBackground(
                    healthScore
                  )}`}
                >
                  <span
                    className={`text-3xl font-bold ${getScoreColor(
                      healthScore
                    )}`}
                  >
                    {animatedScore}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <Progress value={animatedScore} className="w-full h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${getScoreBackground(
                    healthScore
                  )}`}
                >
                  {getRiskIcon(healthScore)}
                </div>
                <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Risk Level
                </span>
              </div>

              <div className="space-y-2">
                <h4 className={`font-bold text-xl ${riskAssessment.color}`}>
                  {riskAssessment.level}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {riskAssessment.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Confidence Level</span>
                  <span className="font-semibold text-slate-700">94%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trend Status */}
        <Card
          className={`border-0 shadow-sm hover:shadow-md transition-shadow duration-300 ${getTrendColor()}`}
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/80 rounded-lg">
                  {getTrendIcon()}
                </div>
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Health Trend
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xl capitalize">{trend}</h4>
                <p className="text-sm opacity-75">24-hour comparison</p>
              </div>

              <div className="pt-3 border-t border-current border-opacity-20">
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-75">Last Updated</span>
                  <span className="font-semibold">2 min ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {individualVitalScores.map((vital, index) => (
          <Card
            key={vital.label}
            className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${vital.bgColor}`}>
                    {vital.icon}
                  </div>
                  <span
                    className={`text-lg font-bold ${getScoreColor(
                      vital.value
                    )}`}
                  >
                    {vital.value}%
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-3">
                    {vital.label}
                  </h4>

                  <div className="space-y-3">
                    <div className="relative bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${vital.gradient}`}
                        style={{ width: `${vital.value}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-slate-800">
                        {vital.actual}
                      </span>
                      <span className="text-sm text-slate-500 font-medium">
                        {vital.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-slate-900 text-lg font-semibold">
                Clinical Insights
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm text-slate-700 leading-relaxed">
                    {insight}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Activity className="w-5 h-5 text-slate-600" />
              </div>
              <span className="text-slate-900 text-lg font-semibold">
                Summary
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">
                  Last Assessment
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  2 minutes ago
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">
                  Next Review
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  24 hours
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">
                  Priority Level
                </span>
                <span
                  className={`text-sm font-semibold ${riskAssessment.color}`}
                >
                  {riskAssessment.level}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-medium text-slate-600">
                  Data Points
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {selectedPatient.vitals.length} Records
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
