import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: 'new_submission' | 'status_update';
  submission: any;
  status?: string;
  notes?: string;
  adminEmail?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, submission, status, notes, adminEmail }: NotificationRequest = await req.json();

    console.log(`Processing ${type} notification for submission:`, submission.id);

    if (type === 'new_submission') {
      // Send notification to admin about new submission
      const adminEmailAddress = adminEmail || "admin@mazunte.io"; // Default admin email
      
      const emailResponse = await resend.emails.send({
        from: "Mazunte Platform <onboarding@resend.dev>",
        to: [adminEmailAddress],
        subject: `New Project Submission: ${submission.project_title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
              New Project Submission Received
            </h1>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #0066cc; margin-top: 0;">${submission.project_title}</h2>
              <p><strong>Creator:</strong> ${submission.creator_name} (${submission.creator_email})</p>
              <p><strong>Category:</strong> ${submission.project_category}</p>
              <p><strong>Target Funding:</strong> $${submission.target_funding.toLocaleString()}</p>
              <p><strong>Estimated Yield:</strong> ${submission.estimated_yield}%</p>
              <p><strong>Submitted:</strong> ${new Date(submission.created_at).toLocaleDateString()}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <h3>Project Description:</h3>
              <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                ${submission.project_description}
              </p>
            </div>
            
            ${submission.market_analysis ? `
              <div style="margin: 20px 0;">
                <h3>Market Analysis:</h3>
                <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                  ${submission.market_analysis}
                </p>
              </div>
            ` : ''}
            
            ${submission.revenue_model ? `
              <div style="margin: 20px 0;">
                <h3>Revenue Model:</h3>
                <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                  ${submission.revenue_model}
                </p>
              </div>
            ` : ''}
            
            <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; text-align: center;">
                <a href="https://moxpmnooovdcffvztbbc.supabase.co/admin/projects" 
                   style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Review Submission in Admin Panel
                </a>
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
              <p>This is an automated notification from the Mazunte project submission system.</p>
            </div>
          </div>
        `,
      });

      console.log("Admin notification sent successfully:", emailResponse);

    } else if (type === 'status_update') {
      // Send status update to project creator
      const statusMessage = getStatusMessage(status);
      const statusColor = getStatusColor(status);
      
      const statusEmailResponse = await resend.emails.send({
        from: "Mazunte Platform <onboarding@resend.dev>",
        to: [submission.creator_email],
        subject: `Project Submission Update: ${submission.project_title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
              Project Submission Status Update
            </h1>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #0066cc; margin-top: 0;">${submission.project_title}</h2>
              <div style="background-color: ${statusColor}; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; text-transform: uppercase; font-size: 12px;">
                ${status?.replace('_', ' ')}
              </div>
            </div>
            
            <div style="margin: 20px 0;">
              <h3>Status Update:</h3>
              <p style="font-size: 16px; line-height: 1.6;">
                ${statusMessage}
              </p>
            </div>
            
            ${notes ? `
              <div style="margin: 20px 0;">
                <h3>Review Notes:</h3>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #0066cc;">
                  ${notes.replace(/\n/g, '<br>')}
                </div>
              </div>
            ` : ''}
            
            <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">What's Next?</h3>
              ${getNextStepsMessage(status)}
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
              <p>Thank you for your submission to the Mazunte platform. If you have any questions, please don't hesitate to contact our team.</p>
              <p>Best regards,<br>The Mazunte Team</p>
            </div>
          </div>
        `,
      });

      console.log("Status update notification sent successfully:", statusEmailResponse);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function getStatusMessage(status?: string): string {
  switch (status) {
    case 'approved':
      return 'Congratulations! Your project submission has been approved and will now be listed on our platform for investors to discover.';
    case 'rejected':
      return 'After careful review, we are unable to approve your project submission at this time. Please review the feedback below and consider resubmitting with improvements.';
    case 'under_review':
      return 'Your project submission is currently under review by our team. We will notify you once the review is complete.';
    case 'pending':
      return 'Your project submission has been received and is pending initial review.';
    default:
      return 'Your project submission status has been updated.';
  }
}

function getStatusColor(status?: string): string {
  switch (status) {
    case 'approved': return '#10b981';
    case 'rejected': return '#ef4444';
    case 'under_review': return '#f59e0b';
    case 'pending': return '#6b7280';
    default: return '#6b7280';
  }
}

function getNextStepsMessage(status?: string): string {
  switch (status) {
    case 'approved':
      return `
        <p>Your project is now live on our platform! Here's what happens next:</p>
        <ul>
          <li>Investors can now view and invest in your project</li>
          <li>You'll receive notifications when investments are made</li>
          <li>Keep your project page updated with regular progress reports</li>
          <li>Monitor your funding progress through the developer dashboard</li>
        </ul>
      `;
    case 'rejected':
      return `
        <p>Don't let this discourage you! Here are some ways to improve your submission:</p>
        <ul>
          <li>Review the feedback provided and address any concerns</li>
          <li>Strengthen your business plan and market analysis</li>
          <li>Provide more detailed financial projections</li>
          <li>Consider reaching out to our team for guidance</li>
        </ul>
      `;
    case 'under_review':
      return `
        <p>While we review your submission:</p>
        <ul>
          <li>No action is required from you at this time</li>
          <li>We may contact you if we need additional information</li>
          <li>Review typically takes 3-5 business days</li>
          <li>You'll be notified as soon as a decision is made</li>
        </ul>
      `;
    default:
      return '<p>We will keep you updated on any further developments with your submission.</p>';
  }
}

Deno.serve(handler);