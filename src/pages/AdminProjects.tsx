import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ProjectSubmission {
  id: string;
  project_title: string;
  creator_name: string;
  creator_email: string;
  project_category: string;
  target_funding: number;
  submission_status: string;
  created_at: string;
}

const AdminProjects = () => {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('AdminProjects component rendered', { submissions: submissions.length, loading, error });

  useEffect(() => {
    console.log('AdminProjects useEffect triggered');
    fetchSubmissions();
  }, []);

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

        {submissions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No Project Submissions Yet</h3>
              <p className="text-muted-foreground">When developers submit projects, they will appear here for review.</p>
            </CardContent>
          </Card>
        ) : (
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{submission.project_title}</div>
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
                    <TableCell>${submission.target_funding?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={submission.submission_status === 'approved' ? 'default' : 
                                   submission.submission_status === 'rejected' ? 'destructive' : 'secondary'}>
                        {submission.submission_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(submission.created_at), 'MMM dd, yyyy')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;