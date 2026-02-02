import { useState } from "react";
import { motion } from "framer-motion";
import { FolderTree, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  color: string;
}

export default function GroupsSetup() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const groups: Group[] = [
    { id: "1", name: "VIP Customers", description: "High-value customers", memberCount: 12, color: "bg-purple-500" },
    { id: "2", name: "New Leads", description: "Recently added leads", memberCount: 45, color: "bg-blue-500" },
    { id: "3", name: "Support Team", description: "Customer support staff", memberCount: 8, color: "bg-green-500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Groups Setup</h1>
          <p className="text-muted-foreground">Manage user and customer groups</p>
        </div>
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
                  <DialogTitle>Create New Group</DialogTitle>
                  <DialogDescription>Create a group for organizing users</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Group Name <span className="text-red-500">*</span></Label>
                    <Input id="name" placeholder="VIP Customers" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Group description..." rows={3} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => { toast({ title: "Group Created" }); setDialogOpen(false); }}>Create Group</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {groups.map((group) => (
            <motion.div key={group.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${group.color}`} />
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                  </div>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{group.memberCount} members</Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
