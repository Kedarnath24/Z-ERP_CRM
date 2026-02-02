import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Users,
  CheckSquare,
  AlertCircle,
  Clock,
  DollarSign,
  Package,
  FileText,
  Activity,
  Calendar as CalendarIcon,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Zap,
  AlertTriangle,
  Target,
  BarChart3,
  LineChart,
  PieChart,
  Settings
} from 'lucide-react';
import { BarChart, Bar, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Area, AreaChart, Tooltip } from 'recharts';

export default function DashboardOverview() {
  const [dateRange, setDateRange] = useState('month');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock data
  const kpiStats = [
    { title: 'Projects', value: '28', icon: Target, change: '+12%', trend: 'up', subtitle: 'last 30 days' },
    { title: 'Tasks', value: '156', icon: CheckSquare, change: '+23%', trend: 'up', subtitle: 'active items' },
    { title: 'Contacts', value: '342', icon: Users, change: '+8%', trend: 'up', subtitle: 'total contacts' },
    { title: 'Overdue Tasks', value: '7', icon: AlertCircle, change: '-3%', trend: 'down', subtitle: 'needs attention' }
  ];

  const performanceHighlights = [
    { 
      icon: Zap, 
      title: 'Performance Boost', 
      description: 'System efficiency increased by 34%',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200'
    },
    { 
      icon: AlertTriangle, 
      title: 'Low Stock Alert', 
      description: '12 items below minimum threshold',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200'
    },
    { 
      icon: Clock, 
      title: 'Overdue Invoices', 
      description: '5 invoices pending payment',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200'
    }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 42000, expenses: 28000, profit: 14000 },
    { month: 'Feb', revenue: 51000, expenses: 32000, profit: 19000 },
    { month: 'Mar', revenue: 48000, expenses: 30000, profit: 18000 },
    { month: 'Apr', revenue: 62000, expenses: 35000, profit: 27000 },
    { month: 'May', revenue: 58000, expenses: 33000, profit: 25000 },
    { month: 'Jun', revenue: 71000, expenses: 38000, profit: 33000 }
  ];

  const salesPipelineData = [
    { stage: 'Lead', value: 45, color: 'hsl(217, 91%, 60%)' },
    { stage: 'Qualified', value: 32, color: 'hsl(142, 71%, 45%)' },
    { stage: 'Proposal', value: 28, color: 'hsl(280, 65%, 60%)' },
    { stage: 'Negotiation', value: 18, color: 'hsl(39, 96%, 60%)' },
    { stage: 'Closed', value: 52, color: 'hsl(142, 76%, 36%)' }
  ];

  const weeklyPerformanceData = [
    { day: 'Mon', team1: 85, team2: 72, team3: 68 },
    { day: 'Tue', team1: 78, team2: 80, team3: 75 },
    { day: 'Wed', team1: 92, team2: 88, team3: 82 },
    { day: 'Thu', team1: 88, team2: 85, team3: 79 },
    { day: 'Fri', team1: 95, team2: 91, team3: 88 }
  ];

  const projectStatusData = [
    { name: 'Completed', value: 45, color: 'hsl(142, 76%, 36%)' },
    { name: 'In Progress', value: 28, color: 'hsl(217, 91%, 60%)' },
    { name: 'Pending', value: 18, color: 'hsl(39, 96%, 60%)' },
    { name: 'Overdue', value: 9, color: 'hsl(0, 84%, 60%)' }
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created new project', time: '2 minutes ago', icon: Target, color: 'text-blue-600' },
    { id: 2, user: 'Sarah Smith', action: 'Completed task: Design Review', time: '15 minutes ago', icon: CheckSquare, color: 'text-green-600' },
    { id: 3, user: 'Mike Johnson', action: 'Updated invoice #INV-2024', time: '1 hour ago', icon: FileText, color: 'text-purple-600' },
    { id: 4, user: 'Emily Davis', action: 'Added new contact', time: '2 hours ago', icon: Users, color: 'text-orange-600' },
    { id: 5, user: 'Alex Brown', action: 'Scheduled meeting', time: '3 hours ago', icon: CalendarIcon, color: 'text-indigo-600' }
  ];

  const revenueInsights = [
    { label: 'Subscriptions', amount: 42500, percentage: 45, color: 'bg-blue-500' },
    { label: 'Services', amount: 35800, percentage: 38, color: 'bg-green-500' },
    { label: 'Products', amount: 16200, percentage: 17, color: 'bg-purple-500' }
  ];

  const taskData = [
    { id: 1, name: 'Complete Q1 Financial Report', status: 'in-progress', dueDate: '2026-01-20', priority: 'high', assignee: 'John Doe' },
    { id: 2, name: 'Update Client Database', status: 'pending', dueDate: '2026-01-18', priority: 'medium', assignee: 'Sarah Smith' },
    { id: 3, name: 'Review Purchase Orders', status: 'completed', dueDate: '2026-01-15', priority: 'low', assignee: 'Mike Johnson' },
    { id: 4, name: 'Inventory Stock Check', status: 'in-progress', dueDate: '2026-01-22', priority: 'high', assignee: 'Emily Davis' },
    { id: 5, name: 'Monthly Team Meeting', status: 'pending', dueDate: '2026-01-19', priority: 'medium', assignee: 'Alex Brown' }
  ];

  const statusConfig = {
    completed: { label: 'Completed', class: 'bg-green-100 text-green-700 border-green-200' },
    'in-progress': { label: 'In Progress', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
  };

  const priorityConfig = {
    high: { label: 'High', class: 'bg-red-100 text-red-700 border-red-200' },
    medium: { label: 'Medium', class: 'bg-orange-100 text-orange-700 border-orange-200' },
    low: { label: 'Low', class: 'bg-slate-100 text-slate-700 border-slate-200' }
  };

  const calendarEvents = [
    { date: new Date(2026, 0, 16), type: 'event', title: 'Team Meeting' },
    { date: new Date(2026, 0, 18), type: 'holiday', title: 'Holiday' },
    { date: new Date(2026, 0, 20), type: 'meeting', title: 'Client Call' },
    { date: new Date(2026, 0, 25), type: 'event', title: 'Project Review' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 1️⃣ HEADER SECTION */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-sm text-slate-600 mt-1">Monitor your business performance and key metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 2️⃣ KPI SUMMARY CARDS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                  {stat.trend === 'up' ? (
                    <ArrowUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  <span className="text-slate-500">{stat.subtitle}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 3️⃣ PERFORMANCE HIGHLIGHT CARDS */}
        <div className="grid gap-4 md:grid-cols-3">
          {performanceHighlights.map((highlight, index) => (
            <Card key={index} className={`border ${highlight.borderColor}`}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`p-2 rounded-lg ${highlight.bgColor}`}>
                  <highlight.icon className={`h-5 w-5 ${highlight.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-slate-900">{highlight.title}</h3>
                  <p className="text-xs text-slate-600">{highlight.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 4️⃣ REVENUE OVERVIEW */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue, expenses, and profit analysis</CardDescription>
              </div>
              <Select defaultValue="6months">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="12months">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(217, 91%, 60%)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" stroke="hsl(0, 84%, 60%)" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2} />
                  <Area type="monotone" dataKey="profit" stroke="hsl(142, 76%, 36%)" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 5️⃣ ANALYTICS GRID */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Sales Pipeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sales Pipeline</CardTitle>
                <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                  Total: 175
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesPipelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="stage" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="hsl(217, 91%, 60%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={weeklyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="team1" stroke="hsl(217, 91%, 60%)" strokeWidth={2} name="Team A" />
                    <Line type="monotone" dataKey="team2" stroke="hsl(142, 71%, 45%)" strokeWidth={2} name="Team B" />
                    <Line type="monotone" dataKey="team3" stroke="hsl(280, 65%, 60%)" strokeWidth={2} name="Team C" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 6️⃣ PROJECT STATUS & 7️⃣ ACTIVITY/INSIGHTS */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Project Status */}
          <Card>
            <CardHeader>
              <CardTitle>Project Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {projectStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-600">{item.name}</span>
                    </div>
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                      {item.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Latest Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Latest Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-slate-100`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{activity.user}</p>
                        <p className="text-xs text-slate-600">{activity.action}</p>
                        <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Revenue Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900">$94.5K</span>
                    <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                      <ArrowUp className="h-3 w-3" />
                      +12.5%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Total revenue this month</p>
                </div>
                <div className="space-y-3 mt-6">
                  {revenueInsights.map((insight, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{insight.label}</span>
                        <span className="text-sm font-semibold text-slate-900">
                          ${(insight.amount / 1000).toFixed(1)}K
                        </span>
                      </div>
                      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute h-full ${insight.color} transition-all`}
                          style={{ width: `${insight.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{insight.percentage}% of total</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 8️⃣ TASK TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Track and manage your team's tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taskData.map((task) => (
                  <TableRow key={task.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[task.status].class}>
                        {statusConfig[task.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={priorityConfig[task.priority].class}>
                        {priorityConfig[task.priority].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.assignee}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 9️⃣ CALENDAR SECTION */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>View your scheduled events and meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 mb-3">Legend</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500" />
                      <span className="text-sm text-slate-600">Events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span className="text-sm text-slate-600">Holidays</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500" />
                      <span className="text-sm text-slate-600">Meetings</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 mb-3">Upcoming Events</h3>
                  <div className="space-y-2">
                    <Card className="p-3 border-l-4 border-l-blue-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900">Team Meeting</p>
                          <p className="text-xs text-slate-600">Jan 16, 2026 • 10:00 AM</p>
                        </div>
                        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                          Event
                        </Badge>
                      </div>
                    </Card>
                    <Card className="p-3 border-l-4 border-l-purple-500">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900">Client Call</p>
                          <p className="text-xs text-slate-600">Jan 20, 2026 • 2:00 PM</p>
                        </div>
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                          Meeting
                        </Badge>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
