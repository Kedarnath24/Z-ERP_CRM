import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  User,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock3,
  AlertCircle,
  CalendarDays
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const INTERVIEWS_DATA = [
  {
    id: 1,
    candidate: 'John Doe',
    position: 'Senior Full Stack Developer',
    date: new Date(2024, 2, 25),
    time: '10:00 AM',
    type: 'Video',
    status: 'Scheduled',
    round: 'Technical'
  },
  {
    id: 2,
    candidate: 'Jane Smith',
    position: 'UX Designer',
    date: new Date(2024, 2, 25),
    time: '02:00 PM',
    type: 'Phone',
    status: 'Completed',
    round: 'Initial'
  },
  {
    id: 3,
    candidate: 'Robert Wilson',
    position: 'Product Manager',
    date: new Date(2024, 2, 26),
    time: '11:00 AM',
    type: 'Onsite',
    status: 'Scheduled',
    round: 'Cultural Fit'
  }
];

export default function InterviewScheduleModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const filteredInterviews = INTERVIEWS_DATA.filter(i => {
    const matchesSearch = i.candidate.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         i.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !date || format(i.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    return matchesSearch && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200"><Clock3 className="h-3 w-3 mr-1" /> Scheduled</Badge>;
      case 'Completed':
        return <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video': return <Video className="h-4 w-4 text-purple-500" />;
      case 'Phone': return <Phone className="h-4 w-4 text-blue-500" />;
      default: return <MapPin className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search candidates or positions..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={!date ? "text-muted-foreground" : ""}>
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {date ? format(date, "PPP") : "Filter by Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                  {date && (
                    <div className="p-2 border-t text-center">
                      <Button variant="ghost" size="sm" onClick={() => setDate(undefined)}>Clear Date</Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredInterviews.map((interview) => (
          <Card key={interview.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{interview.candidate}</h3>
                    <p className="text-sm text-slate-500">{interview.position}  {interview.round} Round</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:flex md:items-center gap-x-8 gap-y-2">
                  <div className="flex items-center text-sm text-slate-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-slate-400" />
                    {format(interview.date, 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Clock className="h-4 w-4 mr-2 text-slate-400" />
                    {interview.time}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <span className="mr-2">{getTypeIcon(interview.type)}</span>
                    {interview.type}
                  </div>
                  <div>
                    {getStatusBadge(interview.status)}
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Reschedule</DropdownMenuItem>
                      <DropdownMenuItem>View Candidate</DropdownMenuItem>
                      <DropdownMenuItem>Add Feedback</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Cancel Interview</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredInterviews.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed rounded-lg">
            <CalendarIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg text-slate-900 font-semibold mb-1">No interviews found</h3>
            <p className="text-slate-500">No interviews match your search or date filter.</p>
            {date && (
                <Button variant="link" onClick={() => setDate(undefined)} className="mt-2 text-purple-600">
                    View all interviews
                </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
