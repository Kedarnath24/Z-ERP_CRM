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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Star,
  Phone,
  Mail,
  MapPin,
  Building2,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';

interface Supplier {
  id: string;
  code: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  rating: number;
  totalOrders: number;
  totalSpend: number;
  status: 'active' | 'inactive';
}

export default function Suppliers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const [suppliers] = useState<Supplier[]>([
    {
      id: '1',
      code: 'SUP-001',
      name: 'Tech Solutions Inc',
      category: 'IT Equipment',
      contactPerson: 'Robert Brown',
      email: 'robert@techsolutions.com',
      phone: '+1 555 0101',
      address: '123 Tech Street, Silicon Valley, CA',
      paymentTerms: 'Net 30',
      rating: 4.5,
      totalOrders: 45,
      totalSpend: 125000,
      status: 'active'
    },
    {
      id: '2',
      code: 'SUP-002',
      name: 'Office Supplies Co',
      category: 'Office Supplies',
      contactPerson: 'Sarah Wilson',
      email: 'sarah@officesupplies.com',
      phone: '+1 555 0202',
      address: '456 Commerce Ave, New York, NY',
      paymentTerms: 'Net 15',
      rating: 4.8,
      totalOrders: 78,
      totalSpend: 45000,
      status: 'active'
    },
    {
      id: '3',
      code: 'SUP-003',
      name: 'Global Logistics',
      category: 'Logistics',
      contactPerson: 'Michael Davis',
      email: 'michael@globallogistics.com',
      phone: '+1 555 0303',
      address: '789 Transport Lane, Chicago, IL',
      paymentTerms: 'Net 45',
      rating: 4.2,
      totalOrders: 32,
      totalSpend: 89000,
      status: 'active'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    paymentTerms: '',
    notes: ''
  });

  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowViewDialog(true);
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || supplier.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-slate-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-slate-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Supplier Management</h1>
            <p className="text-slate-600 mt-1">Manage supplier information and relationships</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            Add Supplier
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Suppliers</CardTitle>
              <Building2 className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suppliers.length}</div>
              <p className="text-xs text-slate-600 mt-1">
                {suppliers.filter(s => s.status === 'active').length} active
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {suppliers.reduce((sum, s) => sum + s.totalOrders, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${suppliers.reduce((sum, s) => sum + s.totalSpend, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}
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
                  placeholder="Search by name, code, or contact person..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Payment Terms</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spend</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{supplier.name}</p>
                        <p className="text-sm text-slate-500">{supplier.contactPerson}</p>
                      </div>
                    </TableCell>
                    <TableCell>{supplier.category}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {supplier.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {supplier.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{supplier.paymentTerms}</TableCell>
                    <TableCell>{renderStars(supplier.rating)}</TableCell>
                    <TableCell>{supplier.totalOrders}</TableCell>
                    <TableCell>${supplier.totalSpend.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={supplier.status === 'active' 
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                      }>
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewSupplier(supplier)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>
                Enter supplier information to add to your database
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Supplier Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter supplier name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                      <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                      <SelectItem value="Logistics">Logistics</SelectItem>
                      <SelectItem value="Services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Contact Person *</Label>
                  <Input
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Enter contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 555 0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Select value={formData.paymentTerms} onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Net 15">Net 15</SelectItem>
                      <SelectItem value="Net 30">Net 30</SelectItem>
                      <SelectItem value="Net 45">Net 45</SelectItem>
                      <SelectItem value="Net 60">Net 60</SelectItem>
                      <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter complete address"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes about supplier"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button>Add Supplier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Supplier Details</DialogTitle>
              <DialogDescription>
                {selectedSupplier?.code} - {selectedSupplier?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedSupplier && (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Information</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="history">Order History</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-600">Supplier Name</Label>
                      <p className="font-medium">{selectedSupplier.name}</p>
                    </div>
                    <div>
                      <Label className="text-slate-600">Category</Label>
                      <p className="font-medium">{selectedSupplier.category}</p>
                    </div>
                    <div>
                      <Label className="text-slate-600">Contact Person</Label>
                      <p className="font-medium">{selectedSupplier.contactPerson}</p>
                    </div>
                    <div>
                      <Label className="text-slate-600">Payment Terms</Label>
                      <p className="font-medium">{selectedSupplier.paymentTerms}</p>
                    </div>
                    <div>
                      <Label className="text-slate-600">Email</Label>
                      <p className="font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {selectedSupplier.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-slate-600">Phone</Label>
                      <p className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedSupplier.phone}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-slate-600">Address</Label>
                      <p className="font-medium flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1" />
                        {selectedSupplier.address}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Overall Rating</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {renderStars(selectedSupplier.rating)}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Total Orders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">{selectedSupplier.totalOrders}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Total Spend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">${selectedSupplier.totalSpend.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Avg Order Value</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">
                          ${Math.round(selectedSupplier.totalSpend / selectedSupplier.totalOrders).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="history">
                  <p className="text-sm text-slate-600">Order history would be displayed here</p>
                </TabsContent>
              </Tabs>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
