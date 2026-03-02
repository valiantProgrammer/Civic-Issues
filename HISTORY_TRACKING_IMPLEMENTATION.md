# History Tracking & Audit Trail Implementation

## Overview
This document describes the complete implementation of the **Admin Action History Tracking** system, which records which admin or administrator verified, approved, or rejected each report.

## What Was Implemented

### 1. **Backend API Enhancement** (`/api/admi-reports/[id]/route.js`)

The PUT endpoint now:

#### **Step 1: Authenticate Admin/Administrator**
```javascript
const authHeader = request.headers.get('authorization');
const token = authHeader.split(' ')[1];
const decodedPayload = await verifyToken(token);
const actorId = decodedPayload?.userId || decodedPayload?.id;
```

#### **Step 2: Determine Actor Role**
- Checks if the actor is an **Admin** (verification role)
- Falls back to check if actor is an **Administrator** (approval/rejection role)
- Retrieves actor name and role from database

```javascript
const AdminModel = await getAdminModel();
admin = await AdminModel.findById(actorId).select('name email authority').lean();
if (admin) {
  actorRole = 'admin';
  actorName = admin.name || admin.email;
} else {
  const AdministratorModel = await getAdministrativeHeadModel();
  administrator = await AdministratorModel.findById(actorId);
  // ...
}
```

#### **Step 3: Create History Entry**
Each status update creates a detailed history entry:

```javascript
const historyEntry = {
  action: historyAction,        // 'verified', 'approved', 'rejected', 'pending', 'solved'
  actorId: new mongoose.Types.ObjectId(actorId),  // ID of the admin/administrator
  actorName: actorName,         // Full name or email
  actorRole: actorRole,         // 'admin' or 'administrator'
  timestamp: new Date(),        // When action was taken
  notes: ''                     // Reason (for rejections) or action details
};
```

#### **Step 4: Save History Entry**
The history entry is atomically pushed to the report's history array:

```javascript
updatePayload.$push = { history: historyEntry };
const updatedReport = await Report.findByIdAndUpdate(
  { _id: id },
  updatePayload,
  { new: true }
);
```

#### **Step 5: Send Email Notification**
Status-specific emails are sent to the reporter with the updated status and actor information:

```javascript
await sendReportNotificationEmail(
  user.email,
  updatedReport,
  emailStatus,  // 'verified', 'approved', 'rejected'
  rejectedReason
);
```

### 2. **Database Schema** (`models/Report.js`)

History entries are stored in the `HistoryEntrySchema`:

```javascript
const HistoryEntrySchema = new Schema({
  action: {
    type: String,
    enum: ['created', 'approved', 'rejected', 'verified', 'forwarded', 'transferred', 'pending', 'solved'],
    required: true,
  },
  actorId: { type: Schema.Types.ObjectId, ref: 'Admin' },
  actorName: { type: String, required: true },
  actorRole: {
    type: String,
    enum: ['user', 'admin', 'administrator'],
    default: 'user',
  },
  timestamp: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
  recipientId: { type: Schema.Types.ObjectId },
  recipientName: { type: String },
});
```

### 3. **Frontend History Display Component** (`ReportHistory.js`)

A new dedicated React component displays the complete audit trail with:

- **Visual Timeline**: Vertical timeline with color-coded action badges
- **Actor Information**: Shows WHO performed the action
  - Admin/Administrator name
  - Role (admin/administrator distinction)
  - Timestamp of action
- **Action Details**: Shows WHAT was done
  - Action type (verified, approved, rejected, etc.)
  - Notes/reason for the action
  - Color-coded badges (green=approved, red=rejected, blue=verified, etc.)

**Key Features:**
- Chronological display from oldest to newest
- Visual timeline with connecting lines
- Color-coded action badges
- Formatted dates and times
- Rejection reasons clearly displayed
- Handles empty/null history gracefully

### 4. **Integration Points**

#### **User Dashboard** (`app/user/components/components/ReportDetailCard.js`)
- Displays complete history with all admin/administrator actions
- Shows who verified, approved, or rejected the report
- Displays rejection reasons

#### **Admin Dashboard** (`app/admin/components/ReportDetailView.js`)
- Shows complete audit trail
- Tracks all actions and actors
- Used for monitoring and oversight

## API Flow Examples

### Example 1: Admin Verifies a Report

**Request:**
```bash
PUT /api/admi-reports/[reportId]
Authorization: Bearer [admin-jwt-token]
Content-Type: application/json

{
  "status": "verified"
}
```

**Backend Processing:**
1. Extracts admin ID from JWT token
2. Looks up admin details (name: "Raj Kumar", role: "admin")
3. Creates history entry:
   ```javascript
   {
     action: 'verified',
     actorId: ObjectId("60d5ec49c1234567890abcdef"),
     actorName: 'Raj Kumar',
     actorRole: 'admin',
     timestamp: 2025-01-15T10:30:00Z,
     notes: 'Report verified by admin: Raj Kumar'
   }
   ```
