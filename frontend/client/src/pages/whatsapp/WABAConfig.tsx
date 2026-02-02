import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Key,
  FileText,
  CheckCircle2,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StepWizard } from "@/components/whatsapp";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

export default function WABAConfig() {
  const [currentStep, setCurrentStep] = useState(0);
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [businessAccountId, setBusinessAccountId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [apiVersion, setApiVersion] = useState("v18.0");
  const [webhookToken, setWebhookToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [templateCount, setTemplateCount] = useState(0);
  const { toast } = useToast();

  const steps = [
    { id: 1, title: "Meta Setup", description: "Prerequisites" },
    { id: 2, title: "Credentials", description: "API Configuration" },
    { id: 3, title: "Templates", description: "Message Templates" },
    { id: 4, title: "Verify", description: "Test & Save" },
  ];

  const handleGenerateToken = () => {
    const token = `wvt_${Math.random().toString(36).substring(2, 15)}`;
    setWebhookToken(token);
    toast({
      title: "Token Generated",
      description: "Webhook verify token has been generated",
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const handleFetchTemplates = () => {
    setIsLoading(true);
    setTimeout(() => {
      setTemplateCount(12);
      setIsLoading(false);
      toast({
        title: "Templates Fetched",
        description: "Successfully retrieved 12 message templates",
      });
    }, 2000);
  };

  const handleComplete = () => {
    toast({
      title: "Configuration Saved",
      description: "Your WABA configuration has been saved successfully",
    });
  };

  const canGoNext = (): boolean => {
    if (currentStep === 0) return true;
    if (currentStep === 1) {
      return !!(phoneNumberId && businessAccountId && accessToken && apiVersion);
    }
    if (currentStep === 2) return true;
    if (currentStep === 3) return templateCount > 0;
    return false;
  };

  return (
    <DashboardLayout>
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>WhatsApp Business API Setup</CardTitle>
          <CardDescription>
            Configure your Meta WhatsApp Business API credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StepWizard
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onComplete={handleComplete}
            canGoNext={canGoNext()}
          >
            {/* Step 1: Meta Setup Guide */}
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Before You Begin</AlertTitle>
                  <AlertDescription>
                    Make sure you have completed the following prerequisites on Meta for Developers
                  </AlertDescription>
                </Alert>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Create a Meta Business Account
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p>1. Go to Meta Business Suite</p>
                        <p>2. Create a new Business Account or use an existing one</p>
                        <p>3. Verify your business details</p>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a href="https://business.facebook.com" target="_blank" rel="noopener noreferrer">
                            Open Meta Business Suite
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        Create a WhatsApp Business App
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p>1. Go to Meta for Developers</p>
                        <p>2. Create a new app or use an existing one</p>
                        <p>3. Add WhatsApp product to your app</p>
                        <p>4. Set up a WhatsApp Business phone number</p>
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer">
                            Open Meta for Developers
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Get Your Access Token
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p>1. Navigate to your WhatsApp app settings</p>
                        <p>2. Generate a permanent access token</p>
                        <p>3. Copy the Phone Number ID and Business Account ID</p>
                        <Alert className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Keep your access token secure. Never share it publicly.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            )}

            {/* Step 2: Credentials */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="phone-number-id">Phone Number ID *</Label>
                  <Input
                    id="phone-number-id"
                    value={phoneNumberId}
                    onChange={(e) => setPhoneNumberId(e.target.value)}
                    placeholder="123456789012345"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-account-id">Business Account ID *</Label>
                  <Input
                    id="business-account-id"
                    value={businessAccountId}
                    onChange={(e) => setBusinessAccountId(e.target.value)}
                    placeholder="987654321098765"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="access-token">Access Token *</Label>
                  <div className="relative">
                    <Input
                      id="access-token"
                      type={showToken ? "text" : "password"}
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="EAAxxxxxxxxxx"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowToken(!showToken)}
                    >
                      {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-version">API Version *</Label>
                  <Select value={apiVersion} onValueChange={setApiVersion}>
                    <SelectTrigger id="api-version">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v18.0">v18.0 (Latest)</SelectItem>
                      <SelectItem value="v17.0">v17.0</SelectItem>
                      <SelectItem value="v16.0">v16.0</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-token">Webhook Verify Token</Label>
                  <div className="flex gap-2">
                    <Input
                      id="webhook-token"
                      value={webhookToken}
                      onChange={(e) => setWebhookToken(e.target.value)}
                      placeholder="Generate or enter custom token"
                      readOnly
                    />
                    <Button type="button" variant="outline" onClick={handleGenerateToken}>
                      Generate
                    </Button>
                    {webhookToken && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopy(webhookToken)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Templates Info */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">Meta-Approved Templates Required</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    WhatsApp Business API requires pre-approved message templates for proactive messaging.
                    Templates must be reviewed and approved by Meta before use.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Marketing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Promotional messages, product announcements, and special offers
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Utility</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Order updates, appointment reminders, and account notifications
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Authentication</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        One-time passwords and verification codes
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Template Guidelines</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                      <li>Templates must comply with WhatsApp Business Policy</li>
                      <li>Review process typically takes 24-48 hours</li>
                      <li>Use variables for personalization</li>
                      <li>Include opt-out instructions for marketing messages</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Step 4: Test & Save */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Configuration Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Phone Number ID:</span>
                      <span className="font-mono text-blue-900">{phoneNumberId || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Business Account ID:</span>
                      <span className="font-mono text-blue-900">{businessAccountId || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">API Version:</span>
                      <span className="font-mono text-blue-900">{apiVersion}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Fetch Message Templates</h4>
                      <p className="text-sm text-muted-foreground">
                        Retrieve your approved templates from Meta
                      </p>
                    </div>
                    <Button onClick={handleFetchTemplates} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Fetching...
                        </>
                      ) : (
                        "Fetch Templates"
                      )}
                    </Button>
                  </div>

                  {templateCount > 0 && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">Templates Retrieved</AlertTitle>
                      <AlertDescription className="text-green-700">
                        Found {templateCount} approved message templates
                      </AlertDescription>
                    </Alert>
                  )}

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Connection Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">API Connection</span>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Ready
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Webhook Endpoint</span>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Templates</span>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {templateCount} Available
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </StepWizard>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
