import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Download, TrendingUp, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

type IncomeEntry = {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  customer?: string;
  project?: string;
  status: 'received' | 'pending';
};

export default function Income() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [incomes, setIncomes] = useState<IncomeEntry[]>([
    { id: 'INC-001', date: '2026-01-15', category: 'Sales Revenue', description: 'Product Sales - Q1', amount: 125000, paymentMethod: 'Bank Transfer', reference: 'INV-2345', customer: 'Acme Corp', project: 'Project Alpha', status: 'received' },
    { id: 'INC-002', date: '2026-01-14', category: 'Consulting Income', description: 'IT Consulting Services', amount: 45000, paymentMethod: 'Wire', reference: 'INV-2346', customer: 'Tech Solutions', project: 'Project Beta', status: 'received' },
    { id: 'INC-003', date: '2026-01-13', category: 'Service Revenue', description: 'Maintenance Contract', amount: 8500, paymentMethod: 'Check', reference: 'INV-2347', customer: 'Global Tech', status: 'pending' },
    { id: 'INC-004', date: '2026-01-12', category: 'Product Sales', description: 'Software Licenses', amount: 32000, paymentMethod: 'Credit Card', reference: 'INV-2348', customer: 'StartupCo', status: 'received' },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const receivedIncome = incomes.filter(inc => inc.status === 'received').reduce((sum, inc) => sum + inc.amount, 0);
  const pendingIncome = incomes.filter(inc => inc.status === 'pending').reduce((sum, inc) => sum + inc.amount, 0);

  const filteredIncomes = incomes.filter(inc =>
    inc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.customer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            Income
          </h2>
          <p className="text-sm text-slate-600 mt-1">Log and categorize incomes</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Income
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Income Entry</DialogTitle>
              <DialogDescription>Record a new income transaction</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input id="amount" type="number" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Revenue</SelectItem>
                      <SelectItem value="consulting">Consulting Income</SelectItem>
                      <SelectItem value="service">Service Revenue</SelectItem>
                      <SelectItem value="product">Product Sales</SelectItem>
                      <SelectItem value="subscription">Subscription Revenue</SelectItem>
                      <SelectItem value="interest">Interest Income</SelectItem>
                      <SelectItem value="other">Other Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="wire">Wire Transfer</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input id="description" placeholder="Enter description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Input id="customer" placeholder="Customer name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference/Invoice #</Label>
                  <Input id="reference" placeholder="INV-XXXX" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Project (Optional)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alpha">Project Alpha</SelectItem>
                    <SelectItem value="beta">Project Beta</SelectItem>
                    <SelectItem value="gamma">Project Gamma</SelectItem>
                    <SelectItem value="none">No Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Add Income</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-slate-600 mt-1">{incomes.length} transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">{formatCurrency(receivedIncome)}</div>
            <p className="text-xs text-slate-600 mt-1">Confirmed payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{formatCurrency(pendingIncome)}</div>
            <p className="text-xs text-slate-600 mt-1">Awaiting receipt</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Income Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input placeholder="Search income..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell>{income.date}</TableCell>
                  <TableCell>{income.category}</TableCell>
                  <TableCell>{income.description}</TableCell>
                  <TableCell>{income.customer || '-'}</TableCell>
                  <TableCell className="text-right font-semibold text-green-700">
                    {formatCurrency(income.amount)}
                  </TableCell>
                  <TableCell>{income.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      income.status === 'received' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    )}>
                      {income.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
