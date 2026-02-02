import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Calendar, Clock, User, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

interface Callback {
  id: string;
  customerName: string;
  phone: string;
  date: string;
  reason: string;
  status: "pending" | "completed" | "missed";
  notes?: string;
}

export default function Callbacks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const callbacks: Callback[] = [
    {
      id: "1",
      customerName: "Alice Johnson",
      phone: "+1 (555) 123-4567",
      date: "2026-01-16 10:00 AM",
      reason: "Product inquiry follow-up",
      status: "pending",
    },
    {
      id: "2",
      customerName: "Bob Williams",
      phone: "+1 (555) 234-5678",
      date: "2026-01-16 2:00 PM",
      reason: "Quote discussion",
      status: "pending",
    },
    {
      id: "3",
      customerName: "Carol Martinez",
      phone: "+1 (555) 345-6789",
      date: "2026-01-15 11:00 AM",
      reason: "Service feedback",
      status: "completed",
    },
  ];

  const getStatusColor = (status: Callback["status"]) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      missed: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Callback marked as ${newStatus}`,
    });
  };

  const filteredCallbacks = callbacks.filter((callback) => {
    const matchesSearch =
      callback.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      callback.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || callback.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Callbacks</h1>
          <p className="text-muted-foreground">Manage customer callback requests</p>
        </div>
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Callbacks List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Customer Callbacks
            </CardTitle>
            <CardDescription>Scheduled callback requests from customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">Customer Name</th>
                    <th className="p-3 text-left text-sm font-medium">Phone</th>
                    <th className="p-3 text-left text-sm font-medium">Date</th>
                    <th className="p-3 text-left text-sm font-medium">Reason</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                    <th className="p-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCallbacks.map((callback) => (
                    <motion.tr
                      key={callback.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{callback.customerName}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm">{callback.phone}</td>
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {callback.date}
                        </div>
                      </td>
                      <td className="p-3 text-sm">{callback.reason}</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(callback.status)}>{callback.status}</Badge>
                      </td>
                      <td className="p-3">
                        <Select
                          defaultValue={callback.status}
                          onValueChange={(value) => handleStatusChange(callback.id, value)}
                        >
                          <SelectTrigger className="w-[140px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Mark as Pending</SelectItem>
                            <SelectItem value="completed">Mark as Completed</SelectItem>
                            <SelectItem value="missed">Mark as Missed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Callbacks</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {callbacks.filter((c) => c.status === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {callbacks.filter((c) => c.status === "completed").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Missed Callbacks</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {callbacks.filter((c) => c.status === "missed").length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
