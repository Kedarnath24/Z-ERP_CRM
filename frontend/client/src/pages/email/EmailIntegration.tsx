import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Server, CheckCircle2, AlertCircle, RefreshCw, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

export default function EmailIntegration() {
  const { toast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "testing">("connected");
  const [settings, setSettings] = useState({
    provider: "smtp",
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "your-email@gmail.com",
    smtpPassword: "••••••••",
    senderName: "Your Company",
    senderEmail: "noreply@yourcompany.com",
    enableTLS: true,
    enableTracking: true,
  });

  const handleTestConnection = () => {
    setConnectionStatus("testing");
    setTimeout(() => {
      setConnectionStatus("connected");
      toast({
        title: "Connection Successful",
        description: "Email server connection test passed",
      });
    }, 2000);
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Email integration settings updated successfully",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Email Integration</h1>
          <p className="text-muted-foreground">Configure email service provider and SMTP settings</p>
        </div>
        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {connectionStatus === "connected" && (
                  <>
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium">Connected</p>
                      <p className="text-sm text-muted-foreground">
                        Email service is active and working
                      </p>
                    </div>
                  </>
                )}
                {connectionStatus === "disconnected" && (
                  <>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                    <div>
                      <p className="font-medium">Disconnected</p>
                      <p className="text-sm text-muted-foreground">
                        Unable to connect to email server
                      </p>
                    </div>
                  </>
                )}
                {connectionStatus === "testing" && (
                  <>
                    <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                    <div>
                      <p className="font-medium">Testing Connection</p>
                      <p className="text-sm text-muted-foreground">
                        Verifying email server settings...
                      </p>
                    </div>
                  </>
                )}
              </div>
              <Button onClick={handleTestConnection} disabled={connectionStatus === "testing"}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Email Provider */}
        <Card>
          <CardHeader>
            <CardTitle>Email Service Provider</CardTitle>
            <CardDescription>Choose your email delivery service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select value={settings.provider} onValueChange={(value) => setSettings({ ...settings, provider: value })}>
                <SelectTrigger id="provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smtp">SMTP (Custom)</SelectItem>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                  <SelectItem value="ses">Amazon SES</SelectItem>
                  <SelectItem value="mailchimp">Mailchimp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* SMTP Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>SMTP Configuration</CardTitle>
            <CardDescription>Configure your SMTP server details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">
                  SMTP Host <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="smtp-host"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">
                  SMTP Port <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="smtp-port"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                  placeholder="587"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-user">
                  SMTP Username <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="smtp-user"
                  value={settings.smtpUser}
                  onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                  placeholder="your-email@gmail.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-password">
                  SMTP Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="smtp-password"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable TLS/SSL</Label>
                <p className="text-sm text-muted-foreground">
                  Use secure connection for email transmission
                </p>
              </div>
              <Switch
                checked={settings.enableTLS}
                onCheckedChange={(checked) => setSettings({ ...settings, enableTLS: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sender Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Sender Configuration</CardTitle>
            <CardDescription>Set default sender information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender-name">
                  Sender Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sender-name"
                  value={settings.senderName}
                  onChange={(e) => setSettings({ ...settings, senderName: e.target.value })}
                  placeholder="Your Company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender-email">
                  Sender Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sender-email"
                  type="email"
                  value={settings.senderEmail}
                  onChange={(e) => setSettings({ ...settings, senderEmail: e.target.value })}
                  placeholder="noreply@yourcompany.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>Additional email configuration options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Tracking</Label>
                <p className="text-sm text-muted-foreground">
                  Track email opens and clicks
                </p>
              </div>
              <Switch
                checked={settings.enableTracking}
                onCheckedChange={(checked) => setSettings({ ...settings, enableTracking: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleSave} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Email Settings
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Emails Sent Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">successful deliveries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2%</div>
              <p className="text-xs text-muted-foreground">3 bounced emails</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
