import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Edit, Trash2, UserPlus } from "lucide-react";
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

interface CustomerGroup {
  id: string;
  name: string;
  description?: string;
  customerCount: number;
  color: string;
}

export default function CustomerGroups() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const groups: CustomerGroup[] = [
    {
      id: "1",
      name: "VIP Customers",
      description: "High-value customers with priority support",
      customerCount: 24,
      color: "bg-purple-500",
    },
    {
      id: "2",
      name: "Enterprise",
      description: "Enterprise-level customers",
      customerCount: 12,
      color: "bg-blue-500",
    },
    {
      id: "3",
      name: "SMB",
      description: "Small and medium business customers",
      customerCount: 58,
      color: "bg-green-500",
    },
    {
      id: "4",
      name: "Trial Users",
      description: "Customers on trial period",
      customerCount: 35,
      color: "bg-orange-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Customer Groups</h1>
          <p className="text-muted-foreground">Organize customers into groups for targeted management</p>
        </div>
        
        {/* Header Actions */}
        <Card>
          <CardContent className="pt-6">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Customer Group</DialogTitle>
                  <DialogDescription>
                    Create a new group to organize your customers
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Group Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="name" placeholder="VIP Customers" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Group description..."
                      rows={3}
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
                        title: "Group Created",
                        description: "Customer group has been created successfully",
                      });
                      setDialogOpen(false);
                    }}
                  >
                    Create Group
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Groups Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${group.color}`} />
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {group.description || "No description"}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {group.customerCount} customers
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Customers
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Group Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Groups</p>
                <p className="text-3xl font-bold">{groups.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Customers</p>
                <p className="text-3xl font-bold">
                  {groups.reduce((sum, g) => sum + g.customerCount, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Largest Group</p>
                <p className="text-xl font-bold">
                  {groups.reduce((max, g) => (g.customerCount > max.customerCount ? g : max)).name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg per Group</p>
                <p className="text-3xl font-bold">
                  {Math.round(
                    groups.reduce((sum, g) => sum + g.customerCount, 0) / groups.length
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
