import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Briefcase, 
  Users, 
  Calendar, 
  CheckCircle,
  FileText,
  CalendarClock,
  UserCheck,
  Sparkles,
  Plus,
  BarChart3,
  TrendingUp,
  Clock,
  AlertCircle,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

// Sub-module components
import JobDescriptionsModule from './job-descriptions';
import InterviewScheduleModule from './interview-schedule';
import CandidatesModule from './candidates';
import AIMatchingModule from './ai-matching';

const PIPELINE_DATA = [
  { name: 'Applied', value: 145, color: '#94a3b8' },
  { name: 'Screening', value: 45, color: '#f59e0b' },
  { name: 'Interview', value: 28, color: '#8b5cf6' },
  { name: 'Technical', value: 12, color: '#3b82f6' },
  { name: 'Offer', value: 5, color: '#10b981' },
];

const RECENT_ACTIVITY = [
  { id: 1, user: 'Sarah Jenkins', action: 'applied for', target: 'Senior Developer', time: '2h ago', icon: <FileText className="h-4 w-4" /> },
  { id: 2, user: 'Interview scheduled', action: 'with', target: 'Michael Chen', time: '4h ago', icon: <CalendarClock className="h-4 w-4" /> },
  { id: 3, user: 'Offer accepted', action: 'by', target: 'Emily Davis', time: 'Yesterday', icon: <CheckCircle className="h-4 w-4" /> },
];

export default function RecruitmentDashboard() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isScheduleInterviewOpen, setIsScheduleInterviewOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-purple-600" />
              Recruitment
            </h1>
            <p className="text-slate-600 mt-1">
              Manage job openings, candidates, interviews, and hiring pipeline
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isScheduleInterviewOpen} onOpenChange={setIsScheduleInterviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-slate-200">
                  <CalendarClock className="h-4 w-4 mr-2 text-slate-500" />
                  Schedule Interview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Schedule Interview</DialogTitle>
                  <DialogDescription>
                    Book a new interview slot for a candidate.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Candidate Name</Label>
                    <Input placeholder="Enter candidate name..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Position</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fullstack">Senior Full Stack Developer</SelectItem>
                        <SelectItem value="pm">Product Manager</SelectItem>
                        <SelectItem value="ux">UX Designer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input type="time" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Interview Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="inperson">In Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsScheduleInterviewOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsScheduleInterviewOpen(false)} className="bg-purple-600 text-white hover:bg-purple-700">Schedule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isPostJobOpen} onOpenChange={setIsPostJobOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Post New Job Opening</DialogTitle>
                  <DialogDescription>
                    Create a new job listing to attract top talent.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input placeholder="e.g. Senior Full Stack Developer" />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eng">Engineering</SelectItem>
                          <SelectItem value="mkt">Marketing</SelectItem>
                          <SelectItem value="prod">Product</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Employment Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full-time</SelectItem>
                          <SelectItem value="part">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input placeholder="e.g. Remote, New York, NY" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Salary Range</Label>
                    <Input placeholder="e.g. ,000 - ,000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Job Description</Label>
                    <Textarea 
                      placeholder="Enter detailed job description, requirements and benefits..." 
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPostJobOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsPostJobOpen(false)} className="bg-purple-600 hover:bg-purple-700 text-white">Publish Position</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium whitespace-nowrap">Active Jobs</p>
                <h3 className="text-2xl font-bold">12</h3>
              </div>
              <div className="ml-auto flex items-center text-xs text-green-600 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-slate-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Candidates</p>
                <h3 className="text-2xl font-bold">248</h3>
              </div>
              <div className="ml-auto flex items-center text-xs text-green-600 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Interviews</p>
                <h3 className="text-2xl font-bold">15</h3>
              </div>
              <div className="ml-auto flex items-center text-xs text-slate-500">
                Today
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Hired</p>
                <h3 className="text-2xl font-bold">34</h3>
              </div>
              <div className="ml-auto flex items-center text-xs text-slate-400">
                This Year
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Hiring Pipeline</CardTitle>
                <CardDescription>Candidate distribution across stages</CardDescription>
              </div>
              <BarChart3 className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PIPELINE_DATA} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                      {PIPELINE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest updates in hiring</CardDescription>
              </div>
              <Clock className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {RECENT_ACTIVITY.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        <span className="text-purple-600">{activity.user}</span> {activity.action} {activity.target}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-xs gap-2">
                  View All Activity
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-100/80 p-1 border border-slate-200">
            <TabsTrigger value="jobs" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm px-6">
              Job Descriptions
            </TabsTrigger>
            <TabsTrigger value="candidates" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm px-6">
              Candidates
            </TabsTrigger>
            <TabsTrigger value="interviews" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm px-6">
              Interviews
            </TabsTrigger>
            <TabsTrigger value="ai-match" className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-sm px-6 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Matching
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-0">
            <JobDescriptionsModule />
          </TabsContent>

          <TabsContent value="candidates" className="mt-0">
            <CandidatesModule />
          </TabsContent>

          <TabsContent value="interviews" className="mt-0">
            <InterviewScheduleModule />
          </TabsContent>

          <TabsContent value="ai-match" className="mt-0">
            <AIMatchingModule />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
