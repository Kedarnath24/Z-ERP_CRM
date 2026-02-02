import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Phone,
  Mail,
  Tag,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Image as ImageIcon,
  File,
  CheckCheck,
  Clock,
  Star,
  Archive,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/components/DashboardLayout";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: "online" | "offline";
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOutgoing: boolean;
  status?: "sent" | "delivered" | "read";
}

export default function Conversations() {
  const [selectedContact, setSelectedContact] = useState<string>("1");
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const contacts: Contact[] = [
    {
      id: "1",
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      lastMessage: "Thanks for the quick response!",
      timestamp: "2m ago",
      unread: 2,
      status: "online",
    },
    {
      id: "2",
      name: "Sarah Wilson",
      phone: "+1 (555) 234-5678",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      lastMessage: "When will my order arrive?",
      timestamp: "15m ago",
      unread: 0,
      status: "online",
    },
    {
      id: "3",
      name: "Mike Johnson",
      phone: "+1 (555) 345-6789",
      lastMessage: "Perfect, that works for me",
      timestamp: "1h ago",
      unread: 1,
      status: "offline",
    },
    {
      id: "4",
      name: "Emma Davis",
      phone: "+1 (555) 456-7890",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      lastMessage: "I have a question about pricing",
      timestamp: "3h ago",
      unread: 0,
      status: "offline",
    },
    {
      id: "5",
      name: "Robert Smith",
      phone: "+1 (555) 567-8901",
      lastMessage: "Great service, thank you!",
      timestamp: "Yesterday",
      unread: 0,
      status: "offline",
    },
  ];

  const messages: { [key: string]: Message[] } = {
    "1": [
      { id: "1", text: "Hi! I need help with my order", timestamp: "10:30 AM", isOutgoing: false },
      { id: "2", text: "Hello! I'd be happy to help. What's your order number?", timestamp: "10:31 AM", isOutgoing: true, status: "read" },
      { id: "3", text: "It's #12345", timestamp: "10:32 AM", isOutgoing: false },
      { id: "4", text: "Let me check that for you. One moment please.", timestamp: "10:33 AM", isOutgoing: true, status: "read" },
      { id: "5", text: "Your order is on its way! Expected delivery is tomorrow.", timestamp: "10:34 AM", isOutgoing: true, status: "delivered" },
      { id: "6", text: "Thanks for the quick response!", timestamp: "10:35 AM", isOutgoing: false },
    ],
    "2": [
      { id: "1", text: "Hello, I placed an order yesterday", timestamp: "9:15 AM", isOutgoing: false },
      { id: "2", text: "Hi Sarah! How can I assist you today?", timestamp: "9:16 AM", isOutgoing: true, status: "read" },
      { id: "3", text: "When will my order arrive?", timestamp: "9:17 AM", isOutgoing: false },
    ],
  };

  const currentContact = contacts.find((c) => c.id === selectedContact);
  const currentMessages = messages[selectedContact] || [];

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    // In real app, would send message here
    setMessageText("");
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-180px)] flex gap-4">
        {/* Left Panel - Conversation List */}
        <Card className="w-80 flex-shrink-0 flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedContact(contact.id)}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer mb-2 transition-colors",
                    selectedContact === contact.id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>{contact.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      {contact.status === "online" && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm truncate">{contact.name}</h4>
                        <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {contact.lastMessage}
                        </p>
                        {contact.unread > 0 && (
                          <Badge className="ml-2 h-5 min-w-5 px-1.5 flex items-center justify-center">
                            {contact.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Center Panel - Chat Area */}
        <Card className="flex-1 flex flex-col">
          {currentContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentContact.avatar} />
                    <AvatarFallback>
                      {currentContact.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{currentContact.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {currentContact.status === "online" ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Star className="mr-2 h-4 w-4" />
                      Star Conversation
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-[#ECE5DD]">
                <div className="space-y-3">
                  {currentMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn("flex", message.isOutgoing ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-lg px-3 py-2 shadow-sm",
                          message.isOutgoing
                            ? "bg-[#DCF8C6] rounded-br-none"
                            : "bg-white rounded-bl-none"
                        )}
                      >
                        <p className="text-sm text-gray-900">{message.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[10px] text-gray-500">{message.timestamp}</span>
                          {message.isOutgoing && message.status && (
                            <CheckCheck
                              className={cn(
                                "w-3 h-3",
                                message.status === "read" ? "text-blue-500" : "text-gray-400"
                              )}
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-end gap-2">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[60px] max-h-[120px]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Quick Replies */}
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => setMessageText("Thank you for contacting us!")}>
                    Quick Reply: Thanks
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setMessageText("I'll check that for you.")}>
                    Quick Reply: Check
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a contact from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Right Panel - Contact Info */}
        {currentContact && (
          <Card className="w-80 flex-shrink-0">
            <ScrollArea className="h-full">
              <div className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-20 w-20 mb-3">
                    <AvatarImage src={currentContact.avatar} />
                    <AvatarFallback className="text-2xl">
                      {currentContact.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{currentContact.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentContact.phone}</p>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span>{currentContact.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="text-xs">john@example.com</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Customer</Badge>
                      <Badge variant="secondary">Premium</Badge>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Notes</h4>
                    <Textarea
                      placeholder="Add notes about this contact..."
                      rows={4}
                      className="text-sm"
                    />
                    <Button size="sm" className="w-full mt-2">
                      Save Notes
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Activity Timeline
                    </h4>
                    <div className="space-y-3">
                      <div className="text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="font-medium">Message sent</span>
                        </div>
                        <p className="text-muted-foreground ml-4">2 minutes ago</p>
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="font-medium">Conversation started</span>
                        </div>
                        <p className="text-muted-foreground ml-4">15 minutes ago</p>
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                          <span className="font-medium">Contact added</span>
                        </div>
                        <p className="text-muted-foreground ml-4">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