4. Pushes entry to report.history array
5. Sends email to reporter: "Your report has been verified by Admin Raj Kumar"
6. Returns updated report with history

**Database Result:**
```javascript
{
  _id: ObjectId("60d5ec49c1234567890xyz123"),
  ticketId: "CIVIC-20250115-00042",
  status: 'verified',
  history: [
    {
      action: 'created',
      actorName: 'User System',
      actorRole: 'user',
      timestamp: 2025-01-12T09:15:00Z,
      notes: 'Report submitted'
    },
    {
      action: 'verified',
      actorId: ObjectId("60d5ec49c1234567890abcdef"),
      actorName: 'Raj Kumar',
      actorRole: 'admin',
      timestamp: 2025-01-15T10:30:00Z,
      notes: 'Report verified by admin: Raj Kumar'
    }
  ]
}
```

### Example 2: Administrator Approves Report

**Request:**
```bash
PUT /api/admi-reports/[reportId]
Authorization: Bearer [administrator-jwt-token]
Content-Type: application/json

{
  "status": "approved"
}
```

**Backend Processing:**
1. Extracts administrator ID from JWT token
2. Looks up administrator details (name: "Priya Sharma", role: "administrator")
3. Creates history entry with "approved" action
4. Sets `sendToMunicipality = true`
5. Adds entry to history array
6. Sends email indicating report forwarded to municipality

### Example 3: Administrator Rejects Report

**Request:**
```bash
PUT /api/admi-reports/[reportId]
Authorization: Bearer [administrator-jwt-token]
Content-Type: application/json

{
  "status": "rejected",
  "rejectedReason": "Insufficient location details provided"
}
```

**Backend Processing:**
1. Extracts administrator ID from JWT token
2. Looks up administrator info (name: "Amit Patel", role: "administrator")
3. Creates history entry:
   ```javascript
   {
     action: 'rejected',
     actorName: 'Amit Patel',
     actorRole: 'administrator',
     timestamp: 2025-01-15T11:45:00Z,
     notes: 'Reason: Insufficient location details provided'
   }
   ```
4. Sets rejection reason and reason message
5. Sends rejection email to reporter with reason
6. Stores history for audit trail

## Frontend Display

### User Reports Page (`/user`)
Users can see:
- Which admin verified their report
- Which administrator approved or rejected it
- Exactly when each action was taken
- Rejection reasons and details

### Admin Dashboard (`/admin`)
Admins can see:
- Complete history of all actions on reports
- Who (by name and role) performed each action
- Timeline of events
- Actions taken by other admins and administrators

## Key Features Delivered

✅ **Admin Identification**: Each history entry records WHO performed the action
✅ **Role Distinction**: Clearly shows whether action was by admin or administrator
✅ **Complete Audit Trail**: Every status change is logged with timestamp
✅ **Rejection Reason Tracking**: Reasons for rejection are preserved
✅ **Chronological Record**: History shows complete journey of each report
✅ **Email Integration**: Notifications include admin/administrator details
✅ **Visual Timeline**: Beautiful chronological display on frontend
✅ **Database Atomicity**: History entries saved atomically with status updates

## Testing the System

### Test Case 1: Verify Report History is Created
1. Create a report as user
2. Login as admin
3. Verify the report
4. Check report.history array contains:
   - 'created' action with user info
   - 'verified' action with admin info and name

### Test Case 2: Verify Role Distinction
1. Create multiple reports
2. Have Admin A verify one report
3. Have Administrator B approve another report
4. Check history shows:
   - actorRole = 'admin' for Admin A's action
   - actorRole = 'administrator' for Administrator B's action

### Test Case 3: Verify Rejection Reason is Saved
1. Create a report
2. Reject with reason: "Missing images"
3. Check report.history contains:
   - action: 'rejected'
   - notes: 'Reason: Missing images'

### Test Case 4: Verify Timeline Display
1. Open report details on user dashboard
2. Scroll to "Report History & Audit Trail" section
3. Verify timeline shows:
   - All actions in chronological order
   - Admin/administrator names
   - Timestamps
   - Action details

## Troubleshooting

### Issue: History not showing admin name
**Solution**: Ensure admin/administrator login token is valid and admin record exists in database

### Issue: actorRole shows 'unknown'
**Solution**: Verify that admin or administrator exists in database with a valid ObjectId

### Issue: Email not sending after status update
**Solution**: Verify EMAIL_USER and EMAIL_PASS are correctly set in .env.local

## Future Enhancements

- [ ] Add admin name filtering/search in history
- [ ] Export history as PDF audit report
- [ ] Add admin action analytics dashboard
- [ ] Email notifications to admins when report is updated
- [ ] History comparison view (before/after changes)
- [ ] Bulk action history export for compliance

