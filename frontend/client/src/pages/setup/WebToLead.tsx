import { useState } from "react";
import { Globe, Copy, Code } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

export default function WebToLead() {
  const { toast } = useToast();
  const formUrl = "https://yourcompany.com/api/leads/capture";
  const embedCode = `<form action="${formUrl}" method="POST">
  <input type="text" name="name" placeholder="Full Name" required>
  <input type="email" name="email" placeholder="Email" required>
  <input type="tel" name="phone" placeholder="Phone">
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Submit</button>
</form>`;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Web-to-Lead</h1>
          <p className="text-muted-foreground">Capture leads from your website</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />Lead Capture Form</CardTitle>
            <CardDescription>Embed this form on your website to capture leads automatically</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Form URL</Label>
              <div className="flex gap-2">
                <Input value={formUrl} readOnly />
                <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(formUrl); toast({ title: "URL Copied" }); }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Embed Code</Label>
              <div className="relative">
                <Textarea value={embedCode} readOnly rows={8} className="font-mono text-xs" />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => { navigator.clipboard.writeText(embedCode); toast({ title: "Code Copied" }); }}
                >
                  <Copy className="mr-2 h-3 w-3" />
                  Copy Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Required Fields</Label>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Name</Badge>
                <Badge variant="outline">Email</Badge>
                <Badge variant="outline">Phone</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Success Redirect URL</Label>
              <Input placeholder="https://yourcompany.com/thank-you" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
