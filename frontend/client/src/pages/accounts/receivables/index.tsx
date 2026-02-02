import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownCircle } from 'lucide-react';

export default function Receivables() {
  const [location] = useLocation();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ArrowDownCircle className="h-6 w-6 text-green-600" />
          Receivables
        </h2>
        <p className="text-sm text-slate-600 mt-1">Track customer payments and outstanding dues</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Receivables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">$485,000</div>
            <p className="text-xs text-red-600 mt-1">$128K overdue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">$357,000</div>
            <p className="text-xs text-slate-600 mt-1">Within due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Collected This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">$245,000</div>
            <p className="text-xs text-green-600 mt-1">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sub-Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <p className="text-slate-600">• Customer Ledger - Track every transaction for a customer</p>
            <p className="text-slate-600">• Outstanding Receivables - View unpaid dues</p>
            <p className="text-slate-600">• Payment Receipts - Record incoming payments</p>
            <p className="text-slate-600">• Ageing Report - Show overdue receivables by 30/60/90 days</p>
            <p className="text-slate-600">• Due Date Alerts - Notify before payment deadlines</p>
          </div>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
}
