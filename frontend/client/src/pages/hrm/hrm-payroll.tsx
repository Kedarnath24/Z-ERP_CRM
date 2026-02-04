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
  ArrowLeft,
  Banknote,
  Receipt,
  Wallet,
  TrendingUp,
  MoreVertical,
  Printer,
  FileSpreadsheet,
  Activity
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

export default function Payroll() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('processing');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('june-2025');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const salaries = [
    { id: 'EMP001', name: 'John Smith', designation: 'Senior Software Engineer', department: 'Engineering', basicSalary: 5000, allowances: 1500, deductions: 500, netSalary: 6000, status: 'processed', avatar: 'JS' },
    { id: 'EMP002', name: 'Sarah Johnson', designation: 'Product Manager', department: 'Product', basicSalary: 6000, allowances: 2000, deductions: 600, netSalary: 7400, status: 'processed', avatar: 'SJ' },
    { id: 'EMP003', name: 'Mike Brown', designation: 'UI/UX Designer', department: 'Design', basicSalary: 4000, allowances: 1200, deductions: 400, netSalary: 4800, status: 'pending', avatar: 'MB' },
    { id: 'EMP004', name: 'Emily Davis', designation: 'HR Manager', department: 'Human Resources', basicSalary: 5500, allowances: 1800, deductions: 550, netSalary: 6750, status: 'pending', avatar: 'ED' },
  ];

  const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
    processed: { label: 'Paid', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
    pending: { label: 'Calculated', class: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    hold: { label: 'On Hold', class: 'bg-rose-100 text-rose-700 border-rose-200', icon: AlertCircle }
  };

  const filteredSalaries = useMemo(() => {
    return salaries.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, salaries]);

  const handleExport = (type: 'excel' | 'pdf') => {
    setIsExporting(true);
    toast({ title: "Exporting...", description: `Generating payroll report in ${type.toUpperCase()}.` });

    setTimeout(() => {
      if (type === 'excel') {
        const ws = XLSX.utils.json_to_sheet(filteredSalaries);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Payroll");
        XLSX.writeFile(wb, `Payroll_${selectedMonth}.xlsx`);
      } else {
        const doc = new jsPDF();
        doc.text(`Payroll Report - ${selectedMonth}`, 14, 15);
        autoTable(doc, {
          startY: 25,
          head: [['ID', 'Employee', 'Basic', 'Allowances', 'Deductions', 'Net Salary', 'Status']],
          body: filteredSalaries.map(s => [s.id, s.name, s.basicSalary, s.allowances, s.deductions, s.netSalary, s.status]),
        });
        doc.save(`Payroll_${selectedMonth}.pdf`);
      }
      setIsExporting(false);
      toast({ title: "Export Ready", description: "Your document is ready." });
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
                <div className="p-2.5 bg-violet-600/10 rounded-xl">
                  <Banknote className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Payroll Management</h1>
                  <p className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                    <Activity className="h-3.5 w-3.5" />
                    Month-end financial processing
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[160px] rounded-xl border-slate-200 bg-white font-bold h-10 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="june-2025">June 2025</SelectItem>
                  <SelectItem value="may-2025">May 2025</SelectItem>
                  <SelectItem value="april-2025">April 2025</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 rounded-xl font-bold h-10 shadow-sm">
                    <Download className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>Payroll Data</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleExport('excel')} className="cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-600" />
                    Master Roll (Excel)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer">
                    <Printer className="h-4 w-4 mr-2 text-rose-600" />
                    Summary Statement (PDF)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-200 rounded-xl font-bold h-10 transition-all active:scale-95">
                <Settings className="h-4 w-4 mr-2" />
                Config
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <StatCard title="Total Payroll" value="$485K" icon={<DollarSign />} color="violet" sub="Budget allocated" />
          <StatCard title="Paid Amount" value="$312K" icon={<CheckCircle />} color="emerald" sub="Successfully disbursed" trend="up" />
          <StatCard title="Pending" value="$173K" icon={<Clock />} color="amber" sub="Awaiting verification" />
          <StatCard title="Hold/Dispute" value="$4.2K" icon={<AlertCircle />} color="rose" sub="Action required" trend="down" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
            <TabsList className="bg-transparent h-auto p-0 gap-1">
              <TabsTrigger 
                value="processing" 
                className={cn(
                  "px-6 py-2.5 rounded-xl transition-all font-bold",
                  activeTab === 'processing' ? "bg-white text-violet-600 shadow-sm border border-violet-100/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                )}
              >
                Salary Processing
              </TabsTrigger>
              <TabsTrigger 
                value="statutory" 
                className={cn(
                  "px-6 py-2.5 rounded-xl transition-all font-bold",
                  activeTab === 'statutory' ? "bg-white text-emerald-600 shadow-sm border border-emerald-100/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                )}
              >
                Statutory (Tax/PF)
              </TabsTrigger>
              <TabsTrigger 
                value="payslips" 
                className={cn(
                  "px-6 py-2.5 rounded-xl transition-all font-bold",
                  activeTab === 'payslips' ? "bg-white text-blue-600 shadow-sm border border-blue-100/50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                )}
              >
                Payslips
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 px-2">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                <Input
                  placeholder="Employee name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full md:w-[240px] bg-white border-slate-200 rounded-xl focus-visible:ring-violet-500/20"
                />
              </div>
              <Button variant="outline" className="rounded-xl border-slate-200 h-10 font-bold px-4">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <TabsContent value="processing" className="mt-6 space-y-4">
            <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Payroll Ledger - {selectedMonth}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium tracking-tight italic">Review gross salary, deductions and net pay</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700 rounded-lg font-bold shadow-md shadow-violet-100">
                      Run Payroll Engine
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="h-28 bg-gradient-to-r from-violet-600 to-indigo-700 p-8">
                      <DialogTitle className="text-2xl font-black text-white">Payroll Execution</DialogTitle>
                      <DialogDescription className="text-violet-100 font-medium">Verification for {selectedMonth} processing cycle</DialogDescription>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Queue Size</p>
                          <p className="text-2xl font-black text-slate-900">235 <small className="text-[10px] text-slate-400 font-medium lowercase italic">staff</small></p>
                        </div>
                        <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100">
                          <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest mb-1">Total Liability</p>
                          <p className="text-2xl font-black text-violet-700">$485k</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Status</p>
                          <p className="text-lg font-black text-emerald-700">Calculated</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                          <span className="text-slate-500">Compiling payslips...</span>
                          <span className="text-violet-600">85%</span>
                        </div>
                        <Progress value={85} className="h-2.5 bg-slate-100" />
                      </div>

                      <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-4">
                        <div className="p-2.5 bg-amber-100 rounded-xl h-fit">
                          <AlertCircle className="h-5 w-5 text-amber-700" />
                        </div>
                        <div className="text-sm">
                          <p className="font-bold text-amber-900">Irreversible Action</p>
                          <p className="text-amber-700 font-medium leading-relaxed">Pressing confirm will initiate bank transfers and freeze data entry for this month. Ensure all manual adjustments are finalized.</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-8 pb-8 flex gap-3">
                      <Button variant="ghost" className="flex-1 rounded-xl h-12 font-bold text-slate-500">Close Window</Button>
                      <Button className="flex-1 bg-violet-600 hover:bg-violet-700 rounded-xl h-12 font-bold shadow-lg shadow-violet-100">Confirm & Disburse</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/30">
                    <TableHead className="w-[280px] font-bold text-slate-700">Staff Member</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Basic</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Allowances</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Deductions</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Net Pay</TableHead>
                    <TableHead className="font-bold text-slate-700">Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSalaries.map((salary) => (
                    <TableRow key={salary.id} className="group transition-colors hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-200 group-hover:scale-110 transition-transform">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${salary.name}`} />
                            <AvatarFallback className="bg-violet-600 text-white font-bold">{salary.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-900 leading-none">{salary.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{salary.id} / {salary.department}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-600">${salary.basicSalary}</TableCell>
                      <TableCell className="text-right font-medium text-emerald-600">+${salary.allowances}</TableCell>
                      <TableCell className="text-right font-medium text-rose-600">-${salary.deductions}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm font-black text-slate-900">${salary.netSalary}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("rounded-lg px-2.5 py-1 border font-bold text-[10px] uppercase tracking-wider", statusConfig[salary.status].class)}>
                          <div className="flex items-center gap-1.5">
                            {React.createElement(statusConfig[salary.status].icon, { className: "h-3 w-3" })}
                            {statusConfig[salary.status].label}
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

          <TabsContent value="payslips" className="mt-6">
             <Card className="border-dashed border-2 py-20 bg-slate-50/30 rounded-[1.5rem] flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <Receipt className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Payslip Repository</h3>
                <p className="text-sm text-slate-500 max-w-xs mt-1 font-medium">
                  Select a payroll cycle to bulk download or view individual payslips.
                </p>
                <Button variant="outline" className="mt-6 rounded-xl border-slate-200">View History</Button>
             </Card>
          </TabsContent>
          
          <TabsContent value="statutory" className="mt-6">
             <Card className="border-dashed border-2 py-20 bg-slate-50/30 rounded-[1.5rem] flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <Wallet className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Tax & Statutory Compliance</h3>
                <p className="text-sm text-slate-500 max-w-xs mt-1 font-medium">
                  Automated PF, ESI, and Tax deduction summaries for government filings.
                </p>
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
              {trend === 'up' ? '+8%' : '-2.5%'}
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
