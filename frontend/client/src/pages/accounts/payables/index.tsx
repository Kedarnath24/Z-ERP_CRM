import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpCircle } from 'lucide-react';

export default function Payables() {
  const [location] = useLocation();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ArrowUpCircle className="h-6 w-6 text-red-600" />
          Payables
        </h2>
        <p className="text-sm text-slate-600 mt-1">Manage vendor bills and payments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Payables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">$325,000</div>
            <p className="text-xs text-orange-600 mt-1">$85K due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">$125,000</div>
            <p className="text-xs text-slate-600 mt-1">12 bills awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Paid This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">$280,000</div>
            <p className="text-xs text-slate-600 mt-1">45 payments processed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sub-Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <p className="text-slate-600">• Vendor Bills - Log bill/invoice details</p>
            <p className="text-slate-600">• Vendor Payments - Record payments made to vendors</p>
            <p className="text-slate-600">• Vendor Ledger - Track vendor financial history</p>
            <p className="text-slate-600">• Pending Payments - List all unpaid vendor bills</p>
            <p className="text-slate-600">• Ageing Report - Show overdue payables by 30/60/90 days</p>
            <p className="text-slate-600">• Approval Workflow - Multi-step approval for payments</p>
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
}
