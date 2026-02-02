import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Clock
} from 'lucide-react';

interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  poNumber: string;
  grnNumber: string;
  supplier: string;
  amount: number;
  status: 'pending' | 'matched' | 'discrepancy' | 'approved' | 'paid';
  matchType: '2-way' | '3-way';
  discrepancies: string[];
}

const statusConfig = {
  pending: { label: 'Pending Review', class: 'bg-slate-100 text-slate-700 border-slate-200' },
  matched: { label: 'Matched', class: 'bg-blue-100 text-blue-700 border-blue-200' },
  discrepancy: { label: 'Has Discrepancy', class: 'bg-red-100 text-red-700 border-red-200' },
  approved: { label: 'Approved', class: 'bg-green-100 text-green-700 border-green-200' },
  paid: { label: 'Paid', class: 'bg-purple-100 text-purple-700 border-purple-200' },
};

export default function PurchaseInvoices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);

  const [invoices] = useState<PurchaseInvoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2026-001',
      date: '2026-01-16',
      poNumber: 'PO-2026-001',
      grnNumber: 'GRN-2026-001',
      supplier: 'Tech Solutions Inc',
      amount: 15000,
      status: 'discrepancy',
      matchType: '3-way',
      discrepancies: ['Quantity mismatch on Item 2', 'Price variance: $200']
    },
    {
      id: '2',
      invoiceNumber: 'INV-2026-002',
      date: '2026-01-15',
      poNumber: 'PO-2026-002',
      grnNumber: 'GRN-2026-002',
      supplier: 'Office Supplies Co',
      amount: 8500,
      status: 'approved',
      matchType: '3-way',
      discrepancies: []
    },
    {
      id: '3',
      invoiceNumber: 'INV-2026-003',
      date: '2026-01-14',
      poNumber: 'PO-2026-003',
      grnNumber: '',
      supplier: 'Global Logistics',
      amount: 22000,
      status: 'matched',
      matchType: '2-way',
      discrepancies: []
    }
  ]);

  const handleViewInvoice = (invoice: PurchaseInvoice) => {
    setSelectedInvoice(invoice);
    setShowViewDialog(true);
  };

  const handleMatchInvoice = (invoice: PurchaseInvoice) => {
    setSelectedInvoice(invoice);
    setShowMatchDialog(true);
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inv.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inv.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Purchase Invoices</h1>
            <p className="text-slate-600 mt-1">Match and process supplier invoices</p>
          </div>
          <Button onClick={() => setShowUploadDialog(true)}>
            <Upload className="h-4 w-4" />
            Upload Invoice
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoices.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {invoices.filter(i => i.status === 'pending' || i.status === 'matched').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Discrepancies</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {invoices.filter(i => i.status === 'discrepancy').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by invoice number, PO number, or supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Review</option>
                <option value="matched">Matched</option>
                <option value="discrepancy">Has Discrepancy</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>GRN Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Match Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>{invoice.poNumber}</TableCell>
                    <TableCell>{invoice.grnNumber || '-'}</TableCell>
                    <TableCell>{invoice.supplier}</TableCell>
                    <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-slate-100 text-slate-700">
                        {invoice.matchType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[invoice.status].class}>
                        {statusConfig[invoice.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewInvoice(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(invoice.status === 'pending' || invoice.status === 'matched') && (
                          <Button variant="ghost" size="icon" onClick={() => handleMatchInvoice(invoice)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Invoice</DialogTitle>
              <DialogDescription>
                Upload supplier invoice document for matching
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-sm text-slate-600 mb-2">
                  Drag and drop invoice file here, or click to browse
                </p>
                <p className="text-xs text-slate-400">
                  Supported formats: PDF, PNG, JPG (Max 10MB)
                </p>
                <Button variant="outline" className="mt-4">
                  Choose File
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Number</Label>
                  <Input placeholder="Enter invoice number" />
                </div>
                <div className="space-y-2">
                  <Label>Invoice Date</Label>
                  <Input type="date" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button>Upload & Match</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Invoice Details</DialogTitle>
              <DialogDescription>
                {selectedInvoice?.invoiceNumber}
              </DialogDescription>
            </DialogHeader>
            {selectedInvoice && (
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="matching">Matching</TabsTrigger>
                  <TabsTrigger value="discrepancies">Discrepancies</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-600">Invoice Number</Label>
                      <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <Label className="text-slate-600">Date</Label>
                      <p className="font-medium">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-slate-600">Supplier</Label>
                      <p className="font-medium">{selectedInvoice.supplier}</p>
                    </div>
                    <div>
                      <Label className="text-slate-600">Amount</Label>
                      <p className="font-medium text-lg">${selectedInvoice.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-slate-600">Status</Label>
                      <Badge className={statusConfig[selectedInvoice.status].class}>
                        {statusConfig[selectedInvoice.status].label}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-slate-600">Match Type</Label>
                      <Badge className="bg-slate-100 text-slate-700">
                        {selectedInvoice.matchType}
                      </Badge>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="matching" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Purchase Order</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-medium">{selectedInvoice.poNumber}</p>
                        <p className="text-sm text-slate-600 mt-1">Amount: ${selectedInvoice.amount.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    {selectedInvoice.grnNumber && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Goods Receipt</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="font-medium">{selectedInvoice.grnNumber}</p>
                          <p className="text-sm text-slate-600 mt-1">Quantity matched</p>
                        </CardContent>
                      </Card>
                    )}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Invoice</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                        <p className="text-sm text-slate-600 mt-1">Amount: ${selectedInvoice.amount.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="discrepancies">
                  {selectedInvoice.discrepancies.length > 0 ? (
                    <div className="space-y-2">
                      {selectedInvoice.discrepancies.map((disc, idx) => (
                        <Alert key={idx} variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>{disc}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                      <p className="text-slate-600">No discrepancies found</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Match Dialog */}
        <Dialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Invoice Match</DialogTitle>
              <DialogDescription>
                {selectedInvoice?.invoiceNumber} - ${selectedInvoice?.amount.toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            {selectedInvoice && (
              <div className="space-y-4">
                {selectedInvoice.discrepancies.length > 0 ? (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {selectedInvoice.discrepancies.length} discrepancy(ies) detected
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      All matching criteria passed successfully
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMatchDialog(false)}>Cancel</Button>
              <Button variant="destructive">
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button>
                <CheckCircle className="h-4 w-4" />
                Approve for Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
