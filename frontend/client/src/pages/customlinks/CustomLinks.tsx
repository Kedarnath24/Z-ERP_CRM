import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Plus, Edit, Trash2, ExternalLink, Eye, EyeOff } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

interface CustomLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  visible: boolean;
  openInNewTab: boolean;
  order: number;
}

export default function CustomLinks() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const links: CustomLink[] = [
    {
      id: "1",
      title: "Company Website",
      url: "https://yourcompany.com",
      description: "Main company website",
      visible: true,
      openInNewTab: true,
      order: 1,
    },
    {
      id: "2",
      title: "Support Portal",
      url: "https://support.yourcompany.com",
      description: "Customer support portal",
      visible: true,
      openInNewTab: true,
      order: 2,
    },
    {
      id: "3",
      title: "Documentation",
      url: "https://docs.yourcompany.com",
      description: "Product documentation",
      visible: true,
      openInNewTab: false,
      order: 3,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Custom Links</h1>
          <p className="text-muted-foreground">Manage custom navigation links in sidebar</p>
        </div>
        {/* Header Actions */}
        <Card>
          <CardContent className="pt-6">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Link</DialogTitle>
                  <DialogDescription>
                    Create a custom link to appear in navigation
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Link Title <span className="text-red-500">*</span>
                    </Label>
                    <Input id="title" placeholder="Company Website" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">
                      URL <span className="text-red-500">*</span>
                    </Label>
                    <Input id="url" type="url" placeholder="https://example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Brief description" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="visible">Visible in Navigation</Label>
                    <Switch id="visible" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="newTab">Open in New Tab</Label>
                    <Switch id="newTab" defaultChecked />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      toast({
                        title: "Link Added",
                        description: "Custom link has been created successfully",
                      });
                      setDialogOpen(false);
                    }}
                  >
                    Add Link
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Links List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Custom Links
            </CardTitle>
            <CardDescription>All custom navigation links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {links.map((link) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{link.title}</h3>
                        <Badge
                          variant="outline"
                          className={link.visible ? "text-green-600" : "text-gray-600"}
                        >
                          {link.visible ? (
                            <><Eye className="h-3 w-3 mr-1" />Visible</>
                          ) : (
                            <><EyeOff className="h-3 w-3 mr-1" />Hidden</>
                          )}
                        </Badge>
                        {link.openInNewTab && (
                          <Badge variant="secondary" className="text-xs">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            New Tab
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {link.description || "No description"}
                      </p>
                      <a
                        href={link.url}
                        target={link.openInNewTab ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {link.url}
                        {link.openInNewTab && <ExternalLink className="h-3 w-3" />}
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{links.length}</div>
              <p className="text-xs text-muted-foreground">custom links</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Visible Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {links.filter((l) => l.visible).length}
              </div>
              <p className="text-xs text-muted-foreground">shown in navigation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">External Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {links.filter((l) => l.openInNewTab).length}
              </div>
              <p className="text-xs text-muted-foreground">open in new tab</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
