# Ticket ID & Email Notification System

## Overview

This implementation adds a comprehensive ticket ID assignment and email notification system to the Civic साथी platform. Users receive automated email confirmations and status updates for their reports, while admins can quickly reference reports by unique ticket IDs.

## Components

### 1. **Ticket ID Generator** (`utils/generateTicketId.js`)
- **Purpose**: Generates unique alphanumeric ticket IDs for each report
- **Format**: `CIVIC-YYYYMMDD-XXXXX`
  - `CIVIC`: Prefix (constant)
  - `YYYYMMDD`: Date of submission
  - `XXXXX`: 5 random alphanumeric characters (A-Z, 0-9)
  - Example: `CIVIC-20260302-A7Z9K`
- **Features**:
  - ✅ User-friendly and memorable
  - ✅ Contains submission date (useful for sorting/filtering)
  - ✅ ~60 million unique combinations per day
  - ✅ Different from MongoDB ObjectID
  - ✅ Index optimized database lookup

### 2. **Email Service** (`lib/emailService.js`)
- **Purpose**: Sends HTML formatted email notifications
- **Supported Statuses**:
  - `submitted`: Initial submission confirmation
  - `pending`: Awaiting admin review
  - `verified`: Admin has verified the report
  - `approved`: Report approved and forwarded to municipality
  - `rejected`: Report rejected with reason displayed

### 3. **Database Schema** (`models/Report.js`)
- **New Field**: `ticketId` (String, unique, indexed)
- **Purpose**: Store and reference unique ticket identifier
- Properties:
  - `required: true` - Must be generated at creation
  - `unique: true` - No duplicate ticket IDs
  - `index: true` - Fast lookups in reports list
  - `trim: true` - Auto-remove whitespace

## Implementation Details

### Report Creation Flow
1. User submits a new report via `/api/reports`
2. Server generates unique `ticketId`
3. Report saved to database with `ticketId`
4. "Submitted" email sent to user with ticket ID
5. Admin notification email sent to assigned admin
6. Response includes both `reportId` and `ticketId`

### Status Update Flow
1. Admin updates report status via `/api/admi-reports/[id]`
2. Report status updated in database
3. Status change email sent to user:
   - **Verified**: Confirmation and next steps
   - **Approved**: Municipality details and timeline
   - **Rejected**: Reason and resubmission instructions
   - **Pending**: Awaiting review notification
4. Updated report returned to admin dashboard

### Email Template Structure
Each email includes:
- **Header**: Portal branding with gradient
- **Status Badge**: Color-coded status indicator
- **Ticket ID Section**: Prominent display for user reference
- **Details Table**: Complete report information
  - Title, Category, Severity, Description
  - Location (Locality, Street, Ward, Municipality)
  - Timestamp
- **Next Steps**: Context-aware guidance per status
- **Rejection Reason** (if applicable): Clear explanation
- **Footer**: Company branding and disclaimer

