import { useState } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Star,
  Plus,
  Download,
  Search,
  Filter,
  Target,
  Award,
  BarChart3,
  Calendar,
  ArrowLeft
} from 'lucide-react';

export default function Performance() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('reviews');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - Performance reviews
  const reviews = [
    {
      id: 'REV001',
      employee: 'John Smith',
      empId: 'EMP001',
      department: 'Engineering',
      reviewPeriod: 'Q2 2025',
      rating: 4.5,
      status: 'completed',
      reviewer: 'Sarah Johnson',
      completedDate: '2025-06-10',
      avatar: 'JS'
    },
    {
      id: 'REV002',
      employee: 'Mike Brown',
      empId: 'EMP003',
      department: 'Design',
      reviewPeriod: 'Q2 2025',
      rating: 4.2,
      status: 'completed',
      reviewer: 'Emily Davis',
      completedDate: '2025-06-12',
      avatar: 'MB'
    },
    {
      id: 'REV003',
      employee: 'Alex Wilson',
      empId: 'EMP005',
      department: 'Sales',
      reviewPeriod: 'Q2 2025',
      rating: 0,
      status: 'pending',
      reviewer: 'Emily Davis',
      completedDate: '-',
      avatar: 'AW'
    }
  ];

  // Mock data - KPIs
  const kpis = [
    {
      id: 'KPI001',
      employee: 'John Smith',
      empId: 'EMP001',
      kpiName: 'Project Delivery',
      target: 10,
      achieved: 12,
      progress: 120,
      status: 'exceeded',
      avatar: 'JS'
    },
    {
      id: 'KPI002',
      employee: 'Sarah Johnson',
      empId: 'EMP002',
      kpiName: 'Product Launches',
      target: 3,
      achieved: 3,
      progress: 100,
      status: 'achieved',
      avatar: 'SJ'
    },
    {
      id: 'KPI003',
      employee: 'Alex Wilson',
      empId: 'EMP005',
      kpiName: 'Sales Targets',
      target: 100,
      achieved: 75,
      progress: 75,
      status: 'in-progress',
      avatar: 'AW'
    }
  ];

  const statusConfig: Record<string, { label: string; class: string }> = {
    completed: { label: 'Completed', class: 'bg-green-100 text-green-700 border-green-200' },
    pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    overdue: { label: 'Overdue', class: 'bg-red-100 text-red-700 border-red-200' }
  };

  const kpiStatusConfig: Record<string, { label: string; class: string }> = {
    exceeded: { label: 'Exceeded', class: 'bg-green-100 text-green-700 border-green-200' },
    achieved: { label: 'Achieved', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    'in-progress': { label: 'In Progress', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    'not-met': { label: 'Not Met', class: 'bg-red-100 text-red-700 border-red-200' }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-slate-200 text-slate-200'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-semibold text-slate-900">{rating.toFixed(1)}</span>
      </div>
    );
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
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Performance Management</h1>
                <p className="text-sm text-slate-600">Track reviews, KPIs, and employee performance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
          <div className="flex items-center gap-2">
            <Select defaultValue="q2-2025">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q2-2025">Q2 2025</SelectItem>
                <SelectItem value="q1-2025">Q1 2025</SelectItem>
                <SelectItem value="q4-2024">Q4 2024</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Performance Review</DialogTitle>
                  <DialogDescription>Initiate a new performance review for an employee</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="review-employee">Employee</Label>
                      <Select>
                        <SelectTrigger id="review-employee">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emp1">John Smith (EMP001)</SelectItem>
                          <SelectItem value="emp2">Sarah Johnson (EMP002)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="review-period">Review Period</Label>
                      <Select>
                        <SelectTrigger id="review-period">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="q2">Q2 2025</SelectItem>
                          <SelectItem value="q1">Q1 2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="review-reviewer">Reviewer</Label>
                    <Select>
                      <SelectTrigger id="review-reviewer">
                        <SelectValue placeholder="Select reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mgr1">Sarah Johnson (Manager)</SelectItem>
                        <SelectItem value="mgr2">Emily Davis (HR Manager)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="review-notes">Review Notes</Label>
                    <Textarea id="review-notes" placeholder="Add any notes or guidelines..." rows={3} />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Review</Button>
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
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">4.2</p>
                  <p className="text-xs text-slate-600">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">182</p>
                  <p className="text-xs text-slate-600">Reviews Done</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">48</p>
                  <p className="text-xs text-slate-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">92%</p>
                  <p className="text-xs text-slate-600">Goals Met</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="kpis">KPI / OKR</TabsTrigger>
            <TabsTrigger value="appraisals">Appraisals</TabsTrigger>
            <TabsTrigger value="goals">Goal Setting</TabsTrigger>
          </TabsList>

          {/* Reviews */}
          <TabsContent value="reviews" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Performance Reviews - Q2 2025</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search reviews..."
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
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Review Period</TableHead>
                      <TableHead>Reviewer</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Completed Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">
                                {review.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{review.employee}</p>
                              <p className="text-xs text-slate-600">{review.empId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{review.department}</TableCell>
                        <TableCell className="text-sm">{review.reviewPeriod}</TableCell>
                        <TableCell className="text-sm">{review.reviewer}</TableCell>
                        <TableCell>
                          {review.rating > 0 ? renderStars(review.rating) : <span className="text-sm text-slate-400">Not rated</span>}
                        </TableCell>
                        <TableCell className="text-sm">{review.completedDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusConfig[review.status].class}>
                            {statusConfig[review.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            {review.status === 'pending' ? 'Complete' : 'View'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* KPIs */}
          <TabsContent value="kpis" className="space-y-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Key Performance Indicators - Q2 2025</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add KPI
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>KPI Name</TableHead>
                      <TableHead className="text-right">Target</TableHead>
                      <TableHead className="text-right">Achieved</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kpis.map((kpi) => (
                      <TableRow key={kpi.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                {kpi.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{kpi.employee}</p>
                              <p className="text-xs text-slate-600">{kpi.empId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium">{kpi.kpiName}</TableCell>
                        <TableCell className="text-right text-sm">{kpi.target}</TableCell>
                        <TableCell className="text-right text-sm font-semibold">{kpi.achieved}</TableCell>
                        <TableCell>
                          <div className="w-32">
                            <div className="flex items-center gap-2 mb-1">
                              <Progress value={kpi.progress > 100 ? 100 : kpi.progress} className="h-2" />
                              <span className="text-xs font-medium whitespace-nowrap">{kpi.progress}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={kpiStatusConfig[kpi.status].class}>
                            {kpiStatusConfig[kpi.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appraisals */}
          <TabsContent value="appraisals" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Appraisals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center py-8">Appraisal management interface would be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goal Setting */}
          <TabsContent value="goals" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Goal Setting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 text-center py-8">Goal setting interface would be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
