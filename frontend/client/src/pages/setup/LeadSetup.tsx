import { useState } from "react";
import { Save, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

export default function LeadSetup() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    autoAssign: true,
    leadScoring: true,
    duplicateCheck: true,
    defaultSource: "website",
    defaultStatus: "new",
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lead Setup</h1>
          <p className="text-muted-foreground">Configure lead management settings</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Lead Configuration</CardTitle>
            <CardDescription>Manage lead capture and assignment rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Assign Leads</Label>
                <p className="text-sm text-muted-foreground">Automatically assign leads to available staff</p>
              </div>
              <Switch checked={settings.autoAssign} onCheckedChange={(checked) => setSettings({ ...settings, autoAssign: checked })} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Lead Scoring</Label>
                <p className="text-sm text-muted-foreground">Enable automatic lead scoring</p>
              </div>
              <Switch checked={settings.leadScoring} onCheckedChange={(checked) => setSettings({ ...settings, leadScoring: checked })} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Duplicate Check</Label>
                <p className="text-sm text-muted-foreground">Prevent duplicate lead entries</p>
              </div>
              <Switch checked={settings.duplicateCheck} onCheckedChange={(checked) => setSettings({ ...settings, duplicateCheck: checked })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Lead Source</Label>
                <Select value={settings.defaultSource} onValueChange={(value) => setSettings({ ...settings, defaultSource: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Default Lead Status</Label>
                <Select value={settings.defaultStatus} onValueChange={(value) => setSettings({ ...settings, defaultStatus: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={() => toast({ title: "Settings Saved" })} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Lead Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
