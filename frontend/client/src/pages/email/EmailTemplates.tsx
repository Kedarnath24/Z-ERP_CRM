import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Plus, Edit, Trash2, Search, Copy, Eye } from "lucide-react";
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

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: string;
  body: string;
  variables: string[];
  active: boolean;
}

export default function EmailTemplates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const templates: EmailTemplate[] = [
    {
      id: "1",
      name: "Welcome Email",
      subject: "Welcome to {{company_name}}!",
      category: "onboarding",
      body: "Dear {{customer_name}},\n\nWelcome to {{company_name}}! We're excited to have you on board.",
      variables: ["company_name", "customer_name"],
      active: true,
    },
    {
      id: "2",
      name: "Quote Sent",
      subject: "Your Quote #{{quote_number}}",
      category: "sales",
      body: "Hi {{customer_name}},\n\nThank you for your interest. Please find attached your quote #{{quote_number}}.",
      variables: ["customer_name", "quote_number"],
      active: true,
    },
    {
      id: "3",
      name: "Invoice Reminder",
      subject: "Payment Reminder - Invoice #{{invoice_number}}",
      category: "billing",
      body: "Dear {{customer_name}},\n\nThis is a friendly reminder that invoice #{{invoice_number}} for {{amount}} is due on {{due_date}}.",
      variables: ["customer_name", "invoice_number", "amount", "due_date"],
      active: true,
    },
    {
      id: "4",
      name: "Meeting Confirmation",
      subject: "Meeting Confirmation - {{meeting_date}}",
      category: "appointments",
      body: "Hi {{customer_name}},\n\nYour meeting is confirmed for {{meeting_date}} at {{meeting_time}}.",
      variables: ["customer_name", "meeting_date", "meeting_time"],
      active: true,
    },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "onboarding", label: "Onboarding" },
    { value: "sales", label: "Sales" },
    { value: "billing", label: "Billing" },
    { value: "appointments", label: "Appointments" },
    { value: "marketing", label: "Marketing" },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-muted-foreground">Manage reusable email templates</p>
        </div>
        {/* Header Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Create Email Template</DialogTitle>
                    <DialogDescription>
                      Create a reusable email template with variables
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Template Name <span className="text-red-500">*</span>
                        </Label>
                        <Input id="name" placeholder="Welcome Email" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">
                          Category <span className="text-red-500">*</span>
                        </Label>
                        <Select>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.slice(1).map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">
                        Email Subject <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="subject"
                        placeholder="Use {{variable_name}} for dynamic content"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="body">
                        Email Body <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="body"
                        placeholder="Use {{variable_name}} for dynamic content..."
                        rows={8}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Available Variables</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{'{{customer_name}}'}</Badge>
                        <Badge variant="outline">{'{{company_name}}'}</Badge>
                        <Badge variant="outline">{'{{invoice_number}}'}</Badge>
                        <Badge variant="outline">{'{{amount}}'}</Badge>
                        <Badge variant="outline">{'{{date}}'}</Badge>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Template Created",
                          description: "Email template has been created successfully",
                        });
                        setDialogOpen(false);
                      }}
                    >
                      Create Template
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="h-4 w-4 text-primary" />
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </div>
                      <CardDescription className="text-sm">
                        {template.subject}
                      </CardDescription>
                    </div>
                    <Badge
                      className={
                        template.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {template.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Category</p>
                      <Badge variant="outline" className="capitalize">
                        {template.category}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Variables</p>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map((variable) => (
                          <Badge key={variable} variant="secondary" className="text-xs">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Button>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
              <p className="text-xs text-muted-foreground">email templates</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {templates.filter((t) => t.active).length}
              </div>
              <p className="text-xs text-muted-foreground">currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length - 1}</div>
              <p className="text-xs text-muted-foreground">template categories</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
