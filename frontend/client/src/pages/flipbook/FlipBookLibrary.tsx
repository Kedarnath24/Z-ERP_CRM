/**
 * FlipBook Library Page
 * Main dashboard for viewing and managing FlipBook documents
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Upload,
  Search,
  Grid3x3,
  List,
  Eye,
  Download,
  Share2,
  Trash2,
  MoreVertical,
  FileText,
  Calendar,
  User,
  TrendingUp,
  BookOpen,
  Filter,
  X,
  Plus,
  ArrowUpDown,
  File,
} from 'lucide-react';
import {
  FlipBookDocument,
  FlipBookModuleType,
  FlipBookUploadProgress,
  FlipBookFilter,
} from '@/types/flipbook';
import {
  uploadPDF,
  getDocuments,
  deleteDocument,
  createShareLink,
} from '@/lib/flipbook-service';
import { formatFileSize } from '@/lib/flipbook-pdf-processor';
import { format } from 'date-fns';
import EmptyState from '@/components/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const MODULE_TYPES: { value: FlipBookModuleType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Documents' },
  { value: 'invoice', label: 'Invoices' },
  { value: 'contract', label: 'Contracts' },
  { value: 'report', label: 'Reports' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'catalog', label: 'Catalogs' },
  { value: 'training', label: 'Training' },
  { value: 'hr', label: 'HR Documents' },
  { value: 'general', label: 'General' },
];

export default function FlipBookLibrary() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // State
  const [documents, setDocuments] = useState<FlipBookDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<FlipBookDocument | null>(null);

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadModuleType, setUploadModuleType] = useState<FlipBookModuleType>('general');
  const [uploadProgress, setUploadProgress] = useState<FlipBookUploadProgress | null>(null);
  const [uploading, setUploading] = useState(false);

  // Filter state
  const [filter, setFilter] = useState<FlipBookFilter>({
    moduleType: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load documents
  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const docs = await getDocuments({ ...filter, searchQuery });
      setDocuments(docs);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filter, searchQuery, toast]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace('.pdf', ''));
      }
    }
  }, [uploadTitle]);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadFile(file);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace('.pdf', ''));
      }
      setUploadDialogOpen(true);
    }
  }, [uploadTitle]);

  // Handle upload
  const handleUpload = useCallback(async () => {
    if (!uploadFile) return;

    try {
      setUploading(true);
      await uploadPDF(
        {
          file: uploadFile,
          title: uploadTitle,
          description: uploadDescription,
          moduleType: uploadModuleType,
          organizationId: 'org-1', // Get from context
        },
        setUploadProgress
      );

      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });

      setUploadDialogOpen(false);
      resetUploadForm();
      loadDocuments();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Upload failed',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }, [uploadFile, uploadTitle, uploadDescription, uploadModuleType, toast, loadDocuments]);

  // Reset upload form
  const resetUploadForm = useCallback(() => {
    setUploadFile(null);
    setUploadTitle('');
    setUploadDescription('');
    setUploadModuleType('general');
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!selectedDocument) return;

    try {
      await deleteDocument(selectedDocument.id);
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
      setDeleteDialogOpen(false);
      setSelectedDocument(null);
      loadDocuments();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
    }
  }, [selectedDocument, toast, loadDocuments]);

  // Handle share
  const handleShare = useCallback(async () => {
    if (!selectedDocument) return;

    try {
      const shareSettings = await createShareLink(selectedDocument.id, {
        mode: 'public',
      });

      navigator.clipboard.writeText(shareSettings.shareUrl);

      toast({
        title: 'Success',
        description: 'Share link copied to clipboard',
      });

      setShareDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create share link',
        variant: 'destructive',
      });
    }
  }, [selectedDocument, toast]);

  // View document
  const viewDocument = useCallback(
    (doc: FlipBookDocument) => {
      navigate(`/flipbook/viewer/${doc.id}`);
    },
    [navigate]
  );

  return (
    <DashboardLayout>
      <div className="flex h-full flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">FlipBook Library</h1>
            <p className="text-muted-foreground">
              Manage and view your interactive digital documents
            </p>
          </div>

          <Button onClick={() => setUploadDialogOpen(true)} size="lg">
            <Upload className="mr-2 h-5 w-5" />
            Upload PDF
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.reduce((acc, doc) => acc + doc.totalPages, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.reduce((acc, doc) => acc + doc.analytics.totalViews, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatFileSize(documents.reduce((acc, doc) => acc + doc.fileSize, 0))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={filter.moduleType}
                  onValueChange={value =>
                    setFilter(prev => ({ ...prev, moduleType: value as any }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODULE_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={`${filter.sortBy}-${filter.sortOrder}`}
                  onValueChange={value => {
                    const [sortBy, sortOrder] = value.split('-');
                    setFilter(prev => ({
                      ...prev,
                      sortBy: sortBy as any,
                      sortOrder: sortOrder as any,
                    }));
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="views-desc">Most Viewed</SelectItem>
                    <SelectItem value="size-desc">Largest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Grid/List */}
        <div className="flex-1">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                <p className="text-muted-foreground">Loading documents...</p>
              </div>
            </div>
          ) : documents.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No documents yet"
              description="Upload your first PDF to get started with FlipBook"
              action={{
                label: 'Upload PDF',
                onClick: () => setUploadDialogOpen(true),
              }}
            />
          ) : viewMode === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {documents.map(doc => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onView={viewDocument}
                    onShare={() => {
                      setSelectedDocument(doc);
                      setShareDialogOpen(true);
                    }}
                    onDelete={() => {
                      setSelectedDocument(doc);
                      setDeleteDialogOpen(true);
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <Card>
              <ScrollArea className="h-[600px]">
                <div className="divide-y">
                  {documents.map(doc => (
                    <DocumentListItem
                      key={doc.id}
                      document={doc}
                      onView={viewDocument}
                      onShare={() => {
                        setSelectedDocument(doc);
                        setShareDialogOpen(true);
                      }}
                      onDelete={() => {
                        setSelectedDocument(doc);
                        setDeleteDialogOpen(true);
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
            </Card>
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload PDF Document</DialogTitle>
            <DialogDescription>
              Upload a PDF file to convert it into an interactive FlipBook
            </DialogDescription>
          </DialogHeader>

          {uploadProgress ? (
            <div className="space-y-4 py-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{uploadProgress.message}</span>
                  <span className="text-muted-foreground">{uploadProgress.percentage}%</span>
                </div>
                <Progress value={uploadProgress.percentage} />
              </div>

              {uploadProgress.currentPage && uploadProgress.totalPages && (
                <p className="text-center text-sm text-muted-foreground">
                  Processing page {uploadProgress.currentPage} of {uploadProgress.totalPages}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {/* File Upload */}
              <div
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                  uploadFile
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {uploadFile ? (
                  <div className="space-y-2">
                    <File className="mx-auto h-12 w-12 text-primary" />
                    <p className="font-medium">{uploadFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(uploadFile.size)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        setUploadFile(null);
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">PDF files up to 50MB</p>
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="Enter document title"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={uploadDescription}
                  onChange={e => setUploadDescription(e.target.value)}
                  placeholder="Enter document description (optional)"
                  rows={3}
                />
              </div>

              {/* Module Type */}
              <div className="space-y-2">
                <Label htmlFor="moduleType">Category *</Label>
                <Select
                  value={uploadModuleType}
                  onValueChange={value => setUploadModuleType(value as FlipBookModuleType)}
                >
                  <SelectTrigger id="moduleType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODULE_TYPES.filter(t => t.value !== 'all').map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUploadDialogOpen(false);
                resetUploadForm();
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!uploadFile || !uploadTitle || uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Create a shareable link for {selectedDocument?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Anyone with the link will be able to view this document.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedDocument?.title}"? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

// Document Card Component
function DocumentCard({
  document: doc,
  onView,
  onShare,
  onDelete,
}: {
  document: FlipBookDocument;
  onView: (doc: FlipBookDocument) => void;
  onShare: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted" onClick={() => onView(doc)}>
          {doc.thumbnail ? (
            <img
              src={doc.thumbnail}
              alt={doc.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}

          {/* Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary">{doc.totalPages} pages</Badge>
          </div>

          {/* Actions */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={e => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(doc)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardContent className="p-4" onClick={() => onView(doc)}>
          <h3 className="font-semibold truncate mb-1">{doc.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {doc.description || 'No description'}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {doc.analytics.totalViews} views
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Document List Item Component
function DocumentListItem({
  document: doc,
  onView,
  onShare,
  onDelete,
}: {
  document: FlipBookDocument;
  onView: (doc: FlipBookDocument) => void;
  onShare: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => onView(doc)}>
      <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-muted">
        {doc.thumbnail ? (
          <img src={doc.thumbnail} alt={doc.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-6 w-6 text-muted-foreground/50" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{doc.title}</h3>
        <p className="text-sm text-muted-foreground truncate">{doc.description || 'No description'}</p>
        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
          <span>{doc.totalPages} pages</span>
          <span>{formatFileSize(doc.fileSize)}</span>
          <span>{format(new Date(doc.uploadedAt), 'MMM d, yyyy')}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline">{doc.analytics.totalViews} views</Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" onClick={e => e.stopPropagation()}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(doc)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
