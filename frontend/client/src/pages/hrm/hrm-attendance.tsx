import { useState } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  ArrowLeft
} from 'lucide-react';

export default function AttendanceLeave() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - Today's attendance
  const attendance = [
    {
      id: 'EMP001',
      name: 'John Smith',
      department: 'Engineering',
      checkIn: '09:02 AM',
      checkOut: '-',
      status: 'present',
      hours: '4.5h',
      avatar: 'JS'
    },
    {
      id: 'EMP002',
      name: 'Sarah Johnson',
      department: 'Product',
      checkIn: '08:58 AM',
      checkOut: '06:15 PM',
      status: 'present',
      hours: '9.5h',
      avatar: 'SJ'
    },
    {
      id: 'EMP003',
      name: 'Mike Brown',
      department: 'Design',
      checkIn: '09:45 AM',
      checkOut: '-',
      status: 'late',
      hours: '3.5h',
      avatar: 'MB'
    },
    {
      id: 'EMP004',
      name: 'Emily Davis',
      department: 'Human Resources',
      checkIn: '-',
      checkOut: '-',
      status: 'leave',
      hours: '0h',
      avatar: 'ED'
    },
    {
      id: 'EMP005',
      name: 'Alex Wilson',
      department: 'Sales',
      checkIn: '-',
      checkOut: '-',
      status: 'absent',
      hours: '0h',
      avatar: 'AW'
    }
  ];

  // Mock data - Leave requests
  const leaveRequests = [
    {
      id: 'LR001',
      employee: 'Emily Davis',
      type: 'Sick Leave',
      from: '2025-06-15',
      to: '2025-06-16',
      days: 2,
      status: 'pending',
      reason: 'Medical checkup',
      avatar: 'ED'
    },
    {
      id: 'LR002',
      employee: 'Alex Wilson',
      type: 'Casual Leave',
      from: '2025-06-20',
      to: '2025-06-22',
      days: 3,
      status: 'approved',
      reason: 'Family function',
      avatar: 'AW'
    },
    {
      id: 'LR003',
      employee: 'Mike Brown',
      type: 'Work From Home',
      from: '2025-06-18',
      to: '2025-06-18',
      days: 1,
      status: 'approved',
      reason: 'Internet installation',
      avatar: 'MB'
    }
  ];

  const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
    present: { label: 'Present', class: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    absent: { label: 'Absent', class: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    late: { label: 'Late', class: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertCircle },
    leave: { label: 'On Leave', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: Coffee }
  };

  const leaveStatusConfig: Record<string, { label: string; class: string }> = {
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    approved: { label: 'Approved', class: 'bg-green-100 text-green-700 border-green-200' },
    rejected: { label: 'Rejected', class: 'bg-red-100 text-red-700 border-red-200' }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 -mx-6 -mt-6 px-6 py-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/hrm')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Attendance & Leave</h1>
                <p className="text-sm text-slate-600">Track attendance, manage leaves, and monitor work hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Coffee className="h-4 w-4 mr-2" />
                  Apply Leave
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Apply for Leave</DialogTitle>
                  <DialogDescription>Submit a leave request for approval</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="leave-type">Leave Type</Label>
                    <Select>
                      <SelectTrigger id="leave-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="casual">Casual Leave</SelectItem>
                        <SelectItem value="annual">Annual Leave</SelectItem>
                        <SelectItem value="wfh">Work From Home</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from-date">From Date</Label>
                      <Input id="from-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to-date">To Date</Label>
                      <Input id="to-date" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea id="reason" placeholder="Provide reason for leave..." rows={3} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Submit Request</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">235</p>
                  <p className="text-xs text-slate-600">Present Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">3</p>
                  <p className="text-xs text-slate-600">Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Coffee className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                  <p className="text-xs text-slate-600">On Leave</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">8</p>
                  <p className="text-xs text-slate-600">Late Arrivals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="today">Today's Attendance</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Summary</TabsTrigger>
            <TabsTrigger value="leave">Leave Requests</TabsTrigger>
            <TabsTrigger value="shift">Shift Management</TabsTrigger>
          </TabsList>

          {/* Today's Attendance */}
          <TabsContent value="today" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Attendance - June 15, 2025</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-48"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => {
                      const StatusIcon = statusConfig[record.status].icon;
                      return (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                  {record.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{record.name}</p>
                                <p className="text-xs text-slate-600">{record.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{record.department}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-slate-400" />
                              {record.checkIn}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-slate-400" />
                              {record.checkOut}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-medium">{record.hours}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusConfig[record.status].class}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[record.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monthly Summary */}
          <TabsContent value="monthly" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Monthly Summary - June 2025</CardTitle>
                  <Select defaultValue="june">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="june">June 2025</SelectItem>
                      <SelectItem value="may">May 2025</SelectItem>
                      <SelectItem value="april">April 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Total Working Days</p>
                    <p className="text-2xl font-bold text-slate-900">22</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Average Attendance</p>
                    <p className="text-2xl font-bold text-green-700">95.2%</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Total Leaves Taken</p>
                    <p className="text-2xl font-bold text-blue-700">38</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 text-center py-8">Monthly attendance chart would be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Requests */}
          <TabsContent value="leave" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Leave Requests</CardTitle>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                                {leave.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <p className="font-medium text-sm">{leave.employee}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{leave.type}</TableCell>
                        <TableCell className="text-sm">{leave.from}</TableCell>
                        <TableCell className="text-sm">{leave.to}</TableCell>
                        <TableCell className="text-sm font-medium">{leave.days} days</TableCell>
                        <TableCell className="text-sm text-slate-600 max-w-xs truncate">{leave.reason}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={leaveStatusConfig[leave.status].class}>
                            {leaveStatusConfig[leave.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {leave.status === 'pending' && (
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                                Approve
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shift Management */}
          <TabsContent value="shift" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shift Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center py-8">Shift management interface would be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
