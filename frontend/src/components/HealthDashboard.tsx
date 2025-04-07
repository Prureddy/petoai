import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart2,
  Bell,
  Calendar,
  Download,
  Heart,
  LineChart,
  Mail,
  Share2,
  Thermometer,
  Weight,
  ArrowUp,
  ArrowDown,
  Clock,
  Stethoscope,
  ChevronDown,
} from 'lucide-react';

interface HealthMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical';
  change: string;
}

interface Reminder {
  id: string;
  title: string;
  date: string;
  type: 'vet' | 'vaccination' | 'medication' | 'grooming';
}

const HealthDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('1M');
  const [selectedMetric, setSelectedMetric] = useState('weight');

  const healthMetrics: HealthMetric[] = [
    {
      label: 'Weight',
      value: '12.5 kg',
      trend: 'up',
      status: 'warning',
      change: '+0.5 kg',
    },
    {
      label: 'Activity',
      value: '75 min/day',
      trend: 'up',
      status: 'normal',
      change: '+15 min',
    },
    {
      label: 'Heart Rate',
      value: '85 bpm',
      trend: 'stable',
      status: 'normal',
      change: '0 bpm',
    },
    {
      label: 'Temperature',
      value: '38.5°C',
      trend: 'down',
      status: 'normal',
      change: '-0.2°C',
    },
  ];

  const reminders: Reminder[] = [
    {
      id: '1',
      title: 'Annual Checkup',
      date: '2025-03-15',
      type: 'vet',
    },
    {
      id: '2',
      title: 'Rabies Vaccination',
      date: '2025-03-20',
      type: 'vaccination',
    },
    {
      id: '3',
      title: 'Heartworm Medicine',
      date: '2025-03-10',
      type: 'medication',
    },
  ];

  const anomalies = [
    {
      title: 'Unusual Weight Gain',
      description: 'Weight increased by 0.5kg in the last week',
      severity: 'warning',
      action: 'Monitor diet and activity',
    },
    {
      title: 'Decreased Activity',
      description: 'Activity level dropped by 20% on weekends',
      severity: 'info',
      action: 'Consider increasing exercise',
    },
  ];

  const getStatusColor = (status: HealthMetric['status']) => {
    switch (status) {
      case 'critical':
        return 'text-red-500';
      case 'warning':
        return 'text-orange-500';
      default:
        return 'text-green-500';
    }
  };

  const getTrendIcon = (trend: HealthMetric['trend']) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4" />;
      case 'down':
        return <ArrowDown className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getMetricIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'weight':
        return <Weight className="w-6 h-6" />;
      case 'activity':
        return <Activity className="w-6 h-6" />;
      case 'heart rate':
        return <Heart className="w-6 h-6" />;
      case 'temperature':
        return <Thermometer className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A90E2] to-[#A8E6CF] p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Pet Health Dashboard</h1>
          <p className="text-white/90">Monitor your pet's health metrics and stay informed</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Pet Profile Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-4">
            <img
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=150&h=150"
              alt="Pet"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-[#333333]">Max</h2>
              <p className="text-[#666666]">Golden Retriever • 3 years old</p>
              <div className="flex items-center mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Overall Health: Excellent
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {healthMetrics.map((metric) => (
            <div key={metric.label} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#4A90E2]/10 rounded-lg">
                  {getMetricIcon(metric.label)}
                </div>
                <span className={`flex items-center space-x-1 text-sm ${getStatusColor(metric.status)}`}>
                  {getTrendIcon(metric.trend)}
                  <span>{metric.change}</span>
                </span>
              </div>
              <h3 className="text-[#666666] text-sm">{metric.label}</h3>
              <p className="text-2xl font-semibold text-[#333333] mt-1">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Trend Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[#333333]">Health Trends</h3>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-1 border border-gray-200 rounded-md text-sm"
                >
                  <option value="weight">Weight</option>
                  <option value="activity">Activity</option>
                  <option value="heartRate">Heart Rate</option>
                  <option value="temperature">Temperature</option>
                </select>
                <div className="flex bg-[#F5F5F5] rounded-md p-1">
                  {['1W', '1M', '3M', '1Y'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedTimeRange(range)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        selectedTimeRange === range
                          ? 'bg-white text-[#4A90E2] shadow-sm'
                          : 'text-[#666666] hover:text-[#333333]'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center text-[#666666]">
              <LineChart className="w-8 h-8" />
              <span className="ml-2">Chart visualization would go here</span>
            </div>
          </div>

          {/* Anomaly Detection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#333333] mb-4">Health Insights</h3>
            <div className="space-y-4">
              {anomalies.map((anomaly, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-l-4 border-l-orange-500 bg-orange-50"
                >
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div className="ml-3">
                      <h4 className="font-medium text-[#333333]">{anomaly.title}</h4>
                      <p className="text-sm text-[#666666] mt-1">{anomaly.description}</p>
                      <p className="text-sm font-medium text-orange-600 mt-2">
                        Recommended Action: {anomaly.action}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reminders and Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reminders */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[#333333]">Upcoming Reminders</h3>
              <button className="text-[#4A90E2] hover:text-[#357ABD] text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#F5F5F5]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white rounded-lg">
                      {reminder.type === 'vet' ? (
                        <Stethoscope className="w-6 h-6 text-[#4A90E2]" />
                      ) : reminder.type === 'vaccination' ? (
                        <Activity className="w-6 h-6 text-[#FF6F61]" />
                      ) : (
                        <Bell className="w-6 h-6 text-[#A8E6CF]" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-[#333333]">{reminder.title}</h4>
                      <p className="text-sm text-[#666666]">
                        {new Date(reminder.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button className="text-[#4A90E2] hover:text-[#357ABD]">
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#333333] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors">
                <span className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Download Report
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-[#FF6F61] text-white rounded-lg hover:bg-[#ff8a7f] transition-colors">
                <span className="flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share with Vet
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-[#A8E6CF] text-white rounded-lg hover:bg-[#8ad1b6] transition-colors">
                <span className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Set Reminder
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthDashboard;