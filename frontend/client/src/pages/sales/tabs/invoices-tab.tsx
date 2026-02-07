import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Download, 
  Filter, 
  Search,
  Eye,
  Edit,
  Printer,
  DollarSign,
  FileText,
  Paperclip,
  MoreVertical,
  Trash2,
  FileCheck,
  Send,
  Building2,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet
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
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cn } from "@/lib/utils";

export default function InvoicesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [showInvoiceView, setShowInvoiceView] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const { toast } = useToast();

  // Mock data
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-001',
      client: 'Acme Corporation',
      date: '2026-01-05',
      dueDate: '2026-02-05',
      amount: '$45,000',
      tax: '$4,500',
      items: 8,
      project: 'Web Development',
      status: 'paid'
    },
    {
      id: 'INV-002',
      client: 'TechStart Inc.',
      date: '2026-01-08',
      dueDate: '2026-02-08',
      amount: '$85,000',
      tax: '$8,500',
      items: 12,
      project: 'Mobile App',
      status: 'open'
    },
    {
      id: 'INV-003',
      client: 'Global Brands Ltd.',
      date: '2026-01-10',
      dueDate: '2026-01-25',
      amount: '$25,000',
      tax: '$2,500',
      items: 5,
      project: 'Marketing',
      status: 'overdue'
    },
    {
      id: 'INV-004',
      client: 'Enterprise Solutions',
      date: '2026-01-12',
      dueDate: '2026-02-12',
      amount: '$125,000',
      tax: '$12,500',
      items: 15,
      project: 'ERP',
      status: 'unpaid'
    }
  ]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = 
        inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.client.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, invoices]);

  const handleExport = (type: 'excel' | 'pdf') => {
    setIsExporting(true);
    toast({ title: "Exporting...", description: `Preparing invoice list in ${type.toUpperCase()}.` });

    setTimeout(() => {
      if (type === 'excel') {
        const ws = XLSX.utils.json_to_sheet(filteredInvoices);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Invoices");
        XLSX.writeFile(wb, `Invoices_${new Date().toISOString().split('T')[0]}.xlsx`);
      } else {
        const doc = new jsPDF();
        doc.text("Invoices Report", 14, 15);
        autoTable(doc, {
          startY: 25,
          head: [['ID', 'Client', 'Date', 'Due Date', 'Amount', 'Status']],
          body: filteredInvoices.map(i => [i.id, i.client, i.date, i.dueDate, i.amount, i.status]),
        });
        doc.save(`Invoices_${new Date().toISOString().split('T')[0]}.pdf`);
      }
      setIsExporting(false);
      toast({ title: "Export Ready", description: "Download started." });
    }, 1200);
  };

  const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
    paid: { label: 'Paid', class: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    open: { label: 'Open', class: 'bg-blue-100 text-blue-700 border-blue-200', icon: Clock },
    unpaid: { label: 'Unpaid', class: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle },
    overdue: { label: 'Overdue', class: 'bg-rose-100 text-rose-700 border-rose-200', icon: AlertCircle },
    cancelled: { label: 'Cancelled', class: 'bg-slate-100 text-slate-700 border-slate-200', icon: Trash2 }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl font-bold text-slate-900">Invoices</CardTitle>
            <p className="text-sm text-slate-500">Manage and track your customer billing</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-white border-slate-200 focus:border-blue-400 transition-all"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={cn("h-9 gap-2", statusFilter !== 'all' && "border-blue-500 bg-blue-50 text-blue-700")}>
                  <Filter className="h-4 w-4" />
                  {statusFilter === 'all' ? 'Status' : `Status: ${statusFilter}`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Invoices</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('open')}>Open</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('paid')}>Paid</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('unpaid')}>Unpaid</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('overdue')}>Overdue</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2" disabled={isExporting}>
                  <Download className="h-4 w-4" />
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Export Formats</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  <FileText className="mr-2 h-4 w-4 text-rose-600" /> PDF (.pdf)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700 shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                  <DialogDescription>Fill in the invoice details</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Header Section */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inv-number">Invoice Number</Label>
                      <Input id="inv-number" placeholder="INV-001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inv-date">Invoice Date</Label>
                      <Input id="inv-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inv-due">Due Date</Label>
                      <Input id="inv-due" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inv-status">Status</Label>
                      <Select>
                        <SelectTrigger id="inv-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inv-customer">Customer</Label>
                      <Select>
                        <SelectTrigger id="inv-customer">
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acme">Acme Corporation</SelectItem>
                          <SelectItem value="techstart">TechStart Inc.</SelectItem>
                          <SelectItem value="global">Global Brands Ltd.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inv-project">Project Reference</Label>
                      <Select>
                        <SelectTrigger id="inv-project">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web">Web Development</SelectItem>
                          <SelectItem value="mobile">Mobile App</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Line Items</h3>
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-600">
                        <div className="col-span-4">Item / Description</div>
                        <div className="col-span-2">Quantity</div>
                        <div className="col-span-2">Rate</div>
                        <div className="col-span-2">Tax %</div>
                        <div className="col-span-2">Amount</div>
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                        <Input className="col-span-4" placeholder="Item description" />
                        <Input className="col-span-2" type="number" placeholder="1" />
                        <Input className="col-span-2" type="number" placeholder="0.00" />
                        <Input className="col-span-2" type="number" placeholder="10" />
                        <Input className="col-span-2" disabled value="$0.00" />
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Line Item
                      </Button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="flex justify-end pt-4">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Subtotal:</span>
                        <span className="font-semibold">$0.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Tax (10%):</span>
                        <span className="font-semibold">$0.00</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-lg">
                        <span>Total:</span>
                        <span>$0.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="inv-notes">Additional Notes</Label>
                    <Textarea id="inv-notes" placeholder="Enter terms, payment instructions, etc." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Save as Draft</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">Issue Invoice</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[120px] px-6">Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((inv) => (
                <TableRow key={inv.id} className="hover:bg-slate-50 transition-colors group">
                  <TableCell className="font-bold text-slate-900 px-6">{inv.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{inv.client}</span>
                      <span className="text-xs text-slate-500 lowercase">{inv.project}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{inv.date}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-tighter font-bold">Due: {inv.dueDate}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">{inv.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("gap-1.5 px-3 py-1 shadow-sm capitalize", statusConfig[inv.status].class)}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {statusConfig[inv.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Dialog open={showInvoiceView && selectedInvoice?.id === inv.id} onOpenChange={(open) => {
                        setShowInvoiceView(open);
                        if (!open) setSelectedInvoice(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                            onClick={() => setSelectedInvoice(inv)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl flex flex-col">
                          {/* Invoice View Header */}
                          <div className="px-8 py-6 bg-slate-900 text-white flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-blue-600 hover:bg-blue-600 text-white border-none text-[10px] uppercase font-bold tracking-widest px-2 py-0.5">Invoice</Badge>
                                <span className="text-2xl font-black font-mono tracking-tighter text-blue-400">{selectedInvoice?.id}</span>
                              </div>
                              <p className="text-slate-400 text-sm font-medium">Issued on {selectedInvoice?.date}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                <Download className="h-4 w-4 mr-2" /> PDF
                              </Button>
                              <Button className="bg-blue-600 hover:bg-blue-700">
                                <Send className="h-4 w-4 mr-2" /> Send to Client
                              </Button>
                            </div>
                          </div>

                          <ScrollArea className="flex-1">
                            <div className="p-8 space-y-8">
                              {/* Address Grid */}
                              <div className="grid grid-cols-2 gap-12">
                                <div className="space-y-4">
                                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Our Details</h3>
                                  <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                      <Building2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-lg text-slate-800">Z-ERP Solutions</p>
                                      <p className="text-sm text-slate-600 leading-relaxed">
                                        123 Business Street, Tech District<br />
                                        Silicon Valley, CA 94025<br />
                                        accounts@z-erp.io
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</h3>
                                  <p className="font-bold text-lg text-slate-800 mb-2">{selectedInvoice?.client}</p>
                                  <p className="text-sm text-slate-600 leading-relaxed">
                                    456 Client Avenue<br />
                                    San Francisco, CA 94102<br />
                                    billing@client.com
                                  </p>
                                </div>
                              </div>

                              {/* Invoice Info Grid */}
                              <div className="grid grid-cols-3 gap-6 p-6 bg-slate-50/80 rounded-xl border border-slate-100">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-tight">Invoice Date</span>
                                  </div>
                                  <p className="text-sm font-bold text-slate-900">{selectedInvoice?.date}</p>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-tight">Due Date</span>
                                  </div>
                                  <p className="text-sm font-bold text-slate-900">{selectedInvoice?.dueDate}</p>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-slate-500">
                                    <CreditCard className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-tight">Status</span>
                                  </div>
                                  <div>
                                    {selectedInvoice && (
                                      <Badge variant="outline" className={cn("gap-1 shadow-sm capitalize", statusConfig[selectedInvoice.status].class)}>
                                        {statusConfig[selectedInvoice.status].label}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Items Table */}
                              <div className="border rounded-xl overflow-hidden shadow-sm">
                                <Table>
                                  <TableHeader className="bg-slate-50/80">
                                    <TableRow>
                                      <TableHead className="w-[45%] font-bold">Description</TableHead>
                                      <TableHead className="font-bold">Quantity</TableHead>
                                      <TableHead className="font-bold">Rate</TableHead>
                                      <TableHead className="font-bold">Tax</TableHead>
                                      <TableHead className="text-right font-bold">Amount</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell className="font-medium">Web Design & Development Services</TableCell>
                                      <TableCell>1</TableCell>
                                      <TableCell>$20,000</TableCell>
                                      <TableCell>10%</TableCell>
                                      <TableCell className="text-right font-bold">$22,000.00</TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell className="font-medium">Cloud Infrastructure Setup</TableCell>
                                      <TableCell>1</TableCell>
                                      <TableCell>$20,000</TableCell>
                                      <TableCell>10%</TableCell>
                                      <TableCell className="text-right font-bold">$22,000.00</TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>

                              {/* Financial Summary */}
                              <div className="flex justify-end gap-6">
                                <div className="w-80 space-y-3 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                                  <div className="flex justify-between text-sm text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-slate-900 font-mono">$40,000.00</span>
                                  </div>
                                  <div className="flex justify-between text-sm text-slate-600">
                                    <span>Tax (10%)</span>
                                    <span className="font-medium text-slate-900 font-mono">$4,000.00</span>
                                  </div>
                                  <div className="flex justify-between text-sm text-slate-600 pb-2 border-b border-slate-200">
                                    <span>Discount (5%)</span>
                                    <span className="font-medium text-rose-600 font-mono">-$2,000.00</span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="text-base font-bold text-slate-900 uppercase">Total Amount</span>
                                    <span className="text-2xl font-black font-mono text-blue-600 tracking-tighter">{selectedInvoice?.amount}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-100">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:bg-rose-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
