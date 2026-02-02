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
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Download,
  Search,
  Filter,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Settings,
  ArrowLeft
} from 'lucide-react';

export default function Payroll() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('processing');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('june-2025');

  // Mock data - Employee salaries
  const salaries = [
    {
      id: 'EMP001',
      name: 'John Smith',
      designation: 'Senior Software Engineer',
      basicSalary: 5000,
      allowances: 1500,
      deductions: 500,
      netSalary: 6000,
      status: 'processed',
      avatar: 'JS'
    },
    {
      id: 'EMP002',
      name: 'Sarah Johnson',
      designation: 'Product Manager',
      basicSalary: 6000,
      allowances: 2000,
      deductions: 600,
      netSalary: 7400,
      status: 'processed',
      avatar: 'SJ'
    },
    {
      id: 'EMP003',
      name: 'Mike Brown',
      designation: 'UI/UX Designer',
      basicSalary: 4000,
      allowances: 1200,
      deductions: 400,
      netSalary: 4800,
      status: 'pending',
      avatar: 'MB'
    },
    {
      id: 'EMP004',
      name: 'Emily Davis',
      designation: 'HR Manager',
      basicSalary: 5500,
      allowances: 1800,
      deductions: 550,
      netSalary: 6750,
      status: 'pending',
      avatar: 'ED'
    }
  ];

  const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
    processed: { label: 'Processed', class: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    hold: { label: 'On Hold', class: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle }
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Payroll Management</h1>
                <p className="text-sm text-slate-600">Process salaries, manage deductions, and generate payslips</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
          <div className="flex items-center gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="june-2025">June 2025</SelectItem>
                <SelectItem value="may-2025">May 2025</SelectItem>
                <SelectItem value="april-2025">April 2025</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">$485K</p>
                  <p className="text-xs text-slate-600">Total Payroll</p>
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
                  <p className="text-2xl font-bold text-slate-900">182</p>
                  <p className="text-xs text-slate-600">Processed</p>
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
                  <p className="text-2xl font-bold text-slate-900">48</p>
                  <p className="text-xs text-slate-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">5</p>
                  <p className="text-xs text-slate-600">On Hold</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="processing">Salary Processing</TabsTrigger>
            <TabsTrigger value="statutory">Statutory</TabsTrigger>
            <TabsTrigger value="payslips">Payslips</TabsTrigger>
            <TabsTrigger value="final">Full & Final</TabsTrigger>
          </TabsList>

          {/* Salary Processing */}
          <TabsContent value="processing" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Salary Processing - June 2025</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-48"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">Process Payroll</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Process Payroll - June 2025</DialogTitle>
                        <DialogDescription>
                          Review and confirm payroll processing for all employees
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 bg-slate-50 rounded-lg">
                            <p className="text-xs text-slate-600 mb-1">Total Employees</p>
                            <p className="text-xl font-bold text-slate-900">235</p>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-xs text-slate-600 mb-1">Total Amount</p>
                            <p className="text-xl font-bold text-purple-700">$485,000</p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-xs text-slate-600 mb-1">Processing Fee</p>
                            <p className="text-xl font-bold text-green-700">$485</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Processing progress</span>
                            <span className="font-medium">0%</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-700 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-yellow-900">Important</p>
                              <p className="text-yellow-700">Once processed, payroll cannot be modified. Please review all entries carefully.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline">Cancel</Button>
                        <Button>Confirm & Process</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead className="text-right">Basic Salary</TableHead>
                      <TableHead className="text-right">Allowances</TableHead>
                      <TableHead className="text-right">Deductions</TableHead>
                      <TableHead className="text-right">Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salaries.map((salary) => {
                      const StatusIcon = statusConfig[salary.status].icon;
                      return (
                        <TableRow key={salary.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-purple-100 text-purple-700 text-xs">
                                  {salary.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{salary.name}</p>
                                <p className="text-xs text-slate-600">{salary.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{salary.designation}</TableCell>
                          <TableCell className="text-right text-sm">${salary.basicSalary.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm text-green-600">+${salary.allowances.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm text-red-600">-${salary.deductions.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm font-semibold">${salary.netSalary.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusConfig[salary.status].class}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[salary.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="text-blue-600">
                              <FileText className="h-3 w-3 mr-1" />
                              View
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

          {/* Statutory */}
          <TabsContent value="statutory" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tax Deductions (TDS)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Total Deducted</span>
                      <span className="font-semibold">$48,500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Employees</span>
                      <span className="font-semibold">235</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Download className="h-3 w-3 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Provident Fund (PF)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Employee Contribution</span>
                      <span className="font-semibold">$28,200</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Employer Contribution</span>
                      <span className="font-semibold">$28,200</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Download className="h-3 w-3 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Professional Tax (PT)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Total Deducted</span>
                      <span className="font-semibold">$4,700</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Employees</span>
                      <span className="font-semibold">235</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      <Download className="h-3 w-3 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compliance Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-slate-900">TDS Returns Filed</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-slate-900">PF Returns Filed</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm font-medium text-slate-900">PT Payment Pending</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">Due June 30</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payslips */}
          <TabsContent value="payslips" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Payslips - June 2025</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Upload
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center py-8">Payslip management interface would be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Full & Final */}
          <TabsContent value="final" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Full & Final Settlement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center py-8">Full & final settlement interface would be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
