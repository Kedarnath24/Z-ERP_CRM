import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  FileText, 
  Download,
  TrendingUp,
  DollarSign,
  Package,
  Building2,
  Calendar,
  BarChart3,
  PieChart,
  Filter
} from 'lucide-react';

export default function PurchaseReports() {
  const [reportType, setReportType] = useState('purchase-history');
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-01-15');
  const [supplier, setSupplier] = useState('all');
  const [department, setDepartment] = useState('all');

  const purchaseHistory = [
    { item: 'Laptop Dell XPS 15', supplier: 'Tech Solutions Inc', department: 'IT', quantity: 5, amount: 7500, date: '2026-01-10' },
    { item: 'Office Chairs', supplier: 'Office Supplies Co', department: 'Operations', quantity: 20, amount: 4000, date: '2026-01-12' },
    { item: 'Printer Cartridges', supplier: 'Office Supplies Co', department: 'Admin', quantity: 10, amount: 500, date: '2026-01-13' },
    { item: 'Network Switch', supplier: 'Tech Solutions Inc', department: 'IT', quantity: 2, amount: 2000, date: '2026-01-14' },
  ];

  const spendAnalysis = [
    { department: 'IT', budget: 50000, actual: 35000, variance: 15000, variancePercent: 30 },
    { department: 'Marketing', budget: 30000, actual: 28500, variance: 1500, variancePercent: 5 },
    { department: 'Operations', budget: 40000, actual: 42000, variance: -2000, variancePercent: -5 },
    { department: 'HR', budget: 20000, actual: 18000, variance: 2000, variancePercent: 10 },
  ];

  const supplierPerformance = [
    { supplier: 'Tech Solutions Inc', orders: 45, totalSpend: 125000, avgDeliveryTime: 5, qualityRating: 4.5, onTimeDelivery: 95 },
    { supplier: 'Office Supplies Co', orders: 78, totalSpend: 45000, avgDeliveryTime: 3, qualityRating: 4.8, onTimeDelivery: 98 },
    { supplier: 'Global Logistics', orders: 32, totalSpend: 89000, avgDeliveryTime: 7, qualityRating: 4.2, onTimeDelivery: 88 },
  ];

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting ${reportType} as ${format}`);
    // Implement export logic
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Purchase Reports & Analytics</h1>
            <p className="text-slate-600 mt-1">Generate insights and reports on purchase activities</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <Download className="h-4 w-4" />
              Export Excel
            </Button>
            <Button onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spend (YTD)</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$259,000</div>
              <p className="text-xs text-slate-600 mt-1">
                +12% from last year
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">155</div>
              <p className="text-xs text-slate-600 mt-1">
                +8% from last year
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
              <Building2 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-slate-600 mt-1">
                3 new this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,671</div>
              <p className="text-xs text-slate-600 mt-1">
                +5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Report Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>Date From</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date To</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Select value={supplier} onValueChange={setSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Suppliers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    <SelectItem value="tech">Tech Solutions Inc</SelectItem>
                    <SelectItem value="office">Office Supplies Co</SelectItem>
                    <SelectItem value="logistics">Global Logistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Tabs */}
        <Card>
          <Tabs defaultValue="purchase-history" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="purchase-history">
                  <FileText className="h-4 w-4 mr-2" />
                  Purchase History
                </TabsTrigger>
                <TabsTrigger value="spend-analysis">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Spend Analysis
                </TabsTrigger>
                <TabsTrigger value="supplier-performance">
                  <PieChart className="h-4 w-4 mr-2" />
                  Supplier Performance
                </TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="purchase-history" className="space-y-4">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseHistory.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{item.item}</TableCell>
                          <TableCell>{item.supplier}</TableCell>
                          <TableCell>{item.department}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="font-semibold">${item.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end items-center p-4 bg-slate-50 rounded-lg">
                  <span className="font-medium mr-4">Total:</span>
                  <span className="text-2xl font-bold">
                    ${purchaseHistory.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                  </span>
                </div>
              </TabsContent>

              <TabsContent value="spend-analysis" className="space-y-4">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Actual Spend</TableHead>
                        <TableHead>Variance</TableHead>
                        <TableHead>Variance %</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {spendAnalysis.map((dept, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{dept.department}</TableCell>
                          <TableCell>${dept.budget.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold">${dept.actual.toLocaleString()}</TableCell>
                          <TableCell className={dept.variance >= 0 ? 'text-green-600' : 'text-red-600'}>
                            ${Math.abs(dept.variance).toLocaleString()}
                          </TableCell>
                          <TableCell className={dept.variancePercent >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {dept.variancePercent >= 0 ? '+' : ''}{dept.variancePercent}%
                          </TableCell>
                          <TableCell>
                            {dept.variance >= 0 ? (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
                                Under Budget
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs">
                                Over Budget
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="supplier-performance" className="space-y-4">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Total Orders</TableHead>
                        <TableHead>Total Spend</TableHead>
                        <TableHead>Avg Delivery (days)</TableHead>
                        <TableHead>Quality Rating</TableHead>
                        <TableHead>On-Time Delivery %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplierPerformance.map((supplier, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{supplier.supplier}</TableCell>
                          <TableCell>{supplier.orders}</TableCell>
                          <TableCell className="font-semibold">${supplier.totalSpend.toLocaleString()}</TableCell>
                          <TableCell>{supplier.avgDeliveryTime} days</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{supplier.qualityRating}</span>
                              <span className="text-yellow-500">★</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    supplier.onTimeDelivery >= 95
                                      ? 'bg-green-500'
                                      : supplier.onTimeDelivery >= 85
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                  }`}
                                  style={{ width: `${supplier.onTimeDelivery}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{supplier.onTimeDelivery}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Visual Analytics Placeholder */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Chart visualization would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Spend by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Chart visualization would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
