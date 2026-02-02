import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Building, DollarSign, User, ChevronRight, ChevronLeft, Eye, Edit, Trash2, Paperclip, Plus } from "lucide-react";

// Lead data type
type Lead = {
  id: string;
  name: string;
  company: string;
  estimatedValue: string;
  assignedTo: string;
  source: string;
  stage: string;
  email?: string;
  phone?: string;
  gst?: string;
  zipCode?: string;
  notes?: string;
  attachments?: number;
};

export default function LeadsModule() {
  const [leads] = useState<Lead[]>([
    {
      id: "L001",
      name: "John Smith",
      company: "Tech Solutions Inc",
      estimatedValue: "$125,000",
      assignedTo: "Sarah Johnson",
      source: "Website",
      stage: "new",
      attachments: 2
    },
    {
      id: "L002",
      name: "Emily Davis",
      company: "Marketing Pro",
      estimatedValue: "$85,000",
      assignedTo: "Michael Chen",
      source: "Referral",
      stage: "contacted",
      attachments: 0
    },
    {
      id: "L003",
      name: "Robert Wilson",
      company: "Global Enterprises",
      estimatedValue: "$250,000",
      assignedTo: "Sarah Johnson",
      source: "LinkedIn",
      stage: "qualified",
      attachments: 3
    },
    {
      id: "L004",
      name: "Jennifer Martinez",
      company: "Retail Chain Corp",
      estimatedValue: "$180,000",
      assignedTo: "David Kim",
      source: "Cold Call",
      stage: "proposal",
      attachments: 5
    },
    {
      id: "L005",
      name: "Michael Brown",
      company: "Software Systems",
      estimatedValue: "$95,000",
      assignedTo: "Michael Chen",
      source: "Trade Show",
      stage: "closed",
      attachments: 1
    },
    {
      id: "L006",
      name: "Amanda Taylor",
      company: "Logistics Ltd",
      estimatedValue: "$140,000",
      assignedTo: "Sarah Johnson",
      source: "Email Campaign",
      stage: "contacted",
      attachments: 0
    },
    {
      id: "L007",
      name: "Christopher Lee",
      company: "Finance Partners",
      estimatedValue: "$310,000",
      assignedTo: "David Kim",
      source: "Referral",
      stage: "qualified",
      attachments: 4
    },
    {
      id: "L008",
      name: "Jessica Garcia",
      company: "Healthcare Systems",
      estimatedValue: "$75,000",
      assignedTo: "Michael Chen",
      source: "Website",
      stage: "new",
      attachments: 0
    }
  ]);

  const stages = [
    { id: "new", label: "New", color: "bg-slate-100 text-slate-700" },
    { id: "contacted", label: "Contacted", color: "bg-blue-100 text-blue-700" },
    { id: "qualified", label: "Qualified", color: "bg-purple-100 text-purple-700" },
    { id: "proposal", label: "Proposal", color: "bg-orange-100 text-orange-700" },
    { id: "closed", label: "Closed", color: "bg-green-100 text-green-700" }
  ];

  const sourceConfig: Record<string, string> = {
    "Website": "bg-blue-100 text-blue-700",
    "Referral": "bg-green-100 text-green-700",
    "LinkedIn": "bg-purple-100 text-purple-700",
    "Cold Call": "bg-orange-100 text-orange-700",
    "Trade Show": "bg-pink-100 text-pink-700",
    "Email Campaign": "bg-teal-100 text-teal-700"
  };

  const getLeadsByStage = (stageId: string) => {
    return leads.filter(lead => lead.stage === stageId);
  };

  return (
    <div className="space-y-4">
      {/* Pipeline View - Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageLeads = getLeadsByStage(stage.id);
          return (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">
                      {stage.label}
                    </CardTitle>
                    <Badge variant="secondary" className="ml-2">
                      {stageLeads.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stageLeads.map((lead) => (
                    <Card key={lead.id} className="border border-slate-200 hover:border-teal-300 transition-colors cursor-pointer">
                      <CardContent className="p-4 space-y-3">
                        {/* Lead Name */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-sm">{lead.name}</h4>
                            <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                              <Building className="h-3 w-3" />
                              {lead.company}
                            </div>
                          </div>
                        </div>

                        {/* Estimated Value */}
                        <div className="flex items-center gap-1 text-sm font-medium text-teal-700">
                          <DollarSign className="h-4 w-4" />
                          {lead.estimatedValue}
                        </div>

                        {/* Assigned To */}
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <User className="h-3 w-3" />
                          {lead.assignedTo}
                        </div>

                        {/* Source Badge */}
                        <Badge className={sourceConfig[lead.source]} variant="secondary">
                          {lead.source}
                        </Badge>

                        {/* Attachments */}
                        {lead.attachments && lead.attachments > 0 && (
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Paperclip className="h-3 w-3" />
                            {lead.attachments} files
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex gap-1">
                            {stage.id !== "new" && (
                              <Button variant="ghost" size="sm" className="h-7 px-2" title="Move backward">
                                <ChevronLeft className="h-3 w-3" />
                              </Button>
                            )}
                            {stage.id !== "closed" && (
                              <Button variant="ghost" size="sm" className="h-7 px-2" title="Move forward">
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Add Lead to Stage */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lead
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Lead</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {/* Lead Info Section */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-sm">Lead Information</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="leadName">Name *</Label>
                              <Input id="leadName" placeholder="Enter lead name" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="leadCompany">Company *</Label>
                              <Input id="leadCompany" placeholder="Enter company name" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="leadEmail">Email *</Label>
                              <Input id="leadEmail" type="email" placeholder="email@example.com" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="leadPhone">Phone *</Label>
                              <Input id="leadPhone" placeholder="+1 234 567 8900" />
                            </div>
                          </div>
                        </div>

                        {/* Business Details Section */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-sm">Business Details</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="leadSource">Source *</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select source" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="website">Website</SelectItem>
                                  <SelectItem value="referral">Referral</SelectItem>
                                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                                  <SelectItem value="coldcall">Cold Call</SelectItem>
                                  <SelectItem value="tradeshow">Trade Show</SelectItem>
                                  <SelectItem value="email">Email Campaign</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="leadValue">Estimated Value *</Label>
                              <Input id="leadValue" placeholder="$0.00" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="leadAssigned">Assigned To *</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select sales rep" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                                  <SelectItem value="michael">Michael Chen</SelectItem>
                                  <SelectItem value="david">David Kim</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="leadStage">Stage *</Label>
                              <Select defaultValue="new">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="contacted">Contacted</SelectItem>
                                  <SelectItem value="qualified">Qualified</SelectItem>
                                  <SelectItem value="proposal">Proposal</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Additional Info Section */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-sm">Additional Information</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="leadGst">GST Number</Label>
                              <Input id="leadGst" placeholder="Enter GST number" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="leadZip">Zip Code</Label>
                              <Input id="leadZip" placeholder="Enter zip code" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leadNotes">Notes</Label>
                            <Textarea id="leadNotes" placeholder="Add any additional notes..." rows={3} />
                          </div>
                        </div>

                        {/* Attachments Section */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-sm">Attachments</h3>
                          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer">
                            <Paperclip className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                            <p className="text-sm text-slate-600">
                              Drag and drop files here or click to browse
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Supported: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)
                            </p>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Lead</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
