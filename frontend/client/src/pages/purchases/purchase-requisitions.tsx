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
  Trash2, 
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download
} from 'lucide-react';

interface PurchaseRequisition {
  id: string;
  prNumber: string;
  date: string;
  department: string;
  requestedBy: string;
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  items: number;
}

const statusConfig = {
  draft: { label: 'Draft', class: 'bg-slate-100 text-slate-700 border-slate-200' },
  pending: { label: 'Pending Approval', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  approved: { label: 'Approved', class: 'bg-green-100 text-green-700 border-green-200' },
  rejected: { label: 'Rejected', class: 'bg-red-100 text-red-700 border-red-200' },
};

export default function PurchaseRequisitions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedPR, setSelectedPR] = useState<PurchaseRequisition | null>(null);

  const [requisitions] = useState<PurchaseRequisition[]>([
    {
      id: '1',
      prNumber: 'PR-2026-001',
      date: '2026-01-10',
      department: 'IT',
      requestedBy: 'John Doe',
      totalAmount: 15000,
      status: 'pending',
      items: 5
    },
    {
      id: '2',
      prNumber: 'PR-2026-002',
      date: '2026-01-12',
      department: 'Marketing',
      requestedBy: 'Jane Smith',
      totalAmount: 8500,
      status: 'approved',
      items: 3
    },
    {
      id: '3',
      prNumber: 'PR-2026-003',
      date: '2026-01-14',
      department: 'Operations',
      requestedBy: 'Mike Johnson',
      totalAmount: 22000,
      status: 'draft',
      items: 8
    }
  ]);

  const [formData, setFormData] = useState({
    department: '',
    requestedBy: '',
    description: '',
    items: [{ name: '', quantity: '', unitPrice: '', totalPrice: '' }]
  });

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: '', unitPrice: '', totalPrice: '' }]
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleViewPR = (pr: PurchaseRequisition) => {
    setSelectedPR(pr);
    setShowViewDialog(true);
  };

  const handleApproval = (pr: PurchaseRequisition) => {
    setSelectedPR(pr);
    setShowApprovalDialog(true);
  };

  const filteredRequisitions = requisitions.filter(pr => {
    const matchesSearch = pr.prNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pr.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pr.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Purchase Requisitions</h1>
            <p className="text-slate-600 mt-1">Manage and track purchase requisition requests</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            New Requisition
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total PRs</CardTitle>
              <FileText className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requisitions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requisitions.filter(pr => pr.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requisitions.filter(pr => pr.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <FileText className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${requisitions.reduce((sum, pr) => sum + pr.totalAmount, 0).toLocaleString()}
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
                  placeholder="Search by PR number, department, or requester..."
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Requisitions Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PR Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequisitions.map((pr) => (
                  <TableRow key={pr.id}>
                    <TableCell className="font-medium">{pr.prNumber}</TableCell>
                    <TableCell>{new Date(pr.date).toLocaleDateString()}</TableCell>
                    <TableCell>{pr.department}</TableCell>
                    <TableCell>{pr.requestedBy}</TableCell>
                    <TableCell>{pr.items}</TableCell>
                    <TableCell>${pr.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[pr.status].class}>
                        {statusConfig[pr.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewPR(pr)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {pr.status === 'draft' && (
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {pr.status === 'pending' && (
                          <Button variant="ghost" size="icon" onClick={() => handleApproval(pr)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
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
              <DialogTitle>Create Purchase Requisition</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new purchase requisition
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Requested By</Label>
                  <Input
                    value={formData.requestedBy}
                    onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description / Purpose</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the purpose of this requisition"
                  rows={3}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Items</Label>
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
                      <Input placeholder="Qty" type="number" />
                    </div>
                    <div>
                      <Input placeholder="Unit Price" type="number" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Total" disabled />
                      {formData.items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button variant="outline">Save as Draft</Button>
              <Button>Submit for Approval</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Purchase Requisition Details</DialogTitle>
              <DialogDescription>
                {selectedPR?.prNumber}
              </DialogDescription>
            </DialogHeader>
            {selectedPR && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-600">Department</Label>
                    <p className="font-medium">{selectedPR.department}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Requested By</Label>
                    <p className="font-medium">{selectedPR.requestedBy}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Date</Label>
                    <p className="font-medium">{new Date(selectedPR.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-slate-600">Status</Label>
                    <Badge className={statusConfig[selectedPR.status].class}>
                      {statusConfig[selectedPR.status].label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-600 mb-2">Items ({selectedPR.items})</Label>
                  <div className="border rounded-lg p-4 space-y-2">
                    <p className="text-sm text-slate-600">Item details would appear here</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold">${selectedPR.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
              <Button variant="outline"><Download className="h-4 w-4" /> Download PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Approval Dialog */}
        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve/Reject Requisition</DialogTitle>
              <DialogDescription>
                {selectedPR?.prNumber} - ${selectedPR?.totalAmount.toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Comments</Label>
                <Textarea placeholder="Add approval comments or rejection reason" rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>Cancel</Button>
              <Button variant="destructive">
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button>
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
