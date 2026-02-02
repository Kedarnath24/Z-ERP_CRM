import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Download, Edit, Camera, Calendar as CalendarIcon, Clock, CheckCircle, XCircle, FileText, Shield, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import StatsCard from '@/components/StatsCard';

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'Approved' | 'Pending' | 'Rejected';
  reason?: string;
}

interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Leave' | 'Holiday';
  checkIn?: string;
  checkOut?: string;
}

interface PayrollRecord {
  id: string;
  month: string;
  gross: number;
  deductions: number;
  netSalary: number;
  paymentDate: string;
}

interface FaceIdSession {
  id: string;
  timestamp: string;
  type: 'Clock In' | 'Clock Out';
  status: 'Success' | 'Failed';
}

export default function EmployeeProfile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Mock employee data
  const employee = {
    id: 'EMP-2026-001',
    name: 'John Anderson',
    email: 'john.anderson@company.com',
    phone: '+1 555-0100',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    manager: 'Sarah Johnson',
    joinDate: '2024-03-15',
    status: 'Active',
    avatar: '',
    address: '123 Main Street, New York, NY 10001',
    emergencyContact: {
      name: 'Jane Anderson',
      relationship: 'Spouse',
      phone: '+1 555-0101',
    },
    bankDetails: {
      accountNumber: '****1234',
      bankName: 'First National Bank',
      routingNumber: '****5678',
    },
  };

  const insurancePolicies = [
    {
      id: '1',
      name: 'Health Insurance Premium',
      coverage: '$500,000',
      premium: '$250/month',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Life Insurance',
      coverage: '$1,000,000',
      premium: '$100/month',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Dental Coverage',
      coverage: '$50,000',
      premium: '$50/month',
      status: 'Active',
    },
  ];

  const leaveRequests: LeaveRequest[] = [
    {
      id: '1',
      type: 'Annual Leave',
      startDate: '2026-02-10',
      endDate: '2026-02-14',
      days: 5,
      status: 'Approved',
    },
    {
      id: '2',
      type: 'Sick Leave',
      startDate: '2026-01-20',
      endDate: '2026-01-21',
      days: 2,
      status: 'Approved',
    },
    {
      id: '3',
      type: 'Personal Leave',
      startDate: '2026-03-05',
      endDate: '2026-03-05',
      days: 1,
      status: 'Pending',
    },
  ];

  const payrollRecords: PayrollRecord[] = [
    {
      id: '1',
      month: 'December 2025',
      gross: 8500,
      deductions: 1200,
      netSalary: 7300,
      paymentDate: '2025-12-31',
    },
    {
      id: '2',
      month: 'November 2025',
      gross: 8500,
      deductions: 1200,
      netSalary: 7300,
      paymentDate: '2025-11-30',
    },
    {
      id: '3',
      month: 'October 2025',
      gross: 8500,
      deductions: 1200,
      netSalary: 7300,
      paymentDate: '2025-10-31',
    },
  ];

  const faceIdSessions: FaceIdSession[] = [
    {
      id: '1',
      timestamp: '2026-01-15 09:00 AM',
      type: 'Clock In',
      status: 'Success',
    },
    {
      id: '2',
      timestamp: '2026-01-14 05:30 PM',
      type: 'Clock Out',
      status: 'Success',
    },
    {
      id: '3',
      timestamp: '2026-01-14 09:15 AM',
      type: 'Clock In',
      status: 'Success',
    },
  ];

  // Leave balance data
  const leaveBalance = {
    total: 20,
    used: 7,
    pending: 1,
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Success':
      case 'Active':
      case 'Present':
        return 'default';
      case 'Pending':
        return 'outline';
      case 'Rejected':
      case 'Failed':
      case 'Absent':
        return 'destructive';
      case 'Leave':
      case 'Holiday':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const EditProfileModal = () => (
    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your personal information</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Full Name</Label>
              <Input id="editName" defaultValue={employee.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input id="editEmail" type="email" defaultValue={employee.email} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editPhone">Phone</Label>
              <Input id="editPhone" defaultValue={employee.phone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editAddress">Address</Label>
              <Input id="editAddress" defaultValue={employee.address} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowEditModal(false)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const RequestLeaveModal = () => (
    <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>Submit a new leave request</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <select id="leaveType" className="w-full border rounded-md p-2">
              <option>Annual Leave</option>
              <option>Sick Leave</option>
              <option>Personal Leave</option>
              <option>Emergency Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Input id="reason" placeholder="Reason for leave" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowLeaveModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowLeaveModal(false)}>Submit Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Profile Header */}
        <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={employee.avatar} />
                <AvatarFallback className="text-2xl">
                  {employee.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">{employee.name}</h2>
                <p className="text-muted-foreground">{employee.position}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {employee.employeeId}
                  </span>
                  <span>{employee.department}</span>
                  <Badge variant="default">{employee.status}</Badge>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowEditModal(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="faceid">Face ID</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        {/* TAB 1: PROFILE OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{employee.phone}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{employee.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{employee.department}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{employee.position}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Manager</p>
                  <p className="font-medium">{employee.manager}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Join Date</p>
                  <p className="font-medium">{employee.joinDate}</p>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{employee.emergencyContact.name}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Relationship</p>
                  <p className="font-medium">{employee.emergencyContact.relationship}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{employee.emergencyContact.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Bank Details */}
            <Card>
              <CardHeader>
                <CardTitle>Bank Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Bank Name</p>
                  <p className="font-medium">{employee.bankDetails.bankName}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="font-medium">{employee.bankDetails.accountNumber}</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Routing Number</p>
                  <p className="font-medium">{employee.bankDetails.routingNumber}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Employment Contract', 'ID Proof', 'Tax Forms', 'Certifications'].map((doc) => (
                  <Button key={doc} variant="outline" className="h-auto py-4 flex flex-col gap-2">
                    <FileText className="w-8 h-8" />
                    <span className="text-sm">{doc}</span>
                    <Download className="w-4 h-4" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: INSURANCE */}
        <TabsContent value="insurance" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {insurancePolicies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Shield className="w-8 h-8 text-primary" />
                    <Badge variant="default">{policy.status}</Badge>
                  </div>
                  <CardTitle className="text-lg">{policy.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Coverage</p>
                    <p className="text-xl font-bold">{policy.coverage}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Premium</p>
                    <p className="text-lg font-semibold">{policy.premium}</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: ATTENDANCE */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>
              <div className="mt-6 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">Leave</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span className="text-sm">Holiday</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: FACE ID ATTENDANCE */}
        <TabsContent value="faceid" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Camera UI */}
            <Card>
              <CardHeader>
                <CardTitle>Face ID Clock In/Out</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {isCameraActive ? (
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="w-16 h-16 text-gray-400" />
                      </div>
                      <div className="absolute inset-0 border-4 border-primary rounded-lg animate-pulse"></div>
                      <p className="absolute bottom-4 left-0 right-0 text-center text-white bg-black/50 py-2">
                        Position your face in the frame
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <Camera className="w-16 h-16 mx-auto text-gray-400" />
                      <p className="text-muted-foreground">Camera inactive</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => setIsCameraActive(!isCameraActive)}
                    variant={isCameraActive ? 'destructive' : 'default'}
                    className="w-full"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isCameraActive ? 'Clock Out' : 'Clock In'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's Status */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Clock In</span>
                    <span className="font-semibold">09:00 AM</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Clock Out</span>
                    <span className="font-semibold">--:-- --</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Work Hours</span>
                    <span className="font-semibold text-green-600">6h 15m</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faceIdSessions.slice(0, 5).map((session) => (
                      <div key={session.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{session.type}</p>
                            <p className="text-xs text-muted-foreground">{session.timestamp}</p>
                          </div>
                        </div>
                        <Badge variant={getStatusBadgeVariant(session.status)}>
                          {session.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 5: LEAVE MANAGEMENT */}
        <TabsContent value="leave" className="space-y-6">
          {/* Leave Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard
              title="Total Leaves"
              value={leaveBalance.total.toString()}
              description="Annual allocation"
            />
            <StatsCard
              title="Used"
              value={leaveBalance.used.toString()}
              description="Days taken"
            />
            <StatsCard
              title="Balance"
              value={(leaveBalance.total - leaveBalance.used).toString()}
              description="Days remaining"
            />
            <StatsCard
              title="Pending Requests"
              value={leaveBalance.pending.toString()}
              description="Awaiting approval"
            />
          </div>

          {/* Leave Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Leave Requests</CardTitle>
                <Button onClick={() => setShowLeaveModal(true)}>
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Request Leave
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">{leave.type}</TableCell>
                      <TableCell>{leave.startDate}</TableCell>
                      <TableCell>{leave.endDate}</TableCell>
                      <TableCell>{leave.days}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(leave.status)}>
                          {leave.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 6: PAYROLL */}
        <TabsContent value="payroll" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Salary Slips</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.month}</TableCell>
                      <TableCell>${record.gross.toLocaleString()}</TableCell>
                      <TableCell className="text-red-600">
                        -${record.deductions.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ${record.netSalary.toLocaleString()}
                      </TableCell>
                      <TableCell>{record.paymentDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <EditProfileModal />
      <RequestLeaveModal />
      </div>
    </DashboardLayout>
  );
}
