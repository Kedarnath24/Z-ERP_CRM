import { useState } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Zap, 
  Plus,
  Download,
  Settings,
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Mail,
  Calendar,
  FileText
} from 'lucide-react';

export default function Automation() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - Automation rules
  const automationRules = [
    {
      id: 'AUTO001',
      name: 'Auto-Approve Leave',
      description: 'Automatically approve leaves less than 2 days for specific departments',
      trigger: 'Leave Request Submitted',
      action: 'Approve Leave',
      isActive: true,
      category: 'Attendance',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'AUTO002',
      name: 'Birthday Wishes',
      description: 'Send birthday wishes email to employees automatically',
      trigger: 'Employee Birthday',
      action: 'Send Email',
      isActive: true,
      category: 'General',
      icon: Mail,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'AUTO003',
      name: 'Onboarding Checklist',
      description: 'Create onboarding tasks when new employee joins',
      trigger: 'Employee Joined',
      action: 'Create Tasks',
      isActive: true,
      category: 'Employee',
      icon: Users,
      color: 'bg-green-100 text-green-700'
    },
    {
      id: 'AUTO004',
      name: 'Probation Reminder',
      description: 'Notify HR 15 days before probation period ends',
      trigger: 'Probation End Date - 15 days',
      action: 'Send Notification',
      isActive: false,
      category: 'Employee',
      icon: AlertCircle,
      color: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: 'AUTO005',
      name: 'Expense Report Reminder',
      description: 'Remind employees to submit expense reports monthly',
      trigger: 'End of Month',
      action: 'Send Reminder',
      isActive: true,
      category: 'Expense',
      icon: FileText,
      color: 'bg-orange-100 text-orange-700'
    },
    {
      id: 'AUTO006',
      name: 'Attendance Alert',
      description: 'Alert manager when employee absent for 2+ consecutive days',
      trigger: 'Consecutive Absences',
      action: 'Alert Manager',
      isActive: true,
      category: 'Attendance',
      icon: Clock,
      color: 'bg-red-100 text-red-700'
    }
  ];

  const [rules, setRules] = useState(automationRules);

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 -mx-6 -mt-6 px-6 py-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/hrm')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Zap className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">HR Automation</h1>
                <p className="text-sm text-slate-600">Automate HR workflows and save time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Rules
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Automation Rule</DialogTitle>
                  <DialogDescription>Define a new automation workflow</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="rule-name">Rule Name</Label>
                    <Input id="rule-name" placeholder="Enter rule name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rule-description">Description</Label>
                    <Textarea id="rule-description" placeholder="Describe what this rule does..." rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rule-category">Category</Label>
                    <Select>
                      <SelectTrigger id="rule-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="attendance">Attendance</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="payroll">Payroll</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg space-y-4">
                    <h3 className="font-semibold text-slate-900">Workflow Configuration</h3>
                    <div className="space-y-2">
                      <Label htmlFor="rule-trigger">When (Trigger)</Label>
                      <Select>
                        <SelectTrigger id="rule-trigger">
                          <SelectValue placeholder="Select trigger event" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee-joined">Employee Joined</SelectItem>
                          <SelectItem value="leave-requested">Leave Requested</SelectItem>
                          <SelectItem value="expense-submitted">Expense Submitted</SelectItem>
                          <SelectItem value="birthday">Employee Birthday</SelectItem>
                          <SelectItem value="probation-end">Probation Ending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rule-action">Then (Action)</Label>
                      <Select>
                        <SelectTrigger id="rule-action">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="send-email">Send Email</SelectItem>
                          <SelectItem value="send-notification">Send Notification</SelectItem>
                          <SelectItem value="create-task">Create Task</SelectItem>
                          <SelectItem value="approve">Auto-Approve</SelectItem>
                          <SelectItem value="alert">Alert Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Rule</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{rules.length}</p>
                  <p className="text-xs text-slate-600">Total Rules</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {rules.filter(r => r.isActive).length}
                  </p>
                  <p className="text-xs text-slate-600">Active Rules</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">1,248</p>
                  <p className="text-xs text-slate-600">Actions Run</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Settings className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">85%</p>
                  <p className="text-xs text-slate-600">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Automation Rules Grid */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Automation Rules</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {rules.map((rule) => {
              const IconComponent = rule.icon;
              return (
                <Card key={rule.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${rule.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{rule.name}</h3>
                          <p className="text-xs text-slate-600 mb-2">{rule.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {rule.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-slate-600">WHEN:</span>
                        <Badge variant="outline" className="text-xs bg-white">
                          {rule.trigger}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-center mb-2">
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-600">THEN:</span>
                        <Badge variant="outline" className="text-xs bg-white">
                          {rule.action}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        {rule.isActive ? (
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Automation Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-slate-900">Successful</span>
                </div>
                <p className="text-2xl font-bold text-green-700">1,062</p>
                <p className="text-xs text-slate-600 mt-1">Actions completed successfully</p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-slate-900">Failed</span>
                </div>
                <p className="text-2xl font-bold text-red-700">32</p>
                <p className="text-xs text-slate-600 mt-1">Actions that encountered errors</p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-slate-900">Time Saved</span>
                </div>
                <p className="text-2xl font-bold text-blue-700">~142h</p>
                <p className="text-xs text-slate-600 mt-1">Estimated time saved this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
