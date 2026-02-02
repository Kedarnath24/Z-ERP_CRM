import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, Search, Filter, Download, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Receivables({ includeLayout = true }: any) {
  const [location] = useLocation();

  const content = (
    <div className="p-6 space-y-6 text-slate-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ArrowDownCircle className="h-6 w-6 text-green-600" />
            Receivables
          </h2>
          <p className="text-sm text-slate-600 mt-1">Track customer payments and outstanding dues</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Receivables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">$485,000</div>
            <p className="text-xs text-slate-500 mt-1">Across 124 clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">$128,000</div>
            <p className="text-xs text-red-600 mt-1">15 invoices past due</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Collected (MTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">$245,000</div>
            <p className="text-xs text-green-600 mt-1">Target: $300,000</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Average Collection Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32 Days</div>
            <p className="text-xs text-slate-500 mt-1">-5 days from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Outstanding Invoices</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input placeholder="Search invoices..." className="pl-9 w-[250px]" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { id: "INV-2026-001", customer: "Acme Corp", date: "2026-01-01", due: "2026-01-31", amount: "$12,500", status: "overdue" },
                { id: "INV-2026-002", customer: "Global Tech", date: "2026-01-05", due: "2026-02-04", amount: "$8,400", status: "pending" },
                { id: "INV-2026-003", customer: "Nexus Solutions", date: "2026-01-10", due: "2026-02-09", amount: "$15,000", status: "pending" },
                { id: "INV-2026-004", customer: "Stellar Innovations", date: "2025-12-15", due: "2026-01-14", amount: "$5,200", status: "overdue" },
              ].map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium text-blue-600 cursor-pointer">{inv.id}</TableCell>
                  <TableCell>{inv.customer}</TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell>{inv.due}</TableCell>
                  <TableCell>{inv.amount}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status === "overdue" ? "destructive" : "secondary"}>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  if (!includeLayout) return content;

  return (
    <DashboardLayout>
      {content}
    </DashboardLayout>
  );
}
