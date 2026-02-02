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
  Send,
  Eye,
  Edit,
  MoreVertical,
  Paperclip,
  CheckSquare
} from 'lucide-react';

export default function ProposalsTab() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const proposals = [
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
  ];

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
            {proposals.map((proposal) => (
              <TableRow key={proposal.id} className="hover:bg-slate-50">
                <TableCell className="font-mono text-sm font-semibold">{proposal.id}</TableCell>
                <TableCell className="font-medium">{proposal.subject}</TableCell>
                <TableCell>{proposal.customer}</TableCell>
                <TableCell className="font-semibold text-green-700">{proposal.totalAmount}</TableCell>
                <TableCell className="text-sm">{proposal.date}</TableCell>
                <TableCell className="text-sm">{proposal.validUntil}</TableCell>
                <TableCell className="text-sm">{proposal.project}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusConfig[proposal.status].class}>
                    {statusConfig[proposal.status].label}
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
                    <Button variant="ghost" size="sm" className="text-green-600">
                      <Send className="h-3 w-3 mr-1" />
                      Send
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
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
