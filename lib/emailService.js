/**
 * Email Service for Report Notifications
 * Sends email notifications at different stages of report processing
 */

import nodemailer from 'nodemailer';

// Configure email transporter (using environment variables)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

/**
 * Formats the report data into a readable email template
 */
const getEmailTemplate = (report, status, reason = null) => {
  const statusMessage = {
    submitted: '✅ Your report has been successfully submitted',
    verified: '✅ Your report has been verified by admin',
    approved: '✅ Your report has been approved and forwarded to municipality',
    rejected: '❌ Your report has been rejected',
    pending: '⏳ Your report is pending for admin review',
  };

  const statusColor = {
    submitted: '#3B82F6',
    verified: '#10B981',
    approved: '#10B981',
    rejected: '#EF4444',
    pending: '#F59E0B',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .status-badge { background: ${statusColor[status]}; color: white; padding: 12px 20px; border-radius: 6px; font-weight: bold; margin: 15px 0; display: inline-block; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; }
        .ticket-id { background: white; padding: 15px; border-left: 4px solid #3B82F6; margin: 20px 0; border-radius: 4px; }
        .ticket-id p { margin: 5px 0; }
        .ticket-id .label { font-weight: bold; color: #64748b; font-size: 12px; }
        .ticket-id .value { font-size: 18px; font-weight: bold; color: #1e293b; font-family: 'Courier New', monospace; }
        .details-table { width: 100%; margin: 20px 0; border-collapse: collapse; }
        .details-table th { background: #e2e8f0; padding: 12px; text-align: left; font-weight: bold; color: #1e293b; border-bottom: 2px solid #cbd5e1; }
        .details-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
        .details-table tr:hover { background: #f1f5f9; }
        .severity-high { color: #dc2626; font-weight: bold; }
        .severity-medium { color: #d97706; font-weight: bold; }
        .severity-low { color: #16a34a; font-weight: bold; }
        .rejection-reason { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .rejection-reason h3 { color: #991b1b; margin-top: 0; }
        .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Civic साथी</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Report Status Update</p>
        </div>
        
        <div class="content">
          <div class="status-badge">${statusMessage[status]}</div>
          
          <h2 style="color: #1e293b; margin-top: 25px;">Report Ticket ID</h2>
          <div class="ticket-id">
            <p class="label">🆔 UNIQUE TICKET IDENTIFIER</p>
            <p class="value">${report.ticketId}</p>
          </div>

          <h2 style="color: #1e293b; margin-top: 25px;">Issue Details</h2>
          <table class="details-table">
            <tr>
              <th>Field</th>
              <th>Details</th>
            </tr>
            <tr>
              <td><strong>Ticket ID</strong></td>
              <td>${report.ticketId}</td>
            </tr>
            <tr>
              <td><strong>Issue Title</strong></td>
              <td>${report.Title}</td>
            </tr>
            <tr>
              <td><strong>Category</strong></td>
              <td>${report.category}</td>
            </tr>
            <tr>
              <td><strong>Severity</strong></td>
              <td>
                <span class="severity-${report.severity.toLowerCase()}">${report.severity}</span>
              </td>
            </tr>
            <tr>
              <td><strong>Description</strong></td>
              <td>${report.Description}</td>
            </tr>
            <tr>
              <td><strong>Location</strong></td>
              <td>
                ${report.building ? report.building + ', ' : ''}
                ${report.street ? report.street + ', ' : ''}
                ${report.locality ? report.locality : 'Not specified'}
              </td>
            </tr>
            <tr>
              <td><strong>Ward</strong></td>
              <td>${report.ward}</td>
            </tr>
            <tr>
              <td><strong>Municipality</strong></td>
              <td>${report.municipalityName}</td>
            </tr>
            <tr>
              <td><strong>Submitted On</strong></td>
              <td>${new Date(report.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</td>
            </tr>
          </table>

          ${reason ? `
            <div class="rejection-reason">
              <h3>Rejection Reason</h3>
              <p>${reason}</p>
              <p style="margin-bottom: 0; color: #7f1d1d; font-size: 13px;">Please edit your report and resubmit with necessary corrections.</p>
            </div>
          ` : ''}

          ${status === 'submitted' ? `
            <div style="background: #dbeafe; border-left: 4px solid #3B82F6; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin-top: 0;">Next Steps</h3>
              <p style="margin: 5px 0;">✓ Your report has been registered in our system</p>
              <p style="margin: 5px 0;">✓ Our team will review it within 24-48 hours</p>
              <p style="margin: 5px 0;">✓ You will receive email updates at each stage</p>
              <p style="margin: 5px 0; margin-bottom: 0;">✓ Keep your Ticket ID safe for future reference</p>
            </div>
          ` : ''}

          ${status === 'approved' ? `
            <div style="background: #dcfce7; border-left: 4px solid #16a34a; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <h3 style="color: #166534; margin-top: 0;">Your report has been forwarded to Municipality</h3>
              <p style="margin: 5px 0;">✓ Report reviewed and verified by admin</p>
              <p style="margin: 5px 0;">✓ Forwarded to ${report.municipalityName} for action</p>
              <p style="margin: 5px 0; margin-bottom: 0;">✓ Expected resolution time: 7-14 days</p>
            </div>
          ` : ''}
        </div>

        <div class="footer">
          <p>This is an automated email from Civic साथी - Citizen Issue Reporting Platform</p>
          <p>Please do not reply to this email. Use your Ticket ID to track your report status.</p>
          <p>© 2026 Civic साथी. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send email notification to user
 */
export const sendReportNotificationEmail = async (userEmail, report, status, reason = null) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@civicsaathi.com',
      to: userEmail,
      subject: `Civic साथी - Report Status Update [${report.ticketId}]`,
      html: getEmailTemplate(report, status, reason),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    // Don't throw error - continue even if email fails
    return { success: false, error: error.message };
  }
};

/**
 * Send email to admin when new report is submitted
 */
export const sendAdminNotificationEmail = async (adminEmail, report) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@civicsaathi.com',
      to: adminEmail,
      subject: `🆕 New Report Submitted [${report.ticketId}]`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e40af; color: white; padding: 20px; border-radius: 8px; text-align: center; }
            .content { background: #f8fafc; padding: 20px; margin-top: 20px; border-radius: 8px; }
            .ticket-badge { background: #3B82F6; color: white; padding: 10px 15px; border-radius: 4px; display: inline-block; font-weight: bold; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Civic Report Submitted</h2>
            </div>
            <div class="content">
              <p><strong>Ticket ID:</strong> <span class="ticket-badge">${report.ticketId}</span></p>
              <p><strong>Reporter:</strong> ${report.ReporterName}</p>
              <p><strong>Category:</strong> ${report.category}</p>
              <p><strong>Severity:</strong> ${report.severity}</p>
              <p><strong>Location:</strong> ${report.locality}, ${report.municipalityName}</p>
              <p><strong>Description:</strong> ${report.Description}</p>
              <p style="margin-top: 20px; text-align: center;">
                <a href="${process.env.ADMIN_PORTAL_URL || 'https://admin.civicsaathi.com'}/reports?ticket=${report.ticketId}" 
                   style="background: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
                  Review Report
                </a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send admin email:', error);
    return { success: false, error: error.message };
  }
};
