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
  Plane, 
  Plus,
  Download,
  Search,
  Filter,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Receipt,
  ArrowLeft
} from 'lucide-react';

export default function TravelExpense() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('travel');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - Travel requests
  const travelRequests = [
    {
      id: 'TRV001',
      employee: 'John Smith',
      empId: 'EMP001',
      destination: 'New York, USA',
      purpose: 'Client Meeting',
      fromDate: '2025-06-20',
      toDate: '2025-06-23',
      days: 3,
      estimatedCost: '$2,500',
      status: 'approved',
      avatar: 'JS'
    },
    {
      id: 'TRV002',
      employee: 'Sarah Johnson',
      empId: 'EMP002',
      destination: 'London, UK',
      purpose: 'Conference',
      fromDate: '2025-07-01',
      toDate: '2025-07-05',
      days: 4,
      estimatedCost: '$3,200',
      status: 'pending',
      avatar: 'SJ'
    },
    {
      id: 'TRV003',
      employee: 'Mike Brown',
      empId: 'EMP003',
      destination: 'San Francisco, USA',
      purpose: 'Training',
      fromDate: '2025-06-25',
      toDate: '2025-06-27',
      days: 2,
      estimatedCost: '$1,800',
      status: 'rejected',
      avatar: 'MB'
    }
  ];

  // Mock data - Expense claims
  const expenseClaims = [
    {
      id: 'EXP001',
      employee: 'Emily Davis',
      empId: 'EMP004',
      category: 'Transportation',
      amount: '$150',
      claimDate: '2025-06-12',
      description: 'Taxi fare for client visit',
      billAttached: true,
      status: 'approved',
      avatar: 'ED'
    },
    {
      id: 'EXP002',
      employee: 'Alex Wilson',
      empId: 'EMP005',
      category: 'Meals',
      amount: '$85',
      claimDate: '2025-06-14',
      description: 'Team dinner with clients',
      billAttached: true,
      status: 'pending',
      avatar: 'AW'
    },
    {
      id: 'EXP003',
      employee: 'Lisa Anderson',
      empId: 'EMP006',
      category: 'Accommodation',
      amount: '$450',
      claimDate: '2025-06-10',
      description: 'Hotel stay - Business trip',
      billAttached: true,
      status: 'approved',
      avatar: 'LA'
    }
  ];

  const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
    approved: { label: 'Approved', class: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    rejected: { label: 'Rejected', class: 'bg-red-100 text-red-700 border-red-200', icon: XCircle }
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
              <div className="p-2 bg-pink-100 rounded-lg">
                <Plane className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Travel & Expense</h1>
                <p className="text-sm text-slate-600">Manage travel requests, expense claims, and reimbursements</p>
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
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Travel Request</DialogTitle>
                  <DialogDescription>Submit a new travel request for approval</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="travel-destination">Destination</Label>
                    <Input id="travel-destination" placeholder="City, Country" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travel-purpose">Purpose of Travel</Label>
                    <Select>
                      <SelectTrigger id="travel-purpose">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Client Meeting</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="travel-from">From Date</Label>
                      <Input id="travel-from" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="travel-to">To Date</Label>
                      <Input id="travel-to" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travel-cost">Estimated Cost</Label>
                    <Input id="travel-cost" placeholder="$2,500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="travel-details">Additional Details</Label>
                    <Textarea id="travel-details" placeholder="Provide more information..." rows={3} />
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
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Plane className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">28</p>
                  <p className="text-xs text-slate-600">Active Trips</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">145</p>
                  <p className="text-xs text-slate-600">Approved Claims</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">32</p>
                  <p className="text-xs text-slate-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">$48.5K</p>
                  <p className="text-xs text-slate-600">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="travel">Travel Requests</TabsTrigger>
            <TabsTrigger value="expenses">Expense Claims</TabsTrigger>
            <TabsTrigger value="advance">Travel Advance</TabsTrigger>
            <TabsTrigger value="reimbursement">Reimbursements</TabsTrigger>
          </TabsList>

          {/* Travel Requests */}
          <TabsContent value="travel" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Travel Requests</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search requests..."
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
                      <TableHead>Destination</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>From Date</TableHead>
                      <TableHead>To Date</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Est. Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {travelRequests.map((request) => {
                      const StatusIcon = statusConfig[request.status].icon;
                      return (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-pink-100 text-pink-700 text-xs">
                                  {request.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{request.employee}</p>
                                <p className="text-xs text-slate-600">{request.empId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{request.destination}</TableCell>
                          <TableCell className="text-sm">{request.purpose}</TableCell>
                          <TableCell className="text-sm">{request.fromDate}</TableCell>
                          <TableCell className="text-sm">{request.toDate}</TableCell>
                          <TableCell className="text-sm">{request.days} days</TableCell>
                          <TableCell className="text-sm font-semibold">{request.estimatedCost}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusConfig[request.status].class}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[request.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {request.status === 'pending' ? (
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="text-green-600">
                                  Approve
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <Button variant="ghost" size="sm" className="text-blue-600">
                                View
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expense Claims */}
          <TabsContent value="expenses" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Expense Claims</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Submit Claim
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Submit Expense Claim</DialogTitle>
                      <DialogDescription>Submit a new expense claim for reimbursement</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="expense-category">Category</Label>
                        <Select>
                          <SelectTrigger id="expense-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="transport">Transportation</SelectItem>
                            <SelectItem value="meals">Meals</SelectItem>
                            <SelectItem value="accommodation">Accommodation</SelectItem>
                            <SelectItem value="supplies">Office Supplies</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expense-amount">Amount</Label>
                        <Input id="expense-amount" placeholder="$150" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expense-description">Description</Label>
                        <Textarea id="expense-description" placeholder="Provide details..." rows={3} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expense-bill">Bill / Receipt</Label>
                        <div className="flex items-center gap-2">
                          <Input id="expense-bill" type="file" />
                          <Button variant="outline" size="icon">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Submit Claim</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Claim Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Bill</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseClaims.map((claim) => {
                      const StatusIcon = statusConfig[claim.status].icon;
                      return (
                        <TableRow key={claim.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                                  {claim.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{claim.employee}</p>
                                <p className="text-xs text-slate-600">{claim.empId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{claim.category}</TableCell>
                          <TableCell className="text-sm font-semibold">{claim.amount}</TableCell>
                          <TableCell className="text-sm">{claim.claimDate}</TableCell>
                          <TableCell className="text-sm text-slate-600 max-w-xs truncate">{claim.description}</TableCell>
                          <TableCell>
                            {claim.billAttached && (
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                                <Receipt className="h-3 w-3 mr-1" />
                                Attached
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusConfig[claim.status].class}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[claim.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {claim.status === 'pending' ? (
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="text-green-600">
                                  Approve
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <Button variant="ghost" size="sm" className="text-blue-600">
                                View
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Travel Advance */}
          <TabsContent value="advance" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Travel Advance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center py-8">Travel advance management interface would be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reimbursements */}
          <TabsContent value="reimbursement" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reimbursements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center py-8">Reimbursement tracking interface would be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
