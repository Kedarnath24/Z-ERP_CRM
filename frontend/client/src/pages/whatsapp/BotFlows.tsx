import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Plus,
  Save,
  Undo,
  Redo,
  MessageSquare,
  HelpCircle,
  GitBranch,
  Clock,
  Zap,
  User,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppPreview } from "@/components/whatsapp";

interface NodeType {
  id: string;
  type: string;
  label: string;
  icon: any;
  color: string;
}

export default function BotFlows() {
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [flowName, setFlowName] = useState("Welcome Flow");
  const [isPublished, setIsPublished] = useState(false);
  const { toast } = useToast();

  const nodeTypes: NodeType[] = [
    { id: "start", type: "trigger", label: "Start", icon: Play, color: "bg-green-100 text-green-700 border-green-300" },
    { id: "message", type: "action", label: "Send Message", icon: MessageSquare, color: "bg-blue-100 text-blue-700 border-blue-300" },
    { id: "buttons", type: "interactive", label: "Buttons", icon: HelpCircle, color: "bg-purple-100 text-purple-700 border-purple-300" },
    { id: "condition", type: "logic", label: "Condition", icon: GitBranch, color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
    { id: "delay", type: "action", label: "Delay", icon: Clock, color: "bg-orange-100 text-orange-700 border-orange-300" },
    { id: "api", type: "action", label: "API Call", icon: Zap, color: "bg-pink-100 text-pink-700 border-pink-300" },
    { id: "agent", type: "action", label: "Assign to Agent", icon: User, color: "bg-indigo-100 text-indigo-700 border-indigo-300" },
  ];

  const variables = [
    { category: "System", items: ["{{current_date}}", "{{current_time}}", "{{bot_name}}"] },
    { category: "Session", items: ["{{session_id}}", "{{session_start}}", "{{message_count}}"] },
    { category: "User", items: ["{{user_name}}", "{{user_phone}}", "{{user_email}}"] },
    { category: "Global", items: ["{{company_name}}", "{{support_email}}", "{{website}}"] },
  ];

  const handleSave = () => {
    toast({
      title: "Flow Saved",
      description: "Your bot flow has been saved successfully",
    });
  };

  const handlePublish = () => {
    setIsPublished(!isPublished);
    toast({
      title: isPublished ? "Flow Unpublished" : "Flow Published",
      description: isPublished
        ? "Bot flow is now inactive"
        : "Bot flow is now live and active",
    });
  };

  const handleTest = () => {
    toast({
      title: "Testing Flow",
      description: "Opening test simulator...",
    });
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-180px)] flex gap-4">
        {/* Left Panel - Node Palette */}
        <Card className="w-64 flex-shrink-0">
          <CardHeader>
            <CardTitle className="text-base">Node Palette</CardTitle>
            <CardDescription className="text-xs">Drag nodes to canvas</CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="space-y-2">
                {nodeTypes.map((node) => (
                  <motion.div
                    key={node.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${node.color} ${
                      selectedNode?.id === node.id ? "ring-2 ring-offset-2" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <node.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{node.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="text-sm font-semibold mb-3">Triggers</h4>
                <div className="space-y-2">
                  <Card className="bg-muted cursor-pointer hover:bg-muted/80">
                    <CardContent className="p-2">
                      <p className="text-xs">New Message</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted cursor-pointer hover:bg-muted/80">
                    <CardContent className="p-2">
                      <p className="text-xs">Button Click</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted cursor-pointer hover:bg-muted/80">
                    <CardContent className="p-2">
                      <p className="text-xs">Keyword Match</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Center Panel - Canvas */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Toolbar */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    value={flowName}
                    onChange={(e) => setFlowName(e.target.value)}
                    className="w-48 h-8"
                  />
                  <Badge variant={isPublished ? "default" : "secondary"}>
                    {isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Redo className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="sm" onClick={handleTest}>
                    <Play className="h-4 w-4 mr-1" />
                    Test
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" onClick={handlePublish}>
                    {isPublished ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Canvas Area */}
          <Card className="flex-1">
            <CardContent className="p-0 h-full">
              <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
                {/* Grid Pattern */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                  }}
                />

                {/* Sample Flow Visualization */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="space-y-4">
                    {/* Start Node */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-lg shadow-lg p-4 border-2 border-green-500 max-w-xs"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-green-100 rounded">
                          <Play className="h-4 w-4 text-green-700" />
                        </div>
                        <span className="font-semibold">Start</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Triggers when user sends a message</p>
                    </motion.div>

                    {/* Connection Line */}
                    <div className="flex justify-center">
                      <div className="w-0.5 h-8 bg-gray-300" />
                    </div>

                    {/* Message Node */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white rounded-lg shadow-lg p-4 border-2 border-blue-500 max-w-xs"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-blue-100 rounded">
                          <MessageSquare className="h-4 w-4 text-blue-700" />
                        </div>
                        <span className="font-semibold">Send Message</span>
                      </div>
                      <p className="text-sm">Welcome to our service! How can we help you today?</p>
                    </motion.div>

                    {/* Connection Line */}
                    <div className="flex justify-center">
                      <div className="w-0.5 h-8 bg-gray-300" />
                    </div>

                    {/* Buttons Node */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white rounded-lg shadow-lg p-4 border-2 border-purple-500 max-w-xs"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-purple-100 rounded">
                          <HelpCircle className="h-4 w-4 text-purple-700" />
                        </div>
                        <span className="font-semibold">Buttons</span>
                      </div>
                      <div className="space-y-1">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          📦 Track Order
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          💬 Talk to Agent
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          ❓ FAQ
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Empty State Overlay */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white/90 backdrop-blur rounded-lg p-4 shadow-lg">
                    <p className="text-sm text-muted-foreground text-center">
                      Drag nodes from the palette to build your flow
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Configuration & Preview */}
        <Card className="w-80 flex-shrink-0">
          <Tabs defaultValue="config" className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="config" className="text-xs">Config</TabsTrigger>
                <TabsTrigger value="variables" className="text-xs">Variables</TabsTrigger>
                <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <TabsContent value="config" className="mt-0 space-y-4">
                  {selectedNode ? (
                    <>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`p-2 rounded ${selectedNode.color}`}>
                            <selectedNode.icon className="h-4 w-4" />
                          </div>
                          <h3 className="font-semibold">{selectedNode.label}</h3>
                        </div>
                      </div>

                      {selectedNode.type === "action" && selectedNode.id === "message" && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-xs">Message Text</Label>
                            <Textarea
                              placeholder="Enter your message..."
                              rows={4}
                              defaultValue="Welcome to our service!"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Add Media</Label>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Typing Indicator</Label>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      )}

                      {selectedNode.type === "interactive" && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-xs">Button Text</Label>
                            <Input placeholder="Button label" />
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Button
                          </Button>
                        </div>
                      )}

                      {selectedNode.type === "logic" && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-xs">Condition</Label>
                            <Input placeholder="e.g., contains 'help'" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">If True</Label>
                            <Input placeholder="Next node" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">If False</Label>
                            <Input placeholder="Else node" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        Select a node to configure
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="variables" className="mt-0 space-y-4">
                  {variables.map((category) => (
                    <div key={category.category}>
                      <h4 className="text-xs font-semibold mb-2 text-muted-foreground">
                        {category.category}
                      </h4>
                      <div className="space-y-1">
                        {category.items.map((item) => (
                          <div
                            key={item}
                            className="p-2 rounded bg-muted hover:bg-muted/80 cursor-pointer text-xs font-mono"
                            onClick={() => {
                              navigator.clipboard.writeText(item);
                              toast({
                                title: "Copied",
                                description: `${item} copied to clipboard`,
                              });
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="preview" className="mt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="h-4 w-4" />
                      <h3 className="font-semibold text-sm">Flow Preview</h3>
                    </div>
                    <WhatsAppPreview
                      messages={[
                        {
                          id: "1",
                          text: "Welcome to our service! How can we help you today?",
                          timestamp: "10:30 AM",
                          isOutgoing: true,
                          status: "read",
                        },
                        {
                          id: "2",
                          text: "I need help with my order",
                          timestamp: "10:31 AM",
                          isOutgoing: false,
                        },
                        {
                          id: "3",
                          text: "I'll help you with that! Please provide your order number.",
                          timestamp: "10:31 AM",
                          isOutgoing: true,
                          status: "delivered",
                        },
                      ]}
                    />
                  </div>
                </TabsContent>
              </ScrollArea>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
}
