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
import { 
  Users, 
  Plus, 
  Search, 
  Download, 
  Filter,
  Edit,
  MoreVertical,
  MapPin,
  Calendar,
  Mail,
  Phone,
  FileText,
  ArrowLeft
} from 'lucide-react';

export default function EmployeeManagement() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Mock data
  const employees = [
    {
      id: 'EMP001',
      name: 'John Smith',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'New York',
      joining: '2023-05-15',
      status: 'active',
      avatar: 'JS',
      email: 'john.smith@company.com',
      phone: '+1 234 567 8900'
    },
    {
      id: 'EMP002',
      name: 'Sarah Johnson',
      designation: 'Product Manager',
      department: 'Product',
      location: 'San Francisco',
      joining: '2022-08-20',
      status: 'active',
      avatar: 'SJ',
      email: 'sarah.j@company.com',
      phone: '+1 234 567 8901'
    },
    {
      id: 'EMP003',
      name: 'Mike Brown',
      designation: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote',
      joining: '2024-01-10',
      status: 'probation',
      avatar: 'MB',
      email: 'mike.brown@company.com',
      phone: '+1 234 567 8902'
    },
    {
      id: 'EMP004',
      name: 'Emily Davis',
      designation: 'HR Manager',
      department: 'Human Resources',
      location: 'New York',
      joining: '2021-03-12',
      status: 'active',
      avatar: 'ED',
      email: 'emily.davis@company.com',
      phone: '+1 234 567 8903'
    },
    {
      id: 'EMP005',
      name: 'Alex Wilson',
      designation: 'Sales Executive',
      department: 'Sales',
      location: 'Chicago',
      joining: '2025-12-01',
      status: 'onboarding',
      avatar: 'AW',
      email: 'alex.wilson@company.com',
      phone: '+1 234 567 8904'
    },
    {
      id: 'EMP006',
      name: 'Lisa Anderson',
      designation: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Boston',
      joining: '2023-11-05',
      status: 'active',
      avatar: 'LA',
      email: 'lisa.anderson@company.com',
      phone: '+1 234 567 8905'
    }
  ];

  const statusConfig: Record<string, { label: string; class: string }> = {
    active: { label: 'Active', class: 'bg-green-100 text-green-700 border-green-200' },
    probation: { label: 'Probation', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    onboarding: { label: 'Onboarding', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    exit: { label: 'Exit Process', class: 'bg-red-100 text-red-700 border-red-200' }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || emp.status === activeTab;
    const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
    return matchesSearch && matchesTab && matchesDept;
  });

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
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Employee Management</h1>
                <p className="text-sm text-slate-600">Manage employee profiles, documents, and lifecycle</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Employees</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="probation">On Probation</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="exit">Exit Process</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6 mt-6">
            {/* Toolbar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Human Resources">HR</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employee Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                              {employee.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{employee.name}</h3>
                          <p className="text-xs text-slate-600">{employee.id}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-medium text-slate-700">{employee.designation}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Users className="h-3 w-3" />
                        <span>{employee.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="h-3 w-3" />
                        <span>{employee.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar className="h-3 w-3" />
                        <span>Joined: {employee.joining}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <Badge variant="outline" className={statusConfig[employee.status].class}>
                        {statusConfig[employee.status].label}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          <FileText className="h-3 w-3 mr-1" />
                          Profile
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing {filteredEmployees.length} of {employees.length} employees
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
