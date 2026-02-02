import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, BookOpen, Search, Grid3x3, List, Eye, Clock, 
  FileText, ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight,
  BarChart3, TrendingUp, Target, Download, Share2, Trash2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FlipBook {
  id: string;
  name: string;
  thumbnail: string;
  pageCount: number;
  lastViewed: string;
  viewCount: number;
  uploadDate: string;
  size: string;
  category: string;
}

export default function FlipBookDashboard() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<FlipBook | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  // Mock data
  const flipBooks: FlipBook[] = [
    {
      id: "1",
      name: "Annual Report 2025",
      thumbnail: "📊",
      pageCount: 48,
      lastViewed: "2 hours ago",
      viewCount: 234,
      uploadDate: "2025-01-10",
      size: "12.4 MB",
      category: "Reports"
    },
    {
      id: "2",
      name: "Product Catalog",
      thumbnail: "📚",
      pageCount: 120,
      lastViewed: "1 day ago",
      viewCount: 567,
      uploadDate: "2025-01-08",
      size: "24.8 MB",
      category: "Catalog"
    },
    {
      id: "3",
      name: "Employee Handbook",
      thumbnail: "📖",
      pageCount: 86,
      lastViewed: "3 days ago",
      viewCount: 145,
      uploadDate: "2025-01-05",
      size: "8.2 MB",
      category: "HR"
    },
    {
      id: "4",
      name: "Training Materials",
      thumbnail: "🎓",
      pageCount: 64,
      lastViewed: "1 week ago",
      viewCount: 89,
      uploadDate: "2024-12-28",
      size: "15.6 MB",
      category: "Training"
    }
  ];

  const filteredBooks = flipBooks.filter(book => {
    const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = [
    { label: "Total Documents", value: "24", icon: BookOpen, color: "text-indigo-600" },
    { label: "Total Views", value: "1,035", icon: Eye, color: "text-amber-600" },
    { label: "Avg. Pages", value: "79", icon: FileText, color: "text-indigo-600" },
    { label: "Active Readers", value: "42", icon: TrendingUp, color: "text-amber-600" }
  ];

  const handleOpenViewer = (book: FlipBook) => {
    setSelectedBook(book);
    setCurrentPage(1);
    setZoom(100);
    setViewerOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Flip Books</h1>
            <p className="text-sm text-gray-500 mt-1">Interactive PDF viewer with 3D page flip</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Upload className="w-4 h-4 mr-2" />
            Upload PDF
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-white/70 backdrop-blur-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search flip books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Reports">Reports</SelectItem>
                  <SelectItem value="Catalog">Catalog</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-indigo-600" : ""}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-indigo-600" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Library */}
        {viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => (
              <Card
                key={book.id}
                className="bg-white/70 backdrop-blur-sm border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleOpenViewer(book)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-full h-48 bg-gradient-to-br from-indigo-50 to-amber-50 rounded-lg flex items-center justify-center text-6xl">
                      {book.thumbnail}
                    </div>
                    <div className="w-full space-y-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{book.name}</h3>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <FileText className="w-4 h-4" />
                        <span>{book.pageCount} pages</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{book.viewCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{book.lastViewed}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                        {book.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleOpenViewer(book)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-amber-50 rounded flex items-center justify-center text-2xl flex-shrink-0">
                        {book.thumbnail}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{book.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>{book.pageCount} pages</span>
                          <span>•</span>
                          <span>{book.size}</span>
                          <span>•</span>
                          <span>{book.lastViewed}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                          {book.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span>{book.viewCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Panel */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Analytics Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">1,035</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+12% from last week</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Avg. Time per Book</p>
                <p className="text-3xl font-bold text-gray-900">8.5m</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+5% from last week</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900">67%</p>
                <div className="flex items-center text-xs text-amber-600">
                  <Target className="w-3 h-3 mr-1" />
                  <span>Avg. 45 pages read</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Most Popular</p>
                <p className="text-lg font-bold text-gray-900">Product Catalog</p>
                <div className="flex items-center text-xs text-indigo-600">
                  <Eye className="w-3 h-3 mr-1" />
                  <span>567 views</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flip Book Viewer Modal */}
        <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
          <DialogContent className="max-w-6xl h-[90vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedBook?.name}</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-1 h-full overflow-hidden">
              {/* Thumbnail Sidebar */}
              <div className="w-32 bg-gray-50 overflow-y-auto border-r">
                <div className="p-2 space-y-2">
                  {Array.from({ length: selectedBook?.pageCount || 0 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`aspect-[3/4] bg-white border-2 rounded cursor-pointer hover:border-indigo-500 transition-colors ${
                        currentPage === idx + 1 ? 'border-indigo-600' : 'border-gray-200'
                      }`}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      <div className="h-full flex items-center justify-center text-xs text-gray-500">
                        {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Viewer */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
                  <div 
                    className="bg-white shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
                    style={{ 
                      width: `${zoom}%`,
                      maxWidth: '100%',
                      aspectRatio: '3/4'
                    }}
                  >
                    <div className="h-full flex flex-col items-center justify-center border border-gray-200">
                      <div className="text-8xl mb-4">{selectedBook?.thumbnail}</div>
                      <p className="text-xl font-semibold text-gray-700">Page {currentPage}</p>
                      <p className="text-sm text-gray-500 mt-2">of {selectedBook?.pageCount}</p>
                      <div className="mt-8 text-center text-gray-400 text-sm">
                        <p>3D Page Flip Animation</p>
                        <p className="mt-1">Use arrow keys to navigate</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Toolbar */}
                <div className="bg-white border-t p-4">
                  <div className="flex items-center justify-between max-w-4xl mx-auto">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium px-4">
                        {currentPage} / {selectedBook?.pageCount}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(Math.min(selectedBook?.pageCount || 1, currentPage + 1))}
                        disabled={currentPage === selectedBook?.pageCount}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setZoom(Math.max(50, zoom - 10))}
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium px-4">{zoom}%</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setZoom(Math.min(200, zoom + 10))}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Maximize className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-center mt-2 text-xs text-gray-500">
                    <kbd className="px-2 py-1 bg-gray-100 rounded">←</kbd> Previous •{" "}
                    <kbd className="px-2 py-1 bg-gray-100 rounded">→</kbd> Next •{" "}
                    <kbd className="px-2 py-1 bg-gray-100 rounded">F</kbd> Fullscreen
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
