import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Plus, MapPin, Briefcase, DollarSign, Users, Eye, Edit, X } from 'lucide-react';

export default function JobDescriptionsModule() {
  const [searchQuery, setSearchQuery] = useState('');

  const jobs = [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salaryRange: '$120K - $150K',
      openings: 2,
      applications: 45,
      status: 'open',
      postedDate: '2026-01-10'
    },
    {
      id: '2',
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      salaryRange: '$130K - $160K',
      openings: 1,
      applications: 32,
      status: 'open',
      postedDate: '2026-01-08'
    },
    {
      id: '3',
      title: 'UX Designer',
      department: 'Design',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salaryRange: '$100K - $130K',
      openings: 1,
      applications: 28,
      status: 'open',
      postedDate: '2026-01-12'
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Contract',
      salaryRange: '$110K - $140K',
      openings: 1,
      applications: 19,
      status: 'open',
      postedDate: '2026-01-05'
    },
    {
      id: '5',
      title: 'Sales Manager',
      department: 'Sales',
      location: 'Chicago, IL',
      type: 'Full-time',
      salaryRange: '$90K - $120K',
      openings: 1,
      applications: 52,
      status: 'closed',
      postedDate: '2025-12-28'
    }
  ];

  const statusConfig: Record<string, { label: string; class: string }> = {
    open: { label: 'Open', class: 'bg-green-100 text-green-700 border-green-200' },
    closed: { label: 'Closed', class: 'bg-slate-100 text-slate-700 border-slate-200' }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card>
        <CardHeader>
          <CardTitle>Job Openings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search job titles, departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all-dept">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-dept">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-type">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-type">All Types</SelectItem>
                  <SelectItem value="fulltime">Full-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="parttime">Part-time</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Salary Range</TableHead>
                <TableHead>Openings</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">{job.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-slate-500" />
                      {job.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      {job.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="h-3 w-3 text-slate-500" />
                      {job.salaryRange}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                      {job.openings} {job.openings === 1 ? 'opening' : 'openings'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-slate-500" />
                      <span className="font-medium">{job.applications}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[job.status].class}>
                      {statusConfig[job.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {job.status === 'open' && (
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Job Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Job Openings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-slate-600 mt-1">5 added this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">176</div>
            <p className="text-xs text-blue-600 mt-1">+23% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Avg Applications/Job</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">35</div>
            <p className="text-xs text-slate-600 mt-1">Per job posting</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
