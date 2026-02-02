import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, DollarSign, MessageSquare, UserPlus, UserCheck, Kanban, UserCircle, MessagesSquare, FolderTree } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import LeadsModule from "./leads";
import CustomersListModule from "./customers-list";
import CommunicationLogModule from "./communication-log";

export default function CustomersDashboard() {
  const [activeTab, setActiveTab] = useState("leads");

  // KPI Data
  const kpiData = [
    {
      title: "Total Leads",
      value: "342",
      description: "in sales pipeline",
      icon: UserPlus,
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      title: "Active Customers",
      value: "156",
      description: "current accounts",
      icon: UserCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pipeline Value",
      value: "$2.4M",
      description: "estimated revenue",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Conversations Logged",
      value: "1,248",
      description: "this month",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-6 w-6 text-teal-600" />
            <h1 className="text-3xl font-bold">Customers</h1>
          </div>
          <p className="text-slate-600">
            Manage leads, customers, and communications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
          <Button size="sm">
            <UserCheck className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-slate-600">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Link href="/customers/groups">
              <Button variant="outline" size="sm">
                <FolderTree className="h-4 w-4 mr-2" />
                Customer Groups
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Kanban className="h-4 w-4" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            Customers
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <MessagesSquare className="h-4 w-4" />
            Communication Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <LeadsModule />
        </TabsContent>

        <TabsContent value="customers">
          <CustomersListModule />
        </TabsContent>

        <TabsContent value="communication">
          <CommunicationLogModule />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
