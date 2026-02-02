import { useState } from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  QrCode,
  RefreshCw,
  Power,
  PowerOff,
  Activity,
  MessageCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConnectionStatus } from "@/components/whatsapp";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

export default function Connect() {
  const [isConnected, setIsConnected] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    setIsScanning(true);
    toast({
      title: "Connecting...",
      description: "Scan the QR code with WhatsApp on your phone",
    });
    setTimeout(() => {
      setIsConnected(true);
      setIsScanning(false);
      toast({
        title: "Connected!",
        description: "Your WhatsApp is now connected",
      });
    }, 3000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "Disconnected",
      description: "WhatsApp session has been terminated",
      variant: "destructive",
    });
  };

  const handleRefreshQR = () => {
    toast({
      title: "QR Code Refreshed",
      description: "Please scan the new QR code",
    });
  };

  // Static activity feed data
  const activities = [
    { id: 1, type: "connection", message: "WhatsApp session connected", time: "2 minutes ago", icon: CheckCircle2, color: "text-green-600" },
    { id: 2, type: "message", message: "50 messages sent successfully", time: "15 minutes ago", icon: MessageCircle, color: "text-blue-600" },
    { id: 3, type: "reconnect", message: "Session reconnected automatically", time: "1 hour ago", icon: RefreshCw, color: "text-yellow-600" },
    { id: 4, type: "connection", message: "New session initialized", time: "3 hours ago", icon: Activity, color: "text-purple-600" },
  ];

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        {/* Connection Status Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">WAHA Status</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ConnectionStatus
                status={isConnected ? "connected" : isScanning ? "connecting" : "disconnected"}
                sessionName="Primary Session"
                phoneNumber="+1 (555) 123-4567"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.8%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* QR Code Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Connection
              </CardTitle>
              <CardDescription>
                Scan this QR code with WhatsApp to connect your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <>
                  <div className="flex justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300"
                    >
                      <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                        {isScanning ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <RefreshCw className="h-12 w-12 text-blue-500" />
                          </motion.div>
                        ) : (
                          <QrCode className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <Badge variant={isScanning ? "default" : "secondary"} className="mb-2">
                      {isScanning ? "Waiting for Scan" : "Ready to Connect"}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {isScanning
                        ? "Open WhatsApp on your phone and scan this code"
                        : "Click connect to generate a QR code"}
                    </p>
                  </div>
                  <Button onClick={handleRefreshQR} variant="outline" className="w-full" disabled={!isScanning}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh QR Code
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-4"
                  >
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">Connected Successfully!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your WhatsApp is connected and ready to use
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions & Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your WhatsApp connection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {!isConnected ? (
                  <Button onClick={handleConnect} className="w-full" disabled={isScanning}>
                    <Power className="mr-2 h-4 w-4" />
                    {isScanning ? "Connecting..." : "Connect WhatsApp"}
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleDisconnect} variant="destructive" className="w-full">
                      <PowerOff className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                    <Button onClick={handleConnect} variant="outline" className="w-full">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reconnect
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div key={activity.id}>
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-lg bg-gray-100 h-fit`}>
                          <activity.icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                      {index < activities.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
