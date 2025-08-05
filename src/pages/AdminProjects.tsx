import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, Mail, Calendar, DollarSign, Users } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ProjectSubmission {
  id: string;
  project_title: string;
  creator_name: string;
  creator_email: string;
  creator_wallet_address: string;
  project_description: string;
  project_category: string;
  target_funding: number;
  min_investment: number;
  max_investment: number;
  estimated_yield: number;
  funding_deadline: string;
  submission_status: string;
  compliance_status: string;
  review_notes: string;
  created_at: string;
  updated_at: string;
  market_analysis: string;
  revenue_model: string;
  timeline: string;
  demo_url: string;
  github_repo_url: string;
  uploaded_documents: any;
}

const AdminProjects = () => {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('project_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load project submissions');
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, status: string, notes: string) => {
    try {
      const { error } = await supabase
        .from('project_submissions')
        .update({
          submission_status: status,
          review_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Send notification email to applicant
      await sendStatusUpdateEmail(selectedSubmission!, status, notes);
      
      toast.success('Submission status updated');
      fetchSubmissions();
      setSelectedSubmission(null);
      setReviewNotes('');
      setNewStatus('');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update submission status');
    }
  };

  const sendStatusUpdateEmail = async (submission: ProjectSubmission, status: string, notes: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-project-notification', {
        body: {
          type: 'status_update',
          submission,
          status,
          notes
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const downloadDocument = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('project-documents')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'under_review': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Project Submissions Admin</h1>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              Pending: {submissions.filter(s => s.submission_status === 'pending').length}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Approved: {submissions.filter(s => s.submission_status === 'approved').length}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              Rejected: {submissions.filter(s => s.submission_status === 'rejected').length}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Funding Target</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{submission.project_title}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {submission.project_description}
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
                    <Badge variant="outline">{submission.project_category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {submission.target_funding.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(submission.submission_status)}>
                      {submission.submission_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(submission.created_at), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setReviewNotes(submission.review_notes || '');
                            setNewStatus(submission.submission_status);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{selectedSubmission?.project_title}</DialogTitle>
                        </DialogHeader>
                        {selectedSubmission && (
                          <div className="space-y-6">
                            {/* Project Details */}
                            <div className="grid grid-cols-2 gap-6">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Project Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Description</label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {selectedSubmission.project_description}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Market Analysis</label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {selectedSubmission.market_analysis || 'Not provided'}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Revenue Model</label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {selectedSubmission.revenue_model || 'Not provided'}
                                    </p>
                                  </div>
                                  {selectedSubmission.demo_url && (
                                    <div>
                                      <label className="text-sm font-medium">Demo URL</label>
                                      <a 
                                        href={selectedSubmission.demo_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline block mt-1"
                                      >
                                        {selectedSubmission.demo_url}
                                      </a>
                                    </div>
                                  )}
                                  {selectedSubmission.github_repo_url && (
                                    <div>
                                      <label className="text-sm font-medium">GitHub Repository</label>
                                      <a 
                                        href={selectedSubmission.github_repo_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline block mt-1"
                                      >
                                        {selectedSubmission.github_repo_url}
                                      </a>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Financial Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Target Funding</label>
                                      <p className="text-lg font-semibold">
                                        ${selectedSubmission.target_funding.toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Estimated Yield</label>
                                      <p className="text-lg font-semibold">
                                        {selectedSubmission.estimated_yield}%
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Min Investment</label>
                                      <p className="text-sm">
                                        ${selectedSubmission.min_investment.toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Max Investment</label>
                                      <p className="text-sm">
                                        {selectedSubmission.max_investment 
                                          ? `$${selectedSubmission.max_investment.toLocaleString()}`
                                          : 'No limit'
                                        }
                                      </p>
                                    </div>
                                  </div>
                                  {selectedSubmission.funding_deadline && (
                                    <div>
                                      <label className="text-sm font-medium">Funding Deadline</label>
                                      <p className="text-sm">
                                        {format(new Date(selectedSubmission.funding_deadline), 'PPP')}
                                      </p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>

                            {/* Uploaded Documents */}
                            {selectedSubmission.uploaded_documents && selectedSubmission.uploaded_documents.length > 0 && (
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    {selectedSubmission.uploaded_documents.map((doc: any, index: number) => (
                                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                          <p className="font-medium">{doc.name}</p>
                                          <p className="text-sm text-muted-foreground">{doc.type}</p>
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => downloadDocument(doc.path, doc.name)}
                                        >
                                          <Download className="w-4 h-4 mr-2" />
                                          Download
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Review Section */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">Review & Status Update</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <Select value={newStatus} onValueChange={setNewStatus}>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending Review</SelectItem>
                                      <SelectItem value="under_review">Under Review</SelectItem>
                                      <SelectItem value="approved">Approved</SelectItem>
                                      <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Review Notes</label>
                                  <Textarea
                                    value={reviewNotes}
                                    onChange={(e) => setReviewNotes(e.target.value)}
                                    placeholder="Add review notes, feedback, or requirements..."
                                    className="mt-1"
                                    rows={4}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => updateSubmissionStatus(selectedSubmission.id, newStatus, reviewNotes)}
                                    className="flex-1"
                                  >
                                    Update Status & Send Email
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {submissions.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No project submissions yet</h3>
              <p className="text-muted-foreground">Project submissions will appear here for review.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;