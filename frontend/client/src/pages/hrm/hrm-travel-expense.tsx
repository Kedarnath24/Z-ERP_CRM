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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  ArrowLeft,
  FileText,
  MapPin,
  Calendar,
  MoreVertical,
  Eye,
  Trash2,
  AlertCircle,
  Briefcase,
  Globe,
  Wallet
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Shared StatCard component
const StatCard = ({ title, value, icon: Icon, description, trend, color }: any) => (
  <Card className="overflow-hidden border-none shadow-sm bg-white/50 backdrop-blur-md">
    <CardContent className="p-6">
      <div className="flex justify-between items-start text-slate-600">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-slate-900">{value}</h3>
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
          {trend && (
            <div className={`flex items-center mt-2 text-xs font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function TravelExpense() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('travel');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);

  // Mock data - Travel requests
  const travelRequests = useMemo(() => [
    {
      id: 'TRV-2025-001',
      employee: 'John Smith',
      empId: 'EMP-001',
      destination: 'New York, USA',
      purpose: 'Client Quarterly Review',
      fromDate: '2025-06-20',
      toDate: '2025-06-23',
      days: 3,
      estimatedCost: 2500,
      status: 'approved',
      avatar: 'https://i.pravatar.cc/150?u=1'
    },
    {
      id: 'TRV-2025-002',
      employee: 'Sarah Johnson',
      empId: 'EMP-002',
      destination: 'London, UK',
      purpose: 'Tech Summit 2025',
      fromDate: '2025-07-01',
      toDate: '2025-07-05',
      days: 4,
      estimatedCost: 3200,
      status: 'pending',
      avatar: 'https://i.pravatar.cc/150?u=2'
    },
    {
      id: 'TRV-2025-003',
      employee: 'Mike Brown',
      empId: 'EMP-003',
      destination: 'San Francisco, USA',
      purpose: 'Security Training',
      fromDate: '2025-06-25',
      toDate: '2025-06-27',
      days: 2,
      estimatedCost: 1800,
      status: 'rejected',
      avatar: 'https://i.pravatar.cc/150?u=3'
    },
    {
      id: 'TRV-2025-004',
      employee: 'Emily Davis',
      empId: 'EMP-004',
      destination: 'Tokyo, Japan',
      purpose: 'Partner Workshop',
      fromDate: '2025-08-10',
      toDate: '2025-08-15',
      days: 5,
      estimatedCost: 4500,
      status: 'pending',
      avatar: 'https://i.pravatar.cc/150?u=4'
    }
  ], []);

  // Mock data - Expense claims
  const expenseClaims = useMemo(() => [
    {
      id: 'EXP-2145',
      employee: 'Emily Davis',
      empId: 'EMP-004',
      category: 'Transportation',
      amount: 150.50,
      claimDate: '2025-06-12',
      description: 'Taxi fare for client visit',
      billAttached: true,
      status: 'approved',
      avatar: 'https://i.pravatar.cc/150?u=4'
    },
    {
      id: 'EXP-2146',
      employee: 'Alex Wilson',
      empId: 'EMP-005',
      category: 'Meals',
      amount: 85.25,
      claimDate: '2025-06-14',
      description: 'Team dinner with clients',
      billAttached: true,
      status: 'pending',
      avatar: 'https://i.pravatar.cc/150?u=5'
    },
    {
      id: 'EXP-2147',
      employee: 'Lisa Anderson',
      empId: 'EMP-006',
      category: 'Accommodation',
      amount: 450.00,
      claimDate: '2025-06-10',
      description: 'Hotel stay - Business trip',
      billAttached: true,
      status: 'approved',
      avatar: 'https://i.pravatar.cc/150?u=6'
    },
    {
      id: 'EXP-2148',
      employee: 'David Miller',
      empId: 'EMP-007',
      category: 'Other',
      amount: 25.00,
      claimDate: '2025-06-15',
      description: 'Office supplies',
      billAttached: false,
      status: 'rejected',
      avatar: 'https://i.pravatar.cc/150?u=7'
    }
  ], []);

  const filteredTravel = travelRequests.filter(req => 
    req.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClaims = expenseClaims.filter(claim => 
    claim.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    claim.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    claim.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
    approved: { label: 'Approved', class: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    rejected: { label: 'Rejected', class: 'bg-red-100 text-red-700 border-red-200', icon: XCircle }
  };

  const handleExport = (type: 'excel' | 'pdf') => {
    const data = activeTab === 'travel' ? filteredTravel : filteredClaims;
    
    if (type === 'excel') {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Travel_Expense");
      XLSX.writeFile(wb, `HRM_Travel_Expense_${new Date().toISOString().split('T')[0]}.xlsx`);
    } else {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text(activeTab === 'travel' ? 'Travel Requests Report' : 'Expense Claims Report', 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);

      const tableData = data.map((item: any) => 
        activeTab === 'travel' 
          ? [item.id, item.employee, item.destination, item.fromDate, item.status, `$${item.estimatedCost}`]
          : [item.id, item.employee, item.category, item.claimDate, item.status, `$${item.amount.toFixed(2)}`]
      );

      autoTable(doc, {
        startY: 40,
        head: [activeTab === 'travel' 
          ? ['ID', 'Employee', 'Destination', 'Date', 'Status', 'Est. Cost']
          : ['ID', 'Employee', 'Category', 'Date', 'Status', 'Amount']],
        body: tableData,
      });

      doc.save(`HRM_Travel_Expense_${new Date().toISOString().split('T')[0]}.pdf`);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-slate-50/50">
        {/* Modern Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-slate-100"
                onClick={() => setLocation('/hrm')}
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-600 rounded-lg">
                    <Plane className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Travel & Expense</h1>
                </div>
                <p className="text-sm text-slate-500 font-medium">Global mobility and reimbursement management</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white">
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-200">
                    <Plus className="h-4 w-4 mr-2" /> New Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Apply for Professional Travel</DialogTitle>
                    <DialogDescription>Submit your travel itinerary and purpose for administrative approval.</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-6 py-6">
                    <div className="col-span-2 space-y-2">
                      <Label>Professional Destination</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input placeholder="City, Country (e.g., Zurich, Switzerland)" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Starting Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input type="date" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Return Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input type="date" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Primary Purpose</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Reason for travel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Client Engagement</SelectItem>
                          <SelectItem value="conference">Global Summit / Conference</SelectItem>
                          <SelectItem value="training">Internal Upskilling</SelectItem>
                          <SelectItem value="operations">Strategic Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated Budget (USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input type="number" placeholder="0.00" className="pl-10" />
                      </div>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Brief Itinerary & Justification</Label>
                      <Textarea placeholder="Describe the strategic value of this trip..." rows={4} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
                    <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => setIsRequestDialogOpen(false)}>Submit Application</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-2">
              <StatCard 
                title="Active Missions"
                value="28"
                description="Staff currently on mission"
                icon={Globe}
                color="bg-pink-100 text-pink-600"
              />
              <StatCard 
                title="Approved Claims"
                value="145"
                description="Processed this quarter"
                icon={CheckCircle}
                color="bg-emerald-100 text-emerald-600"
              />
              <StatCard 
                title="Pending T&E"
                value="32"
                description="Awaiting review"
                icon={Clock}
                color="bg-amber-100 text-amber-600"
              />
              <StatCard 
                title="Monthly Spend"
                value="$48,520"
                trend={{ value: '+12% vs last month', positive: false }}
                icon={Wallet}
                color="bg-slate-100 text-slate-600"
              />
            </div>

            {/* Main Content Area */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                <TabsList className="bg-slate-200/50 p-1">
                  <TabsTrigger value="travel" className="data-[state=active]:bg-white">Travel Requests</TabsTrigger>
                  <TabsTrigger value="expenses" className="data-[state=active]:bg-white">Expense Claims</TabsTrigger>
                  <TabsTrigger value="advance" className="data-[state=active]:bg-white">Travel Advance</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Search ID, staff, or location..." 
                      className="pl-10 w-full md:w-[300px] bg-white border-slate-300 focus:ring-pink-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon" className="bg-white border-slate-300">
                    <Filter className="h-4 w-4 text-slate-600" />
                  </Button>
                </div>
              </div>

              {/* Travel Requests Table */}
              <TabsContent value="travel" className="m-0">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-[120px]">Request ID</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Estimated Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTravel.map((req) => {
                      const status = statusConfig[req.status];
                      return (
                        <TableRow key={req.id} className="hover:bg-slate-50/80 transition-colors">
                          <TableCell className="font-bold text-slate-700">{req.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                <AvatarImage src={req.avatar} />
                                <AvatarFallback className="bg-pink-100 text-pink-700">{req.employee.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-slate-900 leading-none">{req.employee}</p>
                                <p className="text-xs text-slate-500 mt-1">{req.empId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-pink-500" />
                              <span className="text-sm font-medium">{req.destination}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium">{req.fromDate} to {req.toDate}</p>
                              <p className="text-xs text-slate-500">{req.days} Business Days</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-bold text-slate-900">${req.estimatedCost.toLocaleString()}</p>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${status.class} border shadow-none flex items-center w-fit gap-1.5 px-2.5 py-0.5`}>
                              <status.icon className="h-3.5 w-3.5" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem className="gap-2 focus:text-pink-600">
                                  <Eye className="h-4 w-4" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2">
                                  <FileText className="h-4 w-4" /> Download PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-600">
                                  <Trash2 className="h-4 w-4" /> Cancel Request
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Expense Claims Table */}
              <TabsContent value="expenses" className="m-0">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-[120px]">Claim ID</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date Applied</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Receipt</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClaims.map((claim) => {
                      const status = statusConfig[claim.status];
                      return (
                        <TableRow key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                          <TableCell className="font-bold text-slate-700">{claim.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                <AvatarImage src={claim.avatar} />
                                <AvatarFallback className="bg-blue-100 text-blue-700">{claim.employee.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-slate-900 leading-none">{claim.employee}</p>
                                <p className="text-xs text-slate-500 mt-1">{claim.empId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-white px-2 py-0 border-slate-200 text-slate-600 font-medium">
                              {claim.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">{claim.claimDate}</span>
                          </TableCell>
                          <TableCell>
                            <p className="font-bold text-slate-900">${claim.amount.toFixed(2)}</p>
                          </TableCell>
                          <TableCell>
                            {claim.billAttached ? (
                              <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 cursor-pointer flex w-fit gap-1 items-center px-2 py-0.5">
                                <Receipt className="h-3 w-3" /> Attached
                              </Badge>
                            ) : (
                              <span className="text-xs text-slate-400 italic">No receipt</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${status.class} border shadow-none flex items-center w-fit gap-1.5 px-2.5 py-0.5`}>
                              <status.icon className="h-3.5 w-3.5" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                               <MoreVertical className="h-4 w-4" />
                             </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TabsContent>

               <TabsContent value="advance" className="m-0">
               <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                      <Briefcase className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No Advance Requests Available</h3>
                    <p className="text-sm text-slate-500 max-w-[400px] text-center mt-1 font-medium">
                      Start your journey by requesting a travel advance for approved professional trips. All advances are reconciled post-travel.
                    </p>
                 </div>
            </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </DashboardLayout>
  );
}
