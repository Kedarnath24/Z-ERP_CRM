import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Edit,
  Trash2,
  Users,
  Send,
  CheckCircle2,
  Clock,
  TrendingUp,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { StepWizard, WhatsAppPreview } from "@/components/whatsapp";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  status: "draft" | "active" | "paused" | "completed";
  template: string;
  audience: number;
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  createdAt: string;
}

export default function MarketingCampaigns() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  // Static campaign data
  const campaigns: Campaign[] = [
    {
      id: "1",
      name: "Summer Sale 2026",
      status: "active",
      template: "summer_sale_promo",
      audience: 5000,
      sent: 4500,
      delivered: 4350,
      read: 3200,
      replied: 450,
      createdAt: "2026-01-10",
    },
    {
      id: "2",
      name: "New Product Launch",
      status: "completed",
      template: "product_launch",
      audience: 3000,
      sent: 3000,
      delivered: 2950,
      read: 2100,
      replied: 320,
      createdAt: "2026-01-05",
    },
    {
      id: "3",
      name: "Customer Feedback Survey",
      status: "paused",
      template: "feedback_request",
      audience: 2000,
      sent: 1200,
      delivered: 1150,
      read: 800,
      replied: 120,
      createdAt: "2026-01-12",
    },
    {
      id: "4",
      name: "Holiday Greeting",
      status: "draft",
      template: "holiday_wishes",
      audience: 8000,
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      createdAt: "2026-01-14",
    },
  ];

  const wizardSteps = [
    { id: 1, title: "Details", description: "Campaign info" },
    { id: 2, title: "Template", description: "Select template" },
    { id: 3, title: "Audience", description: "Target users" },
    { id: 4, title: "Customize", description: "Message content" },
    { id: 5, title: "Review", description: "Finalize" },
  ];

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const totalReach = campaigns.reduce((sum, c) => sum + c.delivered, 0);
  const totalRead = campaigns.reduce((sum, c) => sum + c.read, 0);
  const openRate = totalReach > 0 ? ((totalRead / totalReach) * 100).toFixed(1) : "0";

  const getStatusBadge = (status: Campaign["status"]) => {
    const variants = {
      draft: "bg-gray-100 text-gray-800",
      active: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return variants[status];
  };

  const handleCreateCampaign = () => {
    setShowCreateDialog(false);
    setCurrentStep(0);
    toast({
      title: "Campaign Created",
      description: "Your campaign has been created successfully",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCampaigns}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCampaigns}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReach.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Messages delivered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openRate}%</div>
              <p className="text-xs text-muted-foreground">Average read rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Campaigns</CardTitle>
                <CardDescription>Manage your WhatsApp marketing campaigns</CardDescription>
              </div>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Campaign</DialogTitle>
                    <DialogDescription>
                      Set up a new WhatsApp marketing campaign
                    </DialogDescription>
                  </DialogHeader>
                  <StepWizard
                    steps={wizardSteps}
                    currentStep={currentStep}
                    onStepChange={setCurrentStep}
                    onComplete={handleCreateCampaign}
                  >
                    {currentStep === 0 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Campaign Name</Label>
                          <Input placeholder="Enter campaign name" />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea placeholder="Brief description of the campaign" rows={3} />
                        </div>
                      </div>
                    )}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Select Template</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a template" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="promo1">Promotional - Sale Announcement</SelectItem>
                              <SelectItem value="promo2">Promotional - New Product</SelectItem>
                              <SelectItem value="util1">Utility - Order Update</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Card className="bg-muted">
                          <CardHeader>
                            <CardTitle className="text-sm">Template Preview</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">
                              🎉 Special Offer! Get {'{'}{'{'} discount {'}'}{'}'}% off on {'{'}{'{'} product {'}'}{'}'} . Shop now!
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Target Audience</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select audience" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Contacts (8,500)</SelectItem>
                              <SelectItem value="active">Active Users (5,200)</SelectItem>
                              <SelectItem value="segment">Custom Segment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Estimated Reach</span>
                                <span className="font-medium">8,500 contacts</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Expected Delivery</span>
                                <span className="font-medium">~8,200 (96%)</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Personalization</Label>
                          <Input placeholder="{{discount}}" defaultValue="25" />
                        </div>
                        <div className="space-y-2">
                          <Label>Product Name</Label>
                          <Input placeholder="{{product}}" defaultValue="Summer Collection" />
                        </div>
                        <WhatsAppPreview
                          messages={[
                            {
                              id: "1",
                              text: "🎉 Special Offer! Get 25% off on Summer Collection. Shop now!",
                              timestamp: "10:30 AM",
                              isOutgoing: true,
                              status: "delivered",
                            },
                          ]}
                        />
                      </div>
                    )}
                    {currentStep === 4 && (
                      <div className="space-y-4">
                        <Card className="bg-blue-50 border-blue-200">
                          <CardHeader>
                            <CardTitle className="text-blue-900">Campaign Summary</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-blue-700">Campaign Name:</span>
                              <span className="font-medium text-blue-900">Summer Sale 2026</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Template:</span>
                              <span className="font-medium text-blue-900">Promotional - Sale</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Audience:</span>
                              <span className="font-medium text-blue-900">8,500 contacts</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-700">Estimated Cost:</span>
                              <span className="font-medium text-blue-900">$85.00</span>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                              <div>
                                <p className="font-medium">Ready to Launch</p>
                                <p className="text-sm text-muted-foreground">
                                  Your campaign will be sent immediately after confirmation
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </StepWizard>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <Badge className={getStatusBadge(campaign.status)}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Template: {campaign.template}</span>
                            <span>•</span>
                            <span>Audience: {campaign.audience.toLocaleString()}</span>
                            <span>•</span>
                            <span>Created: {campaign.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      {campaign.status !== "draft" && (
                        <>
                          <Progress
                            value={(campaign.sent / campaign.audience) * 100}
                            className="mb-2"
                          />
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Sent</p>
                              <p className="font-medium">{campaign.sent.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Delivered</p>
                              <p className="font-medium">{campaign.delivered.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Read</p>
                              <p className="font-medium">{campaign.read.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Replied</p>
                              <p className="font-medium">{campaign.replied.toLocaleString()}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
