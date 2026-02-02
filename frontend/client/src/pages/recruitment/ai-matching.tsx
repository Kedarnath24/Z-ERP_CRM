import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BrainCircuit,
  User,
  Search,
  ChevronRight
} from 'lucide-react';

export default function AIMatchingModule() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [matchingResults, setMatchingResults] = useState<any[]>([]);

  const simulateMatching = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setMatchingResults([
            { name: 'Sarah Jenkins', score: 94, skills: ['React', 'Node.js', 'AWS'], experience: '8 years', match: 'Ideal Match' },
            { name: 'Michael Chen', score: 88, skills: ['Python', 'Docker', 'React'], experience: '5 years', match: 'Strong Match' },
            { name: 'David Miller', score: 72, skills: ['JavaScript', 'CSS', 'UI Design'], experience: '3 years', match: 'Good Match' }
          ]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-dashed border-2 flex flex-col items-center justify-center p-12 text-center bg-purple-50/30">
          <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-6 text-purple-600">
            <Upload className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Upload CVs for AI Analysis</h2>
          <p className="text-slate-500 mb-8 max-w-sm">
            Drag and drop multiple resumes or click to browse. Our AI will rank them based on job requirements.
          </p>
          
          <div className="flex items-center gap-4">
            <Input type="file" className="hidden" id="cv-upload" multiple onChange={simulateMatching} />
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700" onClick={() => document.getElementById('cv-upload')?.click()}>
              <FileText className="h-4 w-4 mr-2" />
              Select Resumes
            </Button>
            <Button variant="outline" size="lg">
              <BrainCircuit className="h-4 w-4 mr-2" />
              Configure AI Parameters
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              How it Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">1</div>
              <p className="text-sm text-slate-600">Upload candidate CVs in PDF or Word format.</p>
            </div>
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">2</div>
              <p className="text-sm text-slate-600">AI parses skills, experience, and education metadata.</p>
            </div>
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">3</div>
              <p className="text-sm text-slate-600">Profiles are scored against the active job description.</p>
            </div>
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">4</div>
              <p className="text-sm text-slate-600">Get a ranked list of the best-suited candidates.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isUploading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 animate-pulse text-purple-600" />
                  AI Matching Engine is processing CVs...
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {matchingResults.length > 0 && !isUploading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Match Results
            </h3>
            <Button variant="ghost" size="sm">Export Results</Button>
          </div>
          
          <div className="grid gap-4">
            {matchingResults.map((result, idx) => (
              <Card key={idx} className="hover:border-purple-200 transition-colors cursor-pointer group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-slate-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{result.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {result.skills.map((skill: string) => (
                          <Badge key={skill} variant="secondary" className="text-[10px] py-0">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8 text-right">
                    <div className="hidden md:block">
                      <p className="text-xs text-slate-500 uppercase font-semibold">Experience</p>
                      <p className="font-medium">{result.experience}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">AI Match Score</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">
                          {result.score}%
                        </span>
                        <Badge className={result.score > 90 ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}>
                          {result.match}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-purple-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
