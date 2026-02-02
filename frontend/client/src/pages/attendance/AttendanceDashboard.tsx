import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, XCircle, Clock, TrendingUp, MapPin, Calendar,
  Download, FileDown, Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AttendanceDashboard() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [workDuration, setWorkDuration] = useState('0h 0m');

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Update work duration if checked in
      if (checkInTime) {
        const duration = Date.now() - checkInTime.getTime();
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        setWorkDuration(`${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [checkInTime]);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date());
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
    setWorkDuration('0h 0m');
  };

  // Mock data
  const stats = [
    { label: 'Present Days', value: '22', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Total Hours', value: '176h', icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Avg Hours/Day', value: '8.2h', icon: TrendingUp, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { label: 'Absent Days', value: '2', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
  ];

  const attendanceHistory = [
    { date: '2026-01-15', checkIn: '09:02 AM', checkOut: 'Active', hours: '4.5h', status: 'present', location: 'Office - New York' },
    { date: '2026-01-14', checkIn: '08:58 AM', checkOut: '06:15 PM', hours: '9.5h', status: 'present', location: 'Office - New York' },
    { date: '2026-01-13', checkIn: '09:45 AM', checkOut: '05:30 PM', hours: '7.75h', status: 'late', location: 'Remote' },
    { date: '2026-01-12', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h', status: 'present', location: 'Office - New York' },
    { date: '2026-01-11', checkIn: '08:55 AM', checkOut: '05:45 PM', hours: '8.8h', status: 'present', location: 'Office - New York' },
    { date: '2026-01-10', checkIn: '-', checkOut: '-', hours: '-', status: 'absent', location: '-' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-500';
      case 'late':
        return 'bg-amber-500';
      case 'absent':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance & Check-In</h1>
          <p className="text-sm text-gray-500 mt-1">Track your attendance and manage check-in/out</p>
        </div>

        {/* Check-In Card */}
        <Card className={`relative overflow-hidden border-0 shadow-xl ${
          isCheckedIn 
            ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600' 
            : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600'
        }`}>
          {/* Animated pulse effect */}
          {isCheckedIn && (
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          )}
          
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left text-white flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${isCheckedIn ? 'bg-white animate-pulse' : 'bg-white/50'}`}></div>
                  <p className="text-white/90 font-medium">
                    {isCheckedIn ? 'You are checked in' : 'Ready to check in'}
                  </p>
                </div>
                
                <div className="text-6xl font-bold mb-2">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                
                <p className="text-lg text-white/90 mb-4">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>

                <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm text-sm px-3 py-1">
                    <MapPin size={14} className="mr-2" />
                    Office - New York
                  </Badge>
                  
                  {isCheckedIn && (
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm text-sm px-3 py-1">
                      <Clock size={14} className="mr-2" />
                      {workDuration}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {!isCheckedIn ? (
                  <Button
                    size="lg"
                    onClick={handleCheckIn}
                    className="bg-white/95 hover:bg-white text-indigo-600 shadow-2xl border-2 border-white/50 backdrop-blur-sm h-14 px-8 text-lg font-semibold"
                  >
                    <CheckCircle size={20} className="mr-2" />
                    Check In
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleCheckOut}
                    className="bg-white/95 hover:bg-white text-green-600 shadow-2xl border-2 border-white/50 backdrop-blur-sm h-14 px-8 text-lg font-semibold"
                  >
                    <XCircle size={20} className="mr-2" />
                    Check Out
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-white/70 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Attendance History */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attendance History</CardTitle>
              <div className="flex gap-2">
                <Select defaultValue="thisMonth">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                    <SelectItem value="lastMonth">Last Month</SelectItem>
                    <SelectItem value="last3Months">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Download size={16} />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 sticky top-0">
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        Date
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        Check In
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        Check Out
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        Location
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hours</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map((record, idx) => (
                    <tr 
                      key={idx} 
                      className={`border-b hover:bg-slate-50 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                      }`}
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {new Date(record.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {record.checkIn === 'Active' ? (
                          <Badge className="bg-green-100 text-green-700">{record.checkIn}</Badge>
                        ) : (
                          record.checkIn
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {record.checkOut === 'Active' ? (
                          <Badge className="bg-blue-100 text-blue-700 animate-pulse">{record.checkOut}</Badge>
                        ) : (
                          record.checkOut
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-gray-400" />
                          {record.location}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{record.hours}</td>
                      <td className="px-4 py-4">
                        <Badge className={`${getStatusColor(record.status)} text-white`}>
                          {getStatusLabel(record.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
