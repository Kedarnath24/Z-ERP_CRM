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
  Shield, 
  Plus,
  Download,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  ArrowLeft
} from 'lucide-react';

export default function Insurance() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('policies');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - Insurance policies
  const policies = [
    {
      id: 'POL001',
      employee: 'John Smith',
      empId: 'EMP001',
      policyType: 'Health Insurance',
      provider: 'XYZ Insurance Co.',
      policyNumber: 'HI-2025-001',
      coverage: '$50,000',
      premium: '$200/month',
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      avatar: 'JS'
    },
    {
      id: 'POL002',
      employee: 'Sarah Johnson',
      empId: 'EMP002',
      policyType: 'Life Insurance',
      provider: 'ABC Life Insurance',
      policyNumber: 'LI-2025-002',
      coverage: '$100,000',
      premium: '$150/month',
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      avatar: 'SJ'
    },
    {
      id: 'POL003',
      employee: 'Mike Brown',
      empId: 'EMP003',
      policyType: 'Health Insurance',
      provider: 'XYZ Insurance Co.',
      policyNumber: 'HI-2025-003',
      coverage: '$50,000',
      premium: '$200/month',
      status: 'pending',
      startDate: '2025-06-15',
      endDate: '2026-06-14',
      avatar: 'MB'
    }
  ];

  // Mock data - Claims
  const claims = [
    {
      id: 'CLM001',
      employee: 'Emily Davis',
      empId: 'EMP004',
      policyType: 'Health Insurance',
      claimAmount: '$2,500',
      claimDate: '2025-06-10',
      description: 'Medical treatment - Emergency',
      status: 'approved',
      approvedAmount: '$2,500',
      avatar: 'ED'
    },
    {
      id: 'CLM002',
      employee: 'Alex Wilson',
      empId: 'EMP005',
      policyType: 'Health Insurance',
      claimAmount: '$1,200',
      claimDate: '2025-06-12',
      description: 'Dental treatment',
      status: 'pending',
      approvedAmount: '-',
      avatar: 'AW'
    },
    {
      id: 'CLM003',
      employee: 'Lisa Anderson',
      empId: 'EMP006',
      policyType: 'Health Insurance',
      claimAmount: '$800',
      claimDate: '2025-06-05',
      description: 'Eye checkup and glasses',
      status: 'rejected',
      approvedAmount: '$0',
      avatar: 'LA'
    }
  ];

  const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
    active: { label: 'Active', class: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    expired: { label: 'Expired', class: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle },
    approved: { label: 'Approved', class: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    rejected: { label: 'Rejected', class: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle }
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
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Insurance Management</h1>
                <p className="text-sm text-slate-600">Manage employee insurance policies and claims</p>
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
                  Add Policy
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Insurance Policy</DialogTitle>
                  <DialogDescription>Create a new insurance policy for an employee</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee">Employee</Label>
                    <Select>
                      <SelectTrigger id="employee">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emp1">John Smith (EMP001)</SelectItem>
                        <SelectItem value="emp2">Sarah Johnson (EMP002)</SelectItem>
                        <SelectItem value="emp3">Mike Brown (EMP003)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policy-type">Policy Type</Label>
                    <Select>
                      <SelectTrigger id="policy-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Health Insurance</SelectItem>
                        <SelectItem value="life">Life Insurance</SelectItem>
                        <SelectItem value="accident">Accident Insurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Input id="provider" placeholder="Insurance provider name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="coverage">Coverage Amount</Label>
                      <Input id="coverage" placeholder="$50,000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="premium">Premium</Label>
                      <Input id="premium" placeholder="$200/month" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input id="start-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-date">End Date</Label>
                      <Input id="end-date" type="date" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Add Policy</Button>
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
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">235</p>
                  <p className="text-xs text-slate-600">Active Policies</p>
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
                  <p className="text-2xl font-bold text-slate-900">42</p>
                  <p className="text-xs text-slate-600">Claims Approved</p>
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
                  <p className="text-2xl font-bold text-slate-900">18</p>
                  <p className="text-xs text-slate-600">Pending Claims</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">$285K</p>
                  <p className="text-xs text-slate-600">Total Coverage</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="policies">Active Policies</TabsTrigger>
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="types">Insurance Types</TabsTrigger>
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
          </TabsList>

          {/* Active Policies */}
          <TabsContent value="policies" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Active Insurance Policies</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search policies..."
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
                      <TableHead>Policy Type</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Policy Number</TableHead>
                      <TableHead>Coverage</TableHead>
                      <TableHead>Premium</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policies.map((policy) => {
                      const StatusIcon = statusConfig[policy.status].icon;
                      return (
                        <TableRow key={policy.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">
                                  {policy.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{policy.employee}</p>
                                <p className="text-xs text-slate-600">{policy.empId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{policy.policyType}</TableCell>
                          <TableCell className="text-sm">{policy.provider}</TableCell>
                          <TableCell className="text-sm font-mono">{policy.policyNumber}</TableCell>
                          <TableCell className="text-sm font-semibold">{policy.coverage}</TableCell>
                          <TableCell className="text-sm">{policy.premium}</TableCell>
                          <TableCell className="text-sm">{policy.endDate}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusConfig[policy.status].class}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[policy.status].label}
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

          {/* Claims */}
          <TabsContent value="claims" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Insurance Claims</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      File Claim
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>File Insurance Claim</DialogTitle>
                      <DialogDescription>Submit a new insurance claim for review</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="claim-employee">Employee</Label>
                        <Select>
                          <SelectTrigger id="claim-employee">
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="emp1">John Smith (EMP001)</SelectItem>
                            <SelectItem value="emp2">Sarah Johnson (EMP002)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="claim-policy">Policy</Label>
                        <Select>
                          <SelectTrigger id="claim-policy">
                            <SelectValue placeholder="Select policy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pol1">Health Insurance - HI-2025-001</SelectItem>
                            <SelectItem value="pol2">Life Insurance - LI-2025-002</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="claim-amount">Claim Amount</Label>
                        <Input id="claim-amount" placeholder="$2,500" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="claim-description">Description</Label>
                        <Textarea id="claim-description" placeholder="Provide details about the claim..." rows={3} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="claim-documents">Supporting Documents</Label>
                        <div className="flex items-center gap-2">
                          <Input id="claim-documents" type="file" />
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
                      <TableHead>Policy Type</TableHead>
                      <TableHead>Claim Amount</TableHead>
                      <TableHead>Claim Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Approved Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claims.map((claim) => {
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
                          <TableCell className="text-sm">{claim.policyType}</TableCell>
                          <TableCell className="text-sm font-semibold">{claim.claimAmount}</TableCell>
                          <TableCell className="text-sm">{claim.claimDate}</TableCell>
                          <TableCell className="text-sm text-slate-600 max-w-xs truncate">{claim.description}</TableCell>
                          <TableCell className="text-sm font-semibold text-green-600">{claim.approvedAmount}</TableCell>
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
                                <FileText className="h-3 w-3 mr-1" />
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

          {/* Insurance Types */}
          <TabsContent value="types" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Health Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Active Policies</span>
                      <span className="font-semibold">185</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Total Coverage</span>
                      <span className="font-semibold">$9.25M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Monthly Premium</span>
                      <span className="font-semibold">$37K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Life Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Active Policies</span>
                      <span className="font-semibold">150</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Total Coverage</span>
                      <span className="font-semibold">$15M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Monthly Premium</span>
                      <span className="font-semibold">$22.5K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-600" />
                    Accident Insurance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Active Policies</span>
                      <span className="font-semibold">120</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Total Coverage</span>
                      <span className="font-semibold">$6M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Monthly Premium</span>
                      <span className="font-semibold">$12K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Coverage */}
          <TabsContent value="coverage" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Coverage Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center py-8">Coverage analysis charts would be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
