import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Shield, 
  TrendingUp, 
  FileText, 
  Plane, 
  Zap,
  UserCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useLocation } from 'wouter';

export default function HRMDashboard() {
  const [, setLocation] = useLocation();

  // Mock data
  const kpiStats = [
    { title: 'Total Employees', value: '248', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Active Employees', value: '235', icon: UserCheck, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'On Leave Today', value: '12', icon: Calendar, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { title: 'Payroll This Month', value: '$485K', icon: DollarSign, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { title: 'Pending Approvals', value: '18', icon: AlertCircle, color: 'text-orange-600', bgColor: 'bg-orange-100' }
  ];

  const hrmModules = [
    {
      icon: Users,
      title: 'Employee Management',
      description: 'Manage employee profiles, documents, and lifecycle',
      route: '/hrm/employees',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Calendar,
      title: 'Attendance & Leave',
      description: 'Track attendance, shifts, and manage leave requests',
      route: '/hrm/attendance',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: DollarSign,
      title: 'Payroll',
      description: 'Process salaries, statutory compliance, and payslips',
      route: '/hrm/payroll',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Shield,
      title: 'Insurance',
      description: 'Manage employee insurance policies and claims',
      route: '/hrm/insurance',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      icon: TrendingUp,
      title: 'Performance',
      description: 'Reviews, KPIs, appraisals, and goal tracking',
      route: '/hrm/performance',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: FileText,
      title: 'HR Letters',
      description: 'Generate offer letters, certificates, and NOCs',
      route: '/hrm/letters',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100'
    },
    {
      icon: Plane,
      title: 'Travel & Expense',
      description: 'Manage travel requests and expense reimbursements',
      route: '/hrm/travel-expense',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      icon: Zap,
      title: 'Automation',
      description: 'Automate HR workflows and notifications',
      route: '/hrm/automation',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">Human Resource Management</h1>
          <p className="text-sm text-slate-600">Manage employees, payroll, attendance, and HR operations</p>
        </div>

        {/* Top Statistics Bar */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {kpiStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Navigation Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {hrmModules.map((module, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setLocation(module.route)}
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-3 rounded-lg ${module.bgColor} group-hover:scale-110 transition-transform`}>
                    <module.icon className={`h-6 w-6 ${module.color}`} />
                  </div>
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <CardDescription className="text-sm text-slate-600">
                  {module.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Quick Stats Footer */}
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Recent Activity</p>
                <p className="text-xs text-slate-500">5 employees joined this week</p>
                <p className="text-xs text-slate-500">18 leave requests pending</p>
                <p className="text-xs text-slate-500">Payroll processed for January</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Upcoming Events</p>
                <p className="text-xs text-slate-500">Performance reviews: Jan 25</p>
                <p className="text-xs text-slate-500">Insurance renewal: Feb 1</p>
                <p className="text-xs text-slate-500">Team meeting: Jan 20</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Action Items</p>
                <p className="text-xs text-slate-500">Process monthly payroll</p>
                <p className="text-xs text-slate-500">Review probation confirmations</p>
                <p className="text-xs text-slate-500">Update insurance policies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
