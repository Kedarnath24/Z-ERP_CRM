import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Plus, 
  User, 
  MoreVertical,
  Mail,
  Phone,
  FileText,
  Building,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const CANDIDATES_DATA = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'Senior Full Stack Developer',
    status: 'Interviewing',
    source: 'LinkedIn',
    experience: '8 years',
    email: 'sarah.j@example.com',
    skills: ['React', 'Node.js', 'AWS']
  },
  {
    id: 2,
    name: 'Michael Chen',
    position: 'Product Manager',
    status: 'Screening',
    source: 'Referral',
    experience: '5 years',
    email: 'm.chen@example.com',
    skills: ['Agile', 'Jira', 'Roadmap']
  },
  {
    id: 3,
    name: 'Emily Davis',
    position: 'UX Designer',
    status: 'Offer Sent',
    source: 'Indeed',
    experience: '4 years',
    email: 'emily.d@example.com',
    skills: ['Figma', 'User Research', 'Testing']
  },
  {
    id: 4,
    name: 'James Wilson',
    position: 'DevOps Engineer',
    status: 'Rejected',
    source: 'Career Site',
    experience: '7 years',
    email: 'james.w@example.com',
    skills: ['Docker', 'K8s', 'Terraform']
  }
];

export default function CandidatesModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
  const [candidates, setCandidates] = useState(CANDIDATES_DATA);

  const updateStatus = (id: number, status: string) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSource = sourceFilter === 'all' || c.source.toLowerCase() === sourceFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Interviewing': return 'bg-blue-100 text-blue-700';
      case 'Screening': return 'bg-yellow-100 text-yellow-700';
      case 'Offer Sent': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">Candidate Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search candidates by name, skills, position..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="offer sent">Offer Sent</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="indeed">Indeed</SelectItem>
                  <SelectItem value="career site">Career Site</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <Dialog open={isAddCandidateOpen} onOpenChange={setIsAddCandidateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-slate-900 text-white hover:bg-slate-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Candidate
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Candidate</DialogTitle>
                    <DialogDescription>
                      Manually add a candidate to the pipeline.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Position</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Senior Full Stack Developer</SelectItem>
                          <SelectItem value="2">Product Manager</SelectItem>
                          <SelectItem value="3">UX Designer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>CV / Resume</Label>
                      <Input type="file" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddCandidateOpen(false)}>Cancel</Button>
                    <Button onClick={() => setIsAddCandidateOpen(false)} className="bg-slate-900 text-white">Save Candidate</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredCandidates.map((candidate) => (
          <Card key={candidate.id} className="hover:shadow-sm transition-shadow group">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {candidate.name}
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </h3>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <Building className="h-3 w-3" /> {candidate.position}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-slate-600">
                    <Mail className="h-3.5 w-3.5" />
                    {candidate.email}
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <Badge variant="outline" className="font-normal">{candidate.experience}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600">
                    <span className="text-xs text-slate-400 capitalize">Source:</span>
                    <span className="font-medium text-slate-700">{candidate.source}</span>
                  </div>
                  <Badge className={`${getStatusColor(candidate.status)} font-semibold border-0`}>
                    {candidate.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <Button variant="outline" size="sm">View CV</Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 uppercase">Top Skills:</span>
                <div className="flex gap-2">
                  {candidate.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-slate-50 text-slate-600 text-[10px] px-2 py-0">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredCandidates.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed rounded-lg">
            <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No candidates found</h3>
            <p className="text-slate-500">No candidates match your current filter settings.</p>
          </div>
        )}
      </div>
    </div>
  );
}
