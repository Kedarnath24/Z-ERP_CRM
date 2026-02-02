import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, Send, Image, Paperclip, Smile, Phone, Video,
  Search, MoreVertical, CheckCheck, Clock, X, Plus, TrendingUp,
  Users, Target, BarChart3, Zap, FileText, Calendar, Settings
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
  status: "online" | "offline";
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sent: boolean;
  status: "sent" | "delivered" | "read";
  type: "text" | "image" | "file";
}

export default function WhatsAppIntegration() {
  const [selectedMode, setSelectedMode] = useState<"waha" | "waba" | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Acme Corporation",
      lastMessage: "Thanks for the quick response!",
      timestamp: "2m ago",
      unread: 2,
      avatar: "AC",
      status: "online"
    },
    {
      id: "2",
      name: "Global Tech Solutions",
      lastMessage: "Can we schedule a demo?",
      timestamp: "15m ago",
      unread: 0,
      avatar: "GT",
      status: "offline"
    },
    {
      id: "3",
      name: "Innovation Labs",
      lastMessage: "Perfect, looking forward to it",
      timestamp: "1h ago",
      unread: 1,
      avatar: "IL",
      status: "online"
    }
  ];

  const messages: Message[] = [
    {
      id: "1",
      content: "Hello! I'm interested in your products.",
      timestamp: "10:30 AM",
      sent: false,
      status: "read",
      type: "text"
    },
    {
      id: "2",
      content: "Hi! Thank you for reaching out. I'd be happy to help you. What products are you interested in?",
      timestamp: "10:32 AM",
      sent: true,
      status: "read",
      type: "text"
    },
    {
      id: "3",
      content: "I'm looking for your enterprise software solutions.",
      timestamp: "10:35 AM",
      sent: false,
      status: "read",
      type: "text"
    },
    {
      id: "4",
      content: "Great choice! Let me send you our product catalog.",
      timestamp: "10:36 AM",
      sent: true,
      status: "delivered",
      type: "text"
    }
  ];

  const templates = [
    {
      id: "1",
      name: "Welcome Message",
      category: "Marketing",
      status: "approved",
      language: "English",
      content: "Welcome to {{company_name}}! We're excited to have you with us."
    },
    {
      id: "2",
      name: "Order Confirmation",
      category: "Transactional",
      status: "approved",
      language: "English",
      content: "Your order #{{order_id}} has been confirmed. Expected delivery: {{delivery_date}}"
    },
    {
      id: "3",
      name: "Appointment Reminder",
      category: "Utility",
      status: "pending",
      language: "English",
      content: "Reminder: You have an appointment scheduled for {{date}} at {{time}}"
    }
  ];

  const campaigns = [
    {
      id: "1",
      name: "Product Launch Campaign",
      status: "active",
      sent: 1234,
      delivered: 1198,
      read: 856,
      replied: 124,
      date: "Jan 10, 2026"
    },
    {
      id: "2",
      name: "Holiday Promotion",
      status: "completed",
      sent: 2456,
      delivered: 2401,
      read: 1876,
      replied: 312,
      date: "Dec 25, 2025"
    },
    {
      id: "3",
      name: "Customer Feedback Request",
      status: "scheduled",
      sent: 0,
      delivered: 0,
      read: 0,
      replied: 0,
      date: "Jan 20, 2026"
    }
  ];

  const wahaStats = [
    { label: "Active Chats", value: "24", icon: MessageCircle, color: "text-indigo-600" },
    { label: "Messages Today", value: "342", icon: Send, color: "text-amber-600" },
    { label: "Avg Response Time", value: "2.3m", icon: Clock, color: "text-green-600" },
    { label: "Satisfaction Rate", value: "94%", icon: TrendingUp, color: "text-blue-600" }
  ];

  const wabaStats = [
    { label: "Active Campaigns", value: "8", icon: Target, color: "text-indigo-600" },
    { label: "Messages Sent", value: "12.4K", icon: Send, color: "text-amber-600" },
    { label: "Delivery Rate", value: "97.2%", icon: CheckCheck, color: "text-green-600" },
    { label: "Response Rate", value: "18.5%", icon: TrendingUp, color: "text-blue-600" }
  ];

  if (!selectedMode) {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WhatsApp Integration</h1>
            <p className="text-sm text-gray-500 mt-1">Choose your integration mode</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12">
            <Card
              className="bg-white/70 backdrop-blur-sm border-gray-200 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300"
              onClick={() => setSelectedMode("waha")}
            >
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">WAHA</h2>
                    <p className="text-sm text-gray-500 mt-1">WhatsApp HTTP API</p>
                  </div>
                  <p className="text-gray-600">
                    Live chat interface for real-time customer conversations and support
                  </p>
                  <div className="space-y-2 text-sm text-left bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCheck className="w-4 h-4 text-green-600" />
                      <span>Real-time messaging</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCheck className="w-4 h-4 text-green-600" />
                      <span>Media sharing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCheck className="w-4 h-4 text-green-600" />
                      <span>Contact management</span>
                    </div>
                  </div>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Enter Live Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-white/70 backdrop-blur-sm border-gray-200 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300"
              onClick={() => setSelectedMode("waba")}
            >
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">WABA</h2>
                    <p className="text-sm text-gray-500 mt-1">WhatsApp Business API</p>
                  </div>
                  <p className="text-gray-600">
                    Campaigns, automation, and broadcast messaging for marketing teams
                  </p>
                  <div className="space-y-2 text-sm text-left bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCheck className="w-4 h-4 text-green-600" />
                      <span>Message templates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCheck className="w-4 h-4 text-green-600" />
                      <span>Bulk campaigns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCheck className="w-4 h-4 text-green-600" />
                      <span>Analytics & reporting</span>
                    </div>
                  </div>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    Manage Campaigns
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (selectedMode === "waha") {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setSelectedMode(null)}>
                <X className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">WAHA - Live Chat</h1>
                <p className="text-sm text-gray-500 mt-1">Real-time customer conversations</p>
              </div>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {wahaStats.map((stat) => (
              <Card key={stat.label} className="bg-white/70 backdrop-blur-sm border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chat Interface */}
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-12 h-[600px]">
                {/* Conversations List */}
                <div className="lg:col-span-4 border-r border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input placeholder="Search conversations..." className="pl-10" />
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(600px-73px)]">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedConversation?.id === conv.id ? "bg-indigo-50" : ""
                        }`}
                        onClick={() => setSelectedConversation(conv)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarFallback className="bg-indigo-600 text-white">
                                {conv.avatar}
                              </AvatarFallback>
                            </Avatar>
                            {conv.status === "online" && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-gray-900 text-sm truncate">{conv.name}</p>
                              <span className="text-xs text-gray-500">{conv.timestamp}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                              {conv.unread > 0 && (
                                <Badge className="bg-indigo-600 ml-2">{conv.unread}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>

                {/* Chat Window */}
                <div className="lg:col-span-5 flex flex-col">
                  {selectedConversation ? (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-indigo-600 text-white">
                              {selectedConversation.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">{selectedConversation.name}</p>
                            <p className="text-xs text-gray-500">
                              {selectedConversation.status === "online" ? "Online" : "Offline"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Video className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Messages */}
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  msg.sent
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-900"
                                }`}
                              >
                                <p className="text-sm">{msg.content}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                  <span className={`text-xs ${msg.sent ? "text-indigo-200" : "text-gray-500"}`}>
                                    {msg.timestamp}
                                  </span>
                                  {msg.sent && (
                                    <CheckCheck
                                      className={`w-3 h-3 ${
                                        msg.status === "read" ? "text-blue-300" : "text-indigo-200"
                                      }`}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Message Input */}
                      <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Paperclip className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Image className="w-4 h-4" />
                          </Button>
                          <Input
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            className="flex-1"
                          />
                          <Button variant="ghost" size="icon">
                            <Smile className="w-4 h-4" />
                          </Button>
                          <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Select a conversation to start messaging</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Info Panel */}
                <div className="lg:col-span-3 border-l border-gray-200 bg-gray-50 p-4">
                  {selectedConversation ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <Avatar className="w-20 h-20 mx-auto mb-3">
                          <AvatarFallback className="bg-indigo-600 text-white text-2xl">
                            {selectedConversation.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-gray-900">{selectedConversation.name}</h3>
                        <p className="text-sm text-gray-500">Customer</p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 text-sm">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-gray-600">Phone</p>
                            <p className="text-gray-900">+1 (555) 123-4567</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="text-gray-900">contact@acme.com</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Location</p>
                            <p className="text-gray-900">San Francisco, CA</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 text-sm">Shared Media</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                              key={i}
                              className="aspect-square bg-gray-200 rounded flex items-center justify-center"
                            >
                              <Image className="w-6 h-6 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500 text-sm">No contact selected</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // WABA Mode
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setSelectedMode(null)}>
              <X className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">WABA - Campaigns & Automation</h1>
              <p className="text-sm text-gray-500 mt-1">Broadcast messaging and marketing automation</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setTemplateModalOpen(true)}>
              <FileText className="w-4 h-4 mr-2" />
              New Template
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700" onClick={() => setCampaignModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {wabaStats.map((stat) => (
            <Card key={stat.label} className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-white/70 backdrop-blur-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{campaign.name}</h3>
                        <p className="text-sm text-gray-500">{campaign.date}</p>
                      </div>
                      <Badge
                        className={
                          campaign.status === "active"
                            ? "bg-green-500"
                            : campaign.status === "completed"
                            ? "bg-gray-500"
                            : "bg-amber-500"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Sent</p>
                        <p className="text-2xl font-bold text-gray-900">{campaign.sent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Delivered</p>
                        <p className="text-2xl font-bold text-green-600">{campaign.delivered.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Read</p>
                        <p className="text-2xl font-bold text-blue-600">{campaign.read.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Replied</p>
                        <p className="text-2xl font-bold text-indigo-600">{campaign.replied.toLocaleString()}</p>
                      </div>
                    </div>
                    {campaign.status !== "scheduled" && (
                      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${(campaign.read / campaign.sent) * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="bg-white/70 backdrop-blur-sm border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{template.category}</p>
                      </div>
                      <Badge
                        variant={template.status === "approved" ? "default" : "secondary"}
                        className={template.status === "approved" ? "bg-green-500" : "bg-amber-500"}
                      >
                        {template.status}
                      </Badge>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-3">
                      {template.content}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{template.language}</span>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    Campaign Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Delivery Rate</span>
                        <span className="font-semibold text-gray-900">97.2%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "97.2%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Read Rate</span>
                        <span className="font-semibold text-gray-900">69.3%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "69.3%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Response Rate</span>
                        <span className="font-semibold text-gray-900">18.5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "18.5%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                    Engagement Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Reach</span>
                      <span className="text-2xl font-bold text-gray-900">8,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Click-through Rate</span>
                      <span className="text-2xl font-bold text-gray-900">12.4%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Conversion Rate</span>
                      <span className="text-2xl font-bold text-gray-900">5.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Avg. Response Time</span>
                      <span className="text-2xl font-bold text-gray-900">4.8h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Template Modal */}
        <Dialog open={templateModalOpen} onOpenChange={setTemplateModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Message Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Template Name</label>
                <Input placeholder="e.g., Welcome Message" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="utility">Utility</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Message Content</label>
                <Textarea
                  placeholder="Enter your message template..."
                  className="mt-1 min-h-32"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use {`{{variable_name}}`} for dynamic content
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setTemplateModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Submit for Approval
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Campaign Modal */}
        <Dialog open={campaignModalOpen} onOpenChange={setCampaignModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Campaign Name</label>
                <Input placeholder="e.g., Product Launch 2026" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Select Template</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates
                      .filter((t) => t.status === "approved")
                      .map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Target Audience</label>
                <Input placeholder="Upload CSV or select segment" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Schedule</label>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <Input type="date" />
                  <Input type="time" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCampaignModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Create Campaign
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
