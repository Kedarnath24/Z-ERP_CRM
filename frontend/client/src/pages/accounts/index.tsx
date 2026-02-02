import { useState } from 'react';
import { useNavigate, useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Landmark, 
  TrendingUp,
  ArrowDownCircle,
  ArrowUpCircle,
  FileBarChart,
  Settings,
  ChevronDown,
  ChevronRight,
  Receipt,
  FileText,
  UserCheck,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import sub-modules
import Banking from './banking/index';
import IncomeExpense from './income-expense/index';
import Receivables from './receivables/index';
import Payables from './payables/index';
import Reports from './reports/index';
import AccountSettings from './settings/index';

type AccountsSection = {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  children?: { id: string; label: string; path: string }[];
};

const accountsSections: AccountsSection[] = [
  {
    id: 'banking',
    label: 'Banking',
    icon: Landmark,
    path: '/accounts/banking',
    children: [
      { id: 'bank-accounts', label: 'Bank Accounts', path: '/accounts/banking/accounts' },
      { id: 'reconciliation', label: 'Bank Reconciliation', path: '/accounts/banking/reconciliation' },
      { id: 'cheques', label: 'Cheque Management', path: '/accounts/banking/cheques' },
      { id: 'cash-bank', label: 'Cash & Bank Entries', path: '/accounts/banking/cash-bank' },
    ],
  },
  {
    id: 'income-expense',
    label: 'Income & Expense',
    icon: TrendingUp,
    path: '/accounts/income-expense',
    children: [
      { id: 'income', label: 'Income', path: '/accounts/income-expense/income' },
      { id: 'expenses', label: 'Expenses', path: '/accounts/income-expense/expenses' },
      { id: 'recurring', label: 'Recurring Expenses', path: '/accounts/income-expense/recurring' },
      { id: 'allocation', label: 'Expense Allocation', path: '/accounts/income-expense/allocation' },
    ],
  },
  {
    id: 'receivables',
    label: 'Receivables',
    icon: ArrowDownCircle,
    path: '/accounts/receivables',
    children: [
      { id: 'customer-ledger', label: 'Customer Ledger', path: '/accounts/receivables/ledger' },
      { id: 'outstanding', label: 'Outstanding Receivables', path: '/accounts/receivables/outstanding' },
      { id: 'receipts', label: 'Payment Receipts', path: '/accounts/receivables/receipts' },
      { id: 'ageing', label: 'Ageing Report', path: '/accounts/receivables/ageing' },
      { id: 'alerts', label: 'Due Date Alerts', path: '/accounts/receivables/alerts' },
    ],
  },
  {
    id: 'payables',
    label: 'Payables',
    icon: ArrowUpCircle,
    path: '/accounts/payables',
    children: [
      { id: 'vendor-bills', label: 'Vendor Bills', path: '/accounts/payables/bills' },
      { id: 'vendor-payments', label: 'Vendor Payments', path: '/accounts/payables/payments' },
      { id: 'vendor-ledger', label: 'Vendor Ledger', path: '/accounts/payables/ledger' },
      { id: 'pending', label: 'Pending Payments', path: '/accounts/payables/pending' },
      { id: 'ageing', label: 'Ageing Report', path: '/accounts/payables/ageing' },
      { id: 'approval', label: 'Approval Workflow', path: '/accounts/payables/approval' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileBarChart,
    path: '/accounts/reports',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/accounts/settings',
  },
];

export default function AccountsModule() {
  const [location, navigate] = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['banking']);

  // Determine active section from URL
  const activeSection = location.split('/')[2] || 'banking';
  const activePath = location || '/accounts/banking';

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const renderContent = () => {
    if (activePath.startsWith('/accounts/banking')) {
      return <Banking />;
    } else if (activePath.startsWith('/accounts/income-expense')) {
      return <IncomeExpense />;
    } else if (activePath.startsWith('/accounts/receivables')) {
      return <Receivables />;
    } else if (activePath.startsWith('/accounts/payables')) {
      return <Payables />;
    } else if (activePath.startsWith('/accounts/reports')) {
      return <Reports />;
    } else if (activePath.startsWith('/accounts/settings')) {
      return <AccountSettings />;
    }
    return <Banking />;
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-64 border-r border-slate-200 bg-slate-50">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Landmark className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">Accounts</h2>
                <p className="text-xs text-slate-600">Financial Management</p>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="p-2">
              {accountsSections.map((section) => {
                const Icon = section.icon;
                const isExpanded = expandedSections.includes(section.id);
                const isActive = activeSection === section.id;

                return (
                  <div key={section.id} className="mb-1">
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start gap-2 h-10',
                        isActive && 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      )}
                      onClick={() => {
                        if (section.children) {
                          toggleSection(section.id);
                        } else {
                          navigate(section.path);
                        }
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{section.label}</span>
                      {section.children && (
                        isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )
                      )}
                    </Button>

                    {/* Children */}
                    {section.children && isExpanded && (
                      <div className="ml-6 mt-1 space-y-1 border-l-2 border-slate-200 pl-2">
                        {section.children.map((child) => {
                          const isChildActive = activePath === child.path;
                          return (
                            <Button
                              key={child.id}
                              variant="ghost"
                              size="sm"
                              className={cn(
                                'w-full justify-start text-sm h-8',
                                isChildActive && 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                              )}
                              onClick={() => navigate(child.path)}
                            >
                              {child.label}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Quick Stats in Sidebar */}
          <div className="absolute bottom-0 left-0 right-0 w-64 p-3 border-t border-slate-200 bg-white">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Bank Balance:</span>
                <span className="font-semibold text-blue-700">$2.46M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Receivables:</span>
                <span className="font-semibold text-green-700">$485K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Payables:</span>
                <span className="font-semibold text-red-700">$325K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}
