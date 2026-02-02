import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Webhook,
  Send,
  Clock,
  CheckCircle2,
  Info,
  Save,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ConnectionIndicator } from "@/components/whatsapp";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [deliveryReceipts, setDeliveryReceipts] = useState(true);
  const [autoReply, setAutoReply] = useState(false);
  const [autoReplyMessage, setAutoReplyMessage] = useState("Thanks for your message! We'll get back to you soon.");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [webhookUrl, setWebhookUrl] = useState("https://api.example.com/webhooks/whatsapp");
  const [testPhone, setTestPhone] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your WhatsApp settings have been updated successfully",
    });
  };

  const handleTestMessage = () => {
    if (!testPhone) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Test Message Sent",
      description: `Test message sent to ${testPhone}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="grid gap-6 max-w-4xl">
        {/* Message Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Message Settings
            </CardTitle>
            <CardDescription>
              Configure how messages are handled and processed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Delivery Receipts */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="delivery-receipts" className="text-base">
                  Enable Delivery Receipts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Send read receipts when messages are viewed
                </p>
              </div>
              <Switch
                id="delivery-receipts"
                checked={deliveryReceipts}
                onCheckedChange={setDeliveryReceipts}
              />
            </div>

            <Separator />

            {/* Auto Reply */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-reply" className="text-base">
                    Auto-Reply
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically respond to incoming messages
                  </p>
                </div>
                <Switch
                  id="auto-reply"
                  checked={autoReply}
                  onCheckedChange={setAutoReply}
                />
              </div>

              {autoReply && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <Label htmlFor="auto-reply-message">Auto-Reply Message</Label>
                  <Textarea
                    id="auto-reply-message"
                    value={autoReplyMessage}
                    onChange={(e) => setAutoReplyMessage(e.target.value)}
                    placeholder="Enter your auto-reply message"
                    rows={3}
                  />
                </motion.div>
              )}
            </div>

            <Separator />

            {/* Session Timeout */}
            <div className="space-y-2">
              <Label htmlFor="session-timeout" className="text-base">
                Session Timeout
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Automatically disconnect after period of inactivity
              </p>
              <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                <SelectTrigger id="session-timeout">
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="0">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhook Settings
            </CardTitle>
            <CardDescription>
              Configure webhook endpoints for incoming messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Webhook Information</AlertTitle>
              <AlertDescription>
                Your webhook will receive POST requests for all incoming WhatsApp messages.
                Make sure your endpoint can handle JSON payloads.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="webhook-url">Incoming Message Webhook URL</Label>
              <Input
                id="webhook-url"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.example.com/webhooks/whatsapp"
              />
            </div>

            <Button variant="outline" className="w-full">
              Test Webhook
            </Button>
          </CardContent>
        </Card>

        {/* Test Message */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Test Message
            </CardTitle>
            <CardDescription>
              Send a test message to verify your connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-phone">Phone Number</Label>
              <Input
                id="test-phone"
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <Button onClick={handleTestMessage} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Send Test Message
            </Button>
          </CardContent>
        </Card>

        {/* Connection Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Connection Health
            </CardTitle>
            <CardDescription>
              Current status of your WhatsApp connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Connected
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <ConnectionIndicator isHealthy={true} label="WhatsApp API" />
              <ConnectionIndicator isHealthy={true} label="Webhook Endpoint" />
              <ConnectionIndicator isHealthy={true} label="Message Queue" />
              <ConnectionIndicator isHealthy={false} label="Media Storage" />
            </div>

            <Separator />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Sync</span>
              <span className="font-medium">2 minutes ago</span>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
