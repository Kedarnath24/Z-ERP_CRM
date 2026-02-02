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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Download
} from 'lucide-react';

interface GoodsReceiptNote {
  id: string;
  grnNumber: string;
  date: string;
  poNumber: string;
  supplier: string;
  receivedBy: string;
  items: number;
  totalQuantity: number;
  status: 'complete' | 'partial' | 'pending-qc';
  qualityCheckPassed: boolean;
}

const statusConfig = {
  complete: { label: 'Complete', class: 'bg-green-100 text-green-700 border-green-200' },
  partial: { label: 'Partial Receipt', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  'pending-qc': { label: 'Pending QC', class: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export default function GoodsReceiptNotes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedGRN, setSelectedGRN] = useState<GoodsReceiptNote | null>(null);
  const [selectedPO, setSelectedPO] = useState('');

  const [grns] = useState<GoodsReceiptNote[]>([
    {
      id: '1',
      grnNumber: 'GRN-2026-001',
      date: '2026-01-15',
      poNumber: 'PO-2026-001',
      supplier: 'Tech Solutions Inc',
      receivedBy: 'John Warehouse',
      items: 3,
      totalQuantity: 15,
      status: 'partial',
      qualityCheckPassed: true
    },
    {
      id: '2',
      grnNumber: 'GRN-2026-002',
      date: '2026-01-14',
      poNumber: 'PO-2026-002',
      supplier: 'Office Supplies Co',
      receivedBy: 'Sarah Storage',
      items: 3,
      totalQuantity: 50,
      status: 'complete',
      qualityCheckPassed: true
    }
  ]);

  const [availablePOs] = useState([
    { id: 'PO-2026-001', supplier: 'Tech Solutions Inc', items: 5, pendingQty: 10 },
    { id: 'PO-2026-003', supplier: 'Global Logistics', items: 1, pendingQty: 8 }
  ]);

  const [formData, setFormData] = useState({
    poNumber: '',
    receivedBy: '',
    receiptDate: new Date().toISOString().split('T')[0],
    notes: '',
    qualityCheck: false,
    items: [
      { name: '', orderedQty: '', receivedQty: '', damagedQty: '', remarks: '' }
    ]
  });

  const handlePOSelect = (poNumber: string) => {
    setSelectedPO(poNumber);
    setFormData({ ...formData, poNumber });
    // In real app, load PO items here
  };

  const handleViewGRN = (grn: GoodsReceiptNote) => {
    setSelectedGRN(grn);
    setShowViewDialog(true);
  };

  const filteredGRNs = grns.filter(grn => {
    const matchesSearch = grn.grnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grn.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         grn.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || grn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Goods Receipt Notes</h1>
            <p className="text-slate-600 mt-1">Record and track goods received from suppliers</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            Record Receipt
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total GRNs</CardTitle>
              <Package className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{grns.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Complete</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {grns.filter(g => g.status === 'complete').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partial</CardTitle>
              <Truck className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {grns.filter(g => g.status === 'partial').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending QC</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {grns.filter(g => g.status === 'pending-qc').length}
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
                  placeholder="Search by GRN number, PO number, or supplier..."
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
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="partial">Partial Receipt</SelectItem>
                  <SelectItem value="pending-qc">Pending QC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* GRN Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>GRN Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Received By</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Qty</TableHead>
                  <TableHead>QC Status</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGRNs.map((grn) => (
                  <TableRow key={grn.id}>
                    <TableCell className="font-medium">{grn.grnNumber}</TableCell>
                    <TableCell>{new Date(grn.date).toLocaleDateString()}</TableCell>
                    <TableCell>{grn.poNumber}</TableCell>
                    <TableCell>{grn.supplier}</TableCell>
                    <TableCell>{grn.receivedBy}</TableCell>
                    <TableCell>{grn.items}</TableCell>
                    <TableCell>{grn.totalQuantity}</TableCell>
                    <TableCell>
                      <Badge className={grn.qualityCheckPassed 
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                      }>
                        {grn.qualityCheckPassed ? 'Passed' : 'Failed'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[grn.status].class}>
                        {statusConfig[grn.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewGRN(grn)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
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
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record Goods Receipt</DialogTitle>
              <DialogDescription>
                Record received goods against a purchase order
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Select Purchase Order *</Label>
                  <Select value={formData.poNumber} onValueChange={handlePOSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select PO" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePOs.map(po => (
                        <SelectItem key={po.id} value={po.id}>
                          {po.id} - {po.supplier} ({po.pendingQty} pending)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Received By *</Label>
                  <Input
                    value={formData.receivedBy}
                    onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Receipt Date *</Label>
                  <Input
                    type="date"
                    value={formData.receiptDate}
                    onChange={(e) => setFormData({ ...formData, receiptDate: e.target.value })}
                  />
                </div>
              </div>

              {selectedPO && (
                <>
                  <div className="space-y-2">
                    <Label>Items Received</Label>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead>Item Name</TableHead>
                            <TableHead className="w-24">Ordered</TableHead>
                            <TableHead className="w-24">Received</TableHead>
                            <TableHead className="w-24">Damaged</TableHead>
                            <TableHead>Remarks</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Sample Item 1</TableCell>
                            <TableCell>
                              <Input defaultValue="10" disabled className="h-8" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="10" className="h-8" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="0" className="h-8" />
                            </TableCell>
                            <TableCell>
                              <Input placeholder="Add remarks" className="h-8" />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Sample Item 2</TableCell>
                            <TableCell>
                              <Input defaultValue="5" disabled className="h-8" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="3" className="h-8" />
                            </TableCell>
                            <TableCell>
                              <Input type="number" defaultValue="0" className="h-8" />
                            </TableCell>
                            <TableCell>
                              <Input placeholder="Add remarks" className="h-8" />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="qualityCheck"
                      checked={formData.qualityCheck}
                      onCheckedChange={(checked) => setFormData({ ...formData, qualityCheck: checked as boolean })}
                    />
                    <Label
                      htmlFor="qualityCheck"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Quality check passed
                    </Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes about the receipt"
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button disabled={!selectedPO}>
                <CheckCircle className="h-4 w-4" />
                Submit GRN
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Goods Receipt Note Details</DialogTitle>
              <DialogDescription>
                {selectedGRN?.grnNumber}
              </DialogDescription>
            </DialogHeader>
            {selectedGRN && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-600">PO Number</Label>
                    <p className="font-medium">{selectedGRN.poNumber}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Supplier</Label>
                    <p className="font-medium">{selectedGRN.supplier}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Receipt Date</Label>
                    <p className="font-medium">{new Date(selectedGRN.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Received By</Label>
                    <p className="font-medium">{selectedGRN.receivedBy}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Status</Label>
                    <Badge className={statusConfig[selectedGRN.status].class}>
                      {statusConfig[selectedGRN.status].label}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-slate-600">Quality Check</Label>
                    <Badge className={selectedGRN.qualityCheckPassed 
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-red-100 text-red-700 border-red-200'
                    }>
                      {selectedGRN.qualityCheckPassed ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-600 mb-2">Items Received ({selectedGRN.items})</Label>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-slate-600">Item details would appear here</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
              <Button variant="outline">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
