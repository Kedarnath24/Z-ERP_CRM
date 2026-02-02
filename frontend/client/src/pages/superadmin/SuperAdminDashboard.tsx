import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, Users, Activity, Shield, TrendingUp, AlertCircle,
  Plus, Search, Settings, Eye, Edit, Trash2, CheckCircle, XCircle,
  BarChart3, Clock, Database, Server, Zap, FileText, Bell
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
import { Switch } from "@/components/ui/switch";

interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: string;
  users: number;
  status: "active" | "suspended" | "trial";
  createdDate: string;
  lastActive: string;
  modules: string[];
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: "success" | "failed";
}

export default function SuperAdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [orgModalOpen, setOrgModalOpen] = useState(false);

  const organizations: Organization[] = [
    {
      id: "1",
      name: "Acme Corporation",
      domain: "acmecorp.com",
      plan: "Enterprise",
      users: 245,
      status: "active",
      createdDate: "Jan 15, 2025",
      lastActive: "2 mins ago",
      modules: ["Sales", "CRM", "Accounting", "HR", "Projects"]
    },
    {
      id: "2",
      name: "Tech Solutions Inc",
      domain: "techsol.io",
      plan: "Professional",
      users: 87,
      status: "active",
      createdDate: "Feb 3, 2025",
      lastActive: "15 mins ago",
      modules: ["Sales", "CRM", "Projects"]
    },
    {
      id: "3",
      name: "StartUp Labs",
      domain: "startuplabs.co",
      plan: "Basic",
      users: 12,
      status: "trial",
      createdDate: "Jan 10, 2026",
      lastActive: "1 hour ago",
      modules: ["Sales", "CRM"]
    },
    {
      id: "4",
      name: "Global Retail",
      domain: "globalretail.com",
      plan: "Professional",
      users: 156,
      status: "suspended",
      createdDate: "Nov 20, 2024",
      lastActive: "2 days ago",
      modules: ["Sales", "Accounting", "Inventory"]
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: "1",
      timestamp: "2 mins ago",
      user: "admin@system",
      action: "Organization Created",
      resource: "Acme Corporation",
      status: "success"
    },
    {
      id: "2",
      timestamp: "15 mins ago",
      user: "admin@techsol.io",
      action: "Module Enabled",
      resource: "Projects Module",
      status: "success"
    },
    {
      id: "3",
      timestamp: "1 hour ago",
      user: "system",
      action: "License Renewal",
      resource: "Tech Solutions Inc",
      status: "success"
    },
    {
      id: "4",
      timestamp: "2 hours ago",
      user: "admin@system",
      action: "Organization Suspended",
      resource: "Global Retail",
      status: "success"
    }
  ];

  const stats = [
    { label: "Organizations", value: "342", change: "+12", icon: Building2, color: "text-indigo-600" },
    { label: "Total Users", value: "8,234", change: "+245", icon: Users, color: "text-green-600" },
    { label: "Active Modules", value: "24", change: "+2", icon: Zap, color: "text-amber-600" },
    { label: "System Health", value: "98.5%", change: "+0.3%", icon: Activity, color: "text-blue-600" }
  ];

  const modules = [
    { name: "Sales & CRM", enabled: 298, total: 342, status: "operational" },
    { name: "Accounting", enabled: 234, total: 342, status: "operational" },
    { name: "HR Management", enabled: 187, total: 342, status: "operational" },
    { name: "Projects", enabled: 156, total: 342, status: "operational" },
    { name: "Inventory", enabled: 143, total: 342, status: "operational" },
    { name: "Subscriptions", enabled: 98, total: 342, status: "operational" }
  ];

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "trial":
        return "bg-blue-500";
      case "suspended":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">System-wide management and monitoring</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setOrgModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Organization
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Organizations List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Organizations</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search organizations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredOrgs.map((org) => (
                    <Card
                      key={org.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => {
                        setSelectedOrg(org);
                        setOrgModalOpen(true);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                              {org.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{org.name}</h3>
                                <Badge className={getStatusColor(org.status)}>
                                  {org.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">{org.domain}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900">{org.users}</p>
                              <p className="text-xs text-gray-500">users</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                                {org.plan}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-4">
                              <span>Created: {org.createdDate}</span>
                              <span>•</span>
                              <span>Last active: {org.lastActive}</span>
                            </div>
                            <div className="flex gap-1">
                              {org.modules.slice(0, 3).map((module, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {module}
                                </Badge>
                              ))}
                              {org.modules.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{org.modules.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-indigo-600" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Database className="w-5 h-5 text-green-600" />
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">Database</p>
                      <p className="text-lg font-bold text-green-600 mt-1">Healthy</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Server className="w-5 h-5 text-green-600" />
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">API Server</p>
                      <p className="text-lg font-bold text-green-600 mt-1">Online</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Activity className="w-5 h-5 text-green-600" />
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">Uptime</p>
                      <p className="text-lg font-bold text-green-600 mt-1">99.9%</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Zap className="w-5 h-5 text-green-600" />
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">Response</p>
                      <p className="text-lg font-bold text-green-600 mt-1">45ms</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Module Usage */}
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Zap className="w-5 h-5 text-amber-600" />
                  Module Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {modules.map((module, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">{module.name}</span>
                        <span className="text-gray-500">
                          {module.enabled}/{module.total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full"
                          style={{ width: `${(module.enabled / module.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Chart */}
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Growth (Last 6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { month: "Aug", orgs: 245, users: 5234 },
                    { month: "Sep", orgs: 267, users: 5892 },
                    { month: "Oct", orgs: 289, users: 6543 },
                    { month: "Nov", orgs: 312, users: 7234 },
                    { month: "Dec", orgs: 328, users: 7856 },
                    { month: "Jan", orgs: 342, users: 8234 }
                  ].map((data, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 w-12">{data.month}</span>
                      <div className="flex-1 mx-3">
                        <div className="flex gap-1">
                          <div className="flex-1 bg-indigo-100 rounded h-8 flex items-center justify-center">
                            <span className="text-xs font-semibold text-indigo-700">{data.orgs}</span>
                          </div>
                          <div className="flex-1 bg-amber-100 rounded h-8 flex items-center justify-center">
                            <span className="text-xs font-semibold text-amber-700">{data.users}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-center gap-4 pt-3 border-t text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-indigo-500 rounded"></div>
                      <span className="text-gray-600">Organizations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded"></div>
                      <span className="text-gray-600">Users</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-start gap-3 text-sm">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        log.status === "success" ? "bg-green-500" : "bg-red-500"
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{log.action}</p>
                        <p className="text-gray-500 text-xs">{log.resource}</p>
                        <p className="text-gray-400 text-xs mt-1">{log.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Audit Log Section */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Audit Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg divide-y">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      log.status === "success" ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {log.status === "success" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-500">{log.resource}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{log.user}</p>
                      <p className="text-xs text-gray-500">{log.timestamp}</p>
                    </div>
                    <Badge className={log.status === "success" ? "bg-green-500" : "bg-red-500"}>
                      {log.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Organization Modal */}
        <Dialog open={orgModalOpen} onOpenChange={setOrgModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {selectedOrg ? `${selectedOrg.name} - Details` : "Create Organization"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {selectedOrg ? (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Organization Name</p>
                      <p className="font-semibold text-gray-900">{selectedOrg.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Domain</p>
                      <p className="font-semibold text-gray-900">{selectedOrg.domain}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Plan</p>
                      <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                        {selectedOrg.plan}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge className={getStatusColor(selectedOrg.status)}>
                        {selectedOrg.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="font-semibold text-gray-900">{selectedOrg.users}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-semibold text-gray-900">{selectedOrg.createdDate}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-3">Enabled Modules</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        "Sales", "CRM", "Accounting", "HR", "Projects", "Inventory",
                        "Subscriptions", "Leads", "WhatsApp", "Field Staff"
                      ].map((module) => (
                        <div key={module} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{module}</span>
                          <Switch checked={selectedOrg.modules.includes(module)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" className="flex-1">
                      Suspend Organization
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Users
                    </Button>
                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                      Save Changes
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Organization Name</label>
                      <Input placeholder="Acme Corporation" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Domain</label>
                      <Input placeholder="acmecorp.com" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Plan</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Admin Email</label>
                      <Input type="email" placeholder="admin@acmecorp.com" className="mt-1" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOrgModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Create Organization
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
