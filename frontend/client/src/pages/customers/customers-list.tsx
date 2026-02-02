import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Plus, Building, User, Mail, Phone, MapPin, Briefcase, DollarSign, Eye, Edit, Trash2, Download, Paperclip } from "lucide-react";

type Customer = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  projectsCount: number;
  totalRevenue: string;
  status: "active" | "inactive";
  notes?: string;
  attachments?: number;
};

export default function CustomersListModule() {
  const [searchQuery, setSearchQuery] = useState("");

  const customers: Customer[] = [
    {
      id: "C001",
      companyName: "Tech Innovations Ltd",
      contactPerson: "John Anderson",
      email: "john.anderson@techinnovations.com",
      phone: "+1 234 567 8901",
      location: "New York, NY",
      projectsCount: 5,
      totalRevenue: "$450,000",
      status: "active",
      attachments: 8
    },
    {
      id: "C002",
      companyName: "Global Retail Corp",
      contactPerson: "Sarah Mitchell",
      email: "sarah.mitchell@globalretail.com",
      phone: "+1 234 567 8902",
      location: "Los Angeles, CA",
      projectsCount: 3,
      totalRevenue: "$320,000",
      status: "active",
      attachments: 5
    },
    {
      id: "C003",
      companyName: "Healthcare Systems Inc",
      contactPerson: "Michael Roberts",
      email: "michael.roberts@healthsystems.com",
      phone: "+1 234 567 8903",
      location: "Chicago, IL",
      projectsCount: 7,
      totalRevenue: "$680,000",
      status: "active",
      attachments: 12
    },
    {
      id: "C004",
      companyName: "Financial Services Group",
      contactPerson: "Emily Thompson",
      email: "emily.thompson@finservices.com",
      phone: "+1 234 567 8904",
      location: "Boston, MA",
      projectsCount: 4,
      totalRevenue: "$520,000",
      status: "active",
      attachments: 9
    },
    {
      id: "C005",
      companyName: "Manufacturing Solutions",
      contactPerson: "David Martinez",
      email: "david.martinez@mfgsolutions.com",
      phone: "+1 234 567 8905",
      location: "Detroit, MI",
      projectsCount: 2,
      totalRevenue: "$185,000",
      status: "inactive",
      attachments: 3
    },
    {
      id: "C006",
      companyName: "Education Platform Co",
      contactPerson: "Jessica Lee",
      email: "jessica.lee@eduplatform.com",
      phone: "+1 234 567 8906",
      location: "Seattle, WA",
      projectsCount: 6,
      totalRevenue: "$410,000",
      status: "active",
      attachments: 7
    }
  ];

  const statusConfig = {
    active: "bg-green-100 text-green-700 border-green-200",
    inactive: "bg-slate-100 text-slate-700 border-slate-200"
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="newyork">New York</SelectItem>
                  <SelectItem value="california">California</SelectItem>
                  <SelectItem value="chicago">Chicago</SelectItem>
                  <SelectItem value="boston">Boston</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input id="companyName" placeholder="Enter company name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input id="contactPerson" placeholder="Enter contact name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="email@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input id="phone" placeholder="+1 234 567 8900" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input id="location" placeholder="City, State/Country" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Add any additional information..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Attachments</Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer">
                      <Paperclip className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600">
                        Drag and drop files here or click to browse
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Customer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-center">Projects</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-teal-600" />
                      <div>
                        <div className="font-medium">{customer.companyName}</div>
                        <div className="text-xs text-slate-500">{customer.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      {customer.contactPerson}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      {customer.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {customer.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {customer.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {customer.projectsCount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-medium text-green-700">
                      <DollarSign className="h-4 w-4" />
                      {customer.totalRevenue}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[customer.status]}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Building className="h-5 w-5 text-teal-600" />
                              {customer.companyName}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6 py-4">
                            {/* Status Badge */}
                            <div>
                              <Badge variant="outline" className={statusConfig[customer.status]}>
                                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                              </Badge>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-3">
                              <h3 className="font-semibold text-sm">Contact Information</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="text-slate-500 mb-1">Contact Person</div>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-slate-400" />
                                    {customer.contactPerson}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-slate-500 mb-1">Location</div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    {customer.location}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-slate-500 mb-1">Email</div>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    {customer.email}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-slate-500 mb-1">Phone</div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    {customer.phone}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Revenue & Projects Summary */}
                            <div className="space-y-3">
                              <h3 className="font-semibold text-sm">Business Summary</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <Card className="border-green-200 bg-green-50">
                                  <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-xs text-slate-600">Total Revenue</p>
                                        <p className="text-2xl font-bold text-green-700">{customer.totalRevenue}</p>
                                      </div>
                                      <DollarSign className="h-8 w-8 text-green-600" />
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card className="border-purple-200 bg-purple-50">
                                  <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-xs text-slate-600">Active Projects</p>
                                        <p className="text-2xl font-bold text-purple-700">{customer.projectsCount}</p>
                                      </div>
                                      <Briefcase className="h-8 w-8 text-purple-600" />
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-3">
                              <h3 className="font-semibold text-sm">Notes</h3>
                              <Card className="bg-slate-50">
                                <CardContent className="pt-6">
                                  <p className="text-sm text-slate-600">
                                    {customer.notes || "No notes available for this customer."}
                                  </p>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Attached Documents */}
                            <div className="space-y-3">
                              <h3 className="font-semibold text-sm">Attached Documents</h3>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Paperclip className="h-4 w-4" />
                                {customer.attachments || 0} files attached
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Download Attachments
                            </Button>
                            <Button>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Customer
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
