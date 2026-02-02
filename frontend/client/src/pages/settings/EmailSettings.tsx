import { useState } from "react";
import { Save, Mail, Server, TestTube } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

export default function EmailSettingsPage() {
  const [testingConnection, setTestingConnection] = useState(false);
  const { toast } = useToast();

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTimeout(() => {
      setTestingConnection(false);
      toast({ 
        title: "Connection Successful", 
        description: "SMTP server is reachable and credentials are valid." 
      });
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Email Settings</h1>
          <p className="text-muted-foreground">Configure email server and notification preferences</p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-muted-foreground" />
                <CardTitle>SMTP Configuration</CardTitle>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-600">Connected</Badge>
            </div>
            <CardDescription>Configure your email server settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">
                  SMTP Host <span className="text-red-500">*</span>
                </Label>
                <Input id="smtp-host" placeholder="smtp.gmail.com" defaultValue="smtp.gmail.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">
                  SMTP Port <span className="text-red-500">*</span>
                </Label>
                <Input id="smtp-port" type="number" placeholder="587" defaultValue="587" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtp-username">
                  Username <span className="text-red-500">*</span>
                </Label>
                <Input id="smtp-username" placeholder="your-email@domain.com" defaultValue="noreply@zervos.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input id="smtp-password" type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label>Enable TLS/SSL</Label>
                <p className="text-sm text-muted-foreground">Use secure connection for emails</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleTestConnection} disabled={testingConnection}>
                <TestTube className="mr-2 h-4 w-4" />
                {testingConnection ? "Testing..." : "Test Connection"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Email Sender Settings</CardTitle>
            </div>
            <CardDescription>Configure default sender information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="from-name">From Name</Label>
                <Input id="from-name" placeholder="Company Name" defaultValue="Zervos Tony Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" type="email" placeholder="noreply@domain.com" defaultValue="noreply@zervos.com" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="reply-to">Reply To Email</Label>
                <Input id="reply-to" type="email" placeholder="support@domain.com" defaultValue="support@zervos.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-footer">Email Footer Text</Label>
                <Input id="email-footer" placeholder="Company tagline" defaultValue="© 2024 Zervos Tony Inc." />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Notification Preferences</CardTitle>
            <CardDescription>Configure which events trigger email notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "New Lead", description: "Send email when a new lead is created" },
              { title: "Invoice Payment", description: "Notify when an invoice payment is received" },
              { title: "Contract Expiry", description: "Alert 30 days before contract expiration" },
              { title: "Task Assignment", description: "Email user when assigned a new task" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="space-y-0.5">
                  <Label>{item.title}</Label>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch defaultChecked={index < 2} />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={() => {
              toast({ title: "Settings Saved", description: "Email settings have been updated successfully." });
            }}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
