import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RefreshCw, DollarSign, TrendingUp, Users, AlertCircle, Plus,
  Search, Filter, Calendar, CreditCard, CheckCircle, XCircle,
  Clock, Send, FileText, Settings, Bell, Download, Eye, Edit
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  activeSubscribers: number;
  status: "active" | "archived";
}

interface CustomerSubscription {
  id: string;
  customer: string;
  plan: string;
  status: "active" | "suspended" | "expired" | "trial";
  startDate: string;
  nextBilling: string;
  amount: number;
  autoRenew: boolean;
}

export default function SubscriptionManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<CustomerSubscription | null>(null);

  const plans: SubscriptionPlan[] = [
    {
      id: "1",
      name: "Basic Plan",
      description: "Perfect for small businesses",
      price: 29,
      billingCycle: "monthly",
      features: ["Up to 10 users", "5GB storage", "Email support", "Basic analytics"],
      activeSubscribers: 124,
      status: "active"
    },
    {
      id: "2",
      name: "Professional Plan",
      description: "For growing companies",
      price: 79,
      billingCycle: "monthly",
      features: ["Up to 50 users", "50GB storage", "Priority support", "Advanced analytics", "API access"],
      activeSubscribers: 87,
      status: "active"
    },
    {
      id: "3",
      name: "Enterprise Plan",
      description: "Unlimited everything",
      price: 199,
      billingCycle: "monthly",
      features: ["Unlimited users", "Unlimited storage", "24/7 phone support", "Custom integrations", "Dedicated account manager"],
      activeSubscribers: 34,
      status: "active"
    }
  ];

  const subscriptions: CustomerSubscription[] = [
    {
      id: "1",
      customer: "Acme Corporation",
      plan: "Professional Plan",
      status: "active",
      startDate: "Jan 1, 2025",
      nextBilling: "Feb 1, 2026",
      amount: 79,
      autoRenew: true
    },
    {
      id: "2",
      customer: "Tech Solutions Inc",
      plan: "Enterprise Plan",
      status: "active",
      startDate: "Dec 15, 2024",
      nextBilling: "Jan 15, 2026",
      amount: 199,
      autoRenew: true
    },
    {
      id: "3",
      customer: "StartUp Labs",
      plan: "Basic Plan",
      status: "trial",
      startDate: "Jan 10, 2026",
      nextBilling: "Jan 24, 2026",
      amount: 0,
      autoRenew: false
    },
    {
      id: "4",
      customer: "Global Retail",
      plan: "Professional Plan",
      status: "expired",
      startDate: "Nov 1, 2024",
      nextBilling: "Jan 1, 2026",
      amount: 79,
      autoRenew: false
    },
    {
      id: "5",
      customer: "Innovation Corp",
      plan: "Basic Plan",
      status: "suspended",
      startDate: "Oct 5, 2024",
      nextBilling: "Dec 5, 2025",
      amount: 29,
      autoRenew: true
    }
  ];

  const stats = [
    { label: "Total Subscriptions", value: "245", change: "+12%", icon: Users, color: "text-indigo-600" },
    { label: "Active Subscribers", value: "218", change: "+8%", icon: CheckCircle, color: "text-green-600" },
    { label: "Expiring Soon", value: "15", change: "-3%", icon: AlertCircle, color: "text-amber-600" },
    { label: "Monthly Revenue", value: "$18.4K", change: "+15%", icon: DollarSign, color: "text-blue-600" }
  ];

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "trial":
        return "bg-blue-500";
      case "suspended":
        return "bg-amber-500";
      case "expired":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDaysUntilBilling = (nextBilling: string) => {
    const today = new Date();
    const billing = new Date(nextBilling);
    const diffTime = billing.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage recurring billing and service access</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setPlanModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Plan
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <span className="text-sm text-green-600">{stat.change}</span>
                    </div>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="catalog" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto">
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
            <TabsTrigger value="renewals">Renewals</TabsTrigger>
            <TabsTrigger value="gating">Service Gating</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Catalog Tab */}
          <TabsContent value="catalog" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className="bg-white/70 backdrop-blur-sm border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-amber-500/10 rounded-bl-full"></div>
                  <CardContent className="p-6 relative">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                          <Badge className="bg-green-500">{plan.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{plan.description}</p>
                      </div>
                      
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-500">/{plan.billingCycle === "monthly" ? "mo" : "yr"}</span>
                      </div>

                      <div className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Active Subscribers</span>
                          <span className="font-semibold text-gray-900">{plan.activeSubscribers}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Customer Subscriptions</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredSubscriptions.map((sub) => {
                    const daysUntil = getDaysUntilBilling(sub.nextBilling);
                    return (
                      <Card
                        key={sub.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => {
                          setSelectedSubscription(sub);
                          setSubscriptionModalOpen(true);
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{sub.customer}</h3>
                                <Badge className={getStatusColor(sub.status)}>
                                  {sub.status}
                                </Badge>
                                {sub.autoRenew && (
                                  <Badge variant="outline" className="text-xs">
                                    <RefreshCw className="w-3 h-3 mr-1" />
                                    Auto-renew
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{sub.plan}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">
                                ${sub.amount}{sub.status === "trial" && <span className="text-sm text-gray-500">/trial</span>}
                              </p>
                              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {sub.status === "expired" ? "Expired" : `${daysUntil} days`}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Started: {sub.startDate}</span>
                              <span>Next billing: {sub.nextBilling}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoicing Tab */}
          <TabsContent value="invoicing" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Automated Invoicing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-green-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Invoices This Month</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">156</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Paid Invoices</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">142</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-amber-50">
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600">Pending Payment</p>
                        <p className="text-2xl font-bold text-amber-600 mt-1">14</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="border rounded-lg divide-y">
                    {[
                      { invoice: "INV-2026-001", customer: "Acme Corp", amount: 79, status: "paid", date: "Jan 1, 2026" },
                      { invoice: "INV-2026-002", customer: "Tech Solutions", amount: 199, status: "paid", date: "Jan 1, 2026" },
                      { invoice: "INV-2026-003", customer: "Global Retail", amount: 79, status: "pending", date: "Jan 2, 2026" },
                      { invoice: "INV-2026-004", customer: "Innovation Corp", amount: 29, status: "overdue", date: "Dec 5, 2025" }
                    ].map((inv, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-100 rounded flex items-center justify-center">
                            <FileText className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{inv.invoice}</p>
                            <p className="text-sm text-gray-500">{inv.customer}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${inv.amount}</p>
                            <p className="text-xs text-gray-500">{inv.date}</p>
                          </div>
                          <Badge
                            className={
                              inv.status === "paid"
                                ? "bg-green-500"
                                : inv.status === "pending"
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }
                          >
                            {inv.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Renewals Tab */}
          <TabsContent value="renewals" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-indigo-600" />
                  Upcoming Renewals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subscriptions
                    .filter(sub => sub.status === "active" || sub.status === "trial")
                    .sort((a, b) => getDaysUntilBilling(a.nextBilling) - getDaysUntilBilling(b.nextBilling))
                    .map((sub) => {
                      const daysUntil = getDaysUntilBilling(sub.nextBilling);
                      const isUrgent = daysUntil <= 7;
                      return (
                        <Card key={sub.id} className={isUrgent ? "border-amber-500 border-2" : ""}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                  isUrgent ? "bg-amber-100" : "bg-indigo-100"
                                }`}>
                                  <Clock className={`w-6 h-6 ${isUrgent ? "text-amber-600" : "text-indigo-600"}`} />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{sub.customer}</p>
                                  <p className="text-sm text-gray-500">{sub.plan}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">{daysUntil}</p>
                                <p className="text-sm text-gray-500">days left</p>
                                {isUrgent && (
                                  <Badge className="mt-1 bg-amber-500">
                                    <Bell className="w-3 h-3 mr-1" />
                                    Urgent
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${isUrgent ? "bg-amber-500" : "bg-indigo-600"}`}
                                style={{ width: `${Math.max(10, 100 - (daysUntil * 3))}%` }}
                              ></div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Gating Tab */}
          <TabsContent value="gating" className="space-y-4">
            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  Service Access Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Automatically restrict or grant access to services based on subscription status
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">Active Subscriptions</h3>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-3xl font-bold text-green-600">218</p>
                        <p className="text-sm text-gray-500 mt-1">Full access granted</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">Restricted Access</h3>
                          <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-3xl font-bold text-red-600">27</p>
                        <p className="text-sm text-gray-500 mt-1">Limited or blocked</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="border rounded-lg divide-y">
                    {[
                      { customer: "Acme Corp", plan: "Professional", access: "full", features: 45 },
                      { customer: "Tech Solutions", plan: "Enterprise", access: "full", features: 78 },
                      { customer: "StartUp Labs", plan: "Basic (Trial)", access: "limited", features: 12 },
                      { customer: "Global Retail", plan: "Professional", access: "suspended", features: 0 },
                      { customer: "Innovation Corp", plan: "Basic", access: "suspended", features: 0 }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{item.customer}</p>
                          <p className="text-sm text-gray-500">{item.plan}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Active Features</p>
                            <p className="text-lg font-bold text-gray-900">{item.features}</p>
                          </div>
                          <Badge
                            className={
                              item.access === "full"
                                ? "bg-green-500"
                                : item.access === "limited"
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }
                          >
                            {item.access}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Revenue Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">This Month</span>
                      <span className="text-2xl font-bold text-gray-900">$18,420</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Month</span>
                      <span className="text-2xl font-bold text-gray-600">$16,050</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Growth</span>
                      <span className="text-2xl font-bold text-green-600">+14.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-600" />
                    Subscriber Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Basic Plan</span>
                        <span className="font-semibold">124 (51%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "51%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Professional Plan</span>
                        <span className="font-semibold">87 (36%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: "36%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Enterprise Plan</span>
                        <span className="font-semibold">34 (13%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "13%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Churn Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">2.4%</p>
                    <p className="text-xs text-green-600 mt-1">-0.5% from last month</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">MRR Growth</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">8.2%</p>
                    <p className="text-xs text-green-600 mt-1">+1.3% from last month</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ARPU</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">$75</p>
                    <p className="text-xs text-green-600 mt-1">+$3 from last month</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">LTV</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">$2,250</p>
                    <p className="text-xs text-green-600 mt-1">+$150 from last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Subscription Details Modal */}
        <Dialog open={subscriptionModalOpen} onOpenChange={setSubscriptionModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Subscription Details</DialogTitle>
            </DialogHeader>
            {selectedSubscription && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-semibold text-gray-900">{selectedSubscription.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Plan</p>
                    <p className="font-semibold text-gray-900">{selectedSubscription.plan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className={getStatusColor(selectedSubscription.status)}>
                      {selectedSubscription.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold text-gray-900">${selectedSubscription.amount}/month</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-semibold text-gray-900">{selectedSubscription.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Billing</p>
                    <p className="font-semibold text-gray-900">{selectedSubscription.nextBilling}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    {selectedSubscription.autoRenew ? (
                      <>
                        <RefreshCw className="w-5 h-5 text-green-600" />
                        <span className="text-green-600 font-medium">Auto-renewal enabled</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-amber-600" />
                        <span className="text-amber-600 font-medium">Auto-renewal disabled</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    Suspend
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Change Plan
                  </Button>
                  <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                    View Invoices
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Plan Modal */}
        <Dialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Subscription Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Plan Name</label>
                  <Input placeholder="e.g., Premium Plan" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Price</label>
                  <Input type="number" placeholder="99" className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Input placeholder="Short description of the plan" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Billing Cycle</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Features</label>
                <div className="space-y-2">
                  <Input placeholder="Feature 1" />
                  <Input placeholder="Feature 2" />
                  <Input placeholder="Feature 3" />
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPlanModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Create Plan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
