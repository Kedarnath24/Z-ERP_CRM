import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Download, 
  Filter, 
  Search,
  Eye,
  Edit,
  FileText,
  ArrowRight
} from 'lucide-react';

export default function EstimatesTab() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const estimates = [
    {
      id: 'EST-001',
      customer: 'Acme Corporation',
      amount: '$42,000',
      tax: '$4,200',
      date: '2026-01-03',
      expiryDate: '2026-02-03',
      reference: 'REF-2026-001',
      project: 'Web Development',
      status: 'sent',
      invoiced: false
    },
    {
      id: 'EST-002',
      customer: 'TechStart Inc.',
      amount: '$78,000',
      tax: '$7,800',
      date: '2026-01-06',
      expiryDate: '2026-02-06',
      reference: 'REF-2026-002',
      project: 'Mobile App',
      status: 'accepted',
      invoiced: true
    },
    {
      id: 'EST-003',
      customer: 'Global Brands Ltd.',
      amount: '$22,000',
      tax: '$2,200',
      date: '2026-01-09',
      expiryDate: '2026-02-09',
      reference: 'REF-2026-003',
      project: 'Marketing',
      status: 'draft',
      invoiced: false
    },
    {
      id: 'EST-004',
      customer: 'Enterprise Solutions',
      amount: '$115,000',
      tax: '$11,500',
      date: '2026-01-11',
      expiryDate: '2026-02-11',
      reference: 'REF-2026-004',
      project: 'ERP',
      status: 'expired',
      invoiced: false
    }
  ];

  const statusConfig: Record<string, { label: string; class: string }> = {
    draft: { label: 'Draft', class: 'bg-slate-100 text-slate-700 border-slate-200' },
    sent: { label: 'Sent', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    accepted: { label: 'Accepted', class: 'bg-green-100 text-green-700 border-green-200' },
    declined: { label: 'Declined', class: 'bg-red-100 text-red-700 border-red-200' },
    expired: { label: 'Expired', class: 'bg-orange-100 text-orange-700 border-orange-200' }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Estimates</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search estimates..."
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
                New Estimate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Estimate</DialogTitle>
                <DialogDescription>Provide an estimate for your customer</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Header */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="est-number">Estimate Number</Label>
                    <Input id="est-number" placeholder="EST-001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="est-date">Date</Label>
                    <Input id="est-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="est-expiry">Expiry Date</Label>
                    <Input id="est-expiry" type="date" />
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="est-customer">Customer</Label>
                    <Select>
                      <SelectTrigger id="est-customer">
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
                    <Label htmlFor="est-project">Project</Label>
                    <Select>
                      <SelectTrigger id="est-project">
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

                {/* Line Items */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Line Items</h3>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-600">
                      <div className="col-span-5">Item / Description</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-2">Rate</div>
                      <div className="col-span-2">Tax %</div>
                      <div className="col-span-1">Amount</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <Input className="col-span-5" placeholder="Item description" />
                      <Input className="col-span-2" type="number" placeholder="1" />
                      <Input className="col-span-2" type="number" placeholder="0.00" />
                      <Input className="col-span-2" type="number" placeholder="10" />
                      <Input className="col-span-1" disabled value="$0.00" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Line Item
                    </Button>
                  </div>
                </div>

                {/* Summary */}
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
                    <span className="font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-green-700">$0.00</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Save as Draft</Button>
                <Button>Create Estimate</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estimate Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invoiced</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {estimates.map((estimate) => (
              <TableRow key={estimate.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-sm font-semibold">{estimate.id}</TableCell>
                <TableCell className="font-medium">{estimate.customer}</TableCell>
                <TableCell className="font-semibold text-green-700">{estimate.amount}</TableCell>
                <TableCell className="text-sm">{estimate.tax}</TableCell>
                <TableCell className="text-sm">{estimate.date}</TableCell>
                <TableCell className="text-sm">{estimate.expiryDate}</TableCell>
                <TableCell className="font-mono text-xs">{estimate.reference}</TableCell>
                <TableCell className="text-sm">{estimate.project}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusConfig[estimate.status].class}>
                    {statusConfig[estimate.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {estimate.invoiced ? (
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">
                      No
                    </Badge>
                  )}
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
                    {!estimate.invoiced && estimate.status === 'accepted' && (
                      <Button variant="ghost" size="sm" className="text-green-600">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Convert
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
  );
}
