import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Users,
  Bot,
  UserCheck,
  Download,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

export default function BotAnalytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const { toast } = useToast();

  // Static data for charts
  const messageVolumeData = [
    { date: "Jan 10", messages: 245, automated: 180 },
    { date: "Jan 11", messages: 312, automated: 235 },
    { date: "Jan 12", messages: 289, automated: 210 },
    { date: "Jan 13", messages: 356, automated: 280 },
    { date: "Jan 14", messages: 423, automated: 340 },
    { date: "Jan 15", messages: 391, automated: 305 },
    { date: "Jan 16", messages: 478, automated: 385 },
  ];

  const responseTimeData = [
    { hour: "00:00", avgTime: 45 },
    { hour: "04:00", avgTime: 38 },
    { hour: "08:00", avgTime: 52 },
    { hour: "12:00", avgTime: 65 },
    { hour: "16:00", avgTime: 58 },
    { hour: "20:00", avgTime: 42 },
  ];

  const messageTypeData = [
    { name: "Text", value: 2847, color: "#3B82F6" },
    { name: "Interactive", value: 1523, color: "#8B5CF6" },
    { name: "Media", value: 892, color: "#10B981" },
    { name: "Document", value: 456, color: "#F59E0B" },
  ];

  const conversationStatusData = [
    { name: "Bot Handled", value: 3245, color: "#8B5CF6" },
    { name: "Agent Takeover", value: 892, color: "#3B82F6" },
    { name: "Pending", value: 234, color: "#F59E0B" },
    { name: "Closed", value: 1567, color: "#10B981" },
  ];

  const botFlowPerformance = [
    { flow: "Welcome Flow", completions: 1234, dropoffs: 45, avgTime: "2.3min" },
    { flow: "Order Tracking", completions: 892, dropoffs: 23, avgTime: "1.8min" },
    { flow: "Product Inquiry", completions: 567, dropoffs: 67, avgTime: "3.1min" },
    { flow: "Support Request", completions: 445, dropoffs: 89, avgTime: "4.2min" },
    { flow: "Feedback Collection", completions: 234, dropoffs: 12, avgTime: "1.5min" },
  ];

  const handleExport = (format: string) => {
    toast({
      title: "Exporting Analytics",
      description: `Preparing ${format.toUpperCase()} export...`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+12.5% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+8.2% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bot Automation Rate</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>+3.1% from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Handoff Rate</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">21.5%</div>
              <div className="flex items-center text-xs text-red-600 mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                <span>-2.3% from last period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="flows">Bot Flows</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Message Volume Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Message Volume
                  </CardTitle>
                  <CardDescription>Daily message traffic overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={messageVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="messages"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        name="Total Messages"
                      />
                      <Line
                        type="monotone"
                        dataKey="automated"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        name="Automated"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Response Time Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Average Response Time
                  </CardTitle>
                  <CardDescription>Response time by hour (seconds)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={responseTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgTime" fill="#10B981" name="Avg Response (s)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Message Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Message Type Distribution
                  </CardTitle>
                  <CardDescription>Breakdown by message type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={messageTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {messageTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {messageTypeData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">
                          {item.name}: {item.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Conversation Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Conversation Status
                  </CardTitle>
                  <CardDescription>Current status distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={conversationStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {conversationStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {conversationStatusData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">
                          {item.name}: {item.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="flows" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bot Flow Performance</CardTitle>
                <CardDescription>Completion rates and drop-off points for each flow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {botFlowPerformance.map((flow) => {
                    const completionRate = (
                      (flow.completions / (flow.completions + flow.dropoffs)) *
                      100
                    ).toFixed(1);
                    return (
                      <div key={flow.flow} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{flow.flow}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>{flow.completions} completions</span>
                              <span>•</span>
                              <span>{flow.dropoffs} drop-offs</span>
                              <span>•</span>
                              <span>Avg: {flow.avgTime}</span>
                            </div>
                          </div>
                          <Badge
                            className={
                              parseFloat(completionRate) >= 90
                                ? "bg-green-100 text-green-800"
                                : parseFloat(completionRate) >= 70
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {completionRate}% Complete
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              parseFloat(completionRate) >= 90
                                ? "bg-green-500"
                                : parseFloat(completionRate) >= 70
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Flows</CardTitle>
                  <CardDescription>Highest completion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {botFlowPerformance
                      .sort((a, b) => {
                        const rateA = a.completions / (a.completions + a.dropoffs);
                        const rateB = b.completions / (b.completions + b.dropoffs);
                        return rateB - rateA;
                      })
                      .slice(0, 3)
                      .map((flow, index) => (
                        <div key={flow.flow} className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              index === 0
                                ? "bg-yellow-100 text-yellow-800"
                                : index === 1
                                ? "bg-gray-100 text-gray-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{flow.flow}</p>
                            <p className="text-sm text-muted-foreground">
                              {(
                                (flow.completions / (flow.completions + flow.dropoffs)) *
                                100
                              ).toFixed(1)}
                              % completion rate
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Needs Attention</CardTitle>
                  <CardDescription>Flows with highest drop-off rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {botFlowPerformance
                      .sort((a, b) => {
                        const dropRateA = a.dropoffs / (a.completions + a.dropoffs);
                        const dropRateB = b.dropoffs / (b.completions + b.dropoffs);
                        return dropRateB - dropRateA;
                      })
                      .slice(0, 3)
                      .map((flow) => (
                        <div key={flow.flow} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{flow.flow}</p>
                            <p className="text-sm text-muted-foreground">
                              {flow.dropoffs} drop-offs ({((flow.dropoffs / (flow.completions + flow.dropoffs)) * 100).toFixed(1)}%)
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
