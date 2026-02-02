import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AccountSettings() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-slate-600" />
          Settings
        </h2>
        <p className="text-sm text-slate-600 mt-1">Configure accounts module preferences</p>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="bank">Bank Configuration</TabsTrigger>
          <TabsTrigger value="reminders">Reminder Templates</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Income & Expense Categories</CardTitle>
              <CardDescription>
                Add, edit, or delete income and expense categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Add New Category</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Category name" />
                    <Button>Add Category</Button>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Existing Categories</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600">• Sales Revenue</p>
                    <p className="text-sm text-slate-600">• Consulting Income</p>
                    <p className="text-sm text-slate-600">• Office Expenses</p>
                    <p className="text-sm text-slate-600">• Utilities</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bank Configuration</CardTitle>
              <CardDescription>
                Configure bank account defaults and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Payment Method</Label>
                  <Input placeholder="Bank Transfer" />
                </div>
                <div className="space-y-2">
                  <Label>Default Currency</Label>
                  <Input placeholder="USD" />
                </div>
                <Button>Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Templates</CardTitle>
              <CardDescription>
                Customize SMS/Email reminder messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Configure automated reminder templates for due payments, overdue invoices, etc.
                </p>
                <Button>Manage Templates</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permissions & Access Control</CardTitle>
              <CardDescription>
                Manage user roles and access permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Configure who can view, edit, and approve financial transactions
                </p>
                <Button>Manage Permissions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </DashboardLayout>
  );
}
