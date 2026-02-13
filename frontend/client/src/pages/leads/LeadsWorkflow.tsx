import { useState, useEffect, useRef } from "react";
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
  CheckCircle, XCircle, AlertCircle, BarChart3, Zap, User, Settings, GitBranch, Flag, MapPin,
  Paperclip, Trash2, Eye, ArrowRight, Upload, FileText
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

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  addedDate: string;
}

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
  attachments?: Attachment[];
  convertedDate?: string;
}

export default function LeadsWorkflow() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Tags input state (multi-tag, linear)
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Form state for creating/editing leads
  const [formData, setFormData] = useState<Partial<Lead>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [leads, setLeads] = useState<Lead[]>([]);

  const [confirmConvertOpen, setConfirmConvertOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);

  const convertLead = (id: string) => {
    const now = new Date();
    const convertedDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'converted' as const, convertedDate } : l));
    if (selectedLead?.id === id) {
      setSelectedLead(prev => prev ? { ...prev, status: 'converted' as const, convertedDate } : prev);
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

  // Reset form when opening create modal
  const openCreateModal = () => {
    setSelectedLead(null);
    setFormData({
      status: "new",
      priority: "medium",
      assignedTo: "Zedunix ERP Admin",
      source: "",
      country: "India",
      defaultLanguage: "System Default",
    });
    setTags([]);
    setTagsInput("");
    setLeadModalOpen(true);
  };

  // Open detail/view modal for existing lead
  const openDetailModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditing(false);
    setDetailModalOpen(true);
  };

  // Switch to edit mode
  const startEditing = () => {
    if (!selectedLead) return;
    setFormData({ ...selectedLead });
    setTags(selectedLead.tags ?? []);
    setTagsInput("");
    setIsEditing(true);
  };

  // Save edited lead
  const saveEditedLead = () => {
    if (!selectedLead) return;
    const updated: Lead = {
      ...selectedLead,
      ...formData,
      tags,
      lastContact: "Just now",
    };
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
    setSelectedLead(updated);
    setIsEditing(false);
  };

  // Sync tags when create modal opens
  useEffect(() => {
    if (leadModalOpen && !selectedLead) {
      setTags([]);
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
      setTags(prev => prev.slice(0, -1));
    }
  };

  const handleTagBlur = () => {
    if (tagsInput.trim() !== "") addTag(tagsInput);
  };

  // Save new lead
  const saveNewLead = () => {
    if (!formData.name || !formData.source) return;
    const now = new Date();
    const createdDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newLead: Lead = {
      id: String(Date.now()),
      name: formData.name || "",
      company: formData.company || "",
      email: formData.email || "",
      phone: formData.phone || "",
      source: formData.source || "",
      status: (formData.status as Lead["status"]) || "new",
      priority: (formData.priority as Lead["priority"]) || "medium",
      assignedTo: formData.assignedTo || "Zedunix ERP Admin",
      createdDate,
      lastContact: "Just now",
      tags,
      address: formData.address,
      position: formData.position,
      city: formData.city,
      state: formData.state,
      website: formData.website,
      country: formData.country,
      zipCode: formData.zipCode,
      leadValue: formData.leadValue,
      defaultLanguage: formData.defaultLanguage,
      description: formData.description,
      dateContacted: formData.dateContacted,
      isPublic: formData.isPublic,
      contactedToday: formData.contactedToday,
      attachments: [],
    };
    setLeads(prev => [newLead, ...prev]);
    setLeadModalOpen(false);
    // Open the new lead's detail view
    setSelectedLead(newLead);
    setIsEditing(false);
    setDetailModalOpen(true);
  };

  // Attachment handling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedLead) return;
    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: String(Date.now()) + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size < 1024 ? `${file.size} B` : file.size < 1048576 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / 1048576).toFixed(1)} MB`,
      type: file.type || "unknown",
      addedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }));
    const updatedLead: Lead = {
      ...selectedLead,
      attachments: [...(selectedLead.attachments || []), ...newAttachments],
    };
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    setSelectedLead(updatedLead);
    e.target.value = "";
  };

  const removeAttachment = (attachmentId: string) => {
    if (!selectedLead) return;
    const updatedLead: Lead = {
      ...selectedLead,
      attachments: (selectedLead.attachments || []).filter(a => a.id !== attachmentId),
    };
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
    setSelectedLead(updatedLead);
  };

  const activeLeads = leads.filter(l => l.status !== "converted");
  const convertedLeads = leads.filter(l => l.status === "converted");

  const totalLeads = leads.length;
  const qualifiedCount = leads.filter(l => l.status === "qualified").length;
  const nurturingCount = leads.filter(l => l.status === "nurturing").length;
  const convertedCount = convertedLeads.length;
  const conversionRate = totalLeads > 0 ? ((convertedCount / totalLeads) * 100).toFixed(1) : "0.0";

  const stats = [
    { label: "Total Leads", value: String(totalLeads), change: `+${totalLeads}`, icon: Users, color: "text-indigo-600" },
    { label: "Qualified", value: String(qualifiedCount), change: `+${qualifiedCount}`, icon: CheckCircle, color: "text-green-600" },
    { label: "Nurturing", value: String(nurturingCount), change: `+${nurturingCount}`, icon: Target, color: "text-amber-600" },
    { label: "Converted", value: String(convertedCount), change: `+${convertedCount}`, icon: Award, color: "text-blue-600" }
  ];

  const additionalStats = [
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500";
      case "qualified": return "bg-green-500";
      case "nurturing": return "bg-amber-500";
      case "converted": return "bg-purple-500";
      case "lost": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-amber-600 bg-amber-50";
      case "low": return "text-gray-600 bg-gray-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const filteredActiveLeads = activeLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConvertedLeads = convertedLeads.filter(lead =>
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
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
          <TabsList className="grid w-full grid-cols-3 gap-1 lg:w-auto">
            <TabsTrigger value="intake" className="text-center">Lead Intake</TabsTrigger>
            <TabsTrigger value="converted" className="text-center">
              Converted
              {convertedCount > 0 && (
                <Badge className="ml-2 bg-purple-500 text-white text-xs">{convertedCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="assignment" className="text-center">Assignment</TabsTrigger>
          </TabsList>

          {/* Lead Intake Tab */}
          <TabsContent value="intake" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Leads</CardTitle>
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
                {filteredActiveLeads.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No leads yet</h3>
                    <p className="text-sm text-gray-400 mb-4">Get started by adding your first lead</p>
                    <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={openCreateModal}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Lead
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredActiveLeads.map((lead) => (
                      <Card
                        key={lead.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => openDetailModal(lead)}
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
                                  {lead.email && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        {lead.email}
                                      </span>
                                    </>
                                  )}
                                  {lead.phone && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        {lead.phone}
                                      </span>
                                    </>
                                  )}
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
                              {lead.attachments && lead.attachments.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Paperclip className="w-3 h-3" />
                                    {lead.attachments.length} file(s)
                                  </span>
                                </>
                              )}
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
                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openDetailModal(lead); }}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Converted Leads Tab */}
          <TabsContent value="converted" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    Converted Leads (Customers)
                  </CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search converted leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredConvertedLeads.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No converted leads yet</h3>
                    <p className="text-sm text-gray-400">Leads that are converted to customers will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredConvertedLeads.map((lead) => (
                      <Card
                        key={lead.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-purple-500"
                        onClick={() => openDetailModal(lead)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {lead.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                                  <Badge className="bg-purple-500">Customer</Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span>{lead.company}</span>
                                  {lead.email && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        {lead.email}
                                      </span>
                                    </>
                                  )}
                                  {lead.phone && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3" />
                                        {lead.phone}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Assigned to</p>
                                <p className="font-semibold text-gray-900">{lead.assignedTo}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Converted</p>
                                <p className="font-semibold text-purple-600">{lead.convertedDate || lead.lastContact}</p>
                              </div>
                              {lead.leadValue && (
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Value</p>
                                  <p className="font-semibold text-green-600">${lead.leadValue}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>Created: {lead.createdDate}</span>
                              <span>•</span>
                              <span>Source: {lead.source}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openDetailModal(lead); }}>
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
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
                            <span className="font-semibold">{leads.filter(l => l.assignedTo === "Sarah J.").length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Active</span>
                            <span className="font-semibold text-green-600">{leads.filter(l => l.assignedTo === "Sarah J." && l.status !== "converted").length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Converted</span>
                            <span className="font-semibold text-blue-600">{leads.filter(l => l.assignedTo === "Sarah J." && l.status === "converted").length}</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Workload</span>
                            <span className="font-semibold">{leads.filter(l => l.assignedTo === "Sarah J.").length > 0 ? Math.min(100, leads.filter(l => l.assignedTo === "Sarah J.").length * 10) : 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${leads.filter(l => l.assignedTo === "Sarah J.").length > 0 ? Math.min(100, leads.filter(l => l.assignedTo === "Sarah J.").length * 10) : 0}%` }}></div>
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
                            <span className="font-semibold">{leads.filter(l => l.assignedTo === "Mike C.").length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Active</span>
                            <span className="font-semibold text-green-600">{leads.filter(l => l.assignedTo === "Mike C." && l.status !== "converted").length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Converted</span>
                            <span className="font-semibold text-blue-600">{leads.filter(l => l.assignedTo === "Mike C." && l.status === "converted").length}</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Workload</span>
                            <span className="font-semibold">{leads.filter(l => l.assignedTo === "Mike C.").length > 0 ? Math.min(100, leads.filter(l => l.assignedTo === "Mike C.").length * 10) : 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${leads.filter(l => l.assignedTo === "Mike C.").length > 0 ? Math.min(100, leads.filter(l => l.assignedTo === "Mike C.").length * 10) : 0}%` }}></div>
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
                            <p className="font-semibold text-gray-900">Zedunix ERP Admin</p>
                            <p className="text-xs text-gray-500">Admin</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Assigned Leads</span>
                            <span className="font-semibold">{leads.filter(l => l.assignedTo === "Zedunix ERP Admin").length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Active</span>
                            <span className="font-semibold text-green-600">{leads.filter(l => l.assignedTo === "Zedunix ERP Admin" && l.status !== "converted").length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Converted</span>
                            <span className="font-semibold text-blue-600">{leads.filter(l => l.assignedTo === "Zedunix ERP Admin" && l.status === "converted").length}</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Workload</span>
                            <span className="font-semibold">{leads.filter(l => l.assignedTo === "Zedunix ERP Admin").length > 0 ? Math.min(100, leads.filter(l => l.assignedTo === "Zedunix ERP Admin").length * 10) : 0}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${leads.filter(l => l.assignedTo === "Zedunix ERP Admin").length > 0 ? Math.min(100, leads.filter(l => l.assignedTo === "Zedunix ERP Admin").length * 10) : 0}%` }}></div>
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

        {/* Create Lead Modal */}
        <Dialog open={leadModalOpen} onOpenChange={setLeadModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Status, Source, and Assigned Row */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    <span className="text-red-500">*</span> Status
                  </label>
                  <div className="flex gap-2 mt-1">
                    <Select value={formData.status || "new"} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as Lead["status"] }))}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="nurturing">Nurturing</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    <span className="text-red-500">*</span> Source
                  </label>
                  <div className="flex gap-2 mt-1">
                    <Select value={formData.source || ""} onValueChange={(v) => setFormData(prev => ({ ...prev, source: v }))}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Referral">Referral</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="Trade Show">Trade Show</SelectItem>
                        <SelectItem value="Cold Call">Cold Call</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Assigned</label>
                  <div className="mt-1">
                    <Select value={formData.assignedTo || "Zedunix ERP Admin"} onValueChange={(v) => setFormData(prev => ({ ...prev, assignedTo: v }))}>
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

              {/* Priority */}
              <div>
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <Select value={formData.priority || "medium"} onValueChange={(v) => setFormData(prev => ({ ...prev, priority: v as Lead["priority"] }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium text-gray-700">Tags</label>
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

              {/* Name and Address */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    <span className="text-red-500">*</span> Name
                  </label>
                  <Input value={formData.name || ""} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="Full name" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <Textarea value={formData.address || ""} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} placeholder="" className="mt-1" rows={1} />
                </div>
              </div>

              {/* Position and City */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Position</label>
                  <Input value={formData.position || ""} onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))} placeholder="" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <Input value={formData.city || ""} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} placeholder="" className="mt-1" />
                </div>
              </div>

              {/* Email and State */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <Input value={formData.email || ""} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} type="email" placeholder="" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <Input value={formData.state || ""} onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))} placeholder="" className="mt-1" />
                </div>
              </div>

              {/* Website and Country */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Website</label>
                  <Input value={formData.website || ""} onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))} placeholder="" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <Select value={formData.country || "India"} onValueChange={(v) => setFormData(prev => ({ ...prev, country: v }))}>
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

              {/* Phone and Zip Code */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <Input value={formData.phone || ""} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} type="tel" placeholder="" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Zip Code</label>
                  <Input value={formData.zipCode || ""} onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))} placeholder="" className="mt-1" />
                </div>
              </div>

              {/* Lead value and Default Language */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Lead value</label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">$</span>
                    <Input value={formData.leadValue || ""} onChange={(e) => setFormData(prev => ({ ...prev, leadValue: Number(e.target.value) || undefined }))} type="number" placeholder="" className="rounded-l-none" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Default Language</label>
                  <Select value={formData.defaultLanguage || "System Default"} onValueChange={(v) => setFormData(prev => ({ ...prev, defaultLanguage: v }))}>
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
                <Input value={formData.company || ""} onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))} placeholder="" className="mt-1" />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Textarea value={formData.description || ""} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="" className="mt-1" rows={4} />
              </div>

              {/* Date Contacted */}
              <div>
                <label className="text-sm font-medium text-gray-700">Date Contacted</label>
                <Input value={formData.dateContacted || ""} onChange={(e) => setFormData(prev => ({ ...prev, dateContacted: e.target.value }))} type="date" className="mt-1" />
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="create-public" checked={formData.isPublic || false} onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="create-public" className="text-sm font-medium text-gray-700">Public</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="create-contactedToday" checked={formData.contactedToday || false} onChange={(e) => setFormData(prev => ({ ...prev, contactedToday: e.target.checked }))} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="create-contactedToday" className="text-sm font-medium text-gray-700">Contacted Today</label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setLeadModalOpen(false)}>Cancel</Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={saveNewLead} disabled={!formData.name || !formData.source}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Lead
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Lead Detail / Edit / View Modal */}
        <Dialog open={detailModalOpen} onOpenChange={(open) => { setDetailModalOpen(open); if (!open) setIsEditing(false); }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-3">
                  {selectedLead && (
                    <>
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {selectedLead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span>{selectedLead.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(selectedLead.status)}>
                            {selectedLead.status === "converted" ? "Customer" : selectedLead.status}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(selectedLead.priority)}>
                            {selectedLead.priority}
                          </Badge>
                        </div>
                      </div>
                    </>
                  )}
                </DialogTitle>
                {selectedLead && !isEditing && (
                  <div className="flex gap-2">
                    {selectedLead.status !== "converted" && (
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => requestConvert(selectedLead)}
                      >
                        <ArrowRight className="w-4 h-4 mr-1" />
                        Convert to Customer
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={startEditing}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
            </DialogHeader>

            {selectedLead && !isEditing ? (
              /* VIEW MODE */
              <div className="space-y-6">
                {/* Converted banner */}
                {selectedLead.status === "converted" && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-purple-800">Converted to Customer</p>
                      <p className="text-sm text-purple-600">This lead was converted on {selectedLead.convertedDate || "N/A"}</p>
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLead.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Company</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLead.company || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLead.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLead.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Position</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLead.position || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Website</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLead.website || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Source</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLead.source}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Assigned To</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLead.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      {[selectedLead.address, selectedLead.city, selectedLead.state, selectedLead.zipCode, selectedLead.country].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Lead Value</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLead.leadValue ? `$${selectedLead.leadValue}` : "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Created Date</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLead.createdDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Last Contact</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLead.lastContact}</p>
                  </div>
                </div>

                {/* Tags */}
                {selectedLead.tags && selectedLead.tags.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedLead.tags.map((t, idx) => (
                        <Badge key={idx} variant="outline" className="text-sm">{t}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {selectedLead.description && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Description</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedLead.description}</p>
                  </div>
                )}

                {/* Attachments Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                      <Paperclip className="w-3 h-3" />
                      Attachments ({selectedLead.attachments?.length || 0})
                    </p>
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        multiple
                      />
                      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-1" />
                        Add Attachment
                      </Button>
                    </div>
                  </div>
                  {(!selectedLead.attachments || selectedLead.attachments.length === 0) ? (
                    <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg">
                      <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">No attachments yet</p>
                      <Button variant="ghost" size="sm" className="mt-2" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-1" />
                        Upload files
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedLead.attachments.map((att) => (
                        <div key={att.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{att.name}</p>
                              <p className="text-xs text-gray-500">{att.size} · Added {att.addedDate}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => removeAttachment(att.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer actions */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setDetailModalOpen(false)}>Close</Button>
                  {selectedLead.status !== "converted" && (
                    <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => requestConvert(selectedLead)}>
                      <ArrowRight className="w-4 h-4 mr-1" />
                      Convert to Customer
                    </Button>
                  )}
                  <Button variant="outline" onClick={startEditing}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ) : selectedLead && isEditing ? (
              /* EDIT MODE */
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700"><span className="text-red-500">*</span> Status</label>
                    <Select value={formData.status || selectedLead.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as Lead["status"] }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="nurturing">Nurturing</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700"><span className="text-red-500">*</span> Source</label>
                    <Select value={formData.source || selectedLead.source} onValueChange={(v) => setFormData(prev => ({ ...prev, source: v }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Referral">Referral</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                        <SelectItem value="Trade Show">Trade Show</SelectItem>
                        <SelectItem value="Cold Call">Cold Call</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Assigned</label>
                    <Select value={formData.assignedTo || selectedLead.assignedTo} onValueChange={(v) => setFormData(prev => ({ ...prev, assignedTo: v }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Zedunix ERP Admin">Zedunix ERP Admin</SelectItem>
                        <SelectItem value="Sarah J.">Sarah J.</SelectItem>
                        <SelectItem value="Mike C.">Mike C.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <Select value={formData.priority || selectedLead.priority} onValueChange={(v) => setFormData(prev => ({ ...prev, priority: v as Lead["priority"] }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Tags</label>
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700"><span className="text-red-500">*</span> Name</label>
                    <Input value={formData.name || ""} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <Textarea value={formData.address || ""} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} className="mt-1" rows={1} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Position</label>
                    <Input value={formData.position || ""} onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <Input value={formData.city || ""} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} className="mt-1" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <Input value={formData.email || ""} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} type="email" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">State</label>
                    <Input value={formData.state || ""} onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))} className="mt-1" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Website</label>
                    <Input value={formData.website || ""} onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Country</label>
                    <Select value={formData.country || "India"} onValueChange={(v) => setFormData(prev => ({ ...prev, country: v }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <Input value={formData.phone || ""} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} type="tel" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Zip Code</label>
                    <Input value={formData.zipCode || ""} onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))} className="mt-1" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Lead value</label>
                    <div className="flex mt-1">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">$</span>
                      <Input value={formData.leadValue || ""} onChange={(e) => setFormData(prev => ({ ...prev, leadValue: Number(e.target.value) || undefined }))} type="number" className="rounded-l-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Default Language</label>
                    <Select value={formData.defaultLanguage || "System Default"} onValueChange={(v) => setFormData(prev => ({ ...prev, defaultLanguage: v }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
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

                <div>
                  <label className="text-sm font-medium text-gray-700">Company</label>
                  <Input value={formData.company || ""} onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))} className="mt-1" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <Textarea value={formData.description || ""} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="mt-1" rows={4} />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Date Contacted</label>
                  <Input value={formData.dateContacted || ""} onChange={(e) => setFormData(prev => ({ ...prev, dateContacted: e.target.value }))} type="date" className="mt-1" />
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="edit-public" checked={formData.isPublic || false} onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <label htmlFor="edit-public" className="text-sm font-medium text-gray-700">Public</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="edit-contactedToday" checked={formData.contactedToday || false} onChange={(e) => setFormData(prev => ({ ...prev, contactedToday: e.target.checked }))} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <label htmlFor="edit-contactedToday" className="text-sm font-medium text-gray-700">Contacted Today</label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={saveEditedLead}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : null}
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
                <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => { confirmConvert(); }}>
                  <ArrowRight className="w-4 h-4 mr-1" />
                  Confirm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
