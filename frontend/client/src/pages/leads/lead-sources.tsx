import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Plus, Edit, Trash2, BarChart3 } from "lucide-react";
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
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

interface LeadSource {
  id: string;
  name: string;
  leadsCount: number;
  conversionRate: number;
  color: string;
}

export default function LeadSources() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const sources: LeadSource[] = [
    { id: "1", name: "Website", leadsCount: 145, conversionRate: 18.5, color: "bg-blue-500" },
    { id: "2", name: "Referral", leadsCount: 89, conversionRate: 32.1, color: "bg-green-500" },
    { id: "3", name: "Social Media", leadsCount: 203, conversionRate: 12.3, color: "bg-purple-500" },
    { id: "4", name: "Email Campaign", leadsCount: 67, conversionRate: 24.8, color: "bg-orange-500" },
    { id: "5", name: "Phone Call", leadsCount: 45, conversionRate: 28.9, color: "bg-pink-500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lead Sources</h1>
          <p className="text-muted-foreground">Manage and track where your leads come from</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Source
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Lead Source</DialogTitle>
                  <DialogDescription>Create a new lead source category</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Source Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="name" placeholder="Website, Referral, etc." />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      toast({ title: "Source Added" });
                      setDialogOpen(false);
                    }}
                  >
                    Add Source
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <motion.div key={source.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${source.color}`} />
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                    </div>
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Leads</span>
                      <Badge variant="outline">{source.leadsCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Conversion Rate</span>
                      <Badge className="bg-green-100 text-green-800">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        {source.conversionRate}%
                      </Badge>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="ghost" size="icon" className="h-8 w-8 flex-1">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 flex-1">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
