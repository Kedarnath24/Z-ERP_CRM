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
  ArrowLeft,
  Briefcase,
  Building2,
  Trash2,
  Eye,
  UserPlus,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  UserCheck,
  Clock,
  UserMinus
} from 'lucide-react';
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cn } from "@/lib/utils";
import React from 'react';

export default function EmployeeManagement() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const [employees, setEmployees] = useState([
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
      joining: '2020-12-01',
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
  ]);

  const statusConfig: Record<string, { label: string; class: string }> = {
    active: { label: 'Active', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    probation: { label: 'Probation', class: 'bg-amber-100 text-amber-700 border-amber-200' },
    onboarding: { label: 'Onboarding', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    exit: { label: 'Exit Process', class: 'bg-rose-100 text-rose-700 border-rose-200' }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === 'all' || emp.status === activeTab;
      const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
      
      return matchesSearch && matchesTab && matchesDept;
    });
  }, [searchQuery, activeTab, departmentFilter, employees]);

  const handleExport = (type: 'excel' | 'pdf') => {
    setIsExporting(true);
    toast({ title: "Exporting...", description: `Preparing employee directory in ${type.toUpperCase()}.` });

    setTimeout(() => {
      if (type === 'excel') {
        const ws = XLSX.utils.json_to_sheet(filteredEmployees);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Employees");
        XLSX.writeFile(wb, `Employees_${new Date().toISOString().split('T')[0]}.xlsx`);
      } else {
        const doc = new jsPDF();
        doc.text("Employee Directory Report", 14, 15);
        autoTable(doc, {
          startY: 25,
          head: [['ID', 'Name', 'Designation', 'Department', 'Email', 'Status']],
          body: filteredEmployees.map(e => [e.id, e.name, e.designation, e.department, e.email, statusConfig[e.status].label]),
        });
        doc.save(`Employees_${new Date().toISOString().split('T')[0]}.pdf`);
      }
      setIsExporting(false);
      toast({ title: "Export Ready", description: "Download started." });
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
                <div className="p-2.5 bg-blue-600/10 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
                  <p className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                    <Building2 className="h-3.5 w-3.5" />
                    {employees.length} Total Team Members
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 rounded-xl font-bold shadow-sm">
                    <Download className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>Choose Format</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleExport('excel')} className="cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-600" />
                    Excel Directory (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer">
                    <Printer className="h-4 w-4 mr-2 text-rose-600" />
                    PDF Comprehensive List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button 
                className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-xl font-bold transition-all active:scale-95"
                onClick={() => toast({ title: "Coming Soon", description: "The employee onboarding form is currently being built." })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <StatCard title="Total Staff" value={employees.length.toString()} icon={<Users />} color="blue" sub="Across all departments" />
          <StatCard title="Active" value={employees.filter(e => e.status === 'active').length.toString()} icon={<UserCheck />} color="emerald" sub="Fully productive" trend="up" />
          <StatCard title="On Probation" value={employees.filter(e => e.status === 'probation').length.toString()} icon={<Clock />} color="amber" sub="Performance review pending" />
          <StatCard title="Attrition" value="2%" icon={<UserMinus />} color="rose" sub="Annualized rate" trend="down" />
        </div>

        <div className="grid gap-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
              <TabsList className="bg-transparent h-auto p-0 gap-1">
                {['all', 'active', 'probation', 'onboarding', 'exit'].map((tab) => (
                  <TabsTrigger 
                    key={tab}
                    value={tab} 
                    className={cn(
                      "px-6 py-2.5 rounded-xl transition-all capitalize font-bold",
                      activeTab === tab 
                        ? "bg-white text-blue-600 shadow-sm border border-blue-100/50" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                    )}
                  >
                    {tab === 'all' ? 'Directory' : tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex items-center gap-2 px-2">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    placeholder="Search name, role or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full md:w-[280px] bg-white border-slate-200 rounded-xl focus-visible:ring-blue-500/20"
                  />
                </div>
                
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[180px] bg-white border-slate-200 rounded-xl font-medium">
                    <Filter className="h-4 w-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-6">
              {filteredEmployees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredEmployees.map((employee) => (
                    <EmployeeCard 
                      key={employee.id} 
                      employee={employee} 
                      statusConfig={statusConfig} 
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-dashed border-2 py-24 bg-slate-50/30 rounded-[2rem]">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <div className="p-5 bg-slate-100 rounded-full mb-6">
                      <Search className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No match found</h3>
                    <p className="text-sm text-slate-500 max-w-xs mt-2 font-medium">
                      Zero results for your current filter combination. Try broader criteria.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-8 rounded-xl px-8 font-bold border-slate-200"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveTab('all');
                        setDepartmentFilter('all');
                      }}
                    >
                      Reset all filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

function EmployeeCard({ employee, statusConfig }: { employee: any, statusConfig: any }) {
  const { toast } = useToast();
  return (
    <Card className="group hover:border-blue-200 hover:shadow-xl transition-all duration-300 rounded-[1.5rem] overflow-hidden border-slate-200/60 flex flex-col bg-white">
      <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
      <CardContent className="p-6 flex-1">
        <div className="flex justify-between items-start mb-5">
          <div className="relative">
            <Avatar className="h-16 w-16 ring-4 ring-white shadow-md border border-slate-100 group-hover:scale-105 transition-transform duration-300">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`} />
              <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                {employee.avatar}
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white shadow-sm",
              employee.status === 'active' ? "bg-emerald-500" : "bg-slate-400"
            )} />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100">
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuLabel>Employee Management</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast({ title: "Edit", description: "Opening editor..." })} className="cursor-pointer">
                <Edit className="h-4 w-4 mr-2 text-blue-600" />
                Edit Profile Info
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "View Docs", description: "Loading documents..." })} className="cursor-pointer">
                <FileText className="h-4 w-4 mr-2 text-indigo-600" />
                Employee Dossier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold">
                <Trash2 className="h-4 w-4 mr-2" />
                Mark as Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1 mb-5">
          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate text-lg tracking-tight">
            {employee.name}
          </h3>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
            {employee.designation}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-2 rounded-xl group-hover:bg-blue-50 transition-colors border border-transparent group-hover:border-blue-100">
            <Building2 className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500" />
            <span className="truncate font-medium">{employee.department}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Mail className="h-3.5 w-3.5 text-slate-400 ml-2" />
            <span className="truncate text-xs font-medium">{employee.email}</span>
          </div>
        </div>
      </CardContent>

      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <Badge 
          className={cn(
            "rounded-lg px-2 py-0.5 border text-[10px] font-bold tracking-tight shadow-sm",
            statusConfig[employee.status].class
          )}
        >
          {statusConfig[employee.status].label}
        </Badge>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 rounded-lg bg-white border-slate-200 text-xs font-bold hover:border-blue-400 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              Overview
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-[2rem] overflow-hidden p-0 border-none shadow-2xl">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
              <div className="absolute -bottom-12 left-8 p-1.5 bg-white rounded-[2rem] shadow-xl">
                <Avatar className="h-28 w-28 border-2 border-white">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`} />
                  <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">{employee.avatar}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="pt-16 px-8 pb-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{employee.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">{employee.designation}</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <p className="text-slate-500 font-medium text-xs">{employee.id}</p>
                  </div>
                </div>
                <Badge className={cn("rounded-xl px-4 py-1.5 font-bold text-[10px] uppercase shadow-sm", statusConfig[employee.status].class)}>
                  {statusConfig[employee.status].label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <ProfileInfoItem icon={<Building2 />} label="Department" value={employee.department} />
                <ProfileInfoItem icon={<MapPin />} label="Work Location" value={employee.location} />
                <ProfileInfoItem icon={<Mail />} label="Official Email" value={employee.email} color="bg-blue-50 text-blue-600" />
                <ProfileInfoItem icon={<Phone />} label="Phone Number" value={employee.phone} color="bg-emerald-50 text-emerald-600" />
                <ProfileInfoItem icon={<Calendar />} label="Joining Date" value={new Date(employee.joining).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
                <ProfileInfoItem icon={<Briefcase />} label="Employment Type" value="Full Time" />
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-2xl py-7 h-auto font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
                  <Edit className="h-5 w-5 mr-3" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="flex-1 rounded-2xl py-7 h-auto text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 font-bold transition-all active:scale-[0.98]">
                  <Trash2 className="h-5 w-5 mr-3" />
                  Terminate
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
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

function ProfileInfoItem({ icon, label, value, color = "bg-slate-100 text-slate-500" }: { icon: React.ReactNode, label: string, value: string, color?: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100/80 bg-slate-50/30 hover:bg-white hover:border-blue-100 transition-all group/info">
      <div className={cn("p-2.5 rounded-xl mt-0.5 transition-colors group-hover/info:scale-110", color)}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4" }) : icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
