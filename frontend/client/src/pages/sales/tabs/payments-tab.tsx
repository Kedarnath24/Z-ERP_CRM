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
  CheckCircle,
  CreditCard
} from 'lucide-react';

export default function PaymentsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showReceiptView, setShowReceiptView] = useState(false);

  // Mock data
  const payments = [
    {
      id: 'PAY-001',
      invoice: 'INV-001',
      customer: 'Acme Corporation',
      amount: '$45,000',
      mode: 'Bank Transfer',
      transactionId: 'TXN-2026-001',
      date: '2026-01-10',
      status: 'completed'
    },
    {
      id: 'PAY-002',
      invoice: 'INV-005',
      customer: 'TechStart Inc.',
      amount: '$25,000',
      mode: 'Credit Card',
      transactionId: 'TXN-2026-002',
      date: '2026-01-12',
      status: 'completed'
    },
    {
      id: 'PAY-003',
      invoice: 'INV-007',
      customer: 'Global Brands Ltd.',
      amount: '$15,000',
      mode: 'PayPal',
      transactionId: 'TXN-2026-003',
      date: '2026-01-15',
      status: 'pending'
    },
    {
      id: 'PAY-004',
      invoice: 'INV-009',
      customer: 'Enterprise Solutions',
      amount: '$125,000',
      mode: 'Bank Transfer',
      transactionId: 'TXN-2026-004',
      date: '2026-01-18',
      status: 'completed'
    }
  ];

  const statusConfig: Record<string, { label: string; class: string }> = {
    completed: { label: 'Completed', class: 'bg-green-100 text-green-700 border-green-200' },
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    failed: { label: 'Failed', class: 'bg-red-100 text-red-700 border-red-200' }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Payments</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search payments..."
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
                  Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Record Payment</DialogTitle>
                  <DialogDescription>Enter payment details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Payment Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pay-number">Payment Number</Label>
                      <Input id="pay-number" placeholder="PAY-001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pay-date">Payment Date</Label>
                      <Input id="pay-date" type="date" />
                    </div>
                  </div>

                  {/* Invoice & Customer */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pay-invoice">Invoice</Label>
                      <Select>
                        <SelectTrigger id="pay-invoice">
                          <SelectValue placeholder="Select invoice" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inv-001">INV-001 - $45,000</SelectItem>
                          <SelectItem value="inv-002">INV-002 - $85,000</SelectItem>
                          <SelectItem value="inv-003">INV-003 - $25,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pay-customer">Customer</Label>
                      <Input id="pay-customer" placeholder="Auto-filled from invoice" disabled />
                    </div>
                  </div>

                  {/* Amount & Mode */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pay-amount">Amount Paid</Label>
                      <Input id="pay-amount" type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pay-mode">Payment Mode</Label>
                      <Select>
                        <SelectTrigger id="pay-mode">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="card">Credit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pay-txn">Transaction ID</Label>
                      <Input id="pay-txn" placeholder="TXN-2026-001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pay-ref">Reference Number</Label>
                      <Input id="pay-ref" placeholder="Optional" />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="pay-notes">Notes</Label>
                    <Textarea id="pay-notes" placeholder="Additional payment notes..." rows={3} />
                  </div>

                  {/* Invoice Amount Summary */}
                  <div className="p-4 bg-slate-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Invoice Amount:</span>
                      <span className="font-semibold">$45,000.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Amount Paid:</span>
                      <span className="font-semibold text-green-700">$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-2 border-t">
                      <span>Amount Due:</span>
                      <span className="text-red-700">$45,000.00</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Record Payment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment Number</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-sm font-semibold">{payment.id}</TableCell>
                  <TableCell className="font-medium text-blue-600 cursor-pointer hover:underline">
                    {payment.invoice}
                  </TableCell>
                  <TableCell className="font-medium">{payment.customer}</TableCell>
                  <TableCell className="font-semibold text-green-700">{payment.amount}</TableCell>
                  <TableCell className="text-sm">
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                      {payment.mode}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{payment.transactionId}</TableCell>
                  <TableCell className="text-sm">{payment.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[payment.status].class}>
                      {statusConfig[payment.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600"
                        onClick={() => setShowReceiptView(true)}
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
                        Receipt
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Receipt View Modal */}
      <Dialog open={showReceiptView} onOpenChange={setShowReceiptView}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>PAY-001 - Acme Corporation</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Receipt Header */}
            <div className="text-center pb-4 border-b">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Payment Received</h2>
              <p className="text-sm text-slate-600 mt-1">Thank you for your payment</p>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-600 mb-1">Receipt Number</p>
                <p className="font-mono font-semibold">PAY-001</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Payment Date</p>
                <p className="font-semibold">January 10, 2026</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Invoice Number</p>
                <p className="font-mono font-semibold text-blue-600">INV-001</p>
              </div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Transaction ID</p>
                <p className="font-mono text-sm">TXN-2026-001</p>
              </div>
            </div>

            {/* Customer & Payment Info */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Received From:</h3>
                <p className="text-sm font-semibold">Acme Corporation</p>
                <p className="text-sm text-slate-600">456 Client Avenue</p>
                <p className="text-sm text-slate-600">San Francisco, CA 94102</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Payment Method:</h3>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium">Bank Transfer</span>
                </div>
                <p className="text-sm text-slate-600">Account: ****5678</p>
              </div>
            </div>

            {/* Amount Details */}
            <div className="p-6 bg-slate-50 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Invoice Amount:</span>
                <span className="font-semibold">$45,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Previously Paid:</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t">
                <span>Amount Paid:</span>
                <span className="text-green-700">$45,000.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Balance Due:</span>
                <span className="font-semibold">$0.00</span>
              </div>
            </div>

            {/* Notes */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-slate-900 mb-2">Notes</h3>
              <p className="text-sm text-slate-600">Payment received in full for Invoice INV-001. Thank you for your business!</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
