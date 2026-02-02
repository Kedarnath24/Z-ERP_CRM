import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, List, Video, MapPin, Phone, Clock, User, Edit, Bell, CheckCircle } from 'lucide-react';

export default function InterviewScheduleModule() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const interviews = [
    {
      id: '1',
      candidateName: 'Sarah Johnson',
      jobTitle: 'Senior Full Stack Developer',
      round: 'Technical Round',
      interviewer: 'John Smith',
      mode: 'video',
      date: '2026-01-16',
      time: '10:00 AM',
      status: 'scheduled'
    },
    {
      id: '2',
      candidateName: 'Michael Chen',
      jobTitle: 'Product Manager',
      round: 'Hiring Manager',
      interviewer: 'Emily Davis',
      mode: 'in-person',
      date: '2026-01-16',
      time: '2:00 PM',
      status: 'scheduled'
    },
    {
      id: '3',
      candidateName: 'Jessica Martinez',
      jobTitle: 'UX Designer',
      round: 'Portfolio Review',
      interviewer: 'Alex Thompson',
      mode: 'video',
      date: '2026-01-17',
      time: '11:00 AM',
      status: 'scheduled'
    },
    {
      id: '4',
      candidateName: 'David Wilson',
      jobTitle: 'DevOps Engineer',
      round: 'Technical Round',
      interviewer: 'John Smith',
      mode: 'phone',
      date: '2026-01-17',
      time: '3:30 PM',
      status: 'scheduled'
    },
    {
      id: '5',
      candidateName: 'Amanda Brown',
      jobTitle: 'Senior Full Stack Developer',
      round: 'Final Round',
      interviewer: 'Sarah Williams',
      mode: 'in-person',
      date: '2026-01-15',
      time: '9:00 AM',
      status: 'completed'
    }
  ];

  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentDay = 15;

  const getInterviewsForDay = (day: number) => {
    const dateStr = `2026-01-${String(day).padStart(2, '0')}`;
    return interviews.filter(i => i.date === dateStr);
  };

  const statusConfig: Record<string, { label: string; class: string }> = {
    scheduled: { label: 'Scheduled', class: 'bg-blue-100 text-blue-700 border-blue-200' },
    completed: { label: 'Completed', class: 'bg-green-100 text-green-700 border-green-200' },
    cancelled: { label: 'Cancelled', class: 'bg-red-100 text-red-700 border-red-200' }
  };

  const modeConfig: Record<string, { icon: any; class: string }> = {
    video: { icon: Video, class: 'bg-purple-100 text-purple-700 border-purple-200' },
    'in-person': { icon: MapPin, class: 'bg-blue-100 text-blue-700 border-blue-200' },
    phone: { icon: Phone, class: 'bg-green-100 text-green-700 border-green-200' }
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Interview Schedule</CardTitle>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'calendar')}>
              <TabsList>
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Calendar View
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
      </Card>

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Round</TableHead>
                  <TableHead>Interviewer</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interviews.map((interview) => {
                  const ModeIcon = modeConfig[interview.mode].icon;
                  return (
                    <TableRow key={interview.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-600" />
                          <span className="font-medium">{interview.candidateName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{interview.jobTitle}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                          {interview.round}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{interview.interviewer}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={modeConfig[interview.mode].class}>
                          <ModeIcon className="h-3 w-3 mr-1" />
                          {interview.mode === 'in-person' ? 'In-person' : interview.mode.charAt(0).toUpperCase() + interview.mode.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-slate-500" />
                          {new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {interview.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusConfig[interview.status].class}>
                          {statusConfig[interview.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {interview.status === 'scheduled' && (
                            <>
                              <Button variant="ghost" size="sm">
                                <Bell className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">January 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {/* Calendar Header */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-slate-600 py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {calendarDays.map((day) => {
                const dayInterviews = getInterviewsForDay(day);
                const isToday = day === currentDay;
                
                return (
                  <div
                    key={day}
                    className={`min-h-24 border rounded-lg p-2 hover:bg-slate-50 transition-colors cursor-pointer ${
                      isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-700' : 'text-slate-900'}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayInterviews.map((interview) => (
                        <div
                          key={interview.id}
                          className={`text-xs p-1 rounded ${
                            interview.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          <div className="font-medium truncate">{interview.time}</div>
                          <div className="truncate">{interview.candidateName}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
                <span className="text-slate-600">Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                <span className="text-slate-600">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-50 border border-blue-300"></div>
                <span className="text-slate-600">Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interview Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">18</div>
            <p className="text-xs text-slate-600 mt-1">Interviews scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">45</div>
            <p className="text-xs text-green-600 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">8</div>
            <p className="text-xs text-orange-600 mt-1">Awaiting interviewer notes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
