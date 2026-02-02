import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search,
  Download,
  Eye,
  Edit,
  Power,
  PowerOff,
  Star,
  Building2,
  CreditCard,
  Landmark
} from 'lucide-react';
import { cn } from '@/lib/utils';

type BankAccount = {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  routingNumber: string;
  balance: number;
  currency: string;
  status: 'active' | 'inactive';
  isPrimary: boolean;
  openingDate: string;
  branch: string;
};

export default function BankAccounts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  // Mock data
  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: 'ACC-001',
      bankName: 'Chase Bank',
      accountType: 'Current Account',
      accountNumber: '****5678',
      routingNumber: '021000021',
      balance: 458000,
      currency: 'USD',
      status: 'active',
      isPrimary: true,
      openingDate: '2024-01-15',
      branch: 'New York Main Branch'
    },
    {
      id: 'ACC-002',
      bankName: 'Bank of America',
      accountType: 'Savings Account',
      accountNumber: '****1234',
      routingNumber: '026009593',
      balance: 1250000,
      currency: 'USD',
      status: 'active',
      isPrimary: false,
      openingDate: '2024-03-22',
      branch: 'Manhattan Branch'
    },
    {
      id: 'ACC-003',
      bankName: 'Wells Fargo',
      accountType: 'Current Account',
      accountNumber: '****9012',
      routingNumber: '121000248',
      balance: 750000,
      currency: 'USD',
      status: 'active',
      isPrimary: false,
      openingDate: '2024-06-10',
      branch: 'Brooklyn Branch'
    },
    {
      id: 'ACC-004',
      bankName: 'Citibank',
      accountType: 'Credit Card',
      accountNumber: '****3456',
      routingNumber: '021000089',
      balance: -12000,
      currency: 'USD',
      status: 'inactive',
      isPrimary: false,
      openingDate: '2023-11-05',
      branch: 'Downtown Branch'
    }
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const activeAccounts = accounts.filter(acc => acc.status === 'active').length;

  const filteredAccounts = accounts.filter(acc =>
    acc.bankName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.accountType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.accountNumber.includes(searchQuery)
  );

  const viewAccountDetails = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsViewDialogOpen(true);
  };

  const toggleAccountStatus = (accountId: string) => {
    setAccounts(accounts.map(acc =>
      acc.id === accountId
        ? { ...acc, status: acc.status === 'active' ? 'inactive' : 'active' }
        : acc
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="h-6 w-6 text-blue-600" />
            Bank Accounts
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            View and manage all institutional bank accounts
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Bank Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Bank Account</DialogTitle>
              <DialogDescription>
                Enter the details of the bank account to add to your system
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input id="bankName" placeholder="e.g., Chase Bank" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Account</SelectItem>
                      <SelectItem value="savings">Savings Account</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="loan">Loan Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input id="accountNumber" placeholder="Enter account number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input id="routingNumber" placeholder="Enter routing number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="balance">Opening Balance *</Label>
                  <Input id="balance" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch Name</Label>
                  <Input id="branch" placeholder="e.g., Main Branch" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openingDate">Opening Date *</Label>
                  <Input id="openingDate" type="date" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isPrimary" className="rounded" />
                <Label htmlFor="isPrimary" className="text-sm font-normal">
                  Set as primary account
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Add Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {formatCurrency(totalBalance)}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Across {accounts.length} accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Active Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{activeAccounts}</div>
            <p className="text-xs text-slate-600 mt-1">
              {accounts.length - activeAccounts} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {formatCurrency(accounts.filter(a => a.status === 'active' && a.balance > 0).reduce((sum, acc) => sum + acc.balance, 0))}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Liquid funds available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Bank Accounts</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search accounts..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account ID</TableHead>
                <TableHead>Bank Name</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {account.id}
                      {account.isPrimary && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      {account.bankName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                      {account.accountType}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {account.accountNumber}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        'font-semibold',
                        account.balance >= 0 ? 'text-green-700' : 'text-red-700'
                      )}
                    >
                      {formatCurrency(account.balance)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={account.status === 'active' ? 'default' : 'secondary'}
                      className={cn(
                        account.status === 'active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {account.status === 'active' ? (
                        <Power className="h-3 w-3 mr-1" />
                      ) : (
                        <PowerOff className="h-3 w-3 mr-1" />
                      )}
                      {account.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewAccountDetails(account)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAccountStatus(account.id)}
                      >
                        {account.status === 'active' ? (
                          <PowerOff className="h-4 w-4 text-red-600" />
                        ) : (
                          <Power className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Account Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
            <DialogDescription>Complete information about this bank account</DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600">Account ID</Label>
                  <p className="font-semibold mt-1">{selectedAccount.id}</p>
                </div>
                <div>
                  <Label className="text-slate-600">Status</Label>
                  <div className="mt-1">
                    <Badge
                      variant={selectedAccount.status === 'active' ? 'default' : 'secondary'}
                      className={cn(
                        selectedAccount.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {selectedAccount.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600">Bank Name</Label>
                  <p className="font-semibold mt-1">{selectedAccount.bankName}</p>
                </div>
                <div>
                  <Label className="text-slate-600">Branch</Label>
                  <p className="font-semibold mt-1">{selectedAccount.branch}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600">Account Type</Label>
                  <p className="font-semibold mt-1">{selectedAccount.accountType}</p>
                </div>
                <div>
                  <Label className="text-slate-600">Currency</Label>
                  <p className="font-semibold mt-1">{selectedAccount.currency}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600">Account Number</Label>
                  <p className="font-mono mt-1">{selectedAccount.accountNumber}</p>
                </div>
                <div>
                  <Label className="text-slate-600">Routing Number</Label>
                  <p className="font-mono mt-1">{selectedAccount.routingNumber}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-600">Current Balance</Label>
                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {formatCurrency(selectedAccount.balance)}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-600">Opening Date</Label>
                  <p className="font-semibold mt-1">{selectedAccount.openingDate}</p>
                </div>
              </div>
              {selectedAccount.isPrimary && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800 font-medium">
                    This is your primary account
                  </span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button>Edit Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
