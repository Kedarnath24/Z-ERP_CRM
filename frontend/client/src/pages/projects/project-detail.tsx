import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Filter,
  MoreVertical,
  FolderKanban,
  Target,
  DollarSign,
  Users,
  TrendingUp,
  Upload,
  Calendar,
  CheckSquare,
  Clock,
  FileText,
  Settings,
  BarChart3,
  Kanban,
  List,
  GanttChart
} from 'lucide-react';
import { useRoute, useLocation } from 'wouter';

// Import tab components
import ProjectOverviewTab from './tabs/project-overview-tab';
import ProjectTasksTab from './tabs/project-tasks-tab';
import ProjectTimesheetsTab from './tabs/project-timesheets-tab';
import ProjectTeamTab from './tabs/project-team-tab';
import ProjectMilestonesTab from './tabs/project-milestones-tab';
import ProjectClientPortalTab from './tabs/project-client-portal-tab';
import ProjectFilesTab from './tabs/project-files-tab';
import ProjectAutomationTab from './tabs/project-automation-tab';
import ProjectReportsTab from './tabs/project-reports-tab';

export default function ProjectDetail() {
  const [, params] = useRoute('/projects/:id');
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock project data
  const project = {
    id: params?.id,
    name: 'E-Commerce Platform Redesign',
    customer: 'TechCorp Solutions',
    status: 'in-progress',
    progress: 65,
    budget: 150000,
    spent: 97500,
    teamMembers: 8,
    startDate: '2026-01-10',
    deadline: '2026-03-15'
  };

  const statusConfig: Record<string, { label: string; class: string }> = {
    'not-started': { label: 'Not Started', class: 'bg-slate-100 text-slate-700 border-slate-200' },
    'in-progress': { label: 'In Progress', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    'on-hold': { label: 'On Hold', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    cancelled: { label: 'Cancelled', class: 'bg-red-100 text-red-700 border-red-200' },
    finished: { label: 'Finished', class: 'bg-green-100 text-green-700 border-green-200' }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 -mx-6 -mt-6 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLocation('/projects')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FolderKanban className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">{project.name}</h1>
                  <p className="text-sm text-slate-600">{project.customer}</p>
                </div>
              </div>
              <Badge variant="outline" className={statusConfig[project.status].class}>
                {statusConfig[project.status].label}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex w-full justify-start">
              <TabsTrigger value="overview">
                <Target className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="tasks">
                <CheckSquare className="h-4 w-4 mr-2" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="timesheets">
                <Clock className="h-4 w-4 mr-2" />
                Timesheets
              </TabsTrigger>
              <TabsTrigger value="team">
                <Users className="h-4 w-4 mr-2" />
                Team
              </TabsTrigger>
              <TabsTrigger value="milestones">
                <Target className="h-4 w-4 mr-2" />
                Milestones
              </TabsTrigger>
              <TabsTrigger value="client-portal">
                <FileText className="h-4 w-4 mr-2" />
                Client Portal
              </TabsTrigger>
              <TabsTrigger value="files">
                <Upload className="h-4 w-4 mr-2" />
                Files
              </TabsTrigger>
              <TabsTrigger value="automation">
                <Settings className="h-4 w-4 mr-2" />
                Automation
              </TabsTrigger>
              <TabsTrigger value="reports">
                <BarChart3 className="h-4 w-4 mr-2" />
                Reports
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value="overview">
            <ProjectOverviewTab project={project} />
          </TabsContent>

          <TabsContent value="tasks">
            <ProjectTasksTab projectId={project.id} />
          </TabsContent>

          <TabsContent value="timesheets">
            <ProjectTimesheetsTab projectId={project.id} />
          </TabsContent>

          <TabsContent value="team">
            <ProjectTeamTab projectId={project.id} />
          </TabsContent>

          <TabsContent value="milestones">
            <ProjectMilestonesTab projectId={project.id} />
          </TabsContent>

          <TabsContent value="client-portal">
            <ProjectClientPortalTab projectId={project.id} />
          </TabsContent>

          <TabsContent value="files">
            <ProjectFilesTab projectId={project.id} />
          </TabsContent>

          <TabsContent value="automation">
            <ProjectAutomationTab projectId={project.id} />
          </TabsContent>

          <TabsContent value="reports">
            <ProjectReportsTab projectId={project.id} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
