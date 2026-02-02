import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Activity, AlertCircle, TrendingUp, Users, Monitor, Clock, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import StatsCard from '@/components/StatsCard';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface EmployeeSession {
  id: string;
  employeeName: string;
  avatar?: string;
  department: string;
  status: 'Active' | 'Idle' | 'Offline';
  activeApp: string;
  idleTime: number;
  productivityPercent: number;
  lastActivity: string;
}

interface Alert {
  id: string;
  employeeName: string;
  severity: 'High' | 'Medium' | 'Low';
  message: string;
  timestamp: string;
}

interface ProductivityData {
  day: string;
  productivity: number;
  active: number;
  idle: number;
}

export default function RemoteDeskMonitoring() {
  const [isDemoMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock employee sessions
  const sessions: EmployeeSession[] = [
    {
      id: '1',
      employeeName: 'Sarah Johnson',
      avatar: '',
      department: 'Engineering',
      status: 'Active',
      activeApp: 'VS Code',
      idleTime: 0,
      productivityPercent: 92,
      lastActivity: '2 minutes ago',
    },
    {
      id: '2',
      employeeName: 'Michael Chen',
      avatar: '',
      department: 'Design',
      status: 'Active',
      activeApp: 'Figma',
      idleTime: 0,
      productivityPercent: 88,
      lastActivity: '5 minutes ago',
    },
    {
      id: '3',
      employeeName: 'Emily Rodriguez',
      avatar: '',
      department: 'Marketing',
      status: 'Idle',
      activeApp: 'Chrome',
      idleTime: 15,
      productivityPercent: 65,
      lastActivity: '15 minutes ago',
    },
    {
      id: '4',
      employeeName: 'James Wilson',
      avatar: '',
      department: 'Sales',
      status: 'Active',
      activeApp: 'Salesforce',
      idleTime: 0,
      productivityPercent: 95,
      lastActivity: '1 minute ago',
    },
    {
      id: '5',
      employeeName: 'Lisa Anderson',
      avatar: '',
      department: 'HR',
      status: 'Idle',
      activeApp: 'Excel',
      idleTime: 8,
      productivityPercent: 72,
      lastActivity: '8 minutes ago',
    },
    {
      id: '6',
      employeeName: 'David Brown',
      avatar: '',
      department: 'Finance',
      status: 'Offline',
      activeApp: 'N/A',
      idleTime: 120,
      productivityPercent: 0,
      lastActivity: '2 hours ago',
    },
  ];

  const alerts: Alert[] = [
    {
      id: '1',
      employeeName: 'Emily Rodriguez',
      severity: 'Medium',
      message: 'Idle for more than 15 minutes',
      timestamp: '2 minutes ago',
    },
    {
      id: '2',
      employeeName: 'David Brown',
      severity: 'High',
      message: 'Offline for extended period',
      timestamp: '5 minutes ago',
    },
    {
      id: '3',
      employeeName: 'Lisa Anderson',
      severity: 'Low',
      message: 'Low productivity detected',
      timestamp: '10 minutes ago',
    },
  ];

  const productivityData: ProductivityData[] = [
    { day: 'Mon', productivity: 85, active: 7.2, idle: 0.8 },
    { day: 'Tue', productivity: 88, active: 7.5, idle: 0.5 },
    { day: 'Wed', productivity: 82, active: 6.8, idle: 1.2 },
    { day: 'Thu', productivity: 90, active: 7.8, idle: 0.2 },
    { day: 'Fri', productivity: 87, active: 7.4, idle: 0.6 },
    { day: 'Sat', productivity: 75, active: 6.0, idle: 2.0 },
    { day: 'Sun', productivity: 70, active: 5.5, idle: 2.5 },
  ];

  const activeCount = sessions.filter((s) => s.status === 'Active').length;
  const idleCount = sessions.filter((s) => s.status === 'Idle').length;
  const offlineCount = sessions.filter((s) => s.status === 'Offline').length;
  const avgProductivity =
    sessions.reduce((sum, s) => sum + s.productivityPercent, 0) / sessions.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'Idle':
        return 'bg-yellow-500';
      case 'Offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Idle':
        return 'outline';
      case 'Offline':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'outline';
      case 'Low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getProductivityColor = (percent: number) => {
    if (percent >= 85) return 'text-green-600';
    if (percent >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Remote Desk Monitoring</h1>
          <p className="text-muted-foreground">Real-time employee activity tracking</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{currentTime.toLocaleTimeString()}</p>
          <p className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Demo Mode Banner */}
      {isDemoMode && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertTitle>Demo Mode Active</AlertTitle>
          <AlertDescription>
            You're viewing simulated data. Real monitoring requires backend integration with
            employee devices.
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active"
          value={activeCount.toString()}
          description="Currently working"
          icon={Users}
        />
        <StatsCard
          title="Idle"
          value={idleCount.toString()}
          description="Inactive sessions"
          icon={Clock}
        />
        <StatsCard
          title="Offline"
          value={offlineCount.toString()}
          description="Not connected"
          icon={Monitor}
        />
        <StatsCard
          title="Avg Productivity"
          value={`${avgProductivity.toFixed(0)}%`}
          description="Team average"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Session Monitoring Grid */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Employee Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {sessions.map((session) => (
                  <Card key={session.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={session.avatar} />
                              <AvatarFallback>
                                {session.employeeName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
                                session.status
                              )}`}
                            ></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{session.employeeName}</h3>
                              <Badge variant={getStatusBadgeVariant(session.status)}>
                                {session.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{session.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-2xl font-bold ${getProductivityColor(
                              session.productivityPercent
                            )}`}
                          >
                            {session.productivityPercent}%
                          </p>
                          <p className="text-xs text-muted-foreground">Productivity</p>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Active App</p>
                          <p className="font-medium flex items-center gap-1">
                            <Monitor className="w-3 h-3" />
                            {session.activeApp}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Idle Time</p>
                          <p className="font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {session.idleTime === 0
                              ? 'Active'
                              : `${session.idleTime} min`}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Activity</p>
                          <p className="font-medium">{session.lastActivity}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Progress value={session.productivityPercent} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Alert System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {alert.timestamp}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{alert.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Team Size</span>
                  <span className="font-semibold">{sessions.length}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Online Rate</span>
                  <span className="font-semibold text-green-600">
                    {(((activeCount + idleCount) / sessions.length) * 100).toFixed(0)}%
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg Active Time</span>
                  <span className="font-semibold">7.2 hrs</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Alerts Today</span>
                  <span className="font-semibold text-orange-600">{alerts.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Productivity Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Productivity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Chart Visualization */}
            <div className="flex items-end justify-between gap-2 h-48">
              {productivityData.map((data) => (
                <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col gap-1">
                    {/* Active Time Bar */}
                    <div
                      className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                      style={{
                        height: `${(data.active / 8) * 100}%`,
                        minHeight: '20px',
                      }}
                      title={`Active: ${data.active}h`}
                    ></div>
                    {/* Idle Time Bar */}
                    <div
                      className="w-full bg-yellow-500 rounded-b transition-all hover:bg-yellow-600"
                      style={{
                        height: `${(data.idle / 8) * 100}%`,
                        minHeight: '10px',
                      }}
                      title={`Idle: ${data.idle}h`}
                    ></div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold">{data.day}</p>
                    <p className="text-xs text-muted-foreground">{data.productivity}%</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Active Time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">Idle Time</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm">Productivity %</span>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {(
                    productivityData.reduce((sum, d) => sum + d.active, 0) /
                    productivityData.length
                  ).toFixed(1)}
                  h
                </p>
                <p className="text-sm text-muted-foreground">Avg Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {(
                    productivityData.reduce((sum, d) => sum + d.idle, 0) /
                    productivityData.length
                  ).toFixed(1)}
                  h
                </p>
                <p className="text-sm text-muted-foreground">Avg Idle</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {(
                    productivityData.reduce((sum, d) => sum + d.productivity, 0) /
                    productivityData.length
                  ).toFixed(0)}
                  %
                </p>
                <p className="text-sm text-muted-foreground">Avg Productivity</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}
