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
  FileText,
  AlertCircle
} from 'lucide-react';

export default function CreditNotesTab() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const creditNotes = [
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
  ];

  const statusConfig: Record<string, { label: string; class: string }> = {
    issued: { label: 'Issued', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    applied: { label: 'Applied', class: 'bg-green-100 text-green-700 border-green-200' },
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Credit Notes</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search credit notes..."
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
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Credit Note Number</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creditNotes.map((note) => (
              <TableRow key={note.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-sm font-semibold">{note.id}</TableCell>
                <TableCell className="font-medium text-blue-600 cursor-pointer hover:underline">
                  {note.invoice}
                </TableCell>
                <TableCell className="font-medium">{note.client}</TableCell>
                <TableCell className="font-semibold text-red-700">{note.amount}</TableCell>
                <TableCell className="text-sm">
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
                    {note.reason}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{note.date}</TableCell>
                <TableCell className="text-sm">{note.project}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusConfig[note.status].class}>
                    {statusConfig[note.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="text-blue-600">
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
  );
}
