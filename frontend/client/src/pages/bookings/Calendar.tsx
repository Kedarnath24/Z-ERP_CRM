import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/DashboardLayout";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  title: string;
  time: string;
  type: "lead" | "external" | "client" | "staff";
  location?: string;
  attendees?: string[];
}

export default function BookingCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // January 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mock appointments data
  const appointments: Record<string, Appointment[]> = {
    "2026-01-16": [
      {
        id: "1",
        title: "Product Demo",
        time: "10:00 AM",
        type: "lead",
        location: "Zoom Meeting",
        attendees: ["Alice Johnson"],
      },
      {
        id: "2",
        title: "Quote Discussion",
        time: "2:00 PM",
        type: "external",
        location: "Office Conference Room",
      },
    ],
    "2026-01-17": [
      {
        id: "3",
        title: "Project Kickoff",
        time: "11:00 AM",
        type: "client",
        location: "Client Office",
        attendees: ["John Doe", "Jane Smith"],
      },
    ],
    "2026-01-20": [
      {
        id: "4",
        title: "Team Sync",
        time: "9:30 AM",
        type: "staff",
        location: "Meeting Room A",
      },
    ],
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(clickedDate);
    setDialogOpen(true);
  };

  const getDateKey = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    return `${year}-${month}-${dayStr}`;
  };

  const hasAppointments = (day: number) => {
    return appointments[getDateKey(day)]?.length > 0;
  };

  const getTypeColor = (type: Appointment["type"]) => {
    const colors = {
      lead: "bg-blue-500",
      external: "bg-purple-500",
      client: "bg-green-500",
      staff: "bg-orange-500",
    };
    return colors[type];
  };

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const selectedDateAppointments = selectedDate
    ? appointments[getDateKey(selectedDate.getDate())] || []
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View and manage all your appointments in calendar view</p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {monthName}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startingDayOfWeek }, (_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const hasEvents = hasAppointments(day);
                const isToday =
                  day === 16 &&
                  currentMonth.getMonth() === 0 &&
                  currentMonth.getFullYear() === 2026;

                return (
                  <motion.div
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "aspect-square p-2 border rounded-lg cursor-pointer transition-all",
                      isToday && "border-primary border-2 bg-primary/5",
                      hasEvents && "bg-blue-50 hover:bg-blue-100",
                      !hasEvents && "hover:bg-muted"
                    )}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className="flex flex-col h-full">
                      <span className={cn("text-sm font-medium", isToday && "text-primary")}>
                        {day}
                      </span>
                      {hasEvents && (
                        <div className="flex-1 flex items-center justify-center mt-1">
                          <div className="flex gap-1">
                            {appointments[getDateKey(day)].slice(0, 3).map((apt, idx) => (
                              <div
                                key={idx}
                                className={cn("w-1.5 h-1.5 rounded-full", getTypeColor(apt.type))}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Appointment Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm">Lead Meeting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm">External Meeting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Client Meeting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm">Staff Meeting</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedDate?.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </DialogTitle>
              <DialogDescription>
                {selectedDateAppointments.length > 0
                  ? `${selectedDateAppointments.length} appointment(s) scheduled`
                  : "No appointments scheduled"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {selectedDateAppointments.length > 0 ? (
                selectedDateAppointments.map((apt) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{apt.title}</h3>
                      <Badge className={getTypeColor(apt.type)}>{apt.type}</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {apt.time}
                      </div>
                      {apt.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {apt.location}
                        </div>
                      )}
                      {apt.attendees && apt.attendees.length > 0 && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {apt.attendees.join(", ")}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No appointments scheduled for this date
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
