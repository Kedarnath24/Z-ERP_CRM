import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Coffee,
  Download,
  Search,
  Filter,
  MoreVertical,
  ArrowLeft,
  CalendarDays,
  UserCheck,
  Plane,
  History,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Activity,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React from 'react';

// AttendanceLeave: Page component for tracking attendance and managing leave requests.
export default function AttendanceLeave() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const attendance = [
    { id: 'EMP001', name: 'John Smith', department: 'Engineering', checkIn: '09:02 AM', checkOut: '-', status: 'present', hours: '4.5h', avatar: 'JS' },
    { id: 'EMP002', name: 'Sarah Johnson', department: 'Product', checkIn: '08:58 AM', checkOut: '06:15 PM', status: 'present', hours: '9.5h', avatar: 'SJ' },
    { id: 'EMP003', name: 'Mike Brown', department: 'Design', checkIn: '09:45 AM', checkOut: '-', status: 'late', hours: '3.5h', avatar: 'MB' },
    { id: 'EMP004', name: 'Emily Davis', department: 'HR Management', checkIn: '-', checkOut: '-', status: 'leave', hours: '0h', avatar: 'ED' },
    { id: 'EMP005', name: 'Alex Wilson', department: 'Sales', checkIn: '-', checkOut: '-', status: 'absent', hours: '0h', avatar: 'AW' },
    { id: 'EMP006', name: 'Lisa Anderson', department: 'Marketing', checkIn: '09:05 AM', checkOut: '05:30 PM', status: 'present', hours: '8.2h', avatar: 'LA' }
  ];

  const leaveRequests = [
    { id: 'LR001', employee: 'Emily Davis', type: 'Sick Leave', from: '2025-06-15', to: '2025-06-16', days: 2, status: 'pending', reason: 'Medical checkup', avatar: 'ED' },
    { id: 'LR002', employee: 'Alex Wilson', type: 'Casual Leave', from: '2025-06-20', to: '2025-06-22', days: 3, status: 'approved', reason: 'Family function', avatar: 'AW' },
    { id: 'LR003', employee: 'Mike Brown', type: 'WFH', from: '2025-06-18', to: '2025-06-18', days: 1, status: 'approved', reason: 'Internet installation', avatar: 'MB' }
  ];

  const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
    present: { label: 'Present', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
    absent: { label: 'Absent', class: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle },
    late: { label: 'Late', class: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle },
    leave: { label: 'On Leave', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: Coffee }
  };

  const leaveStatusConfig: Record<string, { label: string; class: string }> = {
    pending: { label: 'Pending Approval', class: 'bg-amber-100 text-amber-700 border-amber-200' },
    approved: { label: 'Approved', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    rejected: { label: 'Rejected', class: 'bg-rose-100 text-rose-700 border-rose-200' }
  };

  const filteredAttendance = useMemo(() => {
    return attendance.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, attendance]);

  const handleExport = (type: 'excel' | 'pdf') => {
    setIsExporting(true);
    toast({ title: "Exporting...", description: `Preparing attendance report in ${type.toUpperCase()}.` });

    setTimeout(() => {
      if (type === 'excel') {
        const data = activeTab === 'today' ? attendance : leaveRequests;
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Report");
        XLSX.writeFile(wb, `HRM_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
      } else {
        const doc = new jsPDF();
        doc.text(`HRM Report - ${new Date().toLocaleDateString()}`, 14, 15);
        if (activeTab === 'today') {
          autoTable(doc, {
            startY: 25,
            head: [['ID', 'Employee', 'Department', 'Check In', 'Check Out', 'Hours', 'Status']],
            body: attendance.map(a => [a.id, a.name, a.department, a.checkIn, a.checkOut, a.hours, a.status]),
          });
        } else {
          autoTable(doc, {
            startY: 25,
            head: [['ID', 'Employee', 'Type', 'From', 'To', 'Days', 'Status']],
            body: leaveRequests.map(l => [l.id, l.employee, l.type, l.from, l.to, l.days, l.status]),
          });
        }
        doc.save(`HRM_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      }
      setIsExporting(false);
      toast({ title: "Export Ready", description: "Your report has been downloaded." });
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 -mx-6 -mt-6 px-6 py-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setLocation('/hrm')}
                className="hover:bg-slate-100 rounded-full transition-transform active:scale-95"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-600/10 rounded-xl">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Attendance & Leave</h1>
                  <p className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                    <Activity className="h-3.5 w-3.5" />
                    Real-time workforce monitoring
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 rounded-xl font-bold shadow-sm">
                    <Download className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Generate Report</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>Export Data</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleExport('excel')} className="cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-600" />
                    Attendance Matrix (Excel)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer">
                    <Printer className="h-4 w-4 mr-2 text-rose-600" />
                    Summary PDF Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-xl font-bold">
                    <Coffee className="h-4 w-4 mr-2" />
                    Apply for Leave
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                  <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
                    <DialogTitle className="text-2xl font-bold text-white tracking-tight">Apply for Leave</DialogTitle>
                    <DialogDescription className="text-blue-100 font-medium">Submit your request for administrative review</DialogDescription>
                  </div>
                  <div className="p-8 space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="leave-type" className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Leave Type</Label>
                      <Select>
                        <SelectTrigger id="leave-type" className="rounded-xl border-slate-200 h-11 bg-slate-50/50">
                          <SelectValue placeholder="Select leave category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="casual">Casual Leave</SelectItem>
                          <SelectItem value="annual">Annual Leave</SelectItem>
                          <SelectItem value="wfh">Work From Home (WFH)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="from-date" className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Start Date</Label>
                        <div className="relative">
                          <Input id="from-date" type="date" className="rounded-xl border-slate-200 h-11 pl-10" />
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="to-date" className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">End Date</Label>
                        <div className="relative">
                          <Input id="to-date" type="date" className="rounded-xl border-slate-200 h-11 pl-10" />
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason" className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Reason for Leave</Label>
                      <Textarea 
                        id="reason" 
                        placeholder="Please provide details about your request..." 
                        rows={3} 
                        className="rounded-xl border-slate-200 bg-slate-50/50 resize-none"
                      />
                    </div>
                  </div>
                  <div className="px-8 pb-8 flex gap-3">
                    <Button variant="ghost" className="flex-1 rounded-xl h-11 font-bold text-slate-500 hover:bg-slate-100">Cancel</Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-xl h-11 font-bold shadow-lg shadow-blue-100">Submit Request</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <StatCard title="Present Today" value="235" icon={<UserCheck />} color="emerald" sub="94% attendance rate" />
          <StatCard title="Absent" value="3" icon={<XCircle />} color="rose" sub="12% from last week" trend="down" />
          <StatCard title="On Leave" value="12" icon={<Coffee />} color="blue" sub="Planned absences today" />
          <StatCard title="Late Arrivals" value="8" icon={<Clock />} color="amber" sub="Above average" trend="up" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
            <TabsList className="bg-transparent h-auto p-0 gap-1">
              <TabsTrigger 
                value="today" 
                className={cn(
                  "px-6 py-2.5 rounded-xl transition-all font-bold",
                  activeTab === 'today' ? "bg-white text-emerald-600 shadow-sm border border-emerald-100/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                )}
              >
                Today's Feed
              </TabsTrigger>
              <TabsTrigger 
                value="monthly" 
                className={cn(
                  "px-6 py-2.5 rounded-xl transition-all font-bold",
                  activeTab === 'monthly' ? "bg-white text-blue-600 shadow-sm border border-blue-100/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                )}
              >
                Monthly Summary
              </TabsTrigger>
              <TabsTrigger 
                value="leave" 
                className={cn(
                  "px-6 py-2.5 rounded-xl transition-all font-bold",
                  activeTab === 'leave' ? "bg-white text-blue-600 shadow-sm border border-blue-100/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                )}
              >
                Leave Requests
              </TabsTrigger>
              <TabsTrigger 
                value="shift" 
                className={cn(
                  "px-6 py-2.5 rounded-xl transition-all font-bold",
                  activeTab === 'shift' ? "bg-white text-violet-600 shadow-sm border border-violet-100/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                )}
              >
                Shift Roster
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 px-2">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Search name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full md:w-[240px] bg-white border-slate-200 rounded-xl focus-visible:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          <TabsContent value="today" className="mt-6 space-y-4">
            <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Attendance Log</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <Badge variant="outline" className="rounded-full bg-emerald-50 text-emerald-600 border-emerald-100 font-bold px-3">Live Feed</Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/30 hover:bg-slate-50/30">
                    <TableHead className="w-[300px] font-bold text-slate-700">Team Member</TableHead>
                    <TableHead className="font-bold text-slate-700">Department</TableHead>
                    <TableHead className="font-bold text-slate-700">Check In</TableHead>
                    <TableHead className="font-bold text-slate-700">Check Out</TableHead>
                    <TableHead className="font-bold text-slate-700">Duration</TableHead>
                    <TableHead className="font-bold text-slate-700">Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance.map((row) => (
                    <TableRow key={row.id} className="group transition-colors hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-200 group-hover:scale-110 transition-transform">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.name}`} />
                            <AvatarFallback className="bg-blue-600 text-white font-bold">{row.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-900">{row.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-600">{row.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                          <Clock className="h-3.5 w-3.5 text-blue-500" />
                          {row.checkIn}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-400">{row.checkOut}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-100 text-slate-600 border-none font-bold">
                          {row.hours}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("rounded-lg px-2.5 py-1 border font-bold text-[10px] uppercase tracking-wider", statusConfig[row.status].class)}>
                          <div className="flex items-center gap-1.5">
                            {React.createElement(statusConfig[row.status].icon, { className: "h-3 w-3" })}
                            {statusConfig[row.status].label}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4 text-slate-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="leave" className="mt-6 space-y-4">
            <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/30">
                    <TableHead className="font-bold text-slate-700">Requester</TableHead>
                    <TableHead className="font-bold text-slate-700">Type</TableHead>
                    <TableHead className="font-bold text-slate-700">Duration</TableHead>
                    <TableHead className="font-bold text-slate-700">Status</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => (
                    <TableRow key={request.id} className="group hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.employee}`} />
                            <AvatarFallback>{request.avatar}</AvatarFallback>
                          </Avatar>
                          <p className="font-bold text-slate-900">{request.employee}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                          <Plane className="h-4 w-4 text-indigo-500" />
                          {request.type}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-700">{new Date(request.from).toLocaleDateString()} - {new Date(request.to).toLocaleDateString()}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{request.days} Days Total</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("rounded-full px-3 py-1 border font-bold text-[10px] uppercase", leaveStatusConfig[request.status].class)}>
                          {leaveStatusConfig[request.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 rounded-lg border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-bold text-xs"
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs"
                          >
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="monthly" className="mt-6">
            <Card className="border-dashed border-2 py-20 bg-slate-50/30 rounded-[1.5rem]">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <History className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Historical Reports Coming Soon</h3>
                <p className="text-sm text-slate-500 max-w-xs mt-1 font-medium">
                  We're finalizing the monthly visualization module. Check back shortly!
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shift" className="mt-6">
            <Card className="border-dashed border-2 py-20 bg-slate-50/30 rounded-[1.5rem]">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <Briefcase className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Shift Planning Module</h3>
                <p className="text-sm text-slate-500 max-w-xs mt-1 font-medium">
                  Dynamic shift scheduling and roster management is currently in beta.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon, color, sub, trend = 'none' }: { title: string, value: string, icon: React.ReactNode, color: string, sub: string, trend?: 'up' | 'down' | 'none' }) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100"
  };

  return (
    <Card className="rounded-2xl border-slate-200/60 shadow-sm hover:shadow-md transition-all group overflow-hidden">
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", colorMap[color])}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" }) : icon}
          </div>
          {trend !== 'none' && (
            <div className={cn(
              "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter",
              trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            )}>
              {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
              {trend === 'up' ? '+12%' : '-4%'}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900">{value}</h3>
          </div>
          <p className="text-[10px] text-slate-500 font-bold italic tracking-tight">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}