### Color Coding
- **Blue** (#3B82F6): Submitted/Pending
- **Green** (#10B981): Verified/Approved
- **Red** (#EF4444): Rejected
- **Orange** (#F59E0B): Warning/Pending Review

## User-Facing Features

### Report Detail Card Enhancement
- **Ticket ID Display**: Prominently shown in dedicated section
- **Copy Functionality**: One-click copy to clipboard
- **Visual Design**: Monospace font in dark background for clarity
- **Helper Text**: "Use this ID to reference your report"

### Admin Portal Enhancement
- **Ticket ID Column**: Added to report listings
- **Quick Copy**: Copy button for easy reference
- **Searchable**: Can filter/search by ticket ID
- **Direct Link**: Can link reports: `/admin?ticket=CIVIC-20260302-A7Z9K`

## Environment Configuration

### Setup Steps

1. **Create `.env.local` file** in project root (copy from `.env.example`)
   ```bash
   cd c:\myProgrammingLearning\projects\SIH\sih
   ```

2. **Configure Gmail (Recommended)**
   - Go to [myaccount.google.com](https://myaccount.google.com)
   - Navigate to Security → 2-Step Verification (enable if needed)
   - Go to Security → App passwords
   - Create app password for Mail/Windows Computer
   - Copy the 16-character password

3. **Update `.env.local`**
   ```
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=xxxx xxxx xxxx xxxx
   ADMIN_PORTAL_URL=https://your-admin-portal.com/admin
   ```

4. **Alternative Email Providers**
   - **Office 365**: smtp.office365.com:587
   - **Custom SMTP**: Update `emailService.js` config
   - Delete/modify the `service: 'gmail'` line and add:
     ```javascript
     host: process.env.SMTP_HOST,
     port: process.env.SMTP_PORT,
     secure: process.env.SMTP_SECURE === 'true'
     ```

## API Endpoints

### Report Creation
- **Endpoint**: `POST /api/reports`
- **Auth**: Required (JWT)
- **Response**:
  ```json
  {
    "message": "Report submitted and assigned successfully",
    "report": { ...reportData, "ticketId": "CIVIC-20260302-A7Z9K" },
    "ticketId": "CIVIC-20260302-A7Z9K"
  }
  ```

### Report Status Update
- **Endpoint**: `PUT /api/admi-reports/[id]`
- **Body**:
  ```json
  {
    "status": "approved|rejected|verified|pending",
    "rejectedReason": "optional reason for rejection"
  }
  ```
- **Side Effects**: Sends email to user on status change

## Testing Checklist

- [ ] Ticket ID generates in correct format (CIVIC-YYYYMMDD-XXXXX)
- [ ] Ticket ID is unique across reports
- [ ] Ticket ID persists in database
- [ ] Email credentials work (no errors in console)
- [ ] "Submitted" email sends on report creation
- [ ] "Verified" email sends on admin verification
- [ ] "Rejected" email sends with reason
- [ ] "Approved" email sends with municipality info
- [ ] Ticket ID displays in user report detail card
- [ ] Ticket ID displays in admin report detail view
- [ ] Copy to clipboard works for ticket ID
- [ ] Email fails gracefully (doesn't crash system)

## Email Error Handling

- **Graceful Degradation**: Emails are non-blocking
  - If email fails, report still saves successfully
  - Error logged to console: `"Error sending [status] email: [error message]"`
  - User can still access report via other means
- **Console Logging**: All email errors logged for debugging
- **No Server Crash**: Email service errors don't crash API

## Future Enhancements

1. **Email Templates Customization**
   - Admin panel to customize email templates
   - Branded email footers
   - Multi-language support

2. **Email History Tracking**
   - Store email send status in report history
   - Track bounces and failures
   - Resend failed emails

3. **User Preferences**
   - Email frequency preferences
   - Notification opt-in/opt-out
   - Email digest options

4. **Advanced Reporting**
   - Email delivery analytics
   - User engagement tracking
   - A/B testing for email content

## Security Considerations

1. **Credential Protection**
   - Never commit `.env.local` to git
   - Add to `.gitignore`
   - Use environment variables only
   
2. **Email Validation**
   - Ticket ID format validated before use
   - Email addresses sanitized
   - No sensitive data logged

3. **Rate Limiting**
   - Consider adding email rate limiting for production
   - Nodemailer has built-in queue support

## Files Modified/Created

### New Files
- ✅ `utils/generateTicketId.js` - Ticket ID generator
- ✅ `lib/emailService.js` - Email sending service
- ✅ `.env.example` - Environment configuration template

### Modified Files
- ✅ `models/Report.js` - Added ticketId field
- ✅ `app/api/reports/route.js` - Integrated ticket ID generation and submission email
- ✅ `app/api/admi-reports/[id]/route.js` - Integrated status update emails
- ✅ `app/user/components/components/ReportDetailCard.js` - Added ticket ID display
- ✅ `app/admin/components/ReportDetailView.js` - Added ticket ID display

## Troubleshooting

### Emails not sending
1. Check SMTP_USERNAME and SMTP_PASSWORD are correct
2. Verify `.env.local` file exists and is readable
3. Check Gmail app password (if using Gmail)
4. Look for error logs in server console
5. Test with `nodemailer` directly in Node REPL

### Ticket ID not displaying
1. Ensure report has ticketId field in database
2. Check database query includes ticketId
3. Verify report schema includes ticketId field

### Email arrives as plain text
1. Ensure email client supports HTML
2. Check `emailService.js` template formatting
3. Verify `Content-Type: text/html` header is set

## Support

For issues or questions:
1. Check console logs for error messages
2. Verify environment variables are set
3. Ensure database has ticketId field
4. Test email credentials directly
