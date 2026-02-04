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
import { 
  Plus, 
  Download, 
  Filter, 
  Search,
  Eye,
  Edit,
  FileText,
  AlertCircle,
  MoreVertical,
  Trash2,
  FileCheck,
  Building2,
  Calendar,
  FileSpreadsheet,
  Undo2
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

export default function CreditNotesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [showNoteView, setShowNoteView] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const { toast } = useToast();

  // Mock data
  const [creditNotes, setCreditNotes] = useState([
    {
      id: 'CN-001',
      invoice: 'INV-001',
      client: 'Acme Corporation',
      amount: '-$5,000',
      reason: 'Product Return',
      date: '2026-01-12',
      project: 'Web Development',
      status: 'issued'
    },
    {
      id: 'CN-002',
      invoice: 'INV-005',
      client: 'TechStart Inc.',
      amount: '-$2,500',
      reason: 'Service Adjustment',
      date: '2026-01-14',
      project: 'Mobile App',
      status: 'applied'
    },
    {
      id: 'CN-003',
      invoice: 'INV-007',
      client: 'Global Brands Ltd.',
      amount: '-$1,200',
      reason: 'Billing Error',
      date: '2026-01-16',
      project: 'Marketing',
      status: 'pending'
    },
    {
      id: 'CN-004',
      invoice: 'INV-009',
      client: 'Enterprise Solutions',
      amount: '-$15,000',
      reason: 'Scope Change',
      date: '2026-01-18',
      project: 'ERP',
      status: 'applied'
    }
  ]);

  const filteredNotes = useMemo(() => {
    return creditNotes.filter(note => {
      const matchesSearch = 
        note.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.invoice.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || note.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, creditNotes]);

  const handleExport = (type: 'excel' | 'pdf') => {
    setIsExporting(true);
    toast({ title: "Exporting...", description: `Preparing credit note list in ${type.toUpperCase()}.` });

    setTimeout(() => {
      if (type === 'excel') {
        const ws = XLSX.utils.json_to_sheet(filteredNotes);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "CreditNotes");
        XLSX.writeFile(wb, `CreditNotes_${new Date().toISOString().split('T')[0]}.xlsx`);
      } else {
        const doc = new jsPDF();
        doc.text("Credit Notes Report", 14, 15);
        autoTable(doc, {
          startY: 25,
          head: [['ID', 'Invoice', 'Client', 'Amount', 'Reason', 'Status']],
          body: filteredNotes.map(n => [n.id, n.invoice, n.client, n.amount, n.reason, n.status]),
        });
        doc.save(`CreditNotes_${new Date().toISOString().split('T')[0]}.pdf`);
      }
      setIsExporting(false);
      toast({ title: "Export Ready", description: "Download started." });
    }, 1200);
  };

  const statusConfig: Record<string, { label: string; class: string }> = {
    issued: { label: 'Issued', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    applied: { label: 'Applied', class: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    pending: { label: 'Pending', class: 'bg-amber-100 text-amber-700 border-amber-200' },
    cancelled: { label: 'Cancelled', class: 'bg-slate-100 text-slate-700 border-slate-200' }
  };

  const reasonOptions = [
    'Product Return',
    'Service Adjustment',
    'Billing Error',
    'Discount Applied',
    'Scope Change',
    'Customer Refund',
    'Quality Issue',
    'Other'
  ];

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 px-6 py-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl font-bold text-slate-900 leading-none">Credit Notes</CardTitle>
          <p className="text-sm text-slate-500">Manage returns and adjustments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Search credit notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-white border-slate-200 focus:border-blue-400 transition-all shadow-sm"
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
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Notes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('issued')}>Issued</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('applied')}>Applied</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2 border-slate-200" disabled={isExporting}>
                <Download className="h-4 w-4" />
                {isExporting ? '...' : 'Export'}
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
                New Credit Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Credit Note</DialogTitle>
                <DialogDescription>Issue a credit note against an invoice</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Header Section */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cn-number">Credit Note Number</Label>
                    <Input id="cn-number" placeholder="CN-001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cn-date">Date</Label>
                    <Input id="cn-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cn-status">Status</Label>
                    <Select>
                      <SelectTrigger id="cn-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="issued">Issued</SelectItem>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Invoice Reference */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cn-invoice">Invoice Reference</Label>
                    <Select>
                      <SelectTrigger id="cn-invoice">
                        <SelectValue placeholder="Select invoice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inv-001">INV-001 - Acme Corp - $45,000</SelectItem>
                        <SelectItem value="inv-002">INV-002 - TechStart - $85,000</SelectItem>
                        <SelectItem value="inv-003">INV-003 - Global Brands - $25,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cn-customer">Customer</Label>
                    <Input id="cn-customer" placeholder="Auto-filled from invoice" disabled />
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <Label htmlFor="cn-reason">Reason for Credit Note</Label>
                  <Select>
                    <SelectTrigger id="cn-reason">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {reasonOptions.map((reason) => (
                        <SelectItem key={reason} value={reason.toLowerCase().replace(/\s+/g, '-')}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Line Items Table */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Line Items</h3>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Items from Invoice INV-001
                    </Badge>
                  </div>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-600">
                      <div className="col-span-5">Item / Description</div>
                      <div className="col-span-2">Original Qty</div>
                      <div className="col-span-2">Credit Qty</div>
                      <div className="col-span-1">Rate</div>
                      <div className="col-span-2">Credit Amount</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <Input className="col-span-5" value="Website Design" disabled />
                      <Input className="col-span-2" value="1" disabled />
                      <Input className="col-span-2" type="number" placeholder="0" />
                      <Input className="col-span-1" value="$20,000" disabled />
                      <Input className="col-span-2" disabled value="$0.00" />
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <Input className="col-span-5" value="Development Services" disabled />
                      <Input className="col-span-2" value="1" disabled />
                      <Input className="col-span-2" type="number" placeholder="0" />
                      <Input className="col-span-1" value="$20,000" disabled />
                      <Input className="col-span-2" disabled value="$0.00" />
                    </div>
                  </div>
                </div>

                {/* Tax Adjustment */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cn-tax-adjustment">Tax Adjustment (%)</Label>
                    <Input id="cn-tax-adjustment" type="number" placeholder="10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cn-adjustment-reason">Adjustment Note</Label>
                    <Input id="cn-adjustment-reason" placeholder="Optional" />
                  </div>
                </div>

                {/* Summary */}
                <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal Credit:</span>
                    <span className="font-semibold text-red-600">-$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax Credit (10%):</span>
                    <span className="font-semibold text-red-600">-$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total Credit Amount:</span>
                    <span className="text-red-700">-$0.00</span>
                  </div>
                </div>

                {/* Refund Options */}
                <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    Credit Application
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="cn-application">How should this credit be applied?</Label>
                    <Select>
                      <SelectTrigger id="cn-application">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="refund">Refund to Customer</SelectItem>
                        <SelectItem value="credit">Apply to Customer Account</SelectItem>
                        <SelectItem value="next-invoice">Apply to Next Invoice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="cn-notes">Additional Notes</Label>
                  <Textarea id="cn-notes" placeholder="Enter any additional notes or explanations..." rows={3} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Save as Draft</Button>
                <Button>Issue Credit Note</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="px-6">Note #</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNotes.map((note) => (
              <TableRow key={note.id} className="hover:bg-slate-50 transition-colors group">
                <TableCell className="font-mono text-sm font-bold px-6">{note.id}</TableCell>
                <TableCell className="font-medium text-blue-600 cursor-pointer hover:underline">{note.invoice}</TableCell>
                <TableCell>
                   <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{note.client}</span>
                      <span className="text-xs text-slate-500">{note.project}</span>
                   </div>
                </TableCell>
                <TableCell className="font-bold text-rose-600">{note.amount}</TableCell>
                <TableCell className="text-sm font-medium">{note.date}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize font-medium shadow-sm", statusConfig[note.status].class)}>
                    {statusConfig[note.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setSelectedNote(note);
                        toast({ title: "View Note", description: `Loading ${note.id}...` });
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-600 hover:bg-slate-100"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Credit Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleExport('pdf')}>
                          <Download className="mr-2 h-4 w-4 text-purple-600" /> Download PDF
                        </DropdownMenuItem>
                        {note.status === 'issued' && (
                          <DropdownMenuItem>
                            <Undo2 className="mr-2 h-4 w-4 text-emerald-600" /> Apply Credit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Note
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
