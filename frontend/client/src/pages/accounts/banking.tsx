// Re-export from new directory structure
export { default } from './banking/index';

  // Mock data
  const accounts = [
    {
      id: 'ACC-001',
      bankName: 'Chase Bank',
      accountType: 'Current Account',
      accountNumber: '****5678',
      balance: '$458,000',
      status: 'active',
      isPrimary: true
    },
    {
      id: 'ACC-002',
      bankName: 'Bank of America',
      accountType: 'Savings Account',
      accountNumber: '****1234',
      balance: '$1,250,000',
      status: 'active',
      isPrimary: false
    },
    {
      id: 'ACC-003',
      bankName: 'Wells Fargo',
      accountType: 'Current Account',
      accountNumber: '****9012',
      balance: '$750,000',
      status: 'active',
      isPrimary: false
    },
    {
      id: 'ACC-004',
      bankName: 'Citibank',
      accountType: 'Credit Card',
      accountNumber: '****3456',
      balance: '-$12,000',
      status: 'inactive',
      isPrimary: false
    }
  ];

  const transactions = [
    {
      id: 'TXN-001',
      date: '2026-01-15',
      type: 'received',
      description: 'Payment from Acme Corp',
      amount: '$45,000',
      balance: '$458,000',
      method: 'Wire Transfer',
      reference: 'INV-001',
      status: 'completed',
      hasAttachment: true
    },
    {
      id: 'TXN-002',
      date: '2026-01-14',
      type: 'sent',
      description: 'Vendor Payment - TechSupply',
      amount: '$12,500',
      balance: '$413,000',
      method: 'ACH',
      reference: 'PO-458',
      status: 'completed',
      hasAttachment: false
    },
    {
      id: 'TXN-003',
      date: '2026-01-13',
      type: 'received',
      description: 'Customer Payment - GlobalTech',
      amount: '$85,000',
      balance: '$425,500',
      method: 'Check',
      reference: 'INV-002',
      status: 'pending',
      hasAttachment: true
    },
    {
      id: 'TXN-004',
      date: '2026-01-12',
      type: 'sent',
      description: 'Salary Payment - January',
      amount: '$150,000',
      balance: '$340,500',
      method: 'Bank Transfer',
      reference: 'PAY-JAN',
      status: 'completed',
      hasAttachment: false
    }
  ];

  const statusConfig: Record<string, { label: string; class: string }> = {
    active: { label: 'Active', class: 'bg-green-100 text-green-700 border-green-200' },
    inactive: { label: 'Inactive', class: 'bg-slate-100 text-slate-700 border-slate-200' },
    completed: { label: 'Completed', class: 'bg-green-100 text-green-700 border-green-200' },
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    failed: { label: 'Failed', class: 'bg-red-100 text-red-700 border-red-200' }
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="accounts">Accounts</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Account Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">$2,446,000</div>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +5.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">$685,000</div>
              <p className="text-xs text-slate-600 mt-1">142 transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total Debits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">$525,000</div>
              <p className="text-xs text-slate-600 mt-1">89 transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Last Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">Today</div>
              <p className="text-xs text-slate-600 mt-1">$45,000 received</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 5).map((txn) => (
                  <TableRow key={txn.id} className="hover:bg-slate-50">
                    <TableCell className="text-sm">{txn.date}</TableCell>
                    <TableCell className="font-medium">{txn.description}</TableCell>
                    <TableCell>
                      {txn.type === 'received' ? (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                          <ArrowDownLeft className="h-3 w-3 mr-1" />
                          Received
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          Sent
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className={`font-semibold ${txn.type === 'received' ? 'text-green-700' : 'text-red-700'}`}>
                      {txn.amount}
                    </TableCell>
                    <TableCell className="font-semibold">{txn.balance}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[txn.status].class}>
                        {statusConfig[txn.status].label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Transactions Tab */}
      <TabsContent value="transactions" className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>All Transactions</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Transaction
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((txn) => (
                  <TableRow key={txn.id} className="hover:bg-slate-50">
                    <TableCell className="text-sm">{txn.date}</TableCell>
                    <TableCell>
                      {txn.type === 'received' ? (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                          <ArrowDownLeft className="h-3 w-3 mr-1" />
                          In
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          Out
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {txn.description}
                        {txn.hasAttachment && <Paperclip className="h-3 w-3 text-slate-400" />}
                      </div>
                    </TableCell>
                    <TableCell className={`font-semibold ${txn.type === 'received' ? 'text-green-700' : 'text-red-700'}`}>
                      {txn.amount}
                    </TableCell>
                    <TableCell className="font-semibold text-blue-700">{txn.balance}</TableCell>
                    <TableCell className="text-sm">
                      <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                        {txn.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{txn.reference}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[txn.status].class}>
                        {statusConfig[txn.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-600">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-600">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Accounts Tab */}
      <TabsContent value="accounts" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Bank Accounts</h3>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Card key={account.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base">{account.bankName}</CardTitle>
                  </div>
                  <Badge variant="outline" className={statusConfig[account.status].class}>
                    {statusConfig[account.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600">{account.accountType}</p>
                  <p className="font-mono text-sm font-semibold">{account.accountNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Current Balance</p>
                  <p className={`text-2xl font-bold ${account.balance.startsWith('-') ? 'text-red-700' : 'text-blue-700'}`}>
                    {account.balance}
                  </p>
                </div>
                {account.isPrimary && (
                  <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                    Primary Account
                  </Badge>
                )}
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
