import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FolderKanban,
  Plus,
  Filter,
  Download,
  RefreshCw,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  PauseCircle,
  Circle
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

export default function ProjectsList() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  // Form state for new/edit project
  const [projectForm, setProjectForm] = useState({
    name: '',
    customer: '',
    description: '',
    startDate: '',
    deadline: '',
    budget: '',
    status: 'not-started',
    tags: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Mock data
  const statusStats = [
    { label: 'Not Started', value: 12, icon: Circle, color: 'text-slate-600', bgColor: 'bg-slate-100', borderColor: 'border-slate-200' },
    { label: 'In Progress', value: 28, icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
    { label: 'On Hold', value: 5, icon: PauseCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200' },
    { label: 'Cancelled', value: 3, icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' },
    { label: 'Finished', value: 45, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' }
  ];

  const projects = [
    {
      id: 1,
      name: 'E-Commerce Platform Redesign',
      customer: 'TechCorp Solutions',
      tags: ['Web', 'UI/UX'],
      startDate: '2026-01-10',
      deadline: '2026-03-15',
      members: 8,
      status: 'in-progress',
      progress: 65
    },
    {
      id: 2,
      name: 'Mobile Banking App',
      customer: 'FirstBank Ltd',
      tags: ['Mobile', 'Fintech'],
      startDate: '2025-12-01',
      deadline: '2026-02-28',
      members: 12,
      status: 'in-progress',
      progress: 78
    },
    {
      id: 3,
      name: 'CRM System Integration',
      customer: 'SalesForce Pro',
      tags: ['Backend', 'API'],
      startDate: '2026-01-05',
      deadline: '2026-04-20',
      members: 6,
      status: 'not-started',
      progress: 0
    },
    {
      id: 4,
      name: 'Data Analytics Dashboard',
      customer: 'Analytics Inc',
      tags: ['Data', 'Visualization'],
      startDate: '2025-11-15',
      deadline: '2026-01-30',
      members: 5,
      status: 'finished',
      progress: 100
    },
    {
      id: 5,
      name: 'Supply Chain Management',
      customer: 'LogiTech Corp',
      tags: ['ERP', 'Logistics'],
      startDate: '2025-10-20',
      deadline: '2026-02-10',
      members: 10,
      status: 'on-hold',
      progress: 45
    },
    {
      id: 6,
      name: 'Cloud Migration Project',
      customer: 'CloudFirst Systems',
      tags: ['Cloud', 'DevOps'],
      startDate: '2025-09-01',
      deadline: '2025-12-31',
      members: 7,
      status: 'finished',
      progress: 100
    },
    {
      id: 7,
      name: 'AI Chatbot Development',
      customer: 'AI Innovations',
      tags: ['AI', 'ML'],
      startDate: '2026-01-15',
      deadline: '2026-05-30',
      members: 9,
      status: 'in-progress',
      progress: 25
    },
    {
      id: 8,
      name: 'Security Audit Platform',
      customer: 'SecureNet Ltd',
      tags: ['Security', 'Compliance'],
      startDate: '2025-12-10',
      deadline: '2026-03-01',
      members: 4,
      status: 'cancelled',
      progress: 30
    }
  ];

  const statusConfig: Record<string, { label: string; class: string }> = {
    'not-started': { label: 'Not Started', class: 'bg-slate-100 text-slate-700 border-slate-200' },
    'in-progress': { label: 'In Progress', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    'on-hold': { label: 'On Hold', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    cancelled: { label: 'Cancelled', class: 'bg-red-100 text-red-700 border-red-200' },
    finished: { label: 'Finished', class: 'bg-green-100 text-green-700 border-green-200' }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewProject = (projectId: number) => {
    setLocation(`/projects/${projectId}`);
  };

  const validateProjectForm = () => {
    const errors: Record<string, string> = {};
    if (!projectForm.name.trim()) errors.name = 'Project name is required';
    if (!projectForm.customer.trim()) errors.customer = 'Customer is required';
    if (!projectForm.startDate) errors.startDate = 'Start date is required';
    if (!projectForm.deadline) errors.deadline = 'Deadline is required';
    if (projectForm.startDate && projectForm.deadline && projectForm.startDate > projectForm.deadline) {
      errors.deadline = 'Deadline must be after start date';
    }
    if (projectForm.budget && isNaN(Number(projectForm.budget))) {
      errors.budget = 'Budget must be a valid number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetProjectForm = () => {
    setProjectForm({
      name: '',
      customer: '',
      description: '',
      startDate: '',
      deadline: '',
      budget: '',
      status: 'not-started',
      tags: ''
    });
    setFormErrors({});
  };

  const handleCreateProject = () => {
    if (!validateProjectForm()) return;
    
    toast({
      title: "Project Created",
      description: `Project "${projectForm.name}" has been created successfully.`,
    });
    setShowNewProjectDialog(false);
    resetProjectForm();
  };

  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    setProjectForm({
      name: project.name,
      customer: project.customer,
      description: '',
      startDate: project.startDate,
      deadline: project.deadline,
      budget: '',
      status: project.status,
      tags: project.tags.join(', ')
    });
    setShowEditDialog(true);
  };

  const handleUpdateProject = () => {
    if (!validateProjectForm()) return;
    
    toast({
      title: "Project Updated",
      description: `Project "${projectForm.name}" has been updated successfully.`,
    });
    setShowEditDialog(false);
    resetProjectForm();
    setSelectedProject(null);
  };

  const handleDeleteProject = (project: any) => {
    setSelectedProject(project);
    setShowDeleteDialog(true);
  };

  const confirmDeleteProject = () => {
    toast({
      title: "Project Deleted",
      description: `Project "${selectedProject?.name}" has been deleted.`,
      variant: "destructive"
    });
    setShowDeleteDialog(false);
    setSelectedProject(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <FolderKanban className="h-8 w-8 text-blue-600" />
              Projects Summary
            </h1>
            <p className="text-sm text-slate-600 mt-1">View and manage all projects</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" onClick={() => setShowNewProjectDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {statusStats.map((stat, index) => (
            <Card key={index} className={`hover:shadow-md transition-shadow border ${stat.borderColor}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.label}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-600 mt-1">projects</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Controls */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="finished">Finished</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-slate-50">
                    <TableCell>
                      <button
                        onClick={() => handleViewProject(project.id)}
                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline text-left"
                      >
                        {project.name}
                      </button>
                    </TableCell>
                    <TableCell className="text-slate-600">{project.customer}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {project.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{project.startDate}</TableCell>
                    <TableCell className="text-slate-600">{project.deadline}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">{project.members}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[project.status].class}>
                        {statusConfig[project.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProject(project.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditProject(project)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteProject(project)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* New Project Dialog */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Fill in the project details to create a new project.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="Enter project name"
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer">Customer *</Label>
                <Input
                  id="customer"
                  value={projectForm.customer}
                  onChange={(e) => setProjectForm({ ...projectForm, customer: e.target.value })}
                  placeholder="Enter customer name"
                  className={formErrors.customer ? 'border-red-500' : ''}
                />
                {formErrors.customer && <p className="text-xs text-red-500">{formErrors.customer}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="Enter project description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={projectForm.startDate}
                  onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                  className={formErrors.startDate ? 'border-red-500' : ''}
                />
                {formErrors.startDate && <p className="text-xs text-red-500">{formErrors.startDate}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={projectForm.deadline}
                  onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
                  className={formErrors.deadline ? 'border-red-500' : ''}
                />
                {formErrors.deadline && <p className="text-xs text-red-500">{formErrors.deadline}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                  placeholder="Enter budget amount"
                  className={formErrors.budget ? 'border-red-500' : ''}
                />
                {formErrors.budget && <p className="text-xs text-red-500">{formErrors.budget}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={projectForm.status} onValueChange={(value) => setProjectForm({ ...projectForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="finished">Finished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={projectForm.tags}
                onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                placeholder="e.g., Web, UI/UX, Mobile"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowNewProjectDialog(false); resetProjectForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update the project details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Project Name *</Label>
                <Input
                  id="edit-name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="Enter project name"
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-customer">Customer *</Label>
                <Input
                  id="edit-customer"
                  value={projectForm.customer}
                  onChange={(e) => setProjectForm({ ...projectForm, customer: e.target.value })}
                  placeholder="Enter customer name"
                  className={formErrors.customer ? 'border-red-500' : ''}
                />
                {formErrors.customer && <p className="text-xs text-red-500">{formErrors.customer}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="Enter project description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date *</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={projectForm.startDate}
                  onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                  className={formErrors.startDate ? 'border-red-500' : ''}
                />
                {formErrors.startDate && <p className="text-xs text-red-500">{formErrors.startDate}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-deadline">Deadline *</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={projectForm.deadline}
                  onChange={(e) => setProjectForm({ ...projectForm, deadline: e.target.value })}
                  className={formErrors.deadline ? 'border-red-500' : ''}
                />
                {formErrors.deadline && <p className="text-xs text-red-500">{formErrors.deadline}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-budget">Budget ($)</Label>
                <Input
                  id="edit-budget"
                  type="number"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                  placeholder="Enter budget amount"
                  className={formErrors.budget ? 'border-red-500' : ''}
                />
                {formErrors.budget && <p className="text-xs text-red-500">{formErrors.budget}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={projectForm.status} onValueChange={(value) => setProjectForm({ ...projectForm, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="finished">Finished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma separated)</Label>
              <Input
                id="edit-tags"
                value={projectForm.tags}
                onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                placeholder="e.g., Web, UI/UX, Mobile"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditDialog(false); resetProjectForm(); setSelectedProject(null); }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProject}>Update Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProject?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteDialog(false); setSelectedProject(null); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProject}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
