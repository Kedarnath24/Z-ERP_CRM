import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Bell, Calendar, Clock, Save, Trash2, Edit, User, 
  MessageSquare, Flag, Tag as TagIcon, AlertTriangle,
  History, Sparkles, X, Clock3, CheckCircle, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Reminder {
  id: string;
  leadName: string;
  date: string;
  time: string;
  message: string;
  priority: "high" | "medium" | "low";
  category: string;
  notifyBefore: number;
  createdBy: string;
  createdAt: string;
  completed?: boolean;
}

export default function LeadReminders() {
  const { toast } = useToast();
  
  // Form state
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");
  const [reminderPriority, setReminderPriority] = useState<"high" | "medium" | "low">("medium");
  const [reminderCategory, setReminderCategory] = useState("follow-up");
  const [reminderNotifyBefore, setReminderNotifyBefore] = useState(15);
  const [leadName, setLeadName] = useState("");
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Demo reminders data
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: "1",
      leadName: "Sarah Johnson - TechCorp Solutions",
      date: "2026-02-17",
      time: "10:00",
      message: "Follow up on pricing proposal and enterprise features discussion",
      priority: "high",
      category: "follow-up",
      notifyBefore: 15,
      createdBy: "John Smith",
      createdAt: "Feb 16, 2026 at 9:30 AM",
      completed: false
    },
    {
      id: "2",
      leadName: "Michael Chen - Startup Inc",
      date: "2026-02-18",
      time: "14:30",
      message: "Schedule product demo and discuss implementation timeline",
      priority: "medium",
      category: "demo",
      notifyBefore: 30,
      createdBy: "Emily Davis",
      createdAt: "Feb 16, 2026 at 11:15 AM",
      completed: false
    },
    {
      id: "3",
      leadName: "Emma Rodriguez - Global Manufacturing",
      date: "2026-02-16",
      time: "15:00",
      message: "Send contract for review - urgent deadline",
      priority: "high",
      category: "contract",
      notifyBefore: 60,
      createdBy: "John Smith",
      createdAt: "Feb 15, 2026 at 4:20 PM",
      completed: false
    }
  ]);

  const handleSaveReminder = async () => {
    // Validation
    if (!reminderDate || !reminderTime || !reminderMessage.trim() || !leadName.trim()) {
      toast({
        title: "⚠️ Missing Information",
        description: "Please fill in all required fields (lead name, date, time, and message).",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Validate date is not in the past
    const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
    if (reminderDateTime < new Date()) {
      toast({
        title: "⚠️ Invalid Date/Time",
        description: "Reminder date and time cannot be in the past.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Show loading state
    setIsSaving(true);
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (editingReminder) {
      // Update existing reminder
      setReminders(reminders.map(r => 
        r.id === editingReminder.id
          ? {
              ...r,
              leadName,
              date: reminderDate,
              time: reminderTime,
              message: reminderMessage,
              priority: reminderPriority,
              category: reminderCategory,
              notifyBefore: reminderNotifyBefore
            }
          : r
      ));

      toast({
        title: "✅ Reminder Updated",
        description: "Reminder updated successfully",
        duration: 3000,
      });

      setEditingReminder(null);
    } else {
      // Create new reminder
      const newReminder: Reminder = {
        id: String(Date.now()),
        leadName,
        date: reminderDate,
        time: reminderTime,
        message: reminderMessage,
        priority: reminderPriority,
        category: reminderCategory,
        notifyBefore: reminderNotifyBefore,
        createdBy: "Current User",
        createdAt: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        }),
        completed: false
      };

      setReminders([newReminder, ...reminders]);

      toast({
        title: "✅ Reminder Set",
        description: `Follow-up reminder scheduled for ${new Date(reminderDate).toLocaleDateString()} at ${reminderTime}`,
        duration: 3000,
      });
    }

    // Clear form
    setLeadName("");
    setReminderDate("");
    setReminderTime("");
    setReminderMessage("");
    setReminderPriority("medium");
    setReminderCategory("follow-up");
    setReminderNotifyBefore(15);
    setIsSaving(false);
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setLeadName(reminder.leadName);
    setReminderDate(reminder.date);
    setReminderTime(reminder.time);
    setReminderMessage(reminder.message);
    setReminderPriority(reminder.priority);
    setReminderCategory(reminder.category);
    setReminderNotifyBefore(reminder.notifyBefore);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this reminder?')) {
      setReminders(reminders.filter(r => r.id !== id));
      toast({
        title: "🗑️ Reminder Deleted",
        description: "The reminder has been removed.",
        duration: 2000,
      });
    }
  };

  const handleToggleComplete = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const handleSnooze = (id: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setReminders(reminders.map(r => 
      r.id === id
        ? { ...r, date: tomorrow.toISOString().split('T')[0] }
        : r
    ));
    
    toast({
      title: "⏰ Reminder Snoozed",
      description: "Reminder postponed until tomorrow",
      duration: 2000,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Lead Management - Follow Up Reminders</h1>
              <p className="text-sm text-gray-600">Schedule and manage follow-up reminders for all leads</p>
            </div>
          </div>
        </div>

        {/* Enhanced Features Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg shadow-lg mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">✨ Enhanced Follow-up Reminder System</h3>
              <p className="text-sm text-purple-100">Complete reminder management with priority, categories, and smart notifications</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-purple-600" />
                </div>
                <Badge className="bg-purple-600">{reminders.length}</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
              <p className="text-sm text-gray-600">Total Reminders</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <Badge className="bg-green-600">{reminders.filter(r => !r.completed).length}</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">{reminders.filter(r => !r.completed).length}</p>
              <p className="text-sm text-gray-600">Active</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <Badge className="bg-red-600">
                  {reminders.filter(r => {
                    const reminderDateTime = new Date(`${r.date}T${r.time}`);
                    return reminderDateTime < new Date() && !r.completed;
                  }).length}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {reminders.filter(r => {
                  const reminderDateTime = new Date(`${r.date}T${r.time}`);
                  return reminderDateTime < new Date() && !r.completed;
                }).length}
              </p>
              <p className="text-sm text-gray-600">Overdue</p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock3 className="w-5 h-5 text-yellow-600" />
                </div>
                <Badge className="bg-yellow-600">
                  {reminders.filter(r => {
                    const reminderDateTime = new Date(`${r.date}T${r.time}`);
                    return reminderDateTime > new Date() && 
                           reminderDateTime < new Date(Date.now() + 24 * 60 * 60 * 1000) &&
                           !r.completed;
                  }).length}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {reminders.filter(r => {
                  const reminderDateTime = new Date(`${r.date}T${r.time}`);
                  return reminderDateTime > new Date() && 
                         reminderDateTime < new Date(Date.now() + 24 * 60 * 60 * 1000) &&
                         !r.completed;
                }).length}
              </p>
              <p className="text-sm text-gray-600">Due Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Reminder Form */}
        <Card className="border-2 border-purple-200 shadow-md mb-6">
          <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-purple-900">
              <Bell className="w-5 h-5" />
              {editingReminder ? "Edit Follow-up Reminder" : "Schedule Follow-up Reminder"}
            </CardTitle>
            <CardDescription className="text-sm">
              {editingReminder ? "Update an existing reminder" : "Create a new reminder for a lead"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4">
            {/* Lead Name */}
            <div className="space-y-2">
              <Label htmlFor="lead-name" className="text-sm font-medium flex items-center gap-1">
                <User className="w-4 h-4 text-purple-600" />
                Lead Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lead-name"
                placeholder="Enter lead name or company..."
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="text-sm w-full border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label htmlFor="reminder-date" className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Reminder Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="reminder-date"
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="text-sm w-full border-purple-200 focus:border-purple-400 focus:ring-purple-400 h-10"
                />
                {/* Quick Date Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReminderDate(new Date().toISOString().split('T')[0])}
                    className="text-xs h-7 border-purple-200 hover:bg-purple-50"
                  >
                    Today
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setReminderDate(tomorrow.toISOString().split('T')[0]);
                    }}
                    className="text-xs h-7 border-purple-200 hover:bg-purple-50"
                  >
                    Tomorrow
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const nextWeek = new Date();
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      setReminderDate(nextWeek.toISOString().split('T')[0]);
                    }}
                    className="text-xs h-7 border-purple-200 hover:bg-purple-50"
                  >
                    Next Week
                  </Button>
                </div>
                {reminderDate && new Date(reminderDate) < new Date(new Date().setHours(0, 0, 0, 0)) && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Date cannot be in the past
                  </p>
                )}
                {reminderDate && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {new Date(reminderDate).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                )}
              </div>
              
              {/* Time Picker */}
              <div className="space-y-2">
                <Label htmlFor="reminder-time" className="text-sm font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Reminder Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="text-sm w-full border-purple-200 focus:border-purple-400 focus:ring-purple-400 h-10"
                />
                {/* Quick Time Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReminderTime("09:00")}
                    className="text-xs h-7 border-purple-200 hover:bg-purple-50"
                  >
                    9:00 AM
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReminderTime("14:00")}
                    className="text-xs h-7 border-purple-200 hover:bg-purple-50"
                  >
                    2:00 PM
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReminderTime("17:00")}
                    className="text-xs h-7 border-purple-200 hover:bg-purple-50"
                  >
                    5:00 PM
                  </Button>
                </div>
                {reminderTime && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {new Date(`2000-01-01T${reminderTime}`).toLocaleTimeString('en-US', { 
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Priority Selector */}
              <div className="space-y-2">
                <Label htmlFor="reminder-priority" className="text-sm font-medium flex items-center gap-1">
                  <Flag className="w-4 h-4 text-purple-600" />
                  Priority
                </Label>
                <Select
                  value={reminderPriority}
                  onValueChange={(value: "high" | "medium" | "low") => setReminderPriority(value)}
                >
                  <SelectTrigger className="w-full text-sm border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high" className="text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        High Priority
                      </span>
                    </SelectItem>
                    <SelectItem value="medium" className="text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        Medium Priority
                      </span>
                    </SelectItem>
                    <SelectItem value="low" className="text-sm">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Low Priority
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <Label htmlFor="reminder-category" className="text-sm font-medium flex items-center gap-1">
                  <TagIcon className="w-4 h-4 text-purple-600" />
                  Category
                </Label>
                <Select
                  value={reminderCategory}
                  onValueChange={setReminderCategory}
                >
                  <SelectTrigger className="w-full text-sm border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follow-up" className="text-sm">Follow-up Call</SelectItem>
                    <SelectItem value="meeting" className="text-sm">Schedule Meeting</SelectItem>
                    <SelectItem value="email" className="text-sm">Send Email</SelectItem>
                    <SelectItem value="proposal" className="text-sm">Send Proposal</SelectItem>
                    <SelectItem value="demo" className="text-sm">Product Demo</SelectItem>
                    <SelectItem value="contract" className="text-sm">Contract Review</SelectItem>
                    <SelectItem value="other" className="text-sm">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notify Before */}
              <div className="space-y-2">
                <Label htmlFor="reminder-notify" className="text-sm font-medium flex items-center gap-1">
                  <Bell className="w-4 h-4 text-purple-600" />
                  Notify Before
                </Label>
                <Select
                  value={String(reminderNotifyBefore)}
                  onValueChange={(value) => setReminderNotifyBefore(Number(value))}
                >
                  <SelectTrigger className="w-full text-sm border-purple-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5" className="text-sm">5 minutes</SelectItem>
                    <SelectItem value="15" className="text-sm">15 minutes</SelectItem>
                    <SelectItem value="30" className="text-sm">30 minutes</SelectItem>
                    <SelectItem value="60" className="text-sm">1 hour</SelectItem>
                    <SelectItem value="120" className="text-sm">2 hours</SelectItem>
                    <SelectItem value="1440" className="text-sm">1 day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Reminder Message */}
            <div className="space-y-2">
              <Label htmlFor="reminder-message" className="text-sm font-medium flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                Reminder Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reminder-message"
                placeholder="Enter reminder message... (e.g., 'Follow up on pricing proposal')" 
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                rows={4}
                className="text-sm resize-none border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
              
              {/* Message Templates */}
              <div className="space-y-2">
                <p className="text-xs text-gray-600 font-medium">Quick Templates:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReminderMessage("Follow up on pricing proposal and address any concerns")}
                    className="text-xs h-7 border-purple-200 hover:bg-purple-50"
                  >
                    💰 Pricing Follow-up
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReminderMessage("Schedule product demo and walkthrough key features")}
                    className="text-xs h-7 border-purple-200 hover:bg-purple-50"
                  >
                    🎯 Demo Request
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReminderMessage("Send contract documents for review and signature")}
                    className="text-xs h-7 border-purple-200 hover:bg-purple-50"
                  >
                    📄 Contract Review
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReminderMessage("Check in on decision timeline and next steps")}
                    className="text-xs h-7 border-purple-200 hover:bg-purple-50"
                  >
                    ⏰ Decision Check
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setReminderMessage("Send additional information and case studies as requested")}
                    className="text-xs h-7 border-purple-200 hover:bg-purple-50"
                  >
                    📚 Share Resources
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{reminderMessage.length} / 500 characters</p>
                {reminderMessage.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setReminderMessage("")}
                    className="text-xs h-6 text-gray-500 hover:text-red-600"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              {editingReminder && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingReminder(null);
                    setLeadName("");
                    setReminderDate("");
                    setReminderTime("");
                    setReminderMessage("");
                    setReminderPriority("medium");
                    setReminderCategory("follow-up");
                    setReminderNotifyBefore(15);
                  }}
                  className="w-full sm:w-auto border-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSaveReminder}
                disabled={isSaving}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingReminder ? "Update Reminder" : "Save Reminder"}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reminders List */}
        {reminders.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <History className="w-4 h-4" />
                Scheduled Reminders ({reminders.filter(r => !r.completed).length} active)
              </h3>
              {reminders.filter(r => r.completed).length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {reminders.filter(r => r.completed).length} completed
                </Badge>
              )}
            </div>
            
            {reminders
              .sort((a, b) => {
                // Sort by completed status first, then by date/time
                if (a.completed && !b.completed) return 1;
                if (!a.completed && b.completed) return -1;
                return new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime();
              })
              .map(reminder => {
                const reminderDateTime = new Date(`${reminder.date}T${reminder.time}`);
                const isOverdue = reminderDateTime < new Date() && !reminder.completed;
                const isUpcoming = reminderDateTime > new Date() && reminderDateTime < new Date(Date.now() + 24 * 60 * 60 * 1000);
                
                return (
                  <Card key={reminder.id} className={`border-2 transition-all ${
                    reminder.completed 
                      ? 'border-gray-200 bg-gray-50' 
                      : isOverdue
                        ? 'border-red-300 bg-red-50 hover:border-red-400 hover:shadow-md'
                        : isUpcoming
                          ? 'border-yellow-300 bg-yellow-50 hover:border-yellow-400 hover:shadow-md'
                          : 'border-purple-200 hover:border-purple-300 hover:shadow-md bg-white'
                  }`}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={reminder.completed || false}
                          onChange={() => handleToggleComplete(reminder.id)}
                          className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Priority and Category Badges */}
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {reminder.priority && (
                              <Badge 
                                variant="outline"
                                className={`text-xs ${
                                  reminder.priority === "high"
                                    ? "border-red-300 bg-red-50 text-red-700"
                                    : reminder.priority === "medium"
                                      ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                                      : "border-green-300 bg-green-50 text-green-700"
                                }`}
                              >
                                <Flag className="w-3 h-3 mr-1" />
                                {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)}
                              </Badge>
                            )}
                            {reminder.category && (
                              <Badge variant="outline" className="text-xs border-purple-300 bg-purple-50 text-purple-700">
                                <TagIcon className="w-3 h-3 mr-1" />
                                {reminder.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                              </Badge>
                            )}
                            {isOverdue && !reminder.completed && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                            {isUpcoming && !reminder.completed && (
                              <Badge className="text-xs bg-yellow-500">
                                <Clock3 className="w-3 h-3 mr-1" />
                                Due Soon
                              </Badge>
                            )}
                          </div>

                          {/* Lead Name */}
                          <p className="text-xs text-gray-500 mb-1 font-medium">
                            {reminder.leadName}
                          </p>

                          {/* Message */}
                          <p className={`text-sm sm:text-base mb-2 leading-relaxed ${
                            reminder.completed ? 'line-through text-gray-400' : 'text-gray-700 font-medium'
                          }`}>
                            {reminder.message}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className={`flex items-center gap-1 px-2 py-1 rounded ${
                              isOverdue && !reminder.completed ? 'bg-red-100 text-red-700' : 'bg-purple-50'
                            }`}>
                              <Calendar className="w-3 h-3" />
                              {new Date(reminder.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                            <span className={`flex items-center gap-1 px-2 py-1 rounded ${
                              isOverdue && !reminder.completed ? 'bg-red-100 text-red-700' : 'bg-pink-50'
                            }`}>
                              <Clock className="w-3 h-3" />
                              {reminder.time}
                            </span>
                            {reminder.notifyBefore && (
                              <span className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                                <Bell className="w-3 h-3" />
                                {reminder.notifyBefore >= 1440 
                                  ? `${reminder.notifyBefore / 1440} day${reminder.notifyBefore / 1440 > 1 ? 's' : ''} before`
                                  : reminder.notifyBefore >= 60
                                    ? `${reminder.notifyBefore / 60} hr${reminder.notifyBefore / 60 > 1 ? 's' : ''} before`
                                    : `${reminder.notifyBefore} min before`
                                }
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {reminder.createdBy}
                            </span>
                            {reminder.createdAt && (
                              <>
                                <span>•</span>
                                <span className="text-gray-400">{reminder.createdAt}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!reminder.completed && (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEdit(reminder)}
                                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit reminder</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleSnooze(reminder.id)}
                                      className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                                    >
                                      <Clock3 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Snooze until tomorrow</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          )}

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(reminder.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete reminder</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            }
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Bell className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-sm sm:text-base font-medium">No reminders scheduled yet</p>
            <p className="text-xs mt-1">Create your first reminder above to stay on top of follow-ups</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
