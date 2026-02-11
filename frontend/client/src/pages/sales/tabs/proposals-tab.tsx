import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Download, 
  Filter, 
  Search,
  Send,
  Eye,
  Edit,
  FileText,
  MoreVertical,
  Paperclip,
  CheckSquare,
  ChevronDown,
  Mail,
  X,
  Calendar as CalendarIcon,
  Trash2,
  Link as LinkIcon,
  Check,
  Building2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cn } from '@/lib/utils';

export default function ProposalsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const { toast } = useToast();

  // Mock data
  const [proposals, setProposals] = useState([
    {
      id: 'PROP-001',
      subject: 'Website Redesign Project',
      customer: 'Acme Corporation',
      totalAmount: '$45,000',
      date: '2026-01-05',
      validUntil: '2026-02-05',
      project: 'Web Development',
      status: 'sent'
    },
    {
      id: 'PROP-002',
      subject: 'Mobile App Development',
      customer: 'TechStart Inc.',
      totalAmount: '$85,000',
      date: '2026-01-08',
      validUntil: '2026-02-08',
      project: 'Mobile App',
      status: 'accepted'
    },
    {
      id: 'PROP-003',
      subject: 'Digital Marketing Campaign',
      customer: 'Global Brands Ltd.',
      totalAmount: '$25,000',
      date: '2026-01-10',
      validUntil: '2026-02-10',
      project: 'Marketing',
      status: 'draft'
    },
    {
      id: 'PROP-004',
      subject: 'ERP System Implementation',
      customer: 'Enterprise Solutions',
      totalAmount: '$125,000',
      date: '2026-01-12',
      validUntil: '2026-02-12',
      project: 'ERP',
      status: 'declined'
    }
  ]);

  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Edit Form State
  const [editCustomer, setEditCustomer] = useState('');
  const [editProject, setEditProject] = useState('');
  const [editBillTo, setEditBillTo] = useState({ address: '', city: '' });
  const [editShipTo, setEditShipTo] = useState({ address: '', city: '' });
  const [editTags, setEditTags] = useState('');
  const [editCurrency, setEditCurrency] = useState('usd');
  const [editStatus, setEditStatus] = useState('accepted');
  const [editReference, setEditReference] = useState('');
  const [editSaleAgent, setEditSaleAgent] = useState('zeruns-erp-admin');
  const [editDiscountType, setEditDiscountType] = useState('no-discount');
  const [editAdminNote, setEditAdminNote] = useState('');
  const [editEstimateNumber, setEditEstimateNumber] = useState('000001');
  const [editEstimatePrefix, setEditEstimatePrefix] = useState('EST-');
  const [editEstimateDate, setEditEstimateDate] = useState('');
  const [editExpiryDate, setEditExpiryDate] = useState('');
  const [editClientNote, setEditClientNote] = useState('');
  const [editTerms, setEditTerms] = useState('');
  const [editItems, setEditItems] = useState([
    { id: 1, description: '', longDescription: '', qty: 1, rate: 0, tax: 'No Tax', amount: 0 }
  ]);
  const [editDiscount, setEditDiscount] = useState(0);
  const [editAdjustment, setEditAdjustment] = useState(0);
  const [showQtyAs, setShowQtyAs] = useState<'qty' | 'hours' | 'both'>('qty');

  // Load proposal data into edit form
  const loadProposalForEdit = (proposal: any) => {
    setSelectedProposal(proposal);
    setEditCustomer(proposal.customer || '');
    setEditProject(proposal.project || '');
    setEditBillTo({ address: 'Industrial Ave, Abhu Dhabi', city: 'AE' });
    setEditShipTo({ address: '', city: '' });
    setEditTags('tag');
    setEditCurrency('usd');
    setEditStatus(proposal.status || 'draft');
    setEditReference('');
    setEditSaleAgent('zeruns-erp-admin');
    setEditDiscountType('no-discount');
    setEditAdminNote('');
    setEditEstimateNumber(proposal.id?.split('-')[1] || '000001');
    setEditEstimatePrefix('EST-');
    setEditEstimateDate(proposal.date || new Date().toISOString().split('T')[0]);
    setEditExpiryDate(proposal.validUntil || '');
    setEditClientNote('');
    setEditTerms('');
    setEditItems([
      { id: 1, description: '', longDescription: '', qty: 1, rate: 0, tax: 'No Tax', amount: 0 },
      { id: 2, description: 'Brochure', longDescription: 'A3 Size one side lamination', qty: 100, rate: 9, tax: 'No Tax', amount: 900 }
    ]);
    setEditDiscount(0);
    setEditAdjustment(0);
    setIsEditOpen(true);
  };

  // Calculate edit form totals
  const calculateEditTotals = () => {
    const subTotal = editItems.reduce((sum, item) => sum + (item.qty * item.rate), 0);
    const discountAmount = editDiscountType === 'percent' ? (subTotal * editDiscount / 100) : editDiscount;
    const total = subTotal - discountAmount + editAdjustment;
    return { subTotal, discountAmount, total };
  };

  const addEditItem = () => {
    setEditItems([...editItems, { 
      id: editItems.length + 1, 
      description: '', 
      longDescription: '', 
      qty: 1, 
      rate: 0, 
      tax: 'No Tax', 
      amount: 0 
    }]);
  };

  const removeEditItem = (id: number) => {
    if (editItems.length > 1) {
      setEditItems(editItems.filter(item => item.id !== id));
    }
  };

  const updateEditItem = (id: number, field: string, value: any) => {
    setEditItems(editItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'qty' || field === 'rate') {
          updated.amount = updated.qty * updated.rate;
        }
        return updated;
      }
      return item;
    }));
  };

  // New Proposal Form State
  const [allowComments, setAllowComments] = useState(false);
  const [proposalItems, setProposalItems] = useState([
    { id: 1, description: '', longDescription: '', qty: 1, rate: 0, tax: 'No Tax', amount: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('%');
  const [adjustment, setAdjustment] = useState(0);

  // Calculate totals
  const calculateTotals = () => {
    const subTotal = proposalItems.reduce((sum, item) => sum + (item.qty * item.rate), 0);
    const discountAmount = discountType === '%' ? (subTotal * discount / 100) : discount;
    const total = subTotal - discountAmount + adjustment;
    return { subTotal, discountAmount, total };
  };

  const addProposalItem = () => {
    setProposalItems([...proposalItems, { 
      id: proposalItems.length + 1, 
      description: '', 
      longDescription: '', 
      qty: 1, 
      rate: 0, 
      tax: 'No Tax', 
      amount: 0 
    }]);
  };

  const removeProposalItem = (id: number) => {
    setProposalItems(proposalItems.filter(item => item.id !== id));
  };

  const updateProposalItem = (id: number, field: string, value: any) => {
    setProposalItems(proposalItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'qty' || field === 'rate') {
          updated.amount = updated.qty * updated.rate;
        }
        return updated;
      }
      return item;
    }));
  };

  const filteredProposals = useMemo(() => {
    return proposals.filter(prop => {
      const matchesSearch = 
        prop.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || prop.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, proposals]);

  const handleExport = (type: 'excel' | 'pdf') => {
    setIsExporting(true);
    toast({ title: "Exporting...", description: `Preparing your ${type.toUpperCase()} file.` });

    setTimeout(() => {
      if (type === 'excel') {
        const ws = XLSX.utils.json_to_sheet(filteredProposals);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Proposals");
        XLSX.writeFile(wb, `Proposals_${new Date().toISOString().split('T')[0]}.xlsx`);
      } else {
        const doc = new jsPDF();
        doc.text("Sales Proposals Report", 14, 15);
        autoTable(doc, {
          startY: 25,
          head: [['ID', 'Subject', 'Customer', 'Amount', 'Date', 'Status']],
          body: filteredProposals.map(p => [p.id, p.subject, p.customer, p.totalAmount, p.date, p.status]),
        });
        doc.save(`Proposals_${new Date().toISOString().split('T')[0]}.pdf`);
      }
      setIsExporting(false);
      toast({ title: "Export Complete", description: "File downloaded successfully." });
    }, 1000);
  };

  const handleAction = (action: string, prop: any) => {
    setSelectedProposal(prop);
    if (action === 'view') setIsViewOpen(true);
    else if (action === 'edit') setIsEditOpen(true);
    else if (action === 'send') {
      toast({
        title: "Proposal Sent",
        description: `Proposal ${prop.id} has been dispatched to ${prop.customer}.`,
      });
      setProposals(prev => prev.map(p => p.id === prop.id ? { ...p, status: 'sent' } : p));
    }
  };

  const statusConfig: Record<string, { label: string; class: string }> = {
    draft: { label: 'Draft', class: 'bg-slate-100 text-slate-700 border-slate-200' },
    sent: { label: 'Sent', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    accepted: { label: 'Accepted', class: 'bg-green-100 text-green-700 border-green-200' },
    declined: { label: 'Declined', class: 'bg-red-100 text-red-700 border-red-200' }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Proposals</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-48"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={cn(statusFilter !== 'all' && "border-indigo-500 bg-indigo-50")}>
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter === 'all' ? 'Filters' : `Status: ${statusFilter}`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Statuses</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('draft')}>Draft</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('sent')}>Sent</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('accepted')}>Accepted</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('declined')}>Declined</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? '...' : 'Export'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('excel')}>Excel (.xlsx)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>PDF (.pdf)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">New Proposal</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Two Column Layout */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm">* Subject</Label>
                      <Input id="subject" placeholder="Enter proposal subject" className="h-10" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="related" className="text-sm">* Related</Label>
                      <Select defaultValue="not-selected">
                        <SelectTrigger id="related" className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-selected">Not selected</SelectItem>
                          <SelectItem value="project-1">Project Alpha</SelectItem>
                          <SelectItem value="project-2">Project Beta</SelectItem>
                          <SelectItem value="lead-1">Lead - Acme Corp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-sm">* Date</Label>
                        <Input id="date" type="date" defaultValue="2026-02-09" className="h-10" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="open-till" className="text-sm">Open Till</Label>
                        <Input id="open-till" type="date" defaultValue="2026-02-16" className="h-10" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="currency" className="text-sm">* Currency</Label>
                        <Select defaultValue="usd">
                          <SelectTrigger id="currency" className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD $</SelectItem>
                            <SelectItem value="eur">EUR €</SelectItem>
                            <SelectItem value="gbp">GBP £</SelectItem>
                            <SelectItem value="inr">INR ₹</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discount-type" className="text-sm">Discount Type</Label>
                        <Select defaultValue="no-discount" onValueChange={(val) => setDiscountType(val === 'percent' ? '%' : '$')}>
                          <SelectTrigger id="discount-type" className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-discount">No discount</SelectItem>
                            <SelectItem value="percent">Percent (%)</SelectItem>
                            <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags" className="text-sm flex items-center gap-1">
                        Tags
                      </Label>
                      <Input id="tags" placeholder="Add tags..." className="h-10" />
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <Label htmlFor="allow-comments" className="text-sm font-medium">Allow Comments</Label>
                      <Switch
                        id="allow-comments"
                        checked={allowComments}
                        onCheckedChange={setAllowComments}
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm">Status</Label>
                      <Select defaultValue="draft">
                        <SelectTrigger id="status" className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assigned" className="text-sm">Assigned</Label>
                      <Select defaultValue="zeruns-erp-admin">
                        <SelectTrigger id="assigned" className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zeruns-erp-admin">Zeruns ERP Admin</SelectItem>
                          <SelectItem value="john-doe">John Doe</SelectItem>
                          <SelectItem value="jane-smith">Jane Smith</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="to" className="text-sm">* To</Label>
                      <Input id="to" placeholder="Recipient name" className="h-10" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm">Address</Label>
                      <Textarea 
                        id="address" 
                        placeholder="Enter address..." 
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm">City</Label>
                        <Input id="city" placeholder="City" className="h-10" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-sm">State</Label>
                        <Input id="state" placeholder="State" className="h-10" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-sm">Country</Label>
                        <Select defaultValue="not-selected">
                          <SelectTrigger id="country" className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-selected">Not selected</SelectItem>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="in">India</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip" className="text-sm">Zip Code</Label>
                        <Input id="zip" placeholder="Zip Code" className="h-10" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm">* Email</Label>
                        <Input id="email" type="email" placeholder="email@example.com" className="h-10" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm">Phone</Label>
                        <Input id="phone" type="tel" placeholder="Phone number" className="h-10" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base">Items</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>Show quantity as:</span>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Qty
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Hours
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Qty/Hours
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select>
                      <SelectTrigger className="w-48 h-10">
                        <SelectValue placeholder="Add items" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom Item</SelectItem>
                        <SelectItem value="service-1">Consulting Service</SelectItem>
                        <SelectItem value="service-2">Development Service</SelectItem>
                        <SelectItem value="product-1">Software License</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" onClick={addProposalItem}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Items Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="w-8"></TableHead>
                          <TableHead className="w-32">Item</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-24">Qty</TableHead>
                          <TableHead className="w-32">Rate</TableHead>
                          <TableHead className="w-32">Tax</TableHead>
                          <TableHead className="w-32 text-right">Amount</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {proposalItems.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell></TableCell>
                            <TableCell>
                              <Input 
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => updateProposalItem(item.id, 'description', e.target.value)}
                                className="h-9"
                              />
                            </TableCell>
                            <TableCell>
                              <Textarea
                                placeholder="Long description"
                                value={item.longDescription}
                                onChange={(e) => updateProposalItem(item.id, 'longDescription', e.target.value)}
                                className="min-h-[60px] resize-none text-sm"
                                rows={2}
                              />
                              <Button variant="link" size="sm" className="h-6 px-0 text-xs text-blue-600">
                                Link
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.qty}
                                onChange={(e) => updateProposalItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                                className="h-9"
                                min="0"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                placeholder="Rate"
                                value={item.rate}
                                onChange={(e) => updateProposalItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                className="h-9"
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell>
                              <Select value={item.tax} onValueChange={(val) => updateProposalItem(item.id, 'tax', val)}>
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="No Tax">No Tax</SelectItem>
                                  <SelectItem value="GST 18%">GST 18%</SelectItem>
                                  <SelectItem value="VAT 10%">VAT 10%</SelectItem>
                                  <SelectItem value="Sales Tax 8%">Sales Tax 8%</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${item.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {proposalItems.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeProposalItem(item.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Totals Section */}
                <div className="flex justify-end pt-4">
                  <div className="w-96 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Sub Total :</span>
                      <span className="font-semibold">${calculateTotals().subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-slate-600 text-sm">Discount</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={discount}
                          onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                          className="w-24 h-9"
                          min="0"
                        />
                        <Select value={discountType} onValueChange={setDiscountType}>
                          <SelectTrigger className="w-20 h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="%">%</SelectItem>
                            <SelectItem value="$">$</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="font-semibold w-24 text-right">${calculateTotals().discountAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-slate-600 text-sm">Adjustment</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={adjustment}
                          onChange={(e) => setAdjustment(parseFloat(e.target.value) || 0)}
                          className="w-24 h-9"
                        />
                        <span className="font-semibold w-24 text-right">${adjustment.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-base font-bold pt-2 border-t">
                      <span>Total :</span>
                      <span>${calculateTotals().total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Note */}
                <div className="text-xs text-slate-500 pt-4 border-t">
                  Include proposal items with merge field anywhere in proposal content as <span className="font-mono bg-slate-100 px-1 rounded">{'{'}proposal_items{'}'}</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline">Save as Draft</Button>
                <div className="relative inline-flex">
                  <Button className="rounded-r-none">
                    Save
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="rounded-l-none border-l border-white/20 px-2">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem>
                        <Send className="h-4 w-4 mr-2" />
                        Save & Send
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Save and Send Later
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckSquare className="h-4 w-4 mr-2" />
                        Save & Record Payment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="w-[140px]">
                <div className="flex items-center gap-1">
                  Proposal #
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="w-[120px]">Total Amount</TableHead>
              <TableHead className="w-[110px]">Date</TableHead>
              <TableHead className="w-[110px]">Valid Until</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProposals.map((proposal, index) => (
              <TableRow 
                key={`${proposal.id}-${index}`}
                className="hover:bg-slate-50/50 group"
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-blue-600 hover:underline cursor-pointer font-medium font-mono text-sm">
                      {proposal.id}
                    </span>
                    {hoveredRow === index && (
                      <div className="flex items-center gap-2 text-xs text-blue-600 animate-in fade-in duration-200">
                        <button 
                          className="hover:underline"
                          onClick={() => handleAction('view', proposal)}
                        >
                          View
                        </button>
                        <span className="text-slate-300">|</span>
                        <button 
                          className="hover:underline"
                          onClick={() => loadProposalForEdit(proposal)}
                        >
                          Edit
                        </button>
                        <span className="text-slate-300">|</span>
                        <button 
                          className="hover:underline text-green-600"
                          onClick={() => handleAction('send', proposal)}
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{proposal.subject}</TableCell>
                <TableCell>
                  {proposal.customer && (
                    <span className="text-blue-600 hover:underline cursor-pointer">{proposal.customer}</span>
                  )}
                </TableCell>
                <TableCell className="font-semibold text-green-700">{proposal.totalAmount}</TableCell>
                <TableCell className="text-sm text-slate-600">{proposal.date}</TableCell>
                <TableCell className="text-sm text-slate-600">{proposal.validUntil}</TableCell>
                <TableCell className="text-sm text-slate-600">{proposal.project}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", statusConfig[proposal.status].class)}>
                    {statusConfig[proposal.status].label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* View Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={selectedProposal ? statusConfig[selectedProposal.status].class : ""}>
                  {selectedProposal?.status.toUpperCase()}
                </Badge>
                <span className="text-slate-400">|</span>
                <span className="text-sm text-slate-500">Created on {selectedProposal?.date}</span>
              </div>
              <DialogTitle className="text-2xl font-bold">Proposal {selectedProposal?.id}</DialogTitle>
              <DialogDescription>Full details for {selectedProposal?.subject}</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <Label className="text-slate-500 text-xs uppercase tracking-wider">Customer</Label>
                  <p className="font-semibold text-lg">{selectedProposal?.customer}</p>
                </div>
                <div>
                  <Label className="text-slate-500 text-xs uppercase tracking-wider">Total Amount</Label>
                  <p className="font-semibold text-lg text-emerald-600">{selectedProposal?.totalAmount}</p>
                </div>
                <div>
                  <Label className="text-slate-500 text-xs uppercase tracking-wider">Project</Label>
                  <p className="font-medium">{selectedProposal?.project}</p>
                </div>
                <div>
                  <Label className="text-slate-500 text-xs uppercase tracking-wider">Valid Until</Label>
                  <p className="font-medium text-amber-600">{selectedProposal?.validUntil}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-6 bg-slate-50/50">
                <h4 className="font-bold flex items-center gap-2 mb-4">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  Executive Summary
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  This proposal covers the {selectedProposal?.subject} for {selectedProposal?.customer}. 
                  The project aims to deliver high-quality results within the specified timeframe and budget.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
                <Button className="bg-indigo-600 text-white shadow-lg shadow-indigo-100" onClick={() => handleAction('send', selectedProposal)}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Proposal Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog - Enhanced matching EST form layout */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
            <ScrollArea className="max-h-[95vh]">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-lg font-semibold text-blue-600">{editEstimatePrefix}{editEstimateNumber}</DialogTitle>
                  <Badge className={cn("capitalize", statusConfig[editStatus]?.class || 'bg-green-100 text-green-700')}>
                    {editStatus.charAt(0).toUpperCase() + editStatus.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Two Column Layout - Top Section */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-red-500">* Customer</Label>
                      <Select value={editCustomer} onValueChange={setEditCustomer}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Greeen Dot">Greeen Dot</SelectItem>
                          <SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
                          <SelectItem value="TechStart Inc.">TechStart Inc.</SelectItem>
                          <SelectItem value="Global Brands Ltd.">Global Brands Ltd.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Project</Label>
                      <Select value={editProject} onValueChange={setEditProject}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select and begin typing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Mobile App">Mobile App</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="ERP">ERP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-slate-500">Bill To</Label>
                        <div className="text-sm">
                          <p className="font-medium">Dubai</p>
                          <p className="text-slate-600">{editBillTo.address}</p>
                          <p className="text-slate-600">{editBillTo.city}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-slate-500">Ship To</Label>
                        <div className="text-sm text-slate-400">-,--<br />-,--</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-red-500">* Estimate Number</Label>
                        <div className="flex gap-2">
                          <Select value={editEstimatePrefix} onValueChange={setEditEstimatePrefix}>
                            <SelectTrigger className="w-20 h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EST-">EST-</SelectItem>
                              <SelectItem value="PROP-">PROP-</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input 
                            value={editEstimateNumber}
                            onChange={(e) => setEditEstimateNumber(e.target.value)}
                            className="h-9 flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-red-500">* Estimate Date</Label>
                        <div className="relative">
                          <Input 
                            type="date"
                            value={editEstimateDate}
                            onChange={(e) => setEditEstimateDate(e.target.value)}
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Expiry Date</Label>
                        <div className="relative">
                          <Input 
                            type="date"
                            value={editExpiryDate}
                            onChange={(e) => setEditExpiryDate(e.target.value)}
                            className="h-9"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center gap-1">
                          <span className="text-slate-500">●</span> Tags
                        </Label>
                        <Input 
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          placeholder="tag"
                          className="h-9"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-red-500">* Currency</Label>
                        <Select value={editCurrency} onValueChange={setEditCurrency}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD $</SelectItem>
                            <SelectItem value="eur">EUR €</SelectItem>
                            <SelectItem value="inr">INR ₹</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Status</Label>
                        <Select value={editStatus} onValueChange={setEditStatus}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Reference #</Label>
                      <Input 
                        value={editReference}
                        onChange={(e) => setEditReference(e.target.value)}
                        className="h-9"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Sale Agent</Label>
                        <Select value={editSaleAgent} onValueChange={setEditSaleAgent}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="zeruns-erp-admin">Zeruns ERP Admin</SelectItem>
                            <SelectItem value="john-doe">John Doe</SelectItem>
                            <SelectItem value="jane-smith">Jane Smith</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Discount type</Label>
                        <Select value={editDiscountType} onValueChange={setEditDiscountType}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-discount">No discount</SelectItem>
                            <SelectItem value="percent">Percent (%)</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Admin Note</Label>
                      <Textarea 
                        value={editAdminNote}
                        onChange={(e) => setEditAdminNote(e.target.value)}
                        placeholder="Admin note..."
                        rows={3}
                        className="resize-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Select>
                        <SelectTrigger className="w-32 h-9">
                          <SelectValue placeholder="Add Item" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="custom">Custom Item</SelectItem>
                          <SelectItem value="brochure">Brochure</SelectItem>
                          <SelectItem value="flyer">Flyer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline" onClick={addEditItem} className="h-9 w-9 p-0">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>Show quantity as:</span>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="qty-type" 
                          checked={showQtyAs === 'qty'}
                          onChange={() => setShowQtyAs('qty')}
                          className="w-3 h-3"
                        />
                        <span className="text-xs">Qty</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="qty-type" 
                          checked={showQtyAs === 'hours'}
                          onChange={() => setShowQtyAs('hours')}
                          className="w-3 h-3"
                        />
                        <span className="text-xs">Hours</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                          type="radio" 
                          name="qty-type" 
                          checked={showQtyAs === 'both'}
                          onChange={() => setShowQtyAs('both')}
                          className="w-3 h-3"
                        />
                        <span className="text-xs">Qty/Hours</span>
                      </label>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="w-8 text-center">●</TableHead>
                          <TableHead className="w-40">Item</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-24 text-center">Qty</TableHead>
                          <TableHead className="w-28">Rate</TableHead>
                          <TableHead className="w-28">Tax</TableHead>
                          <TableHead className="w-28 text-right">Amount</TableHead>
                          <TableHead className="w-16"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editItems.map((item, index) => (
                          <TableRow key={item.id} className="hover:bg-slate-50/50">
                            <TableCell className="text-center">
                              <div className="w-3 h-3 rounded-full border-2 border-slate-300"></div>
                            </TableCell>
                            <TableCell>
                              <Textarea
                                placeholder="Description"
                                value={item.description}
                                onChange={(e) => updateEditItem(item.id, 'description', e.target.value)}
                                className="min-h-[60px] resize-none text-sm border-dashed"
                                rows={2}
                              />
                            </TableCell>
                            <TableCell>
                              <Textarea
                                placeholder="Long description"
                                value={item.longDescription}
                                onChange={(e) => updateEditItem(item.id, 'longDescription', e.target.value)}
                                className="min-h-[60px] resize-none text-sm border-dashed"
                                rows={2}
                              />
                              <button className="text-xs text-blue-600 hover:underline mt-1 flex items-center gap-1">
                                <LinkIcon className="h-3 w-3" />
                                Link
                              </button>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.qty}
                                onChange={(e) => updateEditItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                                className="h-9 text-center text-sm"
                                min="0"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                placeholder="Rate"
                                value={item.rate || ''}
                                onChange={(e) => updateEditItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                className="h-9 text-sm"
                                min="0"
                                step="0.01"
                              />
                            </TableCell>
                            <TableCell>
                              <Select value={item.tax} onValueChange={(val) => updateEditItem(item.id, 'tax', val)}>
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="No Tax">No Tax</SelectItem>
                                  <SelectItem value="GST 18%">GST 18%</SelectItem>
                                  <SelectItem value="VAT 10%">VAT 10%</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right font-medium text-sm">
                              ${item.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                {editItems.length > 1 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeEditItem(item.id)}
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Totals Section */}
                <div className="flex justify-end pt-2">
                  <div className="w-96 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Sub Total:</span>
                      <span className="font-semibold">${calculateEditTotals().subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-slate-600 text-sm">Discount</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={editDiscount}
                          onChange={(e) => setEditDiscount(parseFloat(e.target.value) || 0)}
                          className="w-24 h-9 text-sm text-blue-600"
                          min="0"
                          placeholder="0.00"
                        />
                        <Select value={editDiscountType === 'percent' ? '%' : '$'}>
                          <SelectTrigger className="w-16 h-9 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="%">%</SelectItem>
                            <SelectItem value="$">$</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="font-semibold w-24 text-right text-sm">${calculateEditTotals().discountAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-slate-600 text-sm">Adjustment</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={editAdjustment}
                          onChange={(e) => setEditAdjustment(parseFloat(e.target.value) || 0)}
                          className="w-24 h-9 text-sm text-blue-600"
                          placeholder="0.00"
                        />
                        <span className="font-semibold w-24 text-right text-sm">${editAdjustment.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-base font-bold pt-2 border-t">
                      <span>Total:</span>
                      <span>${calculateEditTotals().total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Client Note */}
                <div className="space-y-2 pt-4">
                  <Label className="text-sm font-semibold">Client Note</Label>
                  <Textarea 
                    value={editClientNote}
                    onChange={(e) => setEditClientNote(e.target.value)}
                    placeholder="Notes visible to the customer..." 
                    rows={3} 
                    className="resize-none text-sm"
                  />
                </div>

                {/* Terms & Conditions */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Terms & Conditions</Label>
                  <Textarea 
                    value={editTerms}
                    onChange={(e) => setEditTerms(e.target.value)}
                    placeholder="Payment terms, conditions, etc..." 
                    rows={3} 
                    className="resize-none text-sm"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-2">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setIsEditOpen(false);
                    toast({ title: "Saved", description: "Estimate/Proposal has been updated successfully." });
                  }}
                >
                  Save
                </Button>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
