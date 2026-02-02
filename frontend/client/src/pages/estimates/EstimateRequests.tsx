import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Search, Calendar, User, Mail, Phone, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

interface EstimateRequest {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  budget?: string;
  deadline?: string;
  status: "new" | "in-review" | "quoted" | "accepted" | "rejected";
  submittedAt: string;
}

export default function EstimateRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EstimateRequest | null>(null);
  const { toast } = useToast();

  const requests: EstimateRequest[] = [
    {
      id: "1",
      customerName: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1 (555) 123-4567",
      projectType: "Website Development",
      description: "Need a complete e-commerce website with payment integration",
      budget: "$5,000 - $10,000",
      deadline: "2026-02-28",
      status: "new",
      submittedAt: "2026-01-16 10:30 AM",
    },
    {
      id: "2",
      customerName: "Bob Williams",
      email: "bob@company.com",
      phone: "+1 (555) 234-5678",
      projectType: "Mobile App",
      description: "iOS and Android app for food delivery service",
      budget: "$15,000 - $25,000",
      deadline: "2026-03-15",
      status: "in-review",
      submittedAt: "2026-01-15 2:15 PM",
    },
    {
      id: "3",
      customerName: "Carol Martinez",
      email: "carol@startup.io",
      phone: "+1 (555) 345-6789",
      projectType: "CRM System",
      description: "Custom CRM with customer management and analytics",
      budget: "$10,000+",
      status: "quoted",
      submittedAt: "2026-01-14 9:45 AM",
    },
  ];

  const getStatusColor = (status: EstimateRequest["status"]) => {
    const colors = {
      new: "bg-blue-100 text-blue-800",
      "in-review": "bg-yellow-100 text-yellow-800",
      quoted: "bg-purple-100 text-purple-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return colors[status];
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.projectType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Estimate Requests</h1>
          <p className="text-muted-foreground">Manage customer estimate and quote requests</p>
        </div>
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">New Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter((r) => r.status === "new").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">In Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter((r) => r.status === "in-review").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quoted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter((r) => r.status === "quoted").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter((r) => r.status === "accepted").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer, email, or project type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Estimate Request</DialogTitle>
                    <DialogDescription>
                      Manually create a new estimate request
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer">
                        Customer Name <span className="text-red-500">*</span>
                      </Label>
                      <Input id="customer" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-type">
                        Project Type <span className="text-red-500">*</span>
                      </Label>
                      <Select>
                        <SelectTrigger id="project-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web">Website Development</SelectItem>
                          <SelectItem value="mobile">Mobile App</SelectItem>
                          <SelectItem value="crm">CRM System</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="custom">Custom Software</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input id="email" type="email" placeholder="email@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Input id="budget" placeholder="e.g., $5,000 - $10,000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Target Deadline</Label>
                      <Input id="deadline" type="date" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="description">
                        Project Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the project requirements..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Request Created",
                          description: "New estimate request has been created",
                        });
                        setDialogOpen(false);
                      }}
                    >
                      Create Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="grid gap-4">
          {filteredRequests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{request.projectType}</CardTitle>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <CardDescription>{request.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{request.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{request.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{request.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{request.submittedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-4 text-sm">
                      {request.budget && (
                        <div>
                          <span className="text-muted-foreground">Budget: </span>
                          <span className="font-medium">{request.budget}</span>
                        </div>
                      )}
                      {request.deadline && (
                        <div>
                          <span className="text-muted-foreground">Deadline: </span>
                          <span className="font-medium">{request.deadline}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setViewDialogOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                      <Select
                        defaultValue={request.status}
                        onValueChange={(value) => {
                          toast({
                            title: "Status Updated",
                            description: `Request marked as ${value}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in-review">In Review</SelectItem>
                          <SelectItem value="quoted">Quoted</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View Details Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Estimate Request Details</DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Customer Name</Label>
                    <p className="font-medium">{selectedRequest.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Project Type</Label>
                    <p className="font-medium">{selectedRequest.projectType}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedRequest.phone}</p>
                  </div>
                  {selectedRequest.budget && (
                    <div>
                      <Label className="text-muted-foreground">Budget</Label>
                      <p className="font-medium">{selectedRequest.budget}</p>
                    </div>
                  )}
                  {selectedRequest.deadline && (
                    <div>
                      <Label className="text-muted-foreground">Deadline</Label>
                      <p className="font-medium">{selectedRequest.deadline}</p>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-muted-foreground">Project Description</Label>
                  <p className="mt-2 text-sm">{selectedRequest.description}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-2">
                    <Badge className={getStatusColor(selectedRequest.status)}>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                Close
              </Button>
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Quote
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
