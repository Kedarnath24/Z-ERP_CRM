import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Sparkles, TrendingUp, MapPin, Briefcase, Eye, UserCheck, Calendar } from 'lucide-react';

export default function AIMatchingModule() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const matchedCandidates = [
    {
      id: '1',
      name: 'Sarah Johnson',
      matchedJob: 'Senior Full Stack Developer',
      matchScore: 94,
      skillsMatch: 92,
      experienceMatch: 95,
      locationMatch: 100,
      location: 'Remote',
      experience: '8 years'
    },
    {
      id: '2',
      name: 'Michael Chen',
      matchedJob: 'Senior Full Stack Developer',
      matchScore: 88,
      skillsMatch: 90,
      experienceMatch: 85,
      locationMatch: 90,
      location: 'New York, NY',
      experience: '7 years'
    },
    {
      id: '3',
      name: 'Amanda Rodriguez',
      matchedJob: 'Senior Full Stack Developer',
      matchScore: 85,
      skillsMatch: 88,
      experienceMatch: 82,
      locationMatch: 85,
      location: 'San Francisco, CA',
      experience: '6 years'
    },
    {
      id: '4',
      name: 'David Kim',
      matchedJob: 'Senior Full Stack Developer',
      matchScore: 82,
      skillsMatch: 85,
      experienceMatch: 80,
      locationMatch: 80,
      location: 'Seattle, WA',
      experience: '5 years'
    },
    {
      id: '5',
      name: 'Emily Watson',
      matchedJob: 'Senior Full Stack Developer',
      matchScore: 78,
      skillsMatch: 80,
      experienceMatch: 75,
      locationMatch: 80,
      location: 'Austin, TX',
      experience: '5 years'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-700';
    if (score >= 80) return 'text-orange-700';
    return 'text-blue-700';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 border-green-200';
    if (score >= 80) return 'bg-orange-100 border-orange-200';
    return 'bg-blue-100 border-blue-200';
  };

  return (
    <div className="space-y-6">
      {/* CV Upload Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI-Powered Profile Matching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 font-medium mb-2">Upload CV/Resume</p>
              <p className="text-sm text-slate-500 mb-4">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-slate-400">
                Supported formats: PDF, DOC, DOCX (Max 10MB)
              </p>
              <Button className="mt-4">
                Browse Files
              </Button>
            </div>

            {uploadedFile && (
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">{uploadedFile}</p>
                    <p className="text-xs text-slate-600">2.4 MB • Uploaded</p>
                  </div>
                </div>
                <Button>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Process CV
                </Button>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">AI Matching Features</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Intelligent skills extraction and matching</li>
                    <li>• Experience level analysis</li>
                    <li>• Location preference matching</li>
                    <li>• Automated job recommendations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matching Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>AI Match Results</CardTitle>
            <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
              5 matches found
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Matched Job</TableHead>
                <TableHead>Match Score</TableHead>
                <TableHead>Skills Match</TableHead>
                <TableHead>Experience Match</TableHead>
                <TableHead>Location Match</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matchedCandidates.map((candidate) => (
                <TableRow key={candidate.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{candidate.name}</div>
                      <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {candidate.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Briefcase className="h-3 w-3 text-slate-500" />
                      {candidate.matchedJob}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Badge variant="outline" className={getScoreBgColor(candidate.matchScore)}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {candidate.matchScore}%
                      </Badge>
                      <Progress value={candidate.matchScore} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className={`text-sm font-semibold ${getScoreColor(candidate.skillsMatch)}`}>
                        {candidate.skillsMatch}%
                      </div>
                      <Progress value={candidate.skillsMatch} className="h-1.5 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className={`text-sm font-semibold ${getScoreColor(candidate.experienceMatch)}`}>
                        {candidate.experienceMatch}%
                      </div>
                      <Progress value={candidate.experienceMatch} className="h-1.5 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className={`text-sm font-semibold ${getScoreColor(candidate.locationMatch)}`}>
                        {candidate.locationMatch}%
                      </div>
                      <Progress value={candidate.locationMatch} className="h-1.5 w-16" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" title="View Profile">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Shortlist">
                        <UserCheck className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Schedule Interview">
                        <Calendar className="h-4 w-4 text-purple-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Match Score Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Match Score Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <div>
                <p className="font-semibold text-green-900">Excellent Match</p>
                <p className="text-sm text-green-700">90% and above</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-orange-600"></div>
              <div>
                <p className="font-semibold text-orange-900">Good Match</p>
                <p className="text-sm text-orange-700">80% - 89%</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <div>
                <p className="font-semibold text-blue-900">Potential Match</p>
                <p className="text-sm text-blue-700">Below 80%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Avg Match Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">85.4%</div>
            <p className="text-xs text-slate-600 mt-1">For this position</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Top Skill Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">87%</div>
            <p className="text-xs text-slate-600 mt-1">React & TypeScript</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">CVs Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">248</div>
            <p className="text-xs text-green-600 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
