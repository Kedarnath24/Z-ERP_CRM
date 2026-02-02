import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Plus
} from 'lucide-react';

// Tab components
import ProposalsTab from './tabs/proposals-tab';
import EstimatesTab from './tabs/estimates-tab';
import InvoicesTab from './tabs/invoices-tab';
import PaymentsTab from './tabs/payments-tab';
import CreditNotesTab from './tabs/credit-notes-tab';
import BatchPaymentsTab from './tabs/batch-payments-tab';

export default function SalesDashboard() {
  const [activeTab, setActiveTab] = useState('proposals');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              Sales
            </h1>
            <p className="text-sm text-slate-600 mt-1">Manage proposals, invoices, payments, and revenue</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              New Proposal
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">$485K</p>
                  <p className="text-xs text-slate-600">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">$128K</p>
                  <p className="text-xs text-slate-600">Outstanding Amount</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">184</p>
                  <p className="text-xs text-slate-600">Paid Invoices</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                  <p className="text-xs text-slate-600">Overdue Invoices</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="estimates">Estimates</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="credit-notes">Credit Notes</TabsTrigger>
            <TabsTrigger value="batch-payments">Batch Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="proposals" className="mt-6">
            <ProposalsTab />
          </TabsContent>

          <TabsContent value="estimates" className="mt-6">
            <EstimatesTab />
          </TabsContent>

          <TabsContent value="invoices" className="mt-6">
            <InvoicesTab />
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <PaymentsTab />
          </TabsContent>

          <TabsContent value="credit-notes" className="mt-6">
            <CreditNotesTab />
          </TabsContent>

          <TabsContent value="batch-payments" className="mt-6">
            <BatchPaymentsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
