import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Zap, 
  Bell, 
  Mail, 
  Clock, 
  UserPlus, 
  FileText, 
  Calendar,
  ArrowRight,
  Plus,
  Play,
  Save,
  Trash2,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Workflow,
  Sparkles,
  Search,
  ArrowLeft,
  MoreVertical,
  Activity,
  History,
  Timer
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Shared StatCard component
const StatCard = ({ title, value, icon: Icon, description, trend, color }: any) => (
  <Card className="overflow-hidden border-none shadow-sm bg-white/50 backdrop-blur-md">
    <CardContent className="p-6">
      <div className="flex justify-between items-start text-slate-600">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-slate-900">{value}</h3>
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
          {trend && (
            <div className={`flex items-center mt-2 text-xs font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function HRMAutomation() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('workflows');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - Workflows
  const workflows = useMemo(() => [
    {
      id: 'WF-001',
      name: 'New Employee Onboarding',
      description: 'Triggered when a new employee record is created',
      trigger: 'Employee Created',
      steps: 8,
      active: true,
      lastRun: '1 hour ago',
      category: 'Onboarding'
    },
    {
      id: 'WF-002',
      name: 'Leave Approval Notification',
      description: 'Notify manager when a leave path is submitted',
      trigger: 'Leave Submitted',
      steps: 3,
      active: true,
      lastRun: '2 days ago',
      category: 'Leave Management'
    },
    {
      id: 'WF-003',
      name: 'Probation End Reminder',
      description: 'Send reminder 15 days before probation period ends',
      trigger: 'Date Condition',
      steps: 2,
      active: false,
      lastRun: 'Never',
      category: 'Reviews'
    },
    {
      id: 'WF-004',
      name: 'Document Expiry Alert',
      description: 'Notify HR when employee visas or passports are near expiry',
      trigger: 'Schedule',
      steps: 4,
      active: true,
      lastRun: '12 hours ago',
      category: 'Compliance'
    }
  ], []);

  // Mock data - Audit Logs
  const auditLogs = useMemo(() => [
    { id: 1, event: 'Workflow WF-001 executed', status: 'success', time: '10:45 AM', user: 'System' },
    { id: 2, event: 'Rule "Late Login" triggered', status: 'success', time: '09:15 AM', user: 'System' },
    { id: 3, event: 'Workflow WF-004 failed', status: 'error', time: '08:00 AM', user: 'System', message: 'Email service unreachable' },
    { id: 4, event: 'New Automation Rule created', status: 'info', time: 'Yesterday', user: 'Admin' },
  ], []);

  const filteredWorkflows = workflows.filter(wf => 
    wf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wf.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-slate-50/50 text-slate-900">
        {/* Modern Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-slate-100"
                onClick={() => setLocation('/hrm')}
              >
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-600 rounded-lg">
                    <Workflow className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight text-slate-900">HR Automation</h1>
                </div>
                <p className="text-sm text-slate-500 font-medium">Configure intelligent triggers and automated HR processes</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-white">
                <History className="h-4 w-4 mr-2" /> Execution Logs
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                    <Plus className="h-4 w-4 mr-2" /> Create Workflow
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>New Automation Workflow</DialogTitle>
                    <DialogDescription>Define a sequence of actions triggered by specific HR events.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-6">
                    <div className="space-y-2">
                      <Label>Workflow Name</Label>
                      <Input placeholder="e.g. Anniversary Celebration" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Trigger Event</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="When happens?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hire">Employee Hired</SelectItem>
                            <SelectItem value="leave">Leave Approved</SelectItem>
                            <SelectItem value="date">Specific Date</SelectItem>
                            <SelectItem value="status">Status Changed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Classification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="onboarding">Onboarding</SelectItem>
                            <SelectItem value="notifications">Engagement</SelectItem>
                            <SelectItem value="compliance">Compliance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Save Draft</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">Design Flow</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="max-w-[1600px] mx-auto space-y-6">
            
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Active Flows"
                value="12"
                description="Running in production"
                icon={Zap}
                color="bg-amber-100 text-amber-600"
              />
              <StatCard 
                title="Executions Today"
                value="148"
                trend={{ value: '+12% vs yesterday', positive: true }}
                icon={Activity}
                color="bg-emerald-100 text-emerald-600"
              />
              <StatCard 
                title="Success Rate"
                value="99.4%"
                description="Failed: 2 executions"
                icon={CheckCircle2}
                color="bg-blue-100 text-blue-600"
              />
              <StatCard 
                title="Time Saved"
                value="420 hrs"
                description="Calculated monthly"
                icon={Timer}
                color="bg-purple-100 text-purple-600"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Workflows List */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2 text-slate-900">
                      <Cpu className="h-4 w-4 text-indigo-500" />
                      Active Workflows
                    </h2>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Search workflows..." 
                        className="pl-10 w-full md:w-[250px] bg-white border-slate-300" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {filteredWorkflows.map((wf) => (
                      <div key={wf.id} className="p-6 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="mt-1 h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                              {wf.category === 'Onboarding' ? <UserPlus className="h-5 w-5" /> : 
                               wf.category === 'Compliance' ? <Settings className="h-5 w-5" /> : 
                               <Bell className="h-5 w-5" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{wf.name}</h3>
                                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight bg-white border-slate-200 text-slate-500 px-1.5 py-0 h-4">
                                  {wf.id}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{wf.description}</p>
                              
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                  <Zap className="h-3 w-3 text-amber-500" />
                                  When: {wf.trigger}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 border-l border-slate-200 pl-4">
                                  <Sparkles className="h-3 w-3 text-indigo-500" />
                                  {wf.steps} Steps
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 border-l border-slate-200 pl-4">
                                  <Clock className="h-3 w-3 text-slate-400" />
                                  Last ran: {wf.lastRun}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {wf.active ? 'Operational' : 'Paused'}
                              </span>
                              <Switch checked={wf.active} />
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200">
                                <Play className="h-4 w-4 text-emerald-600" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-200">
                                <Settings className="h-4 w-4 text-slate-600" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Sidebar: Status & Logs */}
              <div className="space-y-6 text-slate-900">
                <Card className="border-slate-200 shadow-sm overflow-hidden text-slate-900">
                  <CardHeader className="bg-slate-50/50 pb-4">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                       <History className="h-4 w-4 text-slate-500" />
                       Recent Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[400px]">
                      <div className="divide-y divide-slate-100">
                        {auditLogs.map((log) => (
                          <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex gap-3">
                              <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                                log.status === 'success' ? 'bg-emerald-500' : 
                                log.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-semibold text-slate-900 truncate tracking-tight uppercase">{log.event}</p>
                                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                                  <span className="font-medium">{log.time}  {log.user}</span>
                                  {log.status === 'success' && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                                </div>
                                {log.message && (
                                  <div className="mt-2 p-2 bg-red-50 rounded text-[11px] text-red-600 font-medium">
                                    {log.message}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                      <Button variant="link" className="text-xs font-bold text-indigo-600 h-auto p-0">View All Execution Logs</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-indigo-900 text-white border-none shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10 translate-x-1/4 -translate-y-1/4">
                    <Sparkles className="h-40 w-40" />
                  </div>
                  <CardContent className="p-6 relative z-10">
                    <h3 className="text-lg font-bold">Automation AI (Preview)</h3>
                    <p className="text-indigo-200 text-xs mt-2 leading-relaxed">
                      Our new NLP engine can help you generate automation rules from natural language.
                    </p>
                    <div className="mt-6 flex flex-col gap-2">
                      <Input 
                        placeholder="e.g. Email me if expense > $2k" 
                        className="bg-indigo-800/50 border-indigo-700/50 text-white placeholder:text-indigo-400 text-sm h-9"
                      />
                      <Button className="bg-white text-indigo-900 hover:bg-indigo-50 h-9 font-bold text-xs uppercase tracking-wider">
                        Generate Rule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </DashboardLayout>
  );
}
