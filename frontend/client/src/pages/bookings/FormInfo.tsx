import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Mail, Phone, FileText, Copy, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

export default function FormInfo() {
  const { toast } = useToast();
  const [formEnabled, setFormEnabled] = useState(true);
  const [formSettings, setFormSettings] = useState({
    title: "Schedule an Appointment",
    description: "Book your meeting with our team",
    requireEmail: true,
    requirePhone: true,
    allowRescheduling: true,
    autoConfirm: false,
  });

  const publicFormUrl = "https://yourcompany.com/book/appointments";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicFormUrl);
    toast({
      title: "URL Copied",
      description: "Public form URL copied to clipboard",
    });
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Booking form settings updated successfully",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Booking Form</h1>
          <p className="text-muted-foreground">Configure your public booking form settings</p>
        </div>
        {/* Form Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Form Status</CardTitle>
                <CardDescription>Enable or disable public booking form</CardDescription>
              </div>
              <Switch checked={formEnabled} onCheckedChange={setFormEnabled} />
            </div>
          </CardHeader>
          <CardContent>
            {formEnabled ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                  <span className="text-sm text-muted-foreground">
                    Your booking form is accepting new appointments
                  </span>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <Input value={publicFormUrl} readOnly className="flex-1" />
                  <Button variant="outline" size="icon" onClick={handleCopyUrl}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Inactive</Badge>
                <span className="text-sm text-muted-foreground">
                  Your booking form is currently disabled
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Customization */}
        <Card>
          <CardHeader>
            <CardTitle>Form Customization</CardTitle>
            <CardDescription>Customize how your booking form appears to visitors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="form-title">Form Title</Label>
              <Input
                id="form-title"
                value={formSettings.title}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, title: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="form-description">Form Description</Label>
              <Textarea
                id="form-description"
                value={formSettings.description}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Field Requirements</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Email Address</Label>
                  <p className="text-sm text-muted-foreground">
                    Make email field mandatory for bookings
                  </p>
                </div>
                <Switch
                  checked={formSettings.requireEmail}
                  onCheckedChange={(checked) =>
                    setFormSettings({ ...formSettings, requireEmail: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Phone Number</Label>
                  <p className="text-sm text-muted-foreground">
                    Make phone field mandatory for bookings
                  </p>
                </div>
                <Switch
                  checked={formSettings.requirePhone}
                  onCheckedChange={(checked) =>
                    setFormSettings({ ...formSettings, requirePhone: checked })
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Booking Behavior</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Rescheduling</Label>
                  <p className="text-sm text-muted-foreground">
                    Let customers reschedule their appointments
                  </p>
                </div>
                <Switch
                  checked={formSettings.allowRescheduling}
                  onCheckedChange={(checked) =>
                    setFormSettings({ ...formSettings, allowRescheduling: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Confirm Bookings</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically confirm appointments without manual review
                  </p>
                </div>
                <Switch
                  checked={formSettings.autoConfirm}
                  onCheckedChange={(checked) =>
                    setFormSettings({ ...formSettings, autoConfirm: checked })
                  }
                />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Form Settings
            </Button>
          </CardContent>
        </Card>

        {/* Form Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Form Preview</CardTitle>
            <CardDescription>Preview how your booking form will look to visitors</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-2 border-dashed rounded-lg p-8 bg-muted/30"
            >
              <div className="max-w-md mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">{formSettings.title}</h2>
                  <p className="text-muted-foreground">{formSettings.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input placeholder="Enter your name" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                      {formSettings.requireEmail && <span className="text-red-500">*</span>}
                    </Label>
                    <Input placeholder="your.email@example.com" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                      {formSettings.requirePhone && <span className="text-red-500">*</span>}
                    </Label>
                    <Input placeholder="+1 (555) 000-0000" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Preferred Date <span className="text-red-500">*</span>
                    </Label>
                    <Input type="date" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Preferred Time <span className="text-red-500">*</span>
                    </Label>
                    <Input type="time" disabled />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Additional Notes
                    </Label>
                    <Textarea placeholder="Any specific requirements..." rows={3} disabled />
                  </div>

                  <Button className="w-full" disabled>
                    Submit Booking Request
                  </Button>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
