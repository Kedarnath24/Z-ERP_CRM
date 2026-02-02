import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, Navigation, Clock, Users, TrendingUp, Calendar,
  Search, Filter, Download, RefreshCw, Map, Route, Shield,
  Camera, CheckCircle, XCircle, DollarSign, FileText, PlayCircle,
  Pause, StopCircle, Eye, AlertCircle, Phone
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: "active" | "idle" | "offline";
  location: { lat: number; lng: number; address: string };
  tasksToday: number;
  tasksCompleted: number;
  distanceCovered: string;
  lastUpdate: string;
  avatar: string;
}

interface ProofOfVisit {
  id: string;
  staffName: string;
  customer: string;
  photo: string;
  location: string;
  timestamp: string;
  notes: string;
  verified: boolean;
}

export default function FieldStaffTracking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [selectedProof, setSelectedProof] = useState<ProofOfVisit | null>(null);

  // Mock data
  const staffMembers: StaffMember[] = [
    {
      id: "1",
      name: "John Smith",
      role: "Sales Representative",
      status: "active",
      location: { lat: 37.7749, lng: -122.4194, address: "123 Market St, San Francisco" },
      tasksToday: 8,
      tasksCompleted: 5,
      distanceCovered: "42.3 km",
      lastUpdate: "2 mins ago",
      avatar: "👨‍💼"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Field Engineer",
      status: "active",
      location: { lat: 37.7849, lng: -122.4094, address: "456 Mission St, San Francisco" },
      tasksToday: 6,
      tasksCompleted: 4,
      distanceCovered: "28.7 km",
      lastUpdate: "5 mins ago",
      avatar: "👩‍🔧"
    },
    {
      id: "3",
      name: "Mike Chen",
      role: "Delivery Agent",
      status: "idle",
      location: { lat: 37.7649, lng: -122.4294, address: "789 Howard St, San Francisco" },
      tasksToday: 12,
      tasksCompleted: 12,
      distanceCovered: "56.1 km",
      lastUpdate: "15 mins ago",
      avatar: "🚚"
    }
  ];

  const proofOfVisits: ProofOfVisit[] = [
    {
      id: "1",
      staffName: "John Smith",
      customer: "Acme Corp",
      photo: "📸",
      location: "123 Market St",
      timestamp: "Today, 10:30 AM",
      notes: "Product demo completed successfully",
      verified: true
    },
    {
      id: "2",
      staffName: "Sarah Johnson",
      customer: "Tech Solutions Inc",
      photo: "📸",
      location: "456 Mission St",
      timestamp: "Today, 11:45 AM",
      notes: "Installation verified and signed off",
      verified: true
    },
    {
      id: "3",
      staffName: "Mike Chen",
      customer: "Global Retail",
      photo: "📸",
      location: "789 Howard St",
      timestamp: "Today, 2:15 PM",
      notes: "Delivery completed, awaiting signature",
      verified: false
    }
  ];

  const stats = [
    { label: "Active Staff", value: "24", icon: Users, color: "text-green-600", bg: "bg-green-50" },
    { label: "Tasks Today", value: "156", icon: CheckCircle, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Distance Covered", value: "842 km", icon: Route, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Attendance", value: "96%", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" }
  ];

  const geofences = [
    { id: "1", name: "Downtown Zone", type: "Office", radius: "500m", color: "indigo" },
    { id: "2", name: "Warehouse District", type: "Restricted", radius: "1km", color: "red" },
    { id: "3", name: "Client Area", type: "Service", radius: "2km", color: "green" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Field Staff Tracking</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time location and activity monitoring</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="live-map" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7 lg:w-auto">
            <TabsTrigger value="live-map">Live Map</TabsTrigger>
            <TabsTrigger value="movement">Movement</TabsTrigger>
            <TabsTrigger value="geofence">Geofence</TabsTrigger>
            <TabsTrigger value="proof">Proof of Visit</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          {/* Live Map Tab */}
          <TabsContent value="live-map" className="space-y-4">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Map Placeholder */}
              <Card className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Map className="w-5 h-5 text-indigo-600" />
                      Live Location Map
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-indigo-50 via-blue-50 to-amber-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-700">Interactive Map View</p>
                      <p className="text-sm text-gray-500 mt-2">Real-time staff location markers</p>
                      <div className="mt-4 flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-gray-600">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <span className="text-xs text-gray-600">Idle</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-600">Offline</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Staff List */}
              <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
                <CardHeader>
                  <CardTitle>Active Staff ({staffMembers.length})</CardTitle>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search staff..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {staffMembers.map((staff) => (
                      <div
                        key={staff.id}
                        className="p-3 rounded-lg border border-gray-200 hover:border-indigo-300 cursor-pointer transition-colors"
                        onClick={() => setSelectedStaff(staff)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{staff.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-900 text-sm">{staff.name}</p>
                              <Badge
                                variant={staff.status === "active" ? "default" : "secondary"}
                                className={
                                  staff.status === "active"
                                    ? "bg-green-500"
                                    : staff.status === "idle"
                                    ? "bg-amber-500"
                                    : "bg-gray-400"
                                }
                              >
                                {staff.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{staff.role}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{staff.location.address}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2 text-xs">
                              <span className="text-gray-500">{staff.tasksCompleted}/{staff.tasksToday} tasks</span>
                              <span className="text-indigo-600">{staff.distanceCovered}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Movement History Tab */}
          <TabsContent value="movement" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Route className="w-5 h-5 text-indigo-600" />
                    Movement History & Route Playback
                  </span>
                  <div className="flex gap-2">
                    <Select defaultValue="today">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="aspect-video bg-gradient-to-br from-indigo-50 via-blue-50 to-amber-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-700">Route Playback View</p>
                      <p className="text-sm text-gray-500 mt-2">Historical movement timeline</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-medium text-gray-700">Playback Controls</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <PlayCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Pause className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <StopCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <input type="range" className="w-full" min="0" max="100" defaultValue="0" />
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>08:00 AM</span>
                      <span>06:00 PM</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Total Distance</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">127.4 km</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Active Time</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">7h 24m</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Stops Made</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">18</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Geofence Manager Tab */}
          <TabsContent value="geofence" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    Geofence Manager
                  </span>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <MapPin className="w-4 h-4 mr-2" />
                    Add Geofence
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="aspect-square bg-gradient-to-br from-indigo-50 via-blue-50 to-amber-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-700">Geofence Drawing Panel</p>
                      <p className="text-sm text-gray-500 mt-2">Draw circular or polygon zones</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Active Geofences</h3>
                    {geofences.map((fence) => (
                      <Card key={fence.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full bg-${fence.color}-500`}></div>
                              <div>
                                <p className="font-semibold text-gray-900">{fence.name}</p>
                                <p className="text-sm text-gray-500">{fence.type} • {fence.radius}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <AlertCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Proof of Visit Tab */}
          <TabsContent value="proof" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-600" />
                  Proof of Visit Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {proofOfVisits.map((proof) => (
                    <Card
                      key={proof.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        setSelectedProof(proof);
                        setProofModalOpen(true);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-6xl mb-3">
                          {proof.photo}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-gray-900">{proof.customer}</p>
                            {proof.verified ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-amber-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{proof.staffName}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{proof.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{proof.timestamp}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Attendance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-green-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Present</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">23</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-amber-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Late</p>
                        <p className="text-2xl font-bold text-amber-600 mt-1">2</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Absent</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">1</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">On Leave</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">3</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="border rounded-lg divide-y">
                    {staffMembers.map((staff) => (
                      <div key={staff.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{staff.avatar}</div>
                          <div>
                            <p className="font-semibold text-gray-900">{staff.name}</p>
                            <p className="text-sm text-gray-500">{staff.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">Check-in: 08:45 AM</p>
                            <p className="text-xs text-gray-500">Location verified</p>
                          </div>
                          <Badge className="bg-green-500">Present</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  Task Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffMembers.map((staff) => (
                    <Card key={staff.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{staff.avatar}</div>
                            <div>
                              <p className="font-semibold text-gray-900">{staff.name}</p>
                              <p className="text-sm text-gray-500">{staff.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {staff.tasksCompleted}/{staff.tasksToday}
                            </p>
                            <p className="text-xs text-gray-500">tasks completed</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${(staff.tasksCompleted / staff.tasksToday) * 100}%` }}
                          ></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                  Field Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { staff: "John Smith", type: "Fuel", amount: "$45.00", receipt: "🧾", status: "approved" },
                    { staff: "Sarah Johnson", type: "Meals", amount: "$28.50", receipt: "🧾", status: "pending" },
                    { staff: "Mike Chen", type: "Parking", amount: "$15.00", receipt: "🧾", status: "approved" }
                  ].map((expense, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-3xl">{expense.receipt}</div>
                            <div>
                              <p className="font-semibold text-gray-900">{expense.type}</p>
                              <p className="text-sm text-gray-500">{expense.staff}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="text-xl font-bold text-gray-900">{expense.amount}</p>
                            <Badge
                              className={expense.status === "approved" ? "bg-green-500" : "bg-amber-500"}
                            >
                              {expense.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Proof of Visit Modal */}
        <Dialog open={proofModalOpen} onOpenChange={setProofModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Proof of Visit Details</DialogTitle>
            </DialogHeader>
            {selectedProof && (
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-9xl">
                  {selectedProof.photo}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-semibold text-gray-900">{selectedProof.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Staff Member</p>
                    <p className="font-semibold text-gray-900">{selectedProof.staffName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{selectedProof.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Timestamp</p>
                    <p className="font-semibold text-gray-900">{selectedProof.timestamp}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Notes</p>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedProof.notes}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    {selectedProof.verified ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-600 font-medium">Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-amber-600" />
                        <span className="text-amber-600 font-medium">Pending Verification</span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Reject</Button>
                    <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
