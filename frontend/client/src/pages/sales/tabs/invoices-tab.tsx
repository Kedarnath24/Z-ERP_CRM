import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Printer,
  DollarSign,
  FileText,
  Paperclip
} from 'lucide-react';

export default function InvoicesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInvoiceView, setShowInvoiceView] = useState(false);

  // Mock data
  const invoices = [
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
  ];

  const statusConfig: Record<string, { label: string; class: string }> = {
    paid: { label: 'Paid', class: 'bg-green-100 text-green-700 border-green-200' },
    open: { label: 'Open', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    unpaid: { label: 'Unpaid', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    overdue: { label: 'Overdue', class: 'bg-red-100 text-red-700 border-red-200' },
    cancelled: { label: 'Cancelled', class: 'bg-slate-100 text-slate-700 border-slate-200' }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Invoices</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
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

                  {/* Calculation Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="inv-discount">Discount (%)</Label>
                        <Input id="inv-discount" type="number" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inv-adjustment">Adjustment</Label>
                        <Input id="inv-adjustment" type="number" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="space-y-2 p-4 bg-slate-50 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Subtotal:</span>
                        <span className="font-semibold">$0.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tax:</span>
                        <span className="font-semibold">$0.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Discount:</span>
                        <span className="font-semibold text-red-600">-$0.00</span>
                      </div>
                      <div className="flex justify-between text-base font-bold pt-2 border-t">
                        <span>Total:</span>
                        <span className="text-green-700">$0.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Notes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inv-terms">Payment Terms</Label>
                      <Textarea id="inv-terms" placeholder="Net 30 days..." rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inv-notes">Notes</Label>
                      <Textarea id="inv-notes" placeholder="Additional notes..." rows={3} />
                    </div>
                  </div>

                  {/* Attachments */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      Attachments
                    </Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                      <Input type="file" className="hidden" id="inv-files" multiple />
                      <label htmlFor="inv-files" className="cursor-pointer">
                        <Paperclip className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">Click to upload files</p>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Create Invoice</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-sm font-semibold">{invoice.id}</TableCell>
                  <TableCell className="font-medium">{invoice.client}</TableCell>
                  <TableCell className="text-sm">{invoice.date}</TableCell>
                  <TableCell className="text-sm">{invoice.dueDate}</TableCell>
                  <TableCell className="font-semibold text-green-700">{invoice.amount}</TableCell>
                  <TableCell className="text-sm">{invoice.tax}</TableCell>
                  <TableCell className="text-sm">{invoice.items}</TableCell>
                  <TableCell className="text-sm">{invoice.project}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[invoice.status].class}>
                      {statusConfig[invoice.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600"
                        onClick={() => setShowInvoiceView(true)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-600">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-purple-600">
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice View Modal */}
      <Dialog open={showInvoiceView} onOpenChange={setShowInvoiceView}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>INV-001 - Acme Corporation</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Company & Client Header */}
            <div className="grid grid-cols-2 gap-6 pb-4 border-b">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">From:</h3>
                <p className="text-sm font-semibold">Z-ERP Solutions</p>
                <p className="text-sm text-slate-600">123 Business Street</p>
                <p className="text-sm text-slate-600">New York, NY 10001</p>
                <p className="text-sm text-slate-600">contact@zerp.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Bill To:</h3>
                <p className="text-sm font-semibold">Acme Corporation</p>
                <p className="text-sm text-slate-600">456 Client Avenue</p>
                <p className="text-sm text-slate-600">San Francisco, CA 94102</p>
                <p className="text-sm text-slate-600">billing@acme.com</p>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-xs text-slate-600">Invoice Date</p>
                <p className="font-semibold">Jan 05, 2026</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Due Date</p>
                <p className="font-semibold">Feb 05, 2026</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Invoice Number</p>
                <p className="font-semibold font-mono">INV-001</p>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Website Design</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>$20,000</TableCell>
                    <TableCell>10%</TableCell>
                    <TableCell className="text-right font-semibold">$22,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Development Services</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>$20,000</TableCell>
                    <TableCell>10%</TableCell>
                    <TableCell className="text-right font-semibold">$22,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Summary */}
            <div className="flex justify-end">
              <div className="w-80 space-y-2 p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-semibold">$40,000.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax (10%):</span>
                  <span className="font-semibold">$4,000.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Discount:</span>
                  <span className="font-semibold text-red-600">-$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-green-700">$45,000.00</span>
                </div>
              </div>
            </div>

            {/* Payment Terms & Notes */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Payment Terms</h3>
                <p className="text-sm text-slate-600">Payment due within 30 days. Late payments subject to 2% monthly interest.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Notes</h3>
                <p className="text-sm text-slate-600">Thank you for your business!</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button>
              <DollarSign className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Create Credit Note
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
