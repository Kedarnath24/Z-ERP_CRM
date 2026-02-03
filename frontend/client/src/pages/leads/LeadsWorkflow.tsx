import { useState } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, Users, TrendingUp, Award, Plus, Search, Filter,
  Star, Phone, Mail, Calendar, MessageCircle, Send, Clock,
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
  score: number;
  priority: "high" | "medium" | "low";
  assignedTo: string;
  createdDate: string;
  lastContact: string;
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

  const leads: Lead[] = [
    {
      id: "1",
      name: "John Doe",
      company: "Tech Corp",
      email: "john@techcorp.com",
      phone: "+1 (555) 123-4567",
      source: "Website",
      status: "new",
      score: 85,
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
      score: 92,
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
      score: 68,
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
      score: 95,
      priority: "high",
      assignedTo: "Mike C.",
      createdDate: "Jan 10, 2026",
      lastContact: "3 days ago"
    }
  ];

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
    { label: "Avg Lead Score", value: "78", icon: Star },
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
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
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="intake">Lead Intake</TabsTrigger>
            <TabsTrigger value="scoring">Scoring</TabsTrigger>
            <TabsTrigger value="assignment">Auto Assignment</TabsTrigger>
            <TabsTrigger value="nurture">Nurture Sequences</TabsTrigger>
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
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Score</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className={`w-4 h-4 ${getScoreColor(lead.score)}`} />
                                <p className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                                  {lead.score}
                                </p>
                              </div>
                            </div>
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
                            <Button variant="ghost" size="sm">
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageCircle className="w-4 h-4" />
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

          {/* Scoring Tab */}
          <TabsContent value="scoring" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-600" />
                  Lead Scoring Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Automatically score leads based on demographic, firmographic, and behavioral data
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-green-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">High Score (80-100)</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">42 leads</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-amber-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Medium Score (60-79)</p>
                        <p className="text-2xl font-bold text-amber-600 mt-1">126 leads</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Low Score (0-59)</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">174 leads</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Scoring Criteria</h3>
                    {[
                      { criteria: "Company Size (Enterprise)", points: "+25", color: "text-green-600" },
                      { criteria: "Job Title (Decision Maker)", points: "+20", color: "text-green-600" },
                      { criteria: "Website Visit (Product Page)", points: "+15", color: "text-indigo-600" },
                      { criteria: "Email Opened", points: "+10", color: "text-indigo-600" },
                      { criteria: "Downloaded Whitepaper", points: "+15", color: "text-indigo-600" },
                      { criteria: "Attended Webinar", points: "+20", color: "text-green-600" },
                      { criteria: "Requested Demo", points: "+30", color: "text-green-600" },
                      { criteria: "Email Bounced", points: "-10", color: "text-red-600" },
                      { criteria: "Unsubscribed", points: "-20", color: "text-red-600" }
                    ].map((rule, idx) => (
                      <Card key={idx}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-900">{rule.criteria}</span>
                            <div className="flex items-center gap-3">
                              <span className={`text-lg font-bold ${rule.color}`}>{rule.points}</span>
                              <Button variant="ghost" size="sm">Edit</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Auto Assignment Tab */}
          <TabsContent value="assignment" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  Automatic Lead Assignment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-sm text-gray-600">
                    Distribute leads automatically based on rules, territories, and workload
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

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Assignment Rules</h3>
                    <div className="space-y-3">
                      {[
                        { rule: "High score leads (80+)", assignTo: "Sarah Johnson", status: "active" },
                        { rule: "Enterprise companies", assignTo: "Mike Chen", status: "active" },
                        { rule: "West Coast territory", assignTo: "Emily Davis", status: "active" },
                        { rule: "Inbound demo requests", assignTo: "Round Robin", status: "active" }
                      ].map((rule, idx) => (
                        <Card key={idx}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">{rule.rule}</p>
                                <p className="text-sm text-gray-500">Assign to: {rule.assignTo}</p>
                              </div>
                              <Badge className="bg-green-500">{rule.status}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nurture Sequences Tab */}
          <TabsContent value="nurture" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Automated Nurture Sequences</h2>
              <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setSequenceModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Sequence
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sequences.map((seq) => (
                <Card key={seq.id} className="bg-white/70 backdrop-blur-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          seq.channel === "email" ? "bg-blue-100" :
                          seq.channel === "sms" ? "bg-green-100" :
                          seq.channel === "whatsapp" ? "bg-emerald-100" :
                          "bg-purple-100"
                        }`}>
                          {seq.channel === "email" ? <Mail className="w-5 h-5 text-blue-600" /> :
                           seq.channel === "sms" ? <MessageCircle className="w-5 h-5 text-green-600" /> :
                           seq.channel === "whatsapp" ? <MessageCircle className="w-5 h-5 text-emerald-600" /> :
                           <Phone className="w-5 h-5 text-purple-600" />}
                        </div>
                      </div>
                      <Badge className={seq.status === "active" ? "bg-green-500" : seq.status === "paused" ? "bg-amber-500" : "bg-gray-500"}>
                        {seq.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{seq.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Steps</span>
                        <span className="font-semibold">{seq.steps}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Enrolled</span>
                        <span className="font-semibold">{seq.enrolled}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Completed</span>
                        <span className="font-semibold text-green-600">{seq.completed}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(seq.completed / seq.enrolled) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Lead Details Modal */}
        <Dialog open={leadModalOpen} onOpenChange={setLeadModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedLead ? "Lead Details" : "Add New Lead"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <Input defaultValue={selectedLead?.name} placeholder="John Doe" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Company</label>
                  <Input defaultValue={selectedLead?.company} placeholder="Acme Corp" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input defaultValue={selectedLead?.email} type="email" placeholder="john@acme.com" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <Input defaultValue={selectedLead?.phone} type="tel" placeholder="+1 (555) 123-4567" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Source</label>
                  <Select defaultValue={selectedLead?.source}>
                    <SelectTrigger>
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
                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <Select defaultValue={selectedLead?.priority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <Textarea placeholder="Add notes about this lead..." className="mt-1" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setLeadModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  {selectedLead ? "Update Lead" : "Create Lead"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Sequence Modal */}
        <Dialog open={sequenceModalOpen} onOpenChange={setSequenceModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Nurture Sequence</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Sequence Name</label>
                <Input placeholder="e.g., New Lead Welcome Series" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Channel</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="call">Phone Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Sequence Steps</label>
                <div className="space-y-2">
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-indigo-600">1</Badge>
                        <Input placeholder="Step 1: Welcome email" />
                        <Input type="number" placeholder="0" className="w-20" />
                        <span className="text-sm text-gray-500">days</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSequenceModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Create Sequence
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
