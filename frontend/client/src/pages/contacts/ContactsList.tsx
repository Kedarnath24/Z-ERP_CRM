import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit, 
  Download, 
  Filter, 
  MoreVertical, 
  Plus, 
  Users, 
  Building2, 
  Globe, 
  ArrowLeft,
  Calendar,
  Eye,
  ArrowUpDown,
  FileText
} from "lucide-react";
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { cn } from "@/lib/utils";

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

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <Card className="border-none shadow-sm bg-white/50 backdrop-blur-md overflow-hidden group">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
            {trend && <span className="text-xs font-medium text-emerald-600">{trend}</span>}
          </div>
        </div>
        <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", color)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function ContactsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "CON-001",
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
      id: "CON-002",
      name: "Bob Williams",
      email: "bob.w@company.com",
      phone: "+1 (555) 234-5678",
      company: "Marketing Pro",
      status: "verified",
      source: "Email Campaign",
      createdAt: "2026-01-14",
    },
    {
      id: "CON-003",
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
    {
      id: "CON-004",
      name: "David Smith",
      email: "d.smith@enterprise.com",
      phone: "+1 (555) 456-7890",
      company: "Global Enterprise",
      status: "verified",
      source: "Referral",
      createdAt: "2026-01-10",
    },
    {
      id: "CON-005",
      name: "Eva Green",
      email: "eva.g@design.co",
      phone: "+1 (555) 567-8901",
      company: "Creative Studio",
      status: "pending",
      source: "Website Form",
      createdAt: "2026-01-18",
    }
  ]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contacts, searchQuery, statusFilter]);

  const handleExport = (type: "excel" | "pdf") => {
    if (type === "excel") {
      const ws = XLSX.utils.json_to_sheet(filteredContacts.map(c => ({
        ID: c.id,
        Name: c.name,
        Email: c.email,
        Phone: c.phone,
        Company: c.company || "N/A",
        Status: c.status,
        Source: c.source,
        Date: c.createdAt
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Contacts");
      XLSX.writeFile(wb, `Z-ERP_Contacts_${new Date().toISOString().split("T")[0]}.xlsx`);
    } else {
      const doc = new jsPDF();
      doc.text("Contact Records Report", 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [["Name", "Email", "Phone", "Company", "Status"]],
        body: filteredContacts.map(c => [c.name, c.email, c.phone, c.company || "N/A", c.status]),
      });
      doc.save(`Z-ERP_Contacts_${new Date().toISOString().split("T")[0]}.pdf`);
    }
    toast({ title: "Export Successful", description: `Contacts exported to ${type.toUpperCase()}` });
  };

  const stats = {
    total: contacts.length,
    pending: contacts.filter(c => c.status === "pending").length,
    verified: contacts.filter(c => c.status === "verified").length,
    conversion: "64%"
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-slate-50/30">
        {/* Modern Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CRM Contacts</h1>
                <p className="text-sm text-slate-500 font-medium">Manage leads and non-verified customer interactions</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-white/50 border-slate-200">
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("excel")}>
                    <FileText className="h-4 w-4 mr-2 text-green-600" /> Excel Spreadsheet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("pdf")}>
                    <Download className="h-4 w-4 mr-2 text-rose-600" /> PDF Document
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                    <Plus className="h-4 w-4 mr-2" /> Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Lead</DialogTitle>
                    <DialogDescription>Enter contact details for the new potential customer.</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="e.g. Elena Gilbert" />
                    </div>
                    <div className="space-y-2">
                      <Label>Organization</Label>
                      <Input placeholder="Company Name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Professional Email</Label>
                      <Input type="email" placeholder="elena@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Primary Address</Label>
                      <Input placeholder="123 Business Way, Suite 100" />
                    </div>
                    <div className="space-y-2">
                      <Label>Lead Source</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select origin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web">Website Form</SelectItem>
                          <SelectItem value="ref">Referral</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="ads">Paid Advertising</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Initial Status</Label>
                      <Select defaultValue="pending">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Discard</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsAddDialogOpen(false)}>Create Contact</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Total Leads" 
                value={stats.total} 
                icon={Users} 
                color="bg-indigo-50 text-indigo-600" 
              />
              <StatCard 
                title="Awaiting Verify" 
                value={stats.pending} 
                icon={Clock} 
                color="bg-amber-50 text-amber-600" 
              />
              <StatCard 
                title="Verified Contacts" 
                value={stats.verified} 
                icon={CheckCircle2} 
                color="bg-emerald-50 text-emerald-600" 
                trend="+12% up"
              />
              <StatCard 
                title="Lead Conversion" 
                value={stats.conversion} 
                icon={Globe} 
                color="bg-blue-50 text-blue-600" 
              />
            </div>

            {/* List View */}
            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-md overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-white/40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Contact Directory</CardTitle>
                    <CardDescription>Search and manage all potential customer leads</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Search leads..." 
                        className="pl-9 w-[280px] bg-white/50 border-slate-200 focus:bg-white transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px] bg-white/50 border-slate-200">
                        <Filter className="h-4 w-4 mr-2 text-slate-400" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="w-[300px]">Lead Name</TableHead>
                      <TableHead>Contact Detail</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredContacts.map((contact) => (
                        <motion.tr
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={contact.id}
                          className="group border-b last:border-0 hover:bg-slate-50/80 transition-colors"
                        >
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 group-hover:bg-white group-hover:shadow-sm transition-all">
                                {contact.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{contact.name}</div>
                                <div className="text-xs text-slate-500 font-medium">Added: {contact.createdAt}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                {contact.email}
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                {contact.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-slate-400" />
                              <span className="text-sm font-medium text-slate-700">{contact.company || "Individual"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "px-2.5 py-0.5 rounded-full border-0 text-[10px] uppercase tracking-wider font-bold",
                              contact.status === "verified" 
                                ? "bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-50" 
                                : "bg-amber-100 text-amber-700 shadow-sm shadow-amber-50"
                            )}>
                              {contact.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                                onClick={() => {
                                  setSelectedContact(contact);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuLabel>Manage Contact</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" /> Edit Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" /> Verify Contact
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-rose-600">
                                    <Trash2 className="h-4 w-4 mr-2" /> Delete Lead
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
                {filteredContacts.length === 0 && (
                  <div className="py-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                      <Search className="h-8 w-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">No leads found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your search or filters to find what you are looking for.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* View Contact Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl overflow-hidden p-0 border-none shadow-2xl">
            {selectedContact && (
              <>
                <div className="bg-indigo-600 h-24 relative">
                   <div className="absolute -bottom-10 left-8">
                      <div className="h-20 w-20 rounded-2xl bg-white shadow-xl flex items-center justify-center text-3xl font-bold text-indigo-600 border-4 border-white">
                        {selectedContact.name.charAt(0)}
                      </div>
                   </div>
                </div>
                <div className="pt-14 px-8 pb-8 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedContact.name}</h2>
                    <p className="text-slate-500 font-medium">{selectedContact.company || "Private Individual"}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Connect</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Mail className="h-4 w-4 text-indigo-500" />
                          {selectedContact.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Phone className="h-4 w-4 text-indigo-500" />
                          {selectedContact.phone}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Status</Label>
                      <div className="flex items-center h-8">
                         <Badge className={cn(
                           "px-3 py-1 font-bold",
                           selectedContact.status === "verified" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                         )}>
                           {selectedContact.status}
                         </Badge>
                      </div>
                    </div>
                    <div className="col-span-2 space-y-1">
                       <Label className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Address</Label>
                       <div className="flex items-start gap-2 text-sm text-slate-700">
                          <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                          {selectedContact.address || "No address provided"}
                       </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-2">Notes</Label>
                    <p className="text-sm text-slate-600 italic">
                      {selectedContact.notes || "No additional notes for this contact."}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">Convert to Customer</Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

