import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  DollarSign, 
  Target, 
  FileText, 
  Globe, 
  Github,
  Check,
  X,
  Clock,
  Building,
  TrendingUp,
  Users,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface ProjectSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: ProjectSubmission | null;
  onSubmissionUpdate: () => void;
}

export const ProjectSubmissionModal: React.FC<ProjectSubmissionModalProps> = ({
  isOpen,
  onClose,
  submission,
  onSubmissionUpdate
}) => {
  const [reviewNotes, setReviewNotes] = useState(submission?.review_notes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!submission) return null;

  const updateSubmissionStatus = async (status: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('project_submissions')
        .update({ 
          submission_status: status,
          review_notes: reviewNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', submission.id);

      if (error) throw error;

      toast.success(`Project ${status} successfully`);
      onSubmissionUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Failed to update submission');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {submission.project_title}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`${getStatusColor(submission.submission_status)} border`}>
                  {submission.submission_status}
                </Badge>
                <Badge variant="outline" className="border-primary/20">
                  {submission.project_category}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Submitted</div>
              <div className="font-medium">{format(new Date(submission.created_at), 'MMM dd, yyyy')}</div>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh] space-y-6">
          {/* Creator Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Creator Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{submission.creator_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{submission.creator_email}</span>
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-muted-foreground">Wallet Address</div>
                <div className="font-mono text-sm break-all">{submission.creator_wallet_address}</div>
              </div>
            </CardContent>
          </Card>

          {/* Project Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Description</div>
                <p className="text-sm leading-relaxed">{submission.project_description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Target Funding</div>
                    <div className="font-semibold">${submission.target_funding?.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Estimated Yield</div>
                    <div className="font-semibold">{submission.estimated_yield}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Min Investment</div>
                    <div className="font-semibold">${submission.min_investment?.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              {submission.funding_deadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Funding Deadline</div>
                    <div className="font-medium">{format(new Date(submission.funding_deadline), 'MMM dd, yyyy')}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Links and Resources */}
          {(submission.demo_url || submission.github_repo_url) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Links & Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {submission.demo_url && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <a href={submission.demo_url} target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline text-sm">
                      Demo URL
                    </a>
                  </div>
                )}
                {submission.github_repo_url && (
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-primary" />
                    <a href={submission.github_repo_url} target="_blank" rel="noopener noreferrer" 
                       className="text-primary hover:underline text-sm">
                      GitHub Repository
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Business Details */}
          {(submission.market_analysis || submission.revenue_model || submission.timeline) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Business Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {submission.market_analysis && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Market Analysis</div>
                    <p className="text-sm leading-relaxed">{submission.market_analysis}</p>
                  </div>
                )}
                {submission.revenue_model && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Revenue Model</div>
                    <p className="text-sm leading-relaxed">{submission.revenue_model}</p>
                  </div>
                )}
                {submission.timeline && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Timeline</div>
                    <p className="text-sm leading-relaxed">{submission.timeline}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Compliance & Review
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-muted-foreground">Compliance Status:</div>
                <Badge variant="outline" className={getStatusColor(submission.compliance_status || 'pending')}>
                  {submission.compliance_status || 'pending'}
                </Badge>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Review Notes</label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add review notes for this submission..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        {submission.submission_status === 'pending' && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => updateSubmissionStatus('rejected')}
              disabled={isUpdating}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Reject
            </Button>
            <Button
              onClick={() => updateSubmissionStatus('approved')}
              disabled={isUpdating}
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Approve
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};