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
  Trash2
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Proposal</DialogTitle>
                <DialogDescription>Fill in the proposal details</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Header Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Header Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prop-number">Proposal Number</Label>
                      <Input id="prop-number" placeholder="PROP-001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prop-date">Date</Label>
                      <Input id="prop-date" type="date" />
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Customer Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prop-customer">Customer</Label>
                      <Select>
                        <SelectTrigger id="prop-customer">
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
                      <Label htmlFor="prop-project">Project</Label>
                      <Select>
                        <SelectTrigger id="prop-project">
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
                  <div className="space-y-2">
                    <Label htmlFor="prop-subject">Subject</Label>
                    <Input id="prop-subject" placeholder="Proposal subject" />
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Executive Summary</h3>
                  <Textarea 
                    placeholder="Brief overview of the proposal..." 
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Scope & Deliverables */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    Scope & Deliverables
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <input type="checkbox" className="rounded" />
                      <Input placeholder="Add deliverable item" className="flex-1" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Deliverable
                    </Button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Timeline & Milestones</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prop-start">Start Date</Label>
                      <Input id="prop-start" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prop-end">End Date</Label>
                      <Input id="prop-end" type="date" />
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Terms & Conditions</h3>
                  <Textarea 
                    placeholder="Payment terms, cancellation policy, etc..." 
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Attachments */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    Attachments
                  </h3>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    <Input type="file" className="hidden" id="prop-files" />
                    <label htmlFor="prop-files" className="cursor-pointer">
                      <Paperclip className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">Click to upload files or drag and drop</p>
                    </label>
                  </div>
                </div>

                {/* Signature Block */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900">Signature</h3>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-600">Digital signature will be added here</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Save as Draft</Button>
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Proposal
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
              <TableHead>Proposal Number</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProposals.map((proposal) => (
              <TableRow key={proposal.id} className="hover:bg-slate-50 transition-colors">
                <TableCell className="font-mono text-sm font-semibold">{proposal.id}</TableCell>
                <TableCell className="font-medium">{proposal.subject}</TableCell>
                <TableCell>{proposal.customer}</TableCell>
                <TableCell className="font-semibold text-green-700">{proposal.totalAmount}</TableCell>
                <TableCell className="text-sm">{proposal.date}</TableCell>
                <TableCell className="text-sm">{proposal.validUntil}</TableCell>
                <TableCell className="text-sm">{proposal.project}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", statusConfig[proposal.status].class)}>
                    {statusConfig[proposal.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleAction('view', proposal)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-700 hover:bg-slate-50" onClick={() => handleAction('edit', proposal)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleAction('send', proposal)}>
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction('view', proposal)}>
                          <Download className="mr-2 h-4 w-4 text-slate-500" /> Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => {
                          setProposals(proposals.filter(p => p.id !== proposal.id));
                          toast({ title: "Deleted", description: "Proposal removed.", variant: "destructive" });
                        }}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-indigo-600" />
                Edit Proposal - {selectedProposal?.id}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Proposal Subject</Label>
                <Input defaultValue={selectedProposal?.subject} className="font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Value</Label>
                  <Input defaultValue={selectedProposal?.totalAmount} />
                </div>
                <div className="space-y-2">
                  <Label>Current Status</Label>
                  <Select defaultValue={selectedProposal?.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft (Unsent)</SelectItem>
                      <SelectItem value="sent">Sent to Client</SelectItem>
                      <SelectItem value="accepted">Accepted / Won</SelectItem>
                      <SelectItem value="declined">Declined / Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button className="bg-slate-900 text-white" onClick={() => {
                  setIsEditOpen(false);
                  toast({ title: "Proposal Updated", description: "Changes have been successfully saved." });
                }}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Update Proposal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
