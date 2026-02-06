import React, { useState, useMemo } from 'react';
// Force re-parse
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
  Activity,
  Plus,
  Zap
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
// Rebuild trigger 2
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
export default function HRMPayroll() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('processing');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('june-2025');
  const [isExporting, setIsExporting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isPayrollDialogOpen, setIsPayrollDialogOpen] = useState(false);
  const [payrollConfig, setPayrollConfig] = useState({
    tdsRate: 10,
    profTax: 200,
    pfEnabled: true,
    hraPercent: 40,
    medicalFixed: 250
  });
  
  const { toast } = useToast();

  const [salaries, setSalaries] = useState([
    { id: 'EMP001', name: 'John Smith', designation: 'Senior Software Engineer', department: 'Engineering', basicSalary: 5000, allowances: 1500, deductions: 500, netSalary: 6000, status: 'processed', avatar: 'JS', tax: 450, pf: 150 },
    { id: 'EMP002', name: 'Sarah Johnson', designation: 'Product Manager', department: 'Product', basicSalary: 6000, allowances: 2000, deductions: 600, netSalary: 7400, status: 'processed', avatar: 'SJ', tax: 540, pf: 180 },
    { id: 'EMP003', name: 'Mike Brown', designation: 'UI/UX Designer', department: 'Design', basicSalary: 4000, allowances: 1200, deductions: 400, netSalary: 4800, status: 'pending', avatar: 'MB', tax: 360, pf: 120 },
    { id: 'EMP004', name: 'Emily Davis', designation: 'HR Manager', department: 'Human Resources', basicSalary: 5500, allowances: 1800, deductions: 550, netSalary: 6750, status: 'pending', avatar: 'ED', tax: 495, pf: 165 },
  ]);

  const handleRunPayroll = () => {
    setIsProcessing(true);
    setProcessProgress(0);
    
    const interval = setInterval(() => {
      setProcessProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSalaries(salaries.map(s => {
            // Recalculate based on current config for pending ones
            if (s.status === 'pending') {
              const hra = (s.basicSalary * payrollConfig.hraPercent) / 100;
              const allowances = hra + payrollConfig.medicalFixed;
              const tax = (s.basicSalary + allowances) * (payrollConfig.tdsRate / 100);
              const pf = payrollConfig.pfEnabled ? s.basicSalary * 0.12 : 0;
              const deductions = tax + pf + payrollConfig.profTax;
              const netSalary = (s.basicSalary + allowances) - deductions;
              
              return { 
                ...s, 
                status: 'processed',
                allowances,
                tax,
                pf,
                deductions,
                netSalary: Math.round(netSalary)
              };
            }
            return s;
          }));
          setIsProcessing(false);
          toast({ 
            title: "Payroll Successfully Disbursed", 
            description: `All salaries for ${selectedMonth} have been processed and bank transfers initiated.` 
          });
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleUpdateConfig = (key: string, value: any) => {
    setPayrollConfig(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Config Updated",
      description: `${key} has been updated. This will affect future calculations.`,
    });
  };

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

              <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-200 rounded-xl font-bold h-10 transition-all active:scale-95">
                    <Settings className="h-4 w-4 mr-2" />
                    Salary Design
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                  <div className="bg-slate-900 p-8 text-white">
                    <div className="flex justify-between items-start">
                       <div>
                          <DialogTitle className="text-2xl font-black">Salary System Design</DialogTitle>
                          <DialogDescription className="text-slate-400 font-medium tracking-tight">Configure enterprise-grade compensation & compliance engines</DialogDescription>
                       </div>
                       <div className="p-3 bg-white/10 rounded-2xl">
                          <Zap className="h-6 w-6 text-amber-400 fill-amber-400" />
                       </div>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="earnings" className="p-0">
                    <div className="px-8 pt-4 bg-slate-50 border-b border-slate-100">
                      <TabsList className="bg-transparent h-auto p-0 gap-4">
                        <TabsTrigger value="earnings" className="px-0 py-3 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-violet-600 text-slate-500 data-[state=active]:text-violet-600 font-bold border-b-2 border-transparent transition-all">
                          Earnings & Allowances
                        </TabsTrigger>
                        <TabsTrigger value="deductions" className="px-0 py-3 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-violet-600 text-slate-500 data-[state=active]:text-violet-600 font-bold border-b-2 border-transparent transition-all">
                          Deductions & Benefits
                        </TabsTrigger>
                        <TabsTrigger value="statutory" className="px-0 py-3 rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-violet-600 text-slate-500 data-[state=active]:text-violet-600 font-bold border-b-2 border-transparent transition-all">
                          Statutory Engine
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="p-8 space-y-6 max-h-[400px] overflow-y-auto">
                      <TabsContent value="earnings" className="m-0 space-y-4">
                        {[
                          { id: 'hraPercent', name: 'House Rent Allowance (HRA)', type: 'Percent', info: 'Percentage of Basic salary', value: payrollConfig.hraPercent, unit: '%' },
                          { id: 'medicalFixed', name: 'Medical Allowance', type: 'Fixed', info: 'Tax-exempt monthly payout', value: payrollConfig.medicalFixed, unit: '$' }
                        ].map((comp, i) => (
                           <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-violet-200 transition-all">
                              <div className="flex gap-3 items-center">
                                 <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-violet-50 transition-colors">
                                    <DollarSign className="h-4 w-4 text-slate-400 group-hover:text-violet-600" />
                                 </div>
                                 <div>
                                    <p className="font-bold text-slate-900 leading-tight">{comp.name}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{comp.info}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="number" 
                                  value={comp.value} 
                                  onChange={(e) => handleUpdateConfig(comp.id, parseFloat(e.target.value))}
                                  className="w-16 h-8 border-none bg-slate-100 font-black text-xs text-center rounded-lg"
                                />
                                <span className="font-black text-slate-400 text-[10px]">{comp.unit}</span>
                                <Badge className="bg-slate-100 text-slate-600 border-none font-black text-[9px] uppercase tracking-tighter">{comp.type}</Badge>
                              </div>
                           </div>
                        ))}
                        <Button variant="outline" className="w-full border-dashed border-2 py-6 rounded-2xl font-bold text-slate-400 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50/50">
                           <Plus className="h-4 w-4 mr-2" />
                           Add Earning Component
                        </Button>
                      </TabsContent>

                      <TabsContent value="deductions" className="m-0 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1.5 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                              <Label className="text-[10px] font-black uppercase text-slate-400">Default TDS Rate</Label>
                              <div className="flex items-center gap-2">
                                 <Input 
                                  type="number" 
                                  value={payrollConfig.tdsRate} 
                                  onChange={(e) => handleUpdateConfig('tdsRate', parseFloat(e.target.value))}
                                  className="bg-slate-50 border-none font-black text-lg h-8 px-2" 
                                 />
                                 <span className="font-black text-slate-400">%</span>
                              </div>
                           </div>
                           <div className="space-y-1.5 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                              <Label className="text-[10px] font-black uppercase text-slate-400">Professional Tax</Label>
                              <div className="flex items-center gap-2">
                                 <span className="font-black text-slate-400">$</span>
                                 <Input 
                                  type="number" 
                                  value={payrollConfig.profTax} 
                                  onChange={(e) => handleUpdateConfig('profTax', parseFloat(e.target.value))}
                                  className="bg-slate-50 border-none font-black text-lg h-8 px-2" 
                                 />
                              </div>
                           </div>
                        </div>
                        <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3">
                           <AlertCircle className="h-5 w-5 text-rose-600" />
                           <div>
                              <p className="text-xs font-black text-rose-900 uppercase">Warning: Tax Compliance</p>
                              <p className="text-[10px] text-rose-700 font-medium italic">Changes to deduction rates will trigger a full payroll recount for the active month.</p>
                           </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="statutory" className="m-0 space-y-5">
                         <div className="space-y-4">
                            <div className="flex items-center justify-between">
                               <div>
                                  <p className="font-bold text-slate-900">PF Contribution Engine</p>
                                  <p className="text-xs text-slate-500 font-medium">Automatic employer matching (max $1800/year)</p>
                               </div>
                               <div 
                                onClick={() => handleUpdateConfig('pfEnabled', !payrollConfig.pfEnabled)}
                                className={cn(
                                  "h-6 w-11 rounded-full relative p-1 cursor-pointer transition-colors duration-200",
                                  payrollConfig.pfEnabled ? "bg-violet-600" : "bg-slate-200"
                                )}
                               >
                                  <div className={cn(
                                    "h-4 w-4 bg-white rounded-full shadow-sm transition-transform duration-200",
                                    payrollConfig.pfEnabled ? "translate-x-5" : "translate-x-0"
                                  )} />
                               </div>
                            </div>
                            <div className="flex items-center justify-between opacity-50">
                               <div>
                                  <p className="font-bold text-slate-900 text-sm">Gratuity Provisions</p>
                                  <p className="text-[10px] text-slate-500 font-medium">Auto-calculation for 5+ years tenure</p>
                               </div>
                               <div className="h-6 w-11 bg-slate-200 rounded-full relative p-1 cursor-not-allowed">
                                  <div className="h-4 w-4 bg-white rounded-full shadow-sm" />
                               </div>
                            </div>
                         </div>
                      </TabsContent>
                    </div>
                  </Tabs>

                  <div className="px-8 pb-8 pt-4 flex gap-3 bg-white">
                    <Button variant="ghost" className="flex-1 rounded-xl h-12 font-bold text-slate-500" onClick={() => setIsConfigOpen(false)}>Discard</Button>
                    <Button 
                      className="flex-1 bg-slate-900 hover:bg-slate-800 rounded-xl h-12 font-bold shadow-lg shadow-slate-200 text-white" 
                      onClick={() => {
                        toast({ title: "Rules Saved", description: "The compensation engine has been updated successfully." });
                        setIsConfigOpen(false);
                      }}
                    >
                      Update Engine
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <StatCard 
            title="Total Payroll" 
            value={`$${Math.round(salaries.reduce((acc, s) => acc + s.basicSalary + s.allowances, 0) / 1000)}K`} 
            icon={<DollarSign />} 
            color="violet" 
            sub="Budget allocated" 
          />
          <StatCard 
            title="Paid Amount" 
            value={`$${Math.round(salaries.filter(s => s.status === 'processed').reduce((acc, s) => acc + s.netSalary, 0) / 1000)}K`} 
            icon={<CheckCircle />} 
            color="emerald" 
            sub="Successfully disbursed" 
            trend="up" 
          />
          <StatCard 
            title="Pending" 
            value={`$${Math.round(salaries.filter(s => s.status === 'pending').reduce((acc, s) => acc + s.netSalary, 0) / 1000)}K`} 
            icon={<Clock />} 
            color="amber" 
            sub="Awaiting verification" 
          />
          <StatCard 
            title="Hold/Dispute" 
            value={`$${Math.round(salaries.filter(s => s.status === 'hold').reduce((acc, s) => acc + s.netSalary, 0) / 1000)}K`} 
            icon={<AlertCircle />} 
            color="rose" 
            sub="Action required" 
            trend="down" 
          />
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
                <Dialog open={isPayrollDialogOpen} onOpenChange={setIsPayrollDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700 rounded-lg font-bold shadow-md shadow-violet-100">
                      Run Payroll Engine
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="h-32 bg-gradient-to-r from-violet-600 to-indigo-700 p-8">
                      <DialogTitle className="text-3xl font-black text-white flex items-center gap-3">
                        <Banknote className="h-8 w-8" />
                        Payroll Execution Engine
                      </DialogTitle>
                      <DialogDescription className="text-violet-100 font-medium mt-1">Verification & Processing for {selectedMonth} cycle</DialogDescription>
                    </div>
                    <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                      {/* Overview Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Employees in Queue</p>
                          <p className="text-3xl font-black text-slate-900">{salaries.filter(s => s.status === 'pending').length}</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-1">pending disbursement</p>
                        </div>
                        <div className="p-5 bg-violet-50 rounded-2xl border border-violet-100">
                          <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest mb-2">Total Payout</p>
                          <p className="text-3xl font-black text-violet-700">${salaries.filter(s => s.status === 'pending').reduce((acc, s) => acc + s.netSalary, 0).toLocaleString()}</p>
                          <p className="text-[10px] text-violet-600 font-medium mt-1">net salary amount</p>
                        </div>
                        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-2">Engine Status</p>
                          <p className="text-xl font-black text-emerald-700">{isProcessing ? 'Processing' : 'Ready'}</p>
                          <p className="text-[10px] text-emerald-600 font-medium mt-1">{isProcessing ? 'please wait' : 'awaiting confirmation'}</p>
                        </div>
                      </div>

                      {/* Detailed Breakdown */}
                      <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                        <h4 className="text-xs font-black text-blue-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Processing Breakdown
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-blue-600 font-bold mb-2">Gross Components</p>
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600 font-medium">Total Basic Salary</span>
                                <span className="font-bold text-slate-900">${salaries.filter(s => s.status === 'pending').reduce((acc, s) => acc + s.basicSalary, 0).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600 font-medium">Total Allowances</span>
                                <span className="font-bold text-emerald-600">${salaries.filter(s => s.status === 'pending').reduce((acc, s) => acc + s.allowances, 0).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-rose-600 font-bold mb-2">Deduction Components</p>
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600 font-medium">Total Tax (TDS)</span>
                                <span className="font-bold text-rose-600">${salaries.filter(s => s.status === 'pending').reduce((acc, s) => acc + (s.tax || 0), 0).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600 font-medium">Total PF</span>
                                <span className="font-bold text-rose-600">${salaries.filter(s => s.status === 'pending').reduce((acc, s) => acc + (s.pf || 0), 0).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Employee List */}
                      {salaries.filter(s => s.status === 'pending').length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Employees to be Processed</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {salaries.filter(s => s.status === 'pending').map(emp => (
                              <div key={emp.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-violet-100 text-violet-700 font-bold text-xs">{emp.avatar}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">{emp.name}</p>
                                    <p className="text-xs text-slate-500">{emp.designation}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-black text-violet-700">${emp.netSalary.toLocaleString()}</p>
                                  <p className="text-xs text-slate-500">net pay</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Progress Bar */}
                      {isProcessing && (
                        <div className="space-y-3">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                            <span className="text-slate-500">Transmitting to bank...</span>
                            <span className="text-violet-600">{processProgress}%</span>
                          </div>
                          <Progress value={processProgress} className="h-3 bg-slate-100" />
                        </div>
                      )}

                      {/* Warning */}
                      <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-4">
                        <div className="p-2.5 bg-amber-100 rounded-xl h-fit">
                          <AlertCircle className="h-5 w-5 text-amber-700" />
                        </div>
                        <div className="text-sm">
                          <p className="font-bold text-amber-900 mb-1">⚠️ Irreversible Action</p>
                          <p className="text-amber-700 font-medium leading-relaxed">Confirming will immediately initiate bank transfers and permanently freeze salary data for {selectedMonth}. Ensure all manual adjustments, bonuses, and deductions are finalized before proceeding.</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-8 pb-8 flex gap-3">
                      <Button 
                        variant="ghost" 
                        className="flex-1 rounded-xl h-12 font-bold text-slate-500 hover:bg-slate-100"
                        onClick={() => {
                          setIsPayrollDialogOpen(false);
                          setProcessProgress(0);
                          setIsProcessing(false);
                        }}
                        disabled={isProcessing}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 bg-violet-600 hover:bg-violet-700 rounded-xl h-12 font-bold shadow-lg shadow-violet-100 disabled:opacity-50 disabled:cursor-not-allowed" 
                        onClick={() => {
                          handleRunPayroll();
                          setTimeout(() => {
                            setIsPayrollDialogOpen(false);
                          }, 3500);
                        }}
                        disabled={isProcessing || salaries.every(s => s.status === 'processed')}
                      >
                        {isProcessing ? '⏳ Processing...' : '✓ Confirm & Disburse'}
                      </Button>
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
            <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Payslip Repository - {selectedMonth}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Bulk download or print individual payslips</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl border-slate-200 font-bold" onClick={() => toast({ title: "Bulk Download Started" })}>
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download All (ZIP)
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/30">
                    <TableHead className="font-bold text-slate-700">Staff Member</TableHead>
                    <TableHead className="font-bold text-slate-700">Designation</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Net Pay</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Drafted On</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaries.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-bold text-slate-900">{s.name}</TableCell>
                      <TableCell className="text-slate-500 font-medium">{s.designation}</TableCell>
                      <TableCell className="text-right font-black">${s.netSalary}</TableCell>
                      <TableCell className="text-right text-slate-400 text-xs">June 28, 2025</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-blue-600 font-bold">
                          <Printer className="h-3.5 w-3.5 mr-1.5" />
                          Print
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 rounded-lg text-slate-500 font-bold">
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
          
          <TabsContent value="statutory" className="mt-6">
            <Card className="rounded-[1.5rem] border-slate-200/60 shadow-sm overflow-hidden">
               <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Tax & Provident Fund Summary</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Statutory compliance reports for {selectedMonth}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl border-slate-200 font-bold text-emerald-600">
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    e-Filing
                  </Button>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/30">
                    <TableHead className="font-bold text-slate-700">Employee</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Professional Tax</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Income Tax (TDS)</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">PF (Employer)</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">PF (Employee)</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Total Payable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salaries.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-bold text-slate-900">{s.name}</TableCell>
                      <TableCell className="text-right font-medium text-slate-600">${payrollConfig.profTax}</TableCell>
                      <TableCell className="text-right font-medium text-rose-600">${Math.round(s.tax || 0)}</TableCell>
                      <TableCell className="text-right font-medium text-blue-600">${Math.round(s.pf || 0)}</TableCell>
                      <TableCell className="text-right font-medium text-blue-600">${Math.round(s.pf || 0)}</TableCell>
                      <TableCell className="text-right font-black text-slate-900">${Math.round(payrollConfig.profTax + (s.tax || 0) + (s.pf || 0) * 2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-slate-50/50 font-black">
                    <TableCell>TOTAL</TableCell>
                    <TableCell className="text-right">${(salaries.length * payrollConfig.profTax).toLocaleString()}</TableCell>
                    <TableCell className="text-right text-rose-600">${salaries.reduce((acc, s) => acc + (s.tax || 0), 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right text-blue-600">${salaries.reduce((acc, s) => acc + (s.pf || 0), 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right text-blue-600">${salaries.reduce((acc, s) => acc + (s.pf || 0), 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right text-slate-900">
                      ${salaries.reduce((acc, s) => acc + (s.tax || 0) + (s.pf || 0) * 2 + payrollConfig.profTax, 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
