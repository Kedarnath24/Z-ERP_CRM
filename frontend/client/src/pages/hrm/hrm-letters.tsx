import { useState } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Plus,
  Download,
  Search,
  Filter,
  Eye,
  Mail,
  Printer,
  FileDown,
  ArrowLeft
} from 'lucide-react';

export default function HRLetters() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('templates');
  const [searchQuery, setSearchQuery] = useState('');

  // Letter templates
  const letterTemplates = [
    {
      id: 'TEMP001',
      name: 'Offer Letter',
      description: 'Employment offer letter for new hires',
      category: 'Hiring',
      icon: '📝',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'TEMP002',
      name: 'Appointment Letter',
      description: 'Official appointment confirmation',
      category: 'Hiring',
      icon: '✅',
      color: 'bg-green-100 text-green-700'
    },
    {
      id: 'TEMP003',
      name: 'Experience Letter',
      description: 'Work experience certificate',
      category: 'Exit',
      icon: '🎓',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'TEMP004',
      name: 'Relieving Letter',
      description: 'Employee relieving certificate',
      category: 'Exit',
      icon: '🚪',
      color: 'bg-orange-100 text-orange-700'
    },
    {
      id: 'TEMP005',
      name: 'Salary Certificate',
      description: 'Salary proof for employees',
      category: 'General',
      icon: '💰',
      color: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: 'TEMP006',
      name: 'NOC Letter',
      description: 'No objection certificate',
      category: 'General',
      icon: '📋',
      color: 'bg-cyan-100 text-cyan-700'
    }
  ];

  // Letter history
  const letterHistory = [
    {
      id: 'LET001',
      employee: 'John Smith',
      empId: 'EMP001',
      letterType: 'Offer Letter',
      generatedDate: '2025-06-10',
      generatedBy: 'Emily Davis',
      status: 'sent',
      format: 'PDF'
    },
    {
      id: 'LET002',
      employee: 'Mike Brown',
      empId: 'EMP003',
      letterType: 'Appointment Letter',
      generatedDate: '2025-06-12',
      generatedBy: 'Emily Davis',
      status: 'sent',
      format: 'PDF'
    },
    {
      id: 'LET003',
      employee: 'Alex Wilson',
      empId: 'EMP005',
      letterType: 'Salary Certificate',
      generatedDate: '2025-06-14',
      generatedBy: 'Emily Davis',
      status: 'draft',
      format: 'PDF'
    }
  ];

  const statusConfig: Record<string, { label: string; class: string }> = {
    sent: { label: 'Sent', class: 'bg-green-100 text-green-700 border-green-200' },
    draft: { label: 'Draft', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    pending: { label: 'Pending', class: 'bg-blue-100 text-blue-700 border-blue-200' }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 -mx-6 -mt-6 px-6 py-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/hrm')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <FileText className="h-6 w-6 text-cyan-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">HR Letters</h1>
                <p className="text-sm text-slate-600">Generate and manage employee letters and certificates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Letter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Generate HR Letter</DialogTitle>
                  <DialogDescription>Select template and employee to generate letter</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="letter-template">Letter Template</Label>
                    <Select>
                      <SelectTrigger id="letter-template">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="offer">Offer Letter</SelectItem>
                        <SelectItem value="appointment">Appointment Letter</SelectItem>
                        <SelectItem value="experience">Experience Letter</SelectItem>
                        <SelectItem value="relieving">Relieving Letter</SelectItem>
                        <SelectItem value="salary">Salary Certificate</SelectItem>
                        <SelectItem value="noc">NOC Letter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="letter-employee">Employee</Label>
                    <Select>
                      <SelectTrigger id="letter-employee">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emp1">John Smith (EMP001)</SelectItem>
                        <SelectItem value="emp2">Sarah Johnson (EMP002)</SelectItem>
                        <SelectItem value="emp3">Mike Brown (EMP003)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="letter-date">Letter Date</Label>
                      <Input id="letter-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="letter-format">Format</Label>
                      <Select defaultValue="pdf">
                        <SelectTrigger id="letter-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="docx">DOCX</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Preview:</strong> Letter content will be auto-populated from employee data and template.
                      You can customize before generating.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button>
                    <FileDown className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <FileText className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">6</p>
                  <p className="text-xs text-slate-600">Letter Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">145</p>
                  <p className="text-xs text-slate-600">Letters Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FileDown className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">28</p>
                  <p className="text-xs text-slate-600">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Printer className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                  <p className="text-xs text-slate-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="history">Letter History</TabsTrigger>
          </TabsList>

          {/* Templates */}
          <TabsContent value="templates" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Letter Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {letterTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg text-3xl ${template.color}`}>
                            {template.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
                            <p className="text-xs text-slate-600 mb-3">{template.description}</p>
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" className="flex-1">
                            <Plus className="h-3 w-3 mr-1" />
                            Use
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Letter History */}
          <TabsContent value="history" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Letter Generation History</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search letters..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-48"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Letter ID</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Letter Type</TableHead>
                      <TableHead>Generated Date</TableHead>
                      <TableHead>Generated By</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {letterHistory.map((letter) => (
                      <TableRow key={letter.id}>
                        <TableCell className="font-mono text-sm">{letter.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{letter.employee}</p>
                            <p className="text-xs text-slate-600">{letter.empId}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{letter.letterType}</TableCell>
                        <TableCell className="text-sm">{letter.generatedDate}</TableCell>
                        <TableCell className="text-sm">{letter.generatedBy}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{letter.format}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusConfig[letter.status].class}>
                            {statusConfig[letter.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="text-blue-600">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm" className="text-green-600">
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                            <Button variant="ghost" size="sm" className="text-purple-600">
                              <Mail className="h-3 w-3 mr-1" />
                              Email
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
