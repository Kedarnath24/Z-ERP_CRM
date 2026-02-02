import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Edit, Trash2, TrendingUp } from "lucide-react";
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
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

interface LeadStatus {
  id: string;
  name: string;
  description?: string;
  leadsCount: number;
  color: string;
  order: number;
}

export default function LeadStatus() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const statuses: LeadStatus[] = [
    { id: "1", name: "New", description: "Newly captured leads", leadsCount: 45, color: "bg-blue-500", order: 1 },
    { id: "2", name: "Contacted", description: "Initial contact made", leadsCount: 32, color: "bg-yellow-500", order: 2 },
    { id: "3", name: "Qualified", description: "Leads that meet criteria", leadsCount: 28, color: "bg-purple-500", order: 3 },
    { id: "4", name: "Proposal Sent", description: "Proposal submitted", leadsCount: 15, color: "bg-orange-500", order: 4 },
    { id: "5", name: "Negotiation", description: "In negotiation phase", leadsCount: 12, color: "bg-pink-500", order: 5 },
    { id: "6", name: "Won", description: "Converted to customer", leadsCount: 89, color: "bg-green-500", order: 6 },
    { id: "7", name: "Lost", description: "Lead not converted", leadsCount: 23, color: "bg-red-500", order: 7 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lead Status</h1>
          <p className="text-muted-foreground">Manage lead lifecycle stages and pipeline</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Status
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Lead Status</DialogTitle>
                  <DialogDescription>Create a new status for lead pipeline</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Status Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="name" placeholder="Qualified, In Progress, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Status description..." rows={3} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      toast({ title: "Status Added" });
                      setDialogOpen(false);
                    }}
                  >
                    Add Status
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Lead Pipeline
            </CardTitle>
            <CardDescription>All lead statuses in pipeline order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statuses.map((status, index) => (
                <motion.div
                  key={status.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {status.order}
                        </Badge>
                        <div className={`w-3 h-3 rounded-full ${status.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{status.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {status.description || "No description"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline">{status.leadsCount} leads</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Stages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statuses.length}</div>
              <p className="text-xs text-muted-foreground">pipeline stages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statuses.filter((s) => !["Won", "Lost"].includes(s.name)).reduce((sum, s) => sum + s.leadsCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">in pipeline</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((statuses.find((s) => s.name === "Won")?.leadsCount || 0) / statuses.reduce((sum, s) => sum + s.leadsCount, 0) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">won rate</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
