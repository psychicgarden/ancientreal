import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectSubmissionModal } from '@/components/ProjectSubmissionModal';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Search, 
  Filter, 
  Eye, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw,
  FileText,
  Home
} from 'lucide-react';

interface ProjectSubmission {
  id: string;
  project_title: string;
  creator_name: string;
  creator_email: string;
  creator_wallet_address: string;
  project_category: string;
  project_description: string;
  target_funding: number;
  estimated_yield: number;
  min_investment: number;
  max_investment?: number;
  funding_deadline?: string;
  submission_status: string;
  compliance_status?: string;
  market_analysis?: string;
  revenue_model?: string;
  timeline?: string;
  demo_url?: string;
  github_repo_url?: string;
  review_notes?: string;
  team_info?: any;
  business_plan?: any;
  technical_docs?: any;
  legal_docs?: any;
  uploaded_documents?: any;
  created_at: string;
}

const AdminProjects = () => {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log('AdminProjects component rendered', { submissions: submissions.length, loading, error });

  useEffect(() => {
    console.log('AdminProjects useEffect triggered');
    fetchSubmissions();
  }, []);

  // Filter submissions based on search and filters
  useEffect(() => {
    let filtered = submissions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(submission =>
        submission.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.creator_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.creator_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.submission_status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(submission => submission.project_category === categoryFilter);
    }

    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, statusFilter, categoryFilter]);

  const fetchSubmissions = async () => {
    console.log('fetchSubmissions called');
    setError(null);
    try {
      console.log('Attempting to fetch from Supabase...');
      const { data, error } = await supabase
        .from('project_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase response:', { data, error, dataLength: data?.length });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setSubmissions(data || []);
      console.log('Submissions set successfully:', data?.length || 0);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      toast.error('Failed to load project submissions');
    } finally {
      setLoading(false);
      console.log('Loading set to false');
    }
  };

  const handleRowClick = (submission: ProjectSubmission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const handleSubmissionUpdate = () => {
    fetchSubmissions();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusStats = () => {
    const pending = submissions.filter(s => s.submission_status === 'pending').length;
    const approved = submissions.filter(s => s.submission_status === 'approved').length;
    const rejected = submissions.filter(s => s.submission_status === 'rejected').length;
    return { pending, approved, rejected };
  };

  const stats = getStatusStats();
  const categories = [...new Set(submissions.map(s => s.project_category))];

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium mb-2 text-red-500">Error Loading Submissions</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchSubmissions}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading project submissions...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  console.log('Rendering main component with submissions:', submissions.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Project Submissions Admin
            </h1>
            <p className="text-muted-foreground mt-1">Review and manage project submissions</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.location.href = '/'} variant="outline" className="self-start md:self-auto">
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
            <Button onClick={fetchSubmissions} variant="outline" className="self-start md:self-auto">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{submissions.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search projects, creators, or emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Project Submissions Yet</h3>
              <p className="text-muted-foreground">When developers submit projects, they will appear here for review.</p>
            </CardContent>
          </Card>
        ) : filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Project Submissions ({filteredSubmissions.length})</span>
                <Badge variant="outline">{filteredSubmissions.length} of {submissions.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Project
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Creator
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Funding
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Submitted
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow 
                        key={submission.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleRowClick(submission)}
                      >
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-semibold text-foreground truncate">{submission.project_title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {submission.project_description?.substring(0, 100)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{submission.creator_name}</div>
                            <div className="text-sm text-muted-foreground">{submission.creator_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{submission.project_category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold">${submission.target_funding?.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">{submission.estimated_yield}% yield</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(submission.submission_status)}
                            <Badge 
                              variant={submission.submission_status === 'approved' ? 'default' : 
                                     submission.submission_status === 'rejected' ? 'destructive' : 'secondary'}
                              className="capitalize"
                            >
                              {submission.submission_status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(submission.created_at), 'MMM dd, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(submission);
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Modal */}
        <ProjectSubmissionModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          submission={selectedSubmission}
          onSubmissionUpdate={handleSubmissionUpdate}
        />
      </div>
    </div>
  );
};

export default AdminProjects;