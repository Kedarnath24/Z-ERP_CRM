import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, Plus, Play, Pause, Copy, Trash2, Settings, BarChart3,
  Mail, MessageCircle, Phone, Calendar, CheckCircle, Filter,
  Users, Target, AlertCircle, Clock, TrendingUp, Send
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

interface Workflow {
  id: string;
  name: string;
  status: "active" | "paused" | "draft";
  trigger: string;
  steps: number;
  enrolled: number;
  completed: number;
  lastRun: string;
}

export default function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "New Lead Welcome Flow",
      status: "active",
      trigger: "Lead Created",
      steps: 5,
      enrolled: 234,
      completed: 189,
      lastRun: "2 mins ago"
    },
    {
      id: "2",
      name: "Invoice Payment Reminder",
      status: "active",
      trigger: "Invoice Overdue",
      steps: 3,
      enrolled: 45,
      completed: 38,
      lastRun: "1 hour ago"
    },
    {
      id: "3",
      name: "Customer Onboarding",
      status: "paused",
      trigger: "Deal Won",
      steps: 8,
      enrolled: 67,
      completed: 52,
      lastRun: "2 days ago"
    }
  ]);

  const [builderOpen, setBuilderOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  const stats = [
    { label: "Active Workflows", value: "12", icon: Zap, color: "text-indigo-600" },
    { label: "Total Enrollments", value: "1,234", icon: Users, color: "text-green-600" },
    { label: "Completion Rate", value: "87%", icon: Target, color: "text-amber-600" },
    { label: "Avg Response Time", value: "2.3h", icon: Clock, color: "text-blue-600" }
  ];

  const triggers = [
    { icon: Plus, label: "Lead Created", color: "bg-green-100 text-green-600" },
    { icon: Mail, label: "Email Received", color: "bg-blue-100 text-blue-600" },
    { icon: Calendar, label: "Date/Time", color: "bg-purple-100 text-purple-600" },
    { icon: CheckCircle, label: "Deal Won", color: "bg-green-100 text-green-600" },
    { icon: AlertCircle, label: "Invoice Overdue", color: "bg-red-100 text-red-600" }
  ];

  const actions = [
    { icon: Mail, label: "Send Email", color: "bg-blue-100 text-blue-600" },
    { icon: MessageCircle, label: "Send WhatsApp", color: "bg-green-100 text-green-600" },
    { icon: Phone, label: "Create Task", color: "bg-purple-100 text-purple-600" },
    { icon: Send, label: "Send SMS", color: "bg-amber-100 text-amber-600" },
    { icon: AlertCircle, label: "Create Alert", color: "bg-red-100 text-red-600" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-amber-500";
      case "draft":
        return "bg-gray-500";
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
            <h1 className="text-3xl font-bold text-gray-900">Workflow Automation</h1>
            <p className="text-sm text-gray-500 mt-1">Build and manage automated workflows</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setBuilderOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workflows List */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle>Your Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {workflows.map((workflow) => (
                    <Card key={workflow.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                              <Zap className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                                <Badge className={getStatusColor(workflow.status)}>
                                  {workflow.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">
                                Trigger: {workflow.trigger} • {workflow.steps} steps
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-gray-900">{workflow.enrolled}</p>
                              <p className="text-xs text-gray-500">enrolled</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">{workflow.completed}</p>
                              <p className="text-xs text-gray-500">completed</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${(workflow.completed / workflow.enrolled) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Last run: {workflow.lastRun}</span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => {
                              setSelectedWorkflow(workflow);
                              setBuilderOpen(true);
                            }}>
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => {
                              const foundWorkflow = workflows.find(w => w.id === workflow.id);
                              if (foundWorkflow) {
                                foundWorkflow.status = foundWorkflow.status === "active" ? "paused" : "active";
                                setWorkflows([...workflows]);
                              }
                            }}>
                              {workflow.status === "active" ? (
                                <Pause className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-base">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-semibold">87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "87%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Email Open Rate</span>
                      <span className="font-semibold">64%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "64%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Response Rate</span>
                      <span className="font-semibold">42%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Email sent", workflow: "New Lead Welcome", time: "2m ago" },
                    { action: "Task created", workflow: "Onboarding", time: "15m ago" },
                    { action: "WhatsApp sent", workflow: "Follow-up", time: "1h ago" },
                    { action: "Alert triggered", workflow: "Invoice Reminder", time: "2h ago" }
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5"></div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{activity.action}</p>
                        <p className="text-gray-500 text-xs">{activity.workflow}</p>
                        <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Workflow Builder Modal */}
        <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
          <DialogContent className="max-w-6xl h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {selectedWorkflow ? `Edit: ${selectedWorkflow.name}` : "Create New Workflow"}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-hidden grid grid-cols-12 gap-6">
              {/* Toolbox */}
              <div className="col-span-3 space-y-4 overflow-y-auto">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Triggers</h3>
                  <div className="space-y-2">
                    {triggers.map((trigger, idx) => (
                      <div
                        key={idx}
                        className={`${trigger.color} p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow`}
                        draggable
                      >
                        <div className="flex items-center gap-2">
                          <trigger.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{trigger.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
                  <div className="space-y-2">
                    {actions.map((action, idx) => (
                      <div
                        key={idx}
                        className={`${action.color} p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow`}
                        draggable
                      >
                        <div className="flex items-center gap-2">
                          <action.icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{action.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Conditions</h3>
                  <div className="space-y-2">
                    <div className="bg-amber-100 text-amber-600 p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-medium">If/Else</span>
                      </div>
                    </div>
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Wait/Delay</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="col-span-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 overflow-y-auto">
                <div className="text-center mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Workflow Canvas</h3>
                  <p className="text-sm text-gray-500">Drag and drop elements to build your workflow</p>
                </div>

                <div className="space-y-4 max-w-2xl mx-auto">
                  {/* Example Workflow Steps */}
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                          <Plus className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Trigger: Lead Created</p>
                          <p className="text-sm text-gray-600">When a new lead is added to the system</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-center">
                    <div className="w-0.5 h-12 bg-gray-300"></div>
                  </div>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Action: Send Email</p>
                          <p className="text-sm text-gray-600">Welcome email to new lead</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-center">
                    <div className="w-0.5 h-12 bg-gray-300"></div>
                  </div>

                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">Wait: 2 days</p>
                          <p className="text-sm text-gray-600">Delay before next action</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-center">
                    <Button variant="outline" size="sm" className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Step
                    </Button>
                  </div>
                </div>
              </div>

              {/* Properties Panel */}
              <div className="col-span-3 space-y-4 overflow-y-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Workflow Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <Input
                        defaultValue={selectedWorkflow?.name}
                        placeholder="My Workflow"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <Textarea
                        placeholder="Describe this workflow..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <Select defaultValue={selectedWorkflow?.status || "draft"}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Enrollment Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Enrolled</span>
                        <span className="font-semibold">{selectedWorkflow?.enrolled || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed</span>
                        <span className="font-semibold text-green-600">
                          {selectedWorkflow?.completed || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">In Progress</span>
                        <span className="font-semibold text-blue-600">
                          {selectedWorkflow ? selectedWorkflow.enrolled - selectedWorkflow.completed : 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={() => setBuilderOpen(false)}>
                Cancel
              </Button>
              <Button variant="outline">
                Save as Draft
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Play className="w-4 h-4 mr-2" />
                Activate Workflow
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
