import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Search, Mail, Phone, MapPin, CheckCircle2, Clock, Trash2, Edit } from "lucide-react";
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
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  status: "pending" | "verified";
  source: string;
  createdAt: string;
  notes?: string;
}

export default function ContactsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const contacts: Contact[] = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.j@example.com",
      phone: "+1 (555) 123-4567",
      company: "Tech Solutions Inc",
      address: "123 Main St, New York, NY",
      status: "pending",
      source: "Website Form",
      createdAt: "2026-01-15",
    },
    {
      id: "2",
      name: "Bob Williams",
      email: "bob.w@company.com",
      phone: "+1 (555) 234-5678",
      company: "Marketing Pro",
      status: "verified",
      source: "Email Campaign",
      createdAt: "2026-01-14",
    },
    {
      id: "3",
      name: "Carol Martinez",
      email: "carol.m@startup.io",
      phone: "+1 (555) 345-6789",
      company: "Startup Hub",
      address: "456 Oak Ave, San Francisco, CA",
      status: "pending",
      source: "Phone Call",
      createdAt: "2026-01-16",
      notes: "Interested in premium package",
    },
  ];

  const getStatusColor = (status: Contact["status"]) => {
    return status === "verified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Contact marked as ${newStatus}`,
    });
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Contacts</h1>
          <p className="text-muted-foreground">Manage non-verified customer contacts and leads</p>
        </div>
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.length}</div>
              <p className="text-xs text-muted-foreground">All contact records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contacts.filter((c) => c.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting verification</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contacts.filter((c) => c.status === "verified").length}
              </div>
              <p className="text-xs text-muted-foreground">Verified contacts</p>
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
                  placeholder="Search by name, email, or phone..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                    <DialogDescription>
                      Create a new contact record for non-verified customers
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" placeholder="Company Name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input id="email" type="email" placeholder="email@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone <span className="text-red-500">*</span>
                      </Label>
                      <Input id="phone" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="Full address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source">Source</Label>
                      <Select>
                        <SelectTrigger id="source">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website Form</SelectItem>
                          <SelectItem value="email">Email Campaign</SelectItem>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select defaultValue="pending">
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" placeholder="Additional notes..." rows={3} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Contact Added",
                          description: "New contact has been created successfully",
                        });
                        setDialogOpen(false);
                      }}
                    >
                      Save Contact
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Contacts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Records</CardTitle>
            <CardDescription>All non-verified customer contacts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">Name</th>
                    <th className="p-3 text-left text-sm font-medium">Contact Info</th>
                    <th className="p-3 text-left text-sm font-medium">Company</th>
                    <th className="p-3 text-left text-sm font-medium">Source</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                    <th className="p-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((contact) => (
                    <motion.tr
                      key={contact.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="p-3">
                        <div className="font-medium">{contact.name}</div>
                        {contact.address && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            {contact.address}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {contact.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {contact.phone}
                        </div>
                      </td>
                      <td className="p-3 text-sm">{contact.company || "-"}</td>
                      <td className="p-3 text-sm">{contact.source}</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(contact.status)}>{contact.status}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Select
                            defaultValue={contact.status}
                            onValueChange={(value) => handleStatusChange(contact.id, value)}
                          >
                            <SelectTrigger className="w-[130px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="verified">Verified</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
