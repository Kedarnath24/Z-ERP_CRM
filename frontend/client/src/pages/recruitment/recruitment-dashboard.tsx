import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  CheckCircle,
  FileText,
  CalendarClock,
  UserCheck,
  Sparkles,
  Plus
} from 'lucide-react';

// Sub-module components
import JobDescriptionsModule from './job-descriptions';
import InterviewScheduleModule from './interview-schedule';
import CandidatesModule from './candidates';
import AIMatchingModule from './ai-matching';

export default function RecruitmentDashboard() {
  const [activeTab, setActiveTab] = useState('jobs');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
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
            <Button variant="outline">
              <CalendarClock className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">24</div>
              <p className="text-xs text-slate-600 mt-1">Across 8 departments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Candidates</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">156</div>
              <p className="text-xs text-slate-600 mt-1">In hiring pipeline</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">18</div>
              <p className="text-xs text-slate-600 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positions Filled</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">12</div>
              <p className="text-xs text-green-600 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recruitment Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="jobs" className="gap-2">
              <FileText className="h-4 w-4" />
              Job Descriptions
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2">
              <CalendarClock className="h-4 w-4" />
              Interview Schedule
            </TabsTrigger>
            <TabsTrigger value="candidates" className="gap-2">
              <UserCheck className="h-4 w-4" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="ai-matching" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Profile Matching
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <JobDescriptionsModule />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <InterviewScheduleModule />
          </TabsContent>

          <TabsContent value="candidates" className="space-y-4">
            <CandidatesModule />
          </TabsContent>

          <TabsContent value="ai-matching" className="space-y-4">
            <AIMatchingModule />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
