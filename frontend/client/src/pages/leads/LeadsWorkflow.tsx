import { useState, useEffect } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, Users, TrendingUp, Award, Plus, Search, Filter,
  Phone, Mail, Calendar, MessageCircle, Send, Clock, Edit,
  CheckCircle, XCircle, AlertCircle, BarChart3, Zap, User, Settings, GitBranch, Flag, MapPin
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: "new" | "qualified" | "nurturing" | "converted" | "lost";
  priority: "high" | "medium" | "low";
  assignedTo: string;
  createdDate: string;
  lastContact: string;
  tags?: string[];
  address?: string;
  position?: string;
  city?: string;
  state?: string;
  website?: string;
  country?: string;
  zipCode?: string;
  leadValue?: number;
  defaultLanguage?: string;
  description?: string;
  dateContacted?: string;
  isPublic?: boolean;
  contactedToday?: boolean;
}

interface NurtureSequence {
  id: string;
  name: string;
  status: "active" | "paused" | "draft";
  enrolled: number;
  completed: number;
  steps: number;
  channel: "email" | "sms" | "whatsapp" | "call";
}

export default function LeadsWorkflow() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [sequenceModalOpen, setSequenceModalOpen] = useState(false);

  // Tags input state (multi-tag, linear)
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "John Doe",
      company: "Tech Corp",
      email: "john@techcorp.com",
      phone: "+1 (555) 123-4567",
      source: "Website",
      status: "new",
      
      priority: "high",
      assignedTo: "Sarah J.",
      createdDate: "Jan 15, 2026",
      lastContact: "Just now"
    },
    {
      id: "2",
      name: "Jane Smith",
      company: "Innovation Labs",
      email: "jane@innovlabs.com",
      phone: "+1 (555) 234-5678",
      source: "Referral",
      status: "qualified",
      
      priority: "high",
      assignedTo: "Mike C.",
      createdDate: "Jan 14, 2026",
      lastContact: "2 hours ago"
    },
    {
      id: "3",
      name: "Bob Johnson",
      company: "Global Solutions",
      email: "bob@globalsol.com",
      phone: "+1 (555) 345-6789",
      source: "LinkedIn",
      status: "nurturing",
      
      priority: "medium",
      assignedTo: "Sarah J.",
      createdDate: "Jan 12, 2026",
      lastContact: "1 day ago"
    },
    {
      id: "4",
      name: "Alice Williams",
      company: "Startup Inc",
      email: "alice@startup.com",
      phone: "+1 (555) 456-7890",
      source: "Trade Show",
      status: "converted",
      
      priority: "high",
      assignedTo: "Mike C.",
      createdDate: "Jan 10, 2026",
      lastContact: "3 days ago"
    }
  ]);

  const [confirmConvertOpen, setConfirmConvertOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);

  const convertLead = (id: string) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'converted' } : l));
    if (selectedLead?.id === id) {
      setSelectedLead({ ...(selectedLead as Lead), status: 'converted' });
    }
  };

  const requestConvert = (lead: Lead) => {
    setLeadToConvert(lead);
    setConfirmConvertOpen(true);
  };

  const confirmConvert = () => {
    if (!leadToConvert) return;
    convertLead(leadToConvert.id);
    setConfirmConvertOpen(false);
    setLeadToConvert(null);
  };

  // Sync tags when modal opens or selectedLead changes
  useEffect(() => {
    if (leadModalOpen) {
      setTags(selectedLead?.tags ?? []);
      setTagsInput("");
    }
  }, [leadModalOpen, selectedLead]);

  const addTag = (value: string) => {
    const v = value.trim();
    if (!v) return;
    if (tags.includes(v)) return;
    setTags(prev => [...prev, v]);
    setTagsInput("");
  };

  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagsInput);
    } else if (e.key === "Backspace" && tagsInput === "") {
      // remove last tag
      setTags(prev => prev.slice(0, -1));
    }
  };

  const handleTagBlur = () => {
    if (tagsInput.trim() !== "") addTag(tagsInput);
  };

  const sequences: NurtureSequence[] = [
    {
      id: "1",
      name: "New Lead Welcome Series",
      status: "active",
      enrolled: 124,
      completed: 78,
      steps: 5,
      channel: "email"
    },
    {
      id: "2",
      name: "Product Demo Follow-up",
      status: "active",
      enrolled: 56,
      completed: 42,
      steps: 3,
      channel: "whatsapp"
    },
    {
      id: "3",
      name: "Re-engagement Campaign",
      status: "paused",
      enrolled: 89,
      completed: 34,
      steps: 4,
      channel: "sms"
    }
  ];

  const stats = [
    { label: "Total Leads", value: "342", change: "+24", icon: Users, color: "text-indigo-600" },
    { label: "Qualified", value: "124", change: "+18", icon: CheckCircle, color: "text-green-600" },
    { label: "Nurturing", value: "156", change: "+12", icon: Target, color: "text-amber-600" },
    { label: "Converted", value: "62", change: "+8", icon: Award, color: "text-blue-600" }
  ];

  const additionalStats = [
    { label: "Conversion Rate", value: "18.1%", icon: TrendingUp }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "qualified":
        return "bg-green-500";
      case "nurturing":
        return "bg-amber-500";
      case "converted":
        return "bg-purple-500";
      case "lost":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads & Workflow</h1>
            <p className="text-sm text-gray-500 mt-1">Intelligent lead management and automation</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setLeadModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
          {additionalStats.map((stat) => (
            <Card key={stat.label} className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Link href="/leads/sources">
                <Button variant="outline" size="sm">
                  <GitBranch className="h-4 w-4 mr-2" />
                  Lead Sources
                </Button>
              </Link>
              <Link href="/leads/status">
                <Button variant="outline" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  Lead Status
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="intake" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 gap-1 lg:w-auto">
            <TabsTrigger value="intake" className="text-center">Lead Intake</TabsTrigger>
            <TabsTrigger value="assignment" className="text-center">Assignment</TabsTrigger>
          </TabsList>

          {/* Lead Intake Tab */}
          <TabsContent value="intake" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Leads</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        setSelectedLead(lead);
                        setLeadModalOpen(true);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {lead.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                                <Badge className={getStatusColor(lead.status)}>
                                  {lead.status}
                                </Badge>
                                <Badge variant="outline" className={getPriorityColor(lead.priority)}>
                                  {lead.priority}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>{lead.company}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {lead.email}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {lead.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Assigned to</p>
                              <p className="font-semibold text-gray-900">{lead.assignedTo}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Last Contact</p>
                              <p className="font-semibold text-gray-900">{lead.lastContact}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Created: {lead.createdDate}</span>
                            <span>•</span>
                            <span>Source: {lead.source}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); requestConvert(lead); }}
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              Convert
                            </Button>
                            <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          

          {/* Assignment Tab */}
          <TabsContent value="assignment" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  Lead Assignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">
                    Distribute leads based on rules, territories, and workload
                  </p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Sarah Johnson</p>
                            <p className="text-xs text-gray-500">Senior Sales Rep</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Assigned Leads</span>
                            <span className="font-semibold">124</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Active</span>
                            <span className="font-semibold text-green-600">89</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Converted</span>
                            <span className="font-semibold text-blue-600">28</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Workload</span>
                            <span className="font-semibold">78%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Mike Chen</p>
                            <p className="text-xs text-gray-500">Sales Rep</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Assigned Leads</span>
                            <span className="font-semibold">98</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Active</span>
                            <span className="font-semibold text-green-600">72</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Converted</span>
                            <span className="font-semibold text-blue-600">21</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Workload</span>
                            <span className="font-semibold">62%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-amber-600 h-2 rounded-full" style={{ width: "62%" }}></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Emily Davis</p>
                            <p className="text-xs text-gray-500">Sales Rep</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Assigned Leads</span>
                            <span className="font-semibold">87</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Active</span>
                            <span className="font-semibold text-green-600">64</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Converted</span>
                            <span className="font-semibold text-blue-600">18</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Workload</span>
                            <span className="font-semibold">55%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: "55%" }}></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                 
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          
        </Tabs>

        {/* Lead Details Modal */}
        <Dialog open={leadModalOpen} onOpenChange={setLeadModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedLead ? "Lead Details" : "Add new lead"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Status, Source, and Assigned Row */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    <span className="text-red-500">*</span> Status
                  </label>
                  <div className="flex gap-2 mt-1">
                    <Select defaultValue="New Leads">
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New Leads">New Leads</SelectItem>
                        <SelectItem value="Qualified">Qualified</SelectItem>
                        <SelectItem value="Nurturing">Nurturing</SelectItem>
                        <SelectItem value="Converted">Converted</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    <span className="text-red-500">*</span> Source
                  </label>
                  <div className="flex gap-2 mt-1">
                    <Select defaultValue={selectedLead?.source}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Non selected" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Referral">Referral</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="Trade Show">Trade Show</SelectItem>
                        <SelectItem value="Cold Call">Cold Call</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Assigned</label>
                  <div className="mt-1">
                    <Select defaultValue="Zedunix ERP Admin">
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Zedunix ERP Admin">Zedunix ERP Admin</SelectItem>
                        <SelectItem value="Sarah J.">Sarah J.</SelectItem>
                        <SelectItem value="Mike C.">Mike C.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Tags (multi-input, linear) */}
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">Tags</label>
                <div className="mt-1 flex items-center gap-2 overflow-x-auto border border-gray-300 rounded-md px-2 py-1 bg-white">
                  {tags.map((t, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-1 bg-gray-100 text-sm rounded-full">
                      <span className="mr-2 text-sm text-gray-700">{t}</span>
                      <button type="button" onClick={() => removeTag(idx)} className="text-gray-500 hover:text-gray-700">
                        <XCircle className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={handleTagBlur}
                    placeholder="Add tag and press Enter"
                    className="min-w-[140px] bg-transparent outline-none text-sm text-gray-700"
                  />
                </div>
              </div>

              {/* Name and Address Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    <span className="text-red-500">*</span> Name
                  </label>
                  <Input defaultValue={selectedLead?.name} placeholder="" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <Textarea defaultValue={selectedLead?.address} placeholder="" className="mt-1" rows={1} />
                </div>
              </div>

              {/* Position and City Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Position</label>
                  <Input defaultValue={selectedLead?.position} placeholder="" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <Input defaultValue={selectedLead?.city} placeholder="" className="mt-1" />
                </div>
              </div>

              {/* Email Address and State Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <Input defaultValue={selectedLead?.email} type="email" placeholder="" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <Input defaultValue={selectedLead?.state} placeholder="" className="mt-1" />
                </div>
              </div>

              {/* Website and Country Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Website</label>
                  <Input defaultValue={selectedLead?.website} placeholder="" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <Select defaultValue="India">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Phone and Zip Code Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <Input defaultValue={selectedLead?.phone} type="tel" placeholder="" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Zip Code</label>
                  <Input defaultValue={selectedLead?.zipCode} placeholder="" className="mt-1" />
                </div>
              </div>

              {/* Lead value and Default Language Row */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Lead value</label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                      $
                    </span>
                    <Input 
                      defaultValue={selectedLead?.leadValue} 
                      type="number" 
                      placeholder="" 
                      className="rounded-l-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Default Language</label>
                  <Select defaultValue="System Default">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="System Default">System Default</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="text-sm font-medium text-gray-700">Company</label>
                <Input defaultValue={selectedLead?.company} placeholder="" className="mt-1" />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Textarea defaultValue={selectedLead?.description} placeholder="" className="mt-1" rows={4} />
              </div>

              {/* Date Contacted */}
              <div>
                <label className="text-sm font-medium text-gray-700">Date Contacted</label>
                <Input defaultValue={selectedLead?.dateContacted} type="date" className="mt-1" />
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="public" 
                    defaultChecked={selectedLead?.isPublic}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="public" className="text-sm font-medium text-gray-700">
                    Public
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="contactedToday" 
                    defaultChecked={selectedLead?.contactedToday}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="contactedToday" className="text-sm font-medium text-gray-700">
                    Contacted Today
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setLeadModalOpen(false)}>
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

       

        {/* Confirm Convert Dialog */}
        <Dialog open={confirmConvertOpen} onOpenChange={setConfirmConvertOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Conversion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                Are you sure you want to convert <span className="font-semibold">{leadToConvert?.name}</span> to a customer? This will mark the lead as converted.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setConfirmConvertOpen(false)}>Cancel</Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => { confirmConvert(); }}>Confirm</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
