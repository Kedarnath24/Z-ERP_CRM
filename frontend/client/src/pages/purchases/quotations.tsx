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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Send,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  GitCompare
} from 'lucide-react';

interface Quotation {
  id: string;
  rfqNumber: string;
  date: string;
  prNumber: string;
  suppliers: string[];
  quotesReceived: number;
  totalSuppliers: number;
  status: 'pending' | 'received' | 'compared' | 'selected';
  dueDate: string;
}

const statusConfig = {
  pending: { label: 'Pending Response', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  received: { label: 'Quotes Received', class: 'bg-blue-100 text-blue-700 border-blue-200' },
  compared: { label: 'Under Comparison', class: 'bg-purple-100 text-purple-700 border-purple-200' },
  selected: { label: 'Vendor Selected', class: 'bg-green-100 text-green-700 border-green-200' },
};

export default function Quotations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<Quotation | null>(null);

  const [quotations] = useState<Quotation[]>([
    {
      id: '1',
      rfqNumber: 'RFQ-2026-001',
      date: '2026-01-08',
      prNumber: 'PR-2026-001',
      suppliers: ['Tech Solutions Inc', 'Tech Suppliers Ltd', 'Hardware Pro'],
      quotesReceived: 2,
      totalSuppliers: 3,
      status: 'received',
      dueDate: '2026-01-15'
    },
    {
      id: '2',
      rfqNumber: 'RFQ-2026-002',
      date: '2026-01-10',
      prNumber: 'PR-2026-002',
      suppliers: ['Office Supplies Co', 'Stationery World'],
      quotesReceived: 2,
      totalSuppliers: 2,
      status: 'compared',
      dueDate: '2026-01-17'
    },
    {
      id: '3',
      rfqNumber: 'RFQ-2026-003',
      date: '2026-01-12',
      prNumber: 'PR-2026-003',
      suppliers: ['Global Logistics', 'Express Shipping'],
      quotesReceived: 0,
      totalSuppliers: 2,
      status: 'pending',
      dueDate: '2026-01-19'
    }
  ]);

  const [formData, setFormData] = useState({
    prNumber: '',
    dueDate: '',
    suppliers: [] as string[],
    notes: ''
  });

  const handleViewRFQ = (rfq: Quotation) => {
    setSelectedRFQ(rfq);
    setShowViewDialog(true);
  };

  const handleCompare = (rfq: Quotation) => {
    setSelectedRFQ(rfq);
    setShowCompareDialog(true);
  };

  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = q.rfqNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.prNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Request for Quotations</h1>
            <p className="text-slate-600 mt-1">Manage RFQs and compare supplier quotes</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            Create RFQ
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total RFQs</CardTitle>
              <FileText className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quotations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotations.filter(q => q.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <GitCompare className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotations.filter(q => q.status === 'received' || q.status === 'compared').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {quotations.filter(q => q.status === 'selected').length}
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
                  placeholder="Search by RFQ number or PR number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending Response</SelectItem>
                  <SelectItem value="received">Quotes Received</SelectItem>
                  <SelectItem value="compared">Under Comparison</SelectItem>
                  <SelectItem value="selected">Vendor Selected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* RFQ Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RFQ Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>PR Number</TableHead>
                  <TableHead>Suppliers</TableHead>
                  <TableHead>Responses</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.map((rfq) => (
                  <TableRow key={rfq.id}>
                    <TableCell className="font-medium">{rfq.rfqNumber}</TableCell>
                    <TableCell>{new Date(rfq.date).toLocaleDateString()}</TableCell>
                    <TableCell>{rfq.prNumber}</TableCell>
                    <TableCell>{rfq.totalSuppliers}</TableCell>
                    <TableCell>
                      <span className="font-medium">{rfq.quotesReceived}</span>
                      <span className="text-slate-500"> / {rfq.totalSuppliers}</span>
                    </TableCell>
                    <TableCell>{new Date(rfq.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[rfq.status].class}>
                        {statusConfig[rfq.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewRFQ(rfq)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {rfq.quotesReceived > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => handleCompare(rfq)}>
                            <GitCompare className="h-4 w-4" />
                          </Button>
                        )}
                        {rfq.status === 'pending' && (
                          <Button variant="ghost" size="icon">
                            <Send className="h-4 w-4" />
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

        {/* Create Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Request for Quotation</DialogTitle>
              <DialogDescription>
                Send RFQ to suppliers based on purchase requisition
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Purchase Requisition *</Label>
                  <Select value={formData.prNumber} onValueChange={(value) => setFormData({ ...formData, prNumber: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select PR" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PR-2026-001">PR-2026-001 - IT Equipment</SelectItem>
                      <SelectItem value="PR-2026-002">PR-2026-002 - Office Supplies</SelectItem>
                      <SelectItem value="PR-2026-003">PR-2026-003 - Logistics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quote Due Date *</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Select Suppliers *</Label>
                <div className="space-y-2 p-4 border rounded-lg bg-slate-50">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Tech Solutions Inc (IT Equipment)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Tech Suppliers Ltd (IT Equipment)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Hardware Pro (IT Equipment)</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any special instructions for suppliers"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button>
                <Send className="h-4 w-4" />
                Send RFQ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>RFQ Details</DialogTitle>
              <DialogDescription>
                {selectedRFQ?.rfqNumber}
              </DialogDescription>
            </DialogHeader>
            {selectedRFQ && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-600">PR Number</Label>
                    <p className="font-medium">{selectedRFQ.prNumber}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Date Sent</Label>
                    <p className="font-medium">{new Date(selectedRFQ.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Due Date</Label>
                    <p className="font-medium">{new Date(selectedRFQ.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Status</Label>
                    <Badge className={statusConfig[selectedRFQ.status].class}>
                      {statusConfig[selectedRFQ.status].label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-600 mb-2">Suppliers ({selectedRFQ.totalSuppliers})</Label>
                  <div className="space-y-2">
                    {selectedRFQ.suppliers.map((supplier, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="font-medium">{supplier}</span>
                        {idx < selectedRFQ.quotesReceived ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            Quote Received
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                            Pending
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
              <Button variant="outline">
                <Download className="h-4 w-4" />
                Download RFQ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Compare Dialog */}
        <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Compare Quotations</DialogTitle>
              <DialogDescription>
                {selectedRFQ?.rfqNumber} - Compare received quotes
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Criteria</TableHead>
                    <TableHead>Tech Solutions Inc</TableHead>
                    <TableHead>Tech Suppliers Ltd</TableHead>
                    <TableHead>Best Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Total Price</TableCell>
                    <TableCell>$15,000</TableCell>
                    <TableCell className="text-green-600 font-semibold">$14,200</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">Tech Suppliers Ltd</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Delivery Time</TableCell>
                    <TableCell className="text-green-600 font-semibold">5 days</TableCell>
                    <TableCell>7 days</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">Tech Solutions Inc</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Warranty</TableCell>
                    <TableCell>1 year</TableCell>
                    <TableCell className="text-green-600 font-semibold">2 years</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700">Tech Suppliers Ltd</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Payment Terms</TableCell>
                    <TableCell>Net 30</TableCell>
                    <TableCell>Net 30</TableCell>
                    <TableCell>
                      <Badge className="bg-slate-100 text-slate-700">Equal</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCompareDialog(false)}>Cancel</Button>
              <Button>Select Supplier & Create PO</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
