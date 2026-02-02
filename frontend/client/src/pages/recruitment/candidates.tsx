import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Plus, User, Briefcase, Building, Eye, FileText, Calendar } from 'lucide-react';

export default function CandidatesModule() {
  const [searchQuery, setSearchQuery] = useState('');

  const candidates = [
    {
      id: '1',
      name: 'Sarah Johnson',
      appliedPosition: 'Senior Full Stack Developer',
      experience: '8 years',
      currentCompany: 'Tech Corp',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      status: 'interview',
      source: 'LinkedIn'
    },
    {
      id: '2',
      name: 'Michael Chen',
      appliedPosition: 'Product Manager',
      experience: '6 years',
      currentCompany: 'StartupXYZ',
      skills: ['Agile', 'Product Strategy', 'Analytics', 'Roadmapping'],
      status: 'screening',
      source: 'Referral'
    },
    {
      id: '3',
      name: 'Jessica Martinez',
      appliedPosition: 'UX Designer',
      experience: '5 years',
      currentCompany: 'Design Studio',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      status: 'offer',
      source: 'Company Website'
    },
    {
      id: '4',
      name: 'David Wilson',
      appliedPosition: 'DevOps Engineer',
      experience: '7 years',
      currentCompany: 'Cloud Services Inc',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
      status: 'interview',
      source: 'Indeed'
    },
    {
      id: '5',
      name: 'Amanda Brown',
      appliedPosition: 'Senior Full Stack Developer',
      experience: '9 years',
      currentCompany: 'Enterprise Solutions',
      skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices'],
      status: 'hired',
      source: 'LinkedIn'
    },
    {
      id: '6',
      name: 'Robert Taylor',
      appliedPosition: 'Sales Manager',
      experience: '10 years',
      currentCompany: 'SaaS Company',
      skills: ['B2B Sales', 'Team Leadership', 'CRM', 'Negotiation'],
      status: 'rejected',
      source: 'Glassdoor'
    }
  ];

  const statusConfig: Record<string, { label: string; class: string }> = {
    screening: { label: 'Screening', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    interview: { label: 'Interview', class: 'bg-purple-100 text-purple-700 border-purple-200' },
    offer: { label: 'Offer', class: 'bg-orange-100 text-orange-700 border-orange-200' },
    hired: { label: 'Hired', class: 'bg-green-100 text-green-700 border-green-200' },
    rejected: { label: 'Rejected', class: 'bg-red-100 text-red-700 border-red-200' }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search candidates by name, skills, position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all-status">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">All Status</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all-source">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-source">All Sources</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="indeed">Indeed</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate Name</TableHead>
                <TableHead>Applied Position</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Current Company</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">{candidate.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Briefcase className="h-3 w-3 text-slate-500" />
                      {candidate.appliedPosition}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{candidate.experience}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Building className="h-3 w-3 text-slate-500" />
                      {candidate.currentCompany}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 3 && (
                        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                          +{candidate.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[candidate.status].class}>
                      {statusConfig[candidate.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{candidate.source}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" title="View Profile">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="View Resume">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Schedule Interview">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pipeline Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Screening</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">42</div>
            <p className="text-xs text-slate-600 mt-1">Under review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Interview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">28</div>
            <p className="text-xs text-slate-600 mt-1">In process</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Offer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">5</div>
            <p className="text-xs text-slate-600 mt-1">Pending acceptance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Hired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">12</div>
            <p className="text-xs text-green-600 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-700">69</div>
            <p className="text-xs text-slate-600 mt-1">Not qualified</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
