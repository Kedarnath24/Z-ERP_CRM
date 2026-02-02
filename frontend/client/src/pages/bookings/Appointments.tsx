import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Calendar as CalendarIcon,
  Users,
  MapPin,
  Clock,
  Bell,
  Repeat,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  subject: string;
  type: "lead" | "external" | "client" | "staff";
  date: string;
  time: string;
  initiatedBy: string;
  attendees: string[];
  status: "upcoming" | "finished" | "missed" | "cancelled";
  location?: string;
}

export default function Appointments() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [appointmentType, setAppointmentType] = useState<string>("lead");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Static appointments data
  const appointments: Appointment[] = [
    {
      id: "1",
      subject: "Product Demo with ABC Corp",
      type: "lead",
      date: "2026-01-16",
      time: "10:00 AM",
      initiatedBy: "John Smith",
      attendees: ["Sarah Wilson", "Mike Johnson"],
      status: "upcoming",
      location: "Conference Room A",
    },
    {
      id: "2",
      subject: "Client Quarterly Review",
      type: "client",
      date: "2026-01-16",
      time: "2:00 PM",
      initiatedBy: "Emma Davis",
      attendees: ["Robert Brown"],
      status: "upcoming",
      location: "Virtual - Zoom",
    },
    {
      id: "3",
      subject: "Team Sprint Planning",
      type: "staff",
      date: "2026-01-16",
      time: "4:00 PM",
      initiatedBy: "John Smith",
      attendees: ["All Staff"],
      status: "upcoming",
    },
    {
      id: "4",
      subject: "Sales Follow-up Call",
      type: "external",
      date: "2026-01-15",
      time: "11:00 AM",
      initiatedBy: "Sarah Wilson",
      attendees: [],
      status: "finished",
    },
  ];

  const todayAppointments = appointments.filter(
    (apt) => apt.date === "2026-01-16" && apt.status === "upcoming"
  );

  const pastAppointments = appointments.filter(
    (apt) => apt.date < "2026-01-16" || apt.status !== "upcoming"
  );

  const getStatusColor = (status: Appointment["status"]) => {
    const colors = {
      upcoming: "bg-blue-100 text-blue-800",
      finished: "bg-green-100 text-green-800",
      missed: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return colors[status];
  };

  const getStatusIcon = (status: Appointment["status"]) => {
    const icons = {
      upcoming: Clock,
      finished: CheckCircle2,
      missed: XCircle,
      cancelled: AlertCircle,
    };
    return icons[status];
  };

  const handleCreateAppointment = () => {
    toast({
      title: "Appointment Created",
      description: "The appointment has been scheduled successfully",
    });
    setShowCreateDialog(false);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Appointment marked as ${newStatus}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage your bookings and meetings</p>
        </div>
        {/* Header with Create Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Appointment</DialogTitle>
                <DialogDescription>Schedule a new appointment or meeting</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Appointment Type */}
                <div className="space-y-2">
                  <Label>Appointment Type *</Label>
                  <Select value={appointmentType} onValueChange={setAppointmentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead Appointment</SelectItem>
                      <SelectItem value="external">External Appointment</SelectItem>
                      <SelectItem value="client">Client Appointment</SelectItem>
                      <SelectItem value="staff">Staff Meeting (Internal)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Input placeholder="Meeting highlights" />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Additional details" rows={3} />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Time *</Label>
                    <Input type="time" />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Location
                  </Label>
                  <Input placeholder="Conference room, Virtual link, etc." />
                </div>

                {/* Attendees - Show for all except Staff Meeting */}
                {appointmentType === "lead" && (
                  <div className="space-y-2">
                    <Label>
                      <Users className="inline h-4 w-4 mr-1" />
                      Attendees *
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff members" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john">John Smith</SelectItem>
                        <SelectItem value="sarah">Sarah Wilson</SelectItem>
                        <SelectItem value="mike">Mike Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Related To - Conditional */}
                {appointmentType !== "staff" && (
                  <div className="space-y-2">
                    <Label>Related To</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select related record" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead1">Lead: ABC Corp</SelectItem>
                        <SelectItem value="client1">Client: XYZ Inc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Repeat */}
                <div className="space-y-2">
                  <Label>
                    <Repeat className="inline h-4 w-4 mr-1" />
                    Repeat
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Does not repeat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Does not repeat</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Notifications */}
                <div className="space-y-2">
                  <Label>
                    <Bell className="inline h-4 w-4 mr-1" />
                    Notifications
                  </Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sms" />
                      <label htmlFor="sms" className="text-sm">
                        SMS
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="whatsapp" />
                      <label htmlFor="whatsapp" className="text-sm">
                        WhatsApp
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email" defaultChecked />
                      <label htmlFor="email" className="text-sm">
                        Email
                      </label>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea placeholder="Internal notes" rows={2} />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAppointment}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Today's Meetings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Today's Meetings
            </CardTitle>
            <CardDescription>Scheduled appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => {
                const StatusIcon = getStatusIcon(appointment.status);
                return (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{appointment.subject}</h3>
                          <Badge variant="outline" className="capitalize">
                            {appointment.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {appointment.time}
                          </span>
                          {appointment.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {appointment.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {appointment.initiatedBy}
                          </span>
                        </div>
                        {appointment.attendees.length > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Attendees: {appointment.attendees.join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {appointment.status}
                        </Badge>
                        <Select
                          defaultValue={appointment.status}
                          onValueChange={(value) => handleStatusChange(appointment.id, value)}
                        >
                          <SelectTrigger className="w-[140px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="finished">Mark as Finished</SelectItem>
                            <SelectItem value="cancelled">Mark as Cancelled</SelectItem>
                            <SelectItem value="missed">Mark as Missed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Past Meetings */}
        <Card>
          <CardHeader>
            <CardTitle>Past Meetings</CardTitle>
            <CardDescription>Historical appointment records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">Date</th>
                    <th className="p-3 text-left text-sm font-medium">Subject</th>
                    <th className="p-3 text-left text-sm font-medium">Type</th>
                    <th className="p-3 text-left text-sm font-medium">Initiated By</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastAppointments.map((appointment) => {
                    const StatusIcon = getStatusIcon(appointment.status);
                    return (
                      <tr key={appointment.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="p-3 text-sm">
                          {new Date(appointment.date).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-sm font-medium">{appointment.subject}</td>
                        <td className="p-3 text-sm capitalize">{appointment.type}</td>
                        <td className="p-3 text-sm">{appointment.initiatedBy}</td>
                        <td className="p-3 text-sm">
                          <Badge className={getStatusColor(appointment.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {appointment.status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
