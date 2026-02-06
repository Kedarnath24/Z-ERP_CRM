import React, { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Banknote,
  Calculator,
  Download,
  Upload,
  FileSpreadsheet,
  TrendingUp,
  Users,
  Building2,
  Calendar,
  DollarSign,
  Percent,
  Shield,
  CheckCircle,
  AlertTriangle,
  Printer
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';export default function HRMPayroll() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // State management
  const [selectedMonth, setSelectedMonth] = useState('February 2026');
  const [activeTab, setActiveTab] = useState('overview');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Payroll configuration
  const [payrollConfig] = useState({
    profTax: 200,
    pfRate: 12,
    esiRate: 1.75,
    bonusRate: 8.33
  });

  // Mock employee salary data
  const [employees] = useState([
    {
      id: 'EMP001',
      name: 'John Smith',
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      baseSalary: 75000,
      allowances: 15000,
      deductions: 8500,
      netSalary: 81500,
      tax: 12000,
      pf: 9000,
      esi: 1315,
      status: 'processed'
    },
    {
      id: 'EMP002',
      name: 'Sarah Johnson',
      designation: 'Product Manager',
      department: 'Product',
      baseSalary: 85000,
      allowances: 17000,
      deductions: 9200,
      netSalary: 92800,
      tax: 15300,
      pf: 10200,
      esi: 1488,
      status: 'processed'
    },
    {
      id: 'EMP003',
      name: 'Mike Brown',
      designation: 'UI/UX Designer',
      department: 'Design',
      baseSalary: 55000,
      allowances: 11000,
      deductions: 6600,
      netSalary: 59400,
      tax: 8250,
      pf: 6600,
      esi: 963,
      status: 'processed'
    },
    {
      id: 'EMP004',
      name: 'Emily Davis',
      designation: 'HR Manager',
      department: 'Human Resources',
      baseSalary: 65000,
      allowances: 13000,
      deductions: 7800,
      netSalary: 70200,
      tax: 9750,
      pf: 7800,
      esi: 1138,
      status: 'processed'
    },
    {
      id: 'EMP005',
      name: 'Alex Wilson',
      designation: 'Sales Executive',
      department: 'Sales',
      baseSalary: 45000,
      allowances: 9000,
      deductions: 5400,
      netSalary: 48600,
      tax: 6750,
      pf: 5400,
      esi: 788,
      status: 'pending'
    }
  ]);

  // Calculate summary statistics
  const payrollSummary = useMemo(() => {
    const processedEmployees = employees.filter(emp => emp.status === 'processed');
    const totalGross = employees.reduce((sum, emp) => sum + emp.baseSalary + emp.allowances, 0);
    const totalNet = employees.reduce((sum, emp) => sum + emp.netSalary, 0);
    const totalTax = employees.reduce((sum, emp) => sum + emp.tax, 0);
    const totalPF = employees.reduce((sum, emp) => sum + emp.pf, 0);
    
    return {
      totalEmployees: employees.length,
      processedEmployees: processedEmployees.length,
      pendingEmployees: employees.length - processedEmployees.length,
      totalGross,
      totalNet,
      totalDeductions: totalGross - totalNet,
      totalTax,
      totalPF,
      totalProfTax: employees.length * payrollConfig.profTax
    };
  }, [employees, payrollConfig]);

  // Export functions
  const exportToExcel = async () => {
    setIsProcessing(true);
    
    try {
      const workbook = XLSX.utils.book_new();
      
      // Employee salary sheet
      const salaryData = employees.map(emp => ({
        'Employee ID': emp.id,
        'Name': emp.name,
        'Designation': emp.designation,
        'Department': emp.department,
        'Base Salary': emp.baseSalary,
        'Allowances': emp.allowances,
        'Gross Salary': emp.baseSalary + emp.allowances,
        'Tax Deduction': emp.tax,
        'PF Deduction': emp.pf,
        'ESI Deduction': emp.esi,
        'Professional Tax': payrollConfig.profTax,
        'Total Deductions': emp.deductions,
        'Net Salary': emp.netSalary,
        'Status': emp.status.toUpperCase()
      }));
      
      const salarySheet = XLSX.utils.json_to_sheet(salaryData);
      XLSX.utils.book_append_sheet(workbook, salarySheet, 'Salary Details');
      
      // Summary sheet
      const summaryData = [
        { Metric: 'Total Employees', Value: payrollSummary.totalEmployees },
        { Metric: 'Processed Employees', Value: payrollSummary.processedEmployees },
        { Metric: 'Pending Employees', Value: payrollSummary.pendingEmployees },
        { Metric: 'Total Gross Salary', Value: payrollSummary.totalGross },
        { Metric: 'Total Net Salary', Value: payrollSummary.totalNet },
        { Metric: 'Total Deductions', Value: payrollSummary.totalDeductions },
        { Metric: 'Total Tax', Value: payrollSummary.totalTax },
        { Metric: 'Total PF', Value: payrollSummary.totalPF },
        { Metric: 'Total Professional Tax', Value: payrollSummary.totalProfTax }
      ];
      
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      
      const filename = `Payroll_${selectedMonth.replace(' ', '_')}_${Date.now()}.xlsx`;
      XLSX.writeFile(workbook, filename);
      
      toast({
        title: "✅ Export Successful",
        description: `Payroll data exported to ${filename}`,
      });
    } catch (error) {
      toast({
        title: "❌ Export Failed",
        description: "Failed to export payroll data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const exportToPDF = async () => {
    setIsProcessing(true);
    
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('Payroll Report', 20, 30);
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text(`Period: ${selectedMonth}`, 20, 45);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);
      
      // Summary section
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Summary', 20, 75);
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Total Employees: ${payrollSummary.totalEmployees}`, 20, 90);
      doc.text(`Total Gross: $${payrollSummary.totalGross.toLocaleString()}`, 20, 100);
      doc.text(`Total Net: $${payrollSummary.totalNet.toLocaleString()}`, 20, 110);
      doc.text(`Total Deductions: $${payrollSummary.totalDeductions.toLocaleString()}`, 20, 120);
      
      // Employee details table
      const tableData = employees.map(emp => [
        emp.id,
        emp.name,
        emp.department,
        `$${emp.baseSalary.toLocaleString()}`,
        `$${emp.allowances.toLocaleString()}`,
        `$${emp.deductions.toLocaleString()}`,
        `$${emp.netSalary.toLocaleString()}`,
        emp.status.toUpperCase()
      ]);
      
      autoTable(doc, {
        head: [['ID', 'Name', 'Department', 'Base Salary', 'Allowances', 'Deductions', 'Net Salary', 'Status']],
        body: tableData,
        startY: 140,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 8, cellPadding: 2 }
      });
      
      const filename = `Payroll_Report_${selectedMonth.replace(' ', '_')}_${Date.now()}.pdf`;
      doc.save(filename);
      
      toast({
        title: "✅ PDF Generated",
        description: `Report saved as ${filename}`,
      });
    } catch (error) {
      toast({
        title: "❌ PDF Generation Failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayroll = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payroll processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "✅ Payroll Processed Successfully",
        description: `${selectedMonth} payroll has been processed for ${employees.length} employees.`,
      });
    } catch (error) {
      toast({
        title: "❌ Processing Failed",
        description: "Failed to process payroll. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">💰 Payroll Management</h1>
              <p className="text-blue-100 mt-2">Manage employee salaries, deductions, and statutory compliance</p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="February 2026">February 2026</SelectItem>
                  <SelectItem value="January 2026">January 2026</SelectItem>
                  <SelectItem value="December 2025">December 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Employees"
            value={payrollSummary.totalEmployees.toString()}
            icon={<Users className="h-5 w-5" />}
            color="blue"
            trend="up"
          />
          <StatCard 
            title="Gross Payroll"
            value={`$${payrollSummary.totalGross.toLocaleString()}`}
            icon={<DollarSign className="h-5 w-5" />}
            color="emerald"
            trend="up"
          />
          <StatCard 
            title="Net Payroll"
            value={`$${payrollSummary.totalNet.toLocaleString()}`}
            icon={<Banknote className="h-5 w-5" />}
            color="indigo"
            trend="up"
          />
          <StatCard 
            title="Total Deductions"
            value={`$${payrollSummary.totalDeductions.toLocaleString()}`}
            icon={<Percent className="h-5 w-5" />}
            color="orange"
            trend="none"
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Employee Details
            </TabsTrigger>
            <TabsTrigger value="statutory" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Statutory Compliance
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6">
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Payroll Summary - {selectedMonth}
                  </CardTitle>
                  <CardDescription>
                    Comprehensive overview of current payroll cycle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                      <div className="text-2xl font-bold text-emerald-700">
                        {payrollSummary.processedEmployees}
                      </div>
                      <div className="text-sm text-emerald-600">Processed</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <div className="text-2xl font-bold text-amber-700">
                        {payrollSummary.pendingEmployees}
                      </div>
                      <div className="text-sm text-amber-600">Pending</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700">
                        ${payrollSummary.totalNet.toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-600">Total Net Pay</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={processPayroll} 
                      disabled={isProcessing}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Calculator className="h-4 w-4 mr-2" />
                          Process Payroll
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={exportToExcel} disabled={isProcessing}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export Excel
                    </Button>
                    <Button variant="outline" onClick={exportToPDF} disabled={isProcessing}>
                      <Printer className="h-4 w-4 mr-2" />
                      Generate PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Employee Details Tab */}
          <TabsContent value="employees" className="mt-6">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>Employee Salary Details</CardTitle>
                <CardDescription>
                  Detailed breakdown of individual employee salaries and deductions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Base Salary</TableHead>
                        <TableHead className="text-right">Allowances</TableHead>
                        <TableHead className="text-right">Deductions</TableHead>
                        <TableHead className="text-right">Net Salary</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-sm text-slate-500">{employee.designation}</div>
                            </div>
                          </TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell className="text-right">${employee.baseSalary.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${employee.allowances.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${employee.deductions.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-bold">${employee.netSalary.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge 
                              className={employee.status === 'processed' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-amber-100 text-amber-700'
                              }
                            >
                              {employee.status === 'processed' ? 'Processed' : 'Pending'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statutory Compliance Tab */}
          <TabsContent value="statutory" className="mt-6">
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Statutory Compliance Summary
                </CardTitle>
                <CardDescription>
                  Tax and statutory deduction details for government compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-lg font-bold text-blue-700">
                        ${payrollSummary.totalTax.toLocaleString()}
                      </div>
                      <div className="text-sm text-blue-600">Total Income Tax</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-lg font-bold text-green-700">
                        ${payrollSummary.totalPF.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600">Total PF Contribution</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-lg font-bold text-purple-700">
                        ${payrollSummary.totalProfTax.toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-600">Professional Tax</div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead className="text-right">Income Tax</TableHead>
                          <TableHead className="text-right">PF (Employee)</TableHead>
                          <TableHead className="text-right">PF (Employer)</TableHead>
                          <TableHead className="text-right">ESI</TableHead>
                          <TableHead className="text-right">Prof. Tax</TableHead>
                          <TableHead className="text-right">Total Statutory</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employees.map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{employee.name}</div>
                                <div className="text-sm text-slate-500">{employee.id}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">${employee.tax.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${employee.pf.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${employee.pf.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${employee.esi.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${payrollConfig.profTax}</TableCell>
                            <TableCell className="text-right font-bold">
                              ${(employee.tax + employee.pf * 2 + employee.esi + payrollConfig.profTax).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-6">
            <div className="grid gap-6">
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                  <CardDescription>
                    Export payroll data in various formats for compliance and record-keeping
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Excel Report</h3>
                          <p className="text-sm text-slate-600 mt-1">
                            Detailed spreadsheet with all salary components and calculations
                          </p>
                          <Button 
                            className="mt-3" 
                            variant="outline" 
                            onClick={exportToExcel}
                            disabled={isProcessing}
                          >
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Export Excel
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Printer className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">PDF Report</h3>
                          <p className="text-sm text-slate-600 mt-1">
                            Professional formatted report suitable for official documentation
                          </p>
                          <Button 
                            className="mt-3" 
                            variant="outline" 
                            onClick={exportToPDF}
                            disabled={isProcessing}
                          >
                            <Printer className="h-4 w-4 mr-2" />
                            Generate PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  color, 
  trend = 'none' 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  color: string; 
  trend?: 'up' | 'down' | 'none';
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  return (
    <Card className="rounded-xl border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm text-slate-600">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={cn("p-3 rounded-lg", colorMap[color])}>
            {icon}
          </div>
        </div>
        {trend !== 'none' && (
          <div className="mt-3">
            <div className={cn(
              "flex items-center gap-1 text-xs",
              trend === 'up' ? "text-emerald-600" : "text-red-600"
            )}>
              <TrendingUp className={cn("h-3 w-3", trend === 'down' && "rotate-180")} />
              <span>{trend === 'up' ? '+5.2%' : '-2.1%'} from last month</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
      const a = document.createElement('a');
      a.href = url;
      a.download = `Payslips_${selectedMonth}_${salaries.length}_employees.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "✅ Download Complete!",
        description: `Generated payslips for ${salaries.length} employees`
      });
      
    } catch (error) {
      console.error('ZIP download error:', error);
      toast({
        title: "❌ Download Failed",
        description: "Unable to generate ZIP file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl border-slate-200 font-bold hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDownloadAllZip}
                  disabled={loadingStates['download-zip']}
                >
                  {loadingStates['download-zip'] ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-slate-600 mr-1.5" />
                      Generating ZIP...
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download All (ZIP)
                    </>
                  )}
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
              <CardContent className="p-0">
               <div className="bg-gradient-to-r from-slate-50/80 to-slate-100/50 px-6 py-5 border-b border-slate-200/60 backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                        💼 Tax & Provident Fund Summary
                        {salaries.length > 0 ? (
                          <Badge className="bg-emerald-100 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full animate-pulse">
                            ✅ {salaries.length} Employee{salaries.length !== 1 ? 's' : ''} Ready
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 font-bold text-xs px-3 py-1 rounded-full">
                            ⚠️ No Data Available
                          </Badge>
                        )}
                      </h3>
                      
                      {/* Enhanced progress indicator */}
                      {salaries.length > 0 && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-emerald-600 font-medium">System Ready for e-Filing</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-slate-600 font-medium">
                        {salaries.length > 0 
                          ? `📊 Statutory compliance reports for ${selectedMonth} - Ready for government e-Filing` 
                          : `⚠️ No employee payroll data available for ${selectedMonth} - Upload data to continue`
                        }
                      </p>
                      
                      {/* Quick stats when data is available */}
                      {salaries.length > 0 && (
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            💰 Total Tax: ${salaries.reduce((acc, s) => acc + (s.tax || 0), 0).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            🏛️ Prof Tax: ${(salaries.length * payrollConfig.profTax).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            🛡️ PF Total: ${salaries.reduce((acc, s) => acc + (s.pf || 0) * 2, 0).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                    
                  {/* Simple, Clean, Working Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    
                    {/* NEW ENHANCED E-FILING BUTTON - GUARANTEED TO WORK */}
                    <Button 
                      onClick={() => {
                        if (!salaries || salaries.length === 0) {
                          toast({
                            title: "No Data Available",
                            description: "Please ensure employee data is loaded before generating e-Filing report.",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        try {
                          // Quick notification
                          toast({
                            title: "🚀 Generating e-Filing Report",
                            description: `Processing ${salaries.length} employees for tax compliance...`
                          });
                          
                          // Simple but professional PDF generation
                          const doc = new jsPDF();
                          
                          // Header
                          doc.setFontSize(20);
                          doc.setFont('helvetica', 'bold');
                          doc.text('TAX & PF COMPLIANCE REPORT', 20, 30);
                          
                          // Filing info
                          doc.setFontSize(12);
                          doc.setFont('helvetica', 'normal');
                          doc.text(`Filing Period: ${selectedMonth}`, 20, 50);
                          doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 60);
                          doc.text(`Total Employees: ${salaries.length}`, 20, 70);
                          
                          // Summary calculations
                          const totalTax = salaries.reduce((acc, s) => acc + (s.tax || 0), 0);
                          const totalPF = salaries.reduce((acc, s) => acc + (s.pf || 0) * 2, 0);
                          const totalProfTax = salaries.length * payrollConfig.profTax;
                          const grandTotal = totalTax + totalProfTax + totalPF;
                          
                          // Summary section
                          doc.setFontSize(14);
                          doc.setFont('helvetica', 'bold');
                          doc.text('STATUTORY SUMMARY', 20, 90);
                          
                          doc.setFontSize(10);
                          doc.setFont('helvetica', 'normal');
                          doc.text(`Professional Tax: $${totalProfTax.toFixed(2)}`, 25, 105);
                          doc.text(`Income Tax (TDS): $${totalTax.toFixed(2)}`, 25, 115);
                          doc.text(`Provident Fund: $${totalPF.toFixed(2)}`, 25, 125);
                          doc.text(`TOTAL OBLIGATION: $${grandTotal.toFixed(2)}`, 25, 140);
                          
                          // Employee table
                          const tableData = salaries.map((s, i) => [
                            (i + 1).toString(),
                            s.name,
                            s.id,
                            `$${payrollConfig.profTax}`,
                            `$${(s.tax || 0).toFixed(2)}`,
                            `$${(s.pf || 0).toFixed(2)}`,
                            `$${(s.pf || 0).toFixed(2)}`,
                            `$${(payrollConfig.profTax + (s.tax || 0) + (s.pf || 0) * 2).toFixed(2)}`
                          ]);
                          
                          autoTable(doc, {
                            head: [['#', 'Employee', 'ID', 'Prof Tax', 'Income Tax', 'PF (Emp)', 'PF (Empl)', 'Total']],
                            body: tableData,
                            startY: 155,
                            theme: 'grid',
                            headStyles: { fillColor: [41, 128, 185] },
                            styles: { fontSize: 8, cellPadding: 3 }
                          });
                          
                          // Footer
                          doc.setFontSize(8);
                          doc.text('Generated by ERP System - Government Ready Report', 20, doc.internal.pageSize.height - 20);
                          
                          // Save file
                          const fileName = `Tax_Filing_Report_${selectedMonth.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
                          doc.save(fileName);
                          
                          // Success notification
                          toast({
                            title: "✅ e-Filing Report Generated!",
                            description: `Successfully created: ${fileName}`
                          });
                          
                        } catch (error) {
                          console.error('e-Filing error:', error);
                          toast({
                            title: "❌ Generation Failed",
                            description: "Failed to create e-Filing report. Please try again.",
                            variant: "destructive"
                          });
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 min-w-[140px] justify-center"
                      disabled={!salaries || salaries.length === 0}
                    >
                      <Upload className="h-4 w-4" />
                      <span>e-Filing Report</span>
                    </Button>
                    
                    {/* Simple Excel Export Button */}
                    <Button 
                      onClick={() => {
                        if (!salaries || salaries.length === 0) {
                          toast({
                            title: "No Data Available",
                            description: "Please ensure employee data is loaded before exporting.",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        try {
                          toast({
                            title: "📊 Generating Excel Export",
                            description: `Formatting ${salaries.length} employee records...`
                          });
                          
                          const exportData = salaries.map((s, index) => ({
                            'Sr No': index + 1,
                            'Employee Name': s.name,
                            'Employee ID': s.id,
                            'Department': s.department || 'General',
                            'Professional Tax': `$${payrollConfig.profTax.toFixed(2)}`,
                            'Income Tax (TDS)': `$${(s.tax || 0).toFixed(2)}`,
                            'PF Employer': `$${(s.pf || 0).toFixed(2)}`,
                            'PF Employee': `$${(s.pf || 0).toFixed(2)}`,
                            'Total Deduction': `$${(payrollConfig.profTax + (s.tax || 0) + (s.pf || 0) * 2).toFixed(2)}`,
                            'Filing Period': selectedMonth,
                            'Generated On': new Date().toLocaleDateString()
                          }));
                          
                          const ws = XLSX.utils.json_to_sheet(exportData);
                          const wb = XLSX.utils.book_new();
                          XLSX.utils.book_append_sheet(wb, ws, 'Tax Summary');
                          
                          const fileName = `Tax_Summary_${selectedMonth.replace(/\s+/g, '_')}_${Date.now()}.xlsx`;
                          XLSX.writeFile(wb, fileName);
                          
                          toast({ 
                            title: "✅ Excel Export Complete!", 
                            description: `Successfully created: ${fileName}` 
                          });
                          
                        } catch (error) {
                          toast({
                            title: "❌ Export Failed",
                            description: "Failed to export data. Please try again.",
                            variant: "destructive"
                          });
                        }
                      }}
                      variant="outline"
                      className="border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 min-w-[140px] justify-center"
                      disabled={!salaries || salaries.length === 0}
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Export Excel</span>
                    </Button>
                  </div>
              
              {/* Enhanced responsive table container */}
              <div className="overflow-hidden">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                        <TableHead className="font-black text-slate-800 text-xs uppercase tracking-wide py-4 px-6 text-left sticky left-0 bg-slate-50 z-10 min-w-[200px]">
                          👥 Employee Details
                        </TableHead>
                        <TableHead className="font-black text-slate-700 text-xs uppercase tracking-wide py-4 px-4 text-right min-w-[120px]">
                          🏛️ Professional Tax
                        </TableHead>
                        <TableHead className="font-black text-slate-700 text-xs uppercase tracking-wide py-4 px-4 text-right min-w-[140px]">
                          💰 Income Tax (TDS)
                        </TableHead>
                        <TableHead className="font-black text-slate-700 text-xs uppercase tracking-wide py-4 px-4 text-right min-w-[130px]">
                          🛡️ PF (Employer)
                        </TableHead>
                        <TableHead className="font-black text-slate-700 text-xs uppercase tracking-wide py-4 px-4 text-right min-w-[130px]">
                          🛡️ PF (Employee)
                        </TableHead>
                        <TableHead className="font-black text-slate-800 text-xs uppercase tracking-wide py-4 px-6 text-right min-w-[140px]">
                          📊 Total Payable
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salaries.map((s, index) => (
                        <TableRow key={s.id} className={`hover:bg-slate-50/50 transition-colors border-b border-slate-100/50 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                        }`}>
                          <TableCell className="font-bold text-slate-900 py-4 px-6 sticky left-0 bg-inherit z-10">
                            <div className="flex flex-col space-y-1">
                              <span className="font-black text-sm">{s.name}</span>
                              <span className="text-xs text-slate-500 font-medium">ID: {s.id}</span>
                              {s.department && (
                                <Badge variant="outline" className="w-fit text-xs bg-slate-100 text-slate-600 border-slate-200">
                                  {s.department}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-slate-700 py-4 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-sm">
                              ${payrollConfig.profTax}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-bold py-4 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-rose-100 text-rose-700 font-mono text-sm">
                              ${Math.round(s.tax || 0)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-bold py-4 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-100 text-blue-700 font-mono text-sm">
                              ${Math.round(s.pf || 0)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-bold py-4 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-blue-100 text-blue-700 font-mono text-sm">
                              ${Math.round(s.pf || 0)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-black py-4 px-6">
                            <span className="inline-flex items-center px-3 py-2 rounded-lg bg-emerald-100 text-emerald-800 font-mono text-base shadow-sm">
                              ${Math.round(payrollConfig.profTax + (s.tax || 0) + (s.pf || 0) * 2)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Enhanced totals row */}
                      <TableRow className="bg-gradient-to-r from-slate-100 to-slate-200/50 font-black border-t-2 border-slate-300">
                        <TableCell className="py-5 px-6 sticky left-0 bg-slate-100 z-10">
                          <div className="flex items-center gap-2">
                            📊 <span className="text-lg font-black text-slate-900">TOTAL OBLIGATIONS</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-black py-5 px-4">
                          <span className="inline-flex items-center px-3 py-2 rounded-lg bg-slate-200 text-slate-800 font-mono text-base shadow-md">
                            ${(salaries.length * payrollConfig.profTax).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-black py-5 px-4">
                          <span className="inline-flex items-center px-3 py-2 rounded-lg bg-rose-200 text-rose-800 font-mono text-base shadow-md">
                            ${salaries.reduce((acc, s) => acc + (s.tax || 0), 0).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-black py-5 px-4">
                          <span className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-200 text-blue-800 font-mono text-base shadow-md">
                            ${salaries.reduce((acc, s) => acc + (s.pf || 0), 0).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-black py-5 px-4">
                          <span className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-200 text-blue-800 font-mono text-base shadow-md">
                            ${salaries.reduce((acc, s) => acc + (s.pf || 0), 0).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-black py-5 px-6">
                          <span className="inline-flex items-center px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-200 to-emerald-300 text-emerald-900 font-mono text-lg shadow-lg border-2 border-emerald-400">
                            ${salaries.reduce((acc, s) => acc + (s.tax || 0) + (s.pf || 0) * 2 + payrollConfig.profTax, 0).toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              </CardContent>
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
