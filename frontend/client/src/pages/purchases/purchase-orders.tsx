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
  Edit, 
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Package,
  DollarSign,
  Truck
} from 'lucide-react';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  supplier: string;
  type: 'standard' | 'planned' | 'blanket';
  totalAmount: number;
  status: 'ordered' | 'partial' | 'received' | 'billed' | 'closed';
  deliveryDate: string;
  items: number;
}

const statusConfig = {
  ordered: { label: 'Ordered', class: 'bg-blue-100 text-blue-700 border-blue-200' },
  partial: { label: 'Partially Received', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  received: { label: 'Fully Received', class: 'bg-green-100 text-green-700 border-green-200' },
  billed: { label: 'Billed', class: 'bg-purple-100 text-purple-700 border-purple-200' },
  closed: { label: 'Closed', class: 'bg-slate-100 text-slate-700 border-slate-200' },
};

const typeConfig = {
  standard: { label: 'Standard', class: 'bg-slate-100 text-slate-700' },
  planned: { label: 'Planned', class: 'bg-blue-100 text-blue-700' },
  blanket: { label: 'Blanket', class: 'bg-purple-100 text-purple-700' },
};

export default function PurchaseOrders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showAmendDialog, setShowAmendDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const [purchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: '1',
      poNumber: 'PO-2026-001',
      date: '2026-01-11',
      supplier: 'Tech Solutions Inc',
      type: 'standard',
      totalAmount: 15000,
      status: 'partial',
      deliveryDate: '2026-01-25',
      items: 5
    },
    {
      id: '2',
      poNumber: 'PO-2026-002',
      date: '2026-01-13',
      supplier: 'Office Supplies Co',
      type: 'standard',
      totalAmount: 8500,
      status: 'received',
      deliveryDate: '2026-01-20',
      items: 3
    },
    {
      id: '3',
      poNumber: 'PO-2026-003',
      date: '2026-01-14',
      supplier: 'Global Logistics',
      type: 'blanket',
      totalAmount: 50000,
      status: 'ordered',
      deliveryDate: '2026-02-15',
      items: 1
    }
  ]);

  const [formData, setFormData] = useState({
    supplier: '',
    type: 'standard',
    deliveryDate: '',
    paymentTerms: '',
    notes: '',
    items: [{ name: '', quantity: '', unitPrice: '', totalPrice: '' }]
  });

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: '', unitPrice: '', totalPrice: '' }]
    });
  };

  const handleViewPO = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setShowViewDialog(true);
  };

  const handleAmend = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setShowAmendDialog(true);
  };

  const handleCancel = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setShowCancelDialog(true);
  };

  const filteredOrders = purchaseOrders.filter(po => {
    const matchesSearch = po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         po.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Purchase Orders</h1>
            <p className="text-slate-600 mt-1">Create and manage purchase orders</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            New Purchase Order
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total POs</CardTitle>
              <FileText className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchaseOrders.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Delivery</CardTitle>
              <Truck className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {purchaseOrders.filter(po => po.status === 'ordered' || po.status === 'partial').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Received</CardTitle>
              <Package className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {purchaseOrders.filter(po => po.status === 'received').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0).toLocaleString()}
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
                  placeholder="Search by PO number or supplier..."
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
                  <SelectItem value="ordered">Ordered</SelectItem>
                  <SelectItem value="partial">Partially Received</SelectItem>
                  <SelectItem value="received">Fully Received</SelectItem>
                  <SelectItem value="billed">Billed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Orders Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.poNumber}</TableCell>
                    <TableCell>{new Date(po.date).toLocaleDateString()}</TableCell>
                    <TableCell>{po.supplier}</TableCell>
                    <TableCell>
                      <Badge className={typeConfig[po.type].class}>
                        {typeConfig[po.type].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{po.items}</TableCell>
                    <TableCell>${po.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(po.deliveryDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[po.status].class}>
                        {statusConfig[po.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewPO(po)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(po.status === 'ordered' || po.status === 'partial') && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => handleAmend(po)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleCancel(po)}>
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
              <DialogDescription>
                Create a new purchase order for supplier
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Supplier *</Label>
                  <Select value={formData.supplier} onValueChange={(value) => setFormData({ ...formData, supplier: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Tech Solutions Inc</SelectItem>
                      <SelectItem value="office">Office Supplies Co</SelectItem>
                      <SelectItem value="logistics">Global Logistics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>PO Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="blanket">Blanket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Delivery Date *</Label>
                  <Input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Select value={formData.paymentTerms} onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net15">Net 15</SelectItem>
                      <SelectItem value="net30">Net 30</SelectItem>
                      <SelectItem value="net45">Net 45</SelectItem>
                      <SelectItem value="net60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or instructions"
                  rows={2}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Items *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 p-3 bg-slate-50 rounded-lg">
                    <div className="col-span-2">
                      <Input placeholder="Item name" />
                    </div>
                    <div>
                      <Input placeholder="Quantity" type="number" />
                    </div>
                    <div>
                      <Input placeholder="Unit Price" type="number" />
                    </div>
                    <div>
                      <Input placeholder="Total" disabled />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button>Create Purchase Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Purchase Order Details</DialogTitle>
              <DialogDescription>
                {selectedPO?.poNumber}
              </DialogDescription>
            </DialogHeader>
            {selectedPO && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-600">Supplier</Label>
                    <p className="font-medium">{selectedPO.supplier}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Type</Label>
                    <Badge className={typeConfig[selectedPO.type].class}>
                      {typeConfig[selectedPO.type].label}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-slate-600">Order Date</Label>
                    <p className="font-medium">{new Date(selectedPO.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Delivery Date</Label>
                    <p className="font-medium">{new Date(selectedPO.deliveryDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Status</Label>
                    <Badge className={statusConfig[selectedPO.status].class}>
                      {statusConfig[selectedPO.status].label}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-slate-600">Items</Label>
                    <p className="font-medium">{selectedPO.items}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold">${selectedPO.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
              <Button variant="outline"><Download className="h-4 w-4" /> Download PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Amend Dialog */}
        <Dialog open={showAmendDialog} onOpenChange={setShowAmendDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Amend Purchase Order</DialogTitle>
              <DialogDescription>
                {selectedPO?.poNumber}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Amendment Reason *</Label>
                <Textarea placeholder="Provide reason for amendment" rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAmendDialog(false)}>Cancel</Button>
              <Button>Proceed to Amend</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Purchase Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel {selectedPO?.poNumber}?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Cancellation Reason *</Label>
                <Textarea placeholder="Provide reason for cancellation" rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>Go Back</Button>
              <Button variant="destructive">
                <XCircle className="h-4 w-4" />
                Cancel PO
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
