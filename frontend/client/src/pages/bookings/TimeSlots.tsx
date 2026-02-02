import { useState } from "react";
import { Clock, Plus, Trash2, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface DaySchedule {
  day: string;
  enabled: boolean;
  slots: TimeSlot[];
}

export default function TimeSlots() {
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    {
      day: "Monday",
      enabled: true,
      slots: [
        { start: "09:00", end: "10:00", available: true },
        { start: "10:00", end: "11:00", available: true },
        { start: "11:00", end: "12:00", available: true },
        { start: "14:00", end: "15:00", available: true },
        { start: "15:00", end: "16:00", available: true },
        { start: "16:00", end: "17:00", available: true },
      ],
    },
    {
      day: "Tuesday",
      enabled: true,
      slots: [
        { start: "09:00", end: "10:00", available: true },
        { start: "10:00", end: "11:00", available: true },
        { start: "14:00", end: "15:00", available: true },
        { start: "15:00", end: "16:00", available: true },
      ],
    },
    {
      day: "Wednesday",
      enabled: true,
      slots: [
        { start: "09:00", end: "12:00", available: true },
        { start: "14:00", end: "17:00", available: true },
      ],
    },
    {
      day: "Thursday",
      enabled: true,
      slots: [
        { start: "09:00", end: "10:00", available: true },
        { start: "10:00", end: "11:00", available: true },
        { start: "14:00", end: "15:00", available: true },
      ],
    },
    {
      day: "Friday",
      enabled: true,
      slots: [
        { start: "09:00", end: "12:00", available: true },
        { start: "13:00", end: "16:00", available: true },
      ],
    },
    { day: "Saturday", enabled: false, slots: [] },
    { day: "Sunday", enabled: false, slots: [] },
  ]);

  const toggleDay = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].enabled = !newSchedule[dayIndex].enabled;
    setSchedule(newSchedule);
  };

  const toggleSlot = (dayIndex: number, slotIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots[slotIndex].available =
      !newSchedule[dayIndex].slots[slotIndex].available;
    setSchedule(newSchedule);
  };

  const handleSave = () => {
    toast({
      title: "Schedule Saved",
      description: "Your availability has been updated successfully",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Time Slots</h1>
          <p className="text-muted-foreground">Configure your available working hours for bookings</p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Weekly Schedule
                </CardTitle>
                <CardDescription>Set your availability for each day of the week</CardDescription>
              </div>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Schedule
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {schedule.map((daySchedule, dayIndex) => (
                <div key={daySchedule.day} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={daySchedule.enabled}
                        onCheckedChange={() => toggleDay(dayIndex)}
                      />
                      <Label className="text-base font-semibold">{daySchedule.day}</Label>
                      {!daySchedule.enabled && (
                        <Badge variant="secondary">Unavailable</Badge>
                      )}
                    </div>
                    {daySchedule.enabled && (
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Slot
                      </Button>
                    )}
                  </div>

                  {daySchedule.enabled && (
                    <div className="flex flex-wrap gap-2">
                      {daySchedule.slots.length > 0 ? (
                        daySchedule.slots.map((slot, slotIndex) => (
                          <div
                            key={slotIndex}
                            onClick={() => toggleSlot(dayIndex, slotIndex)}
                            className={cn(
                              "px-4 py-2 rounded-lg border-2 cursor-pointer transition-all",
                              slot.available
                                ? "bg-green-50 border-green-500 text-green-800 hover:bg-green-100"
                                : "bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span className="text-sm font-medium">
                                {slot.start} - {slot.end}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No time slots configured</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Working Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {schedule.filter((d) => d.enabled).length}
              </div>
              <p className="text-xs text-muted-foreground">days per week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {schedule.reduce((sum, day) => sum + day.slots.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">available time slots</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">40</div>
              <p className="text-xs text-muted-foreground">hours per week</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
