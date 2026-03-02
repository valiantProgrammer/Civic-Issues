# 🔧 Ticket ID Troubleshooting Guide

## Issue: Still Showing MongoDB _id Instead of Ticket ID

**Example of problem:** `Ticket ID: 69a51f867b472818bef848dd` (this is a MongoDB ObjectID)
**Expected:** `Ticket ID: CIVIC-20260302-00001` (sequential ticket ID)

---

## ✅ Solution

### **Option 1: Create a NEW Report (Recommended)**
1. Go to user dashboard
2. Create a brand new report
3. Submit it
4. Check the report details
5. Should now show: `Ticket ID: CIVIC-20260302-00001` (or similar)

**Why?** New reports are created AFTER we added the ticketId feature, so they automatically get the new sequential ID.

---

### **Option 2: Migrate Existing Reports** 
If you want to update old reports with ticket IDs:

#### Step 1: Run Migration Endpoint
```bash
POST http://localhost:3000/api/admin/migrate-ticket-ids
```

Or use curl:
```bash
curl -X POST http://localhost:3000/api/admin/migrate-ticket-ids
```

#### Step 2: Check Console Output
Look for messages like:
```
✅ Added ticketId CIVIC-20260302-00001 to report 69a51f867b472818bef848dd
✅ Added ticketId CIVIC-20260302-00002 to report 69a51f867b472818bef848de
...
```

#### Step 3: Verify Migration
Response should show:
```json
{
  "message": "Migration completed",
  "totalProcessed": 5,
  "successCount": 5,
  "errorCount": 0
}
```

#### Step 4: Delete Migration Endpoint
After running, delete the migration file:
```
app/api/admin/migrate-ticket-ids/route.js
```

(Keep it for future use, or delete if not needed again)

---

## 🔍 Debugging: Check Server Logs

When you create a new report, check your terminal for:

```
✅ Generated Ticket ID: CIVIC-20260302-00001
✅ Report saved with Ticket ID: CIVIC-20260302-00001 Report ID: 69a51f867b472818bef848dd
```

### If You Don't See These Logs:
1. Check if server is running
2. Make sure you're watching the correct terminal
3. Verify API endpoint is `/api/reports` (POST)

### If You See Error:
```
Error generating ticket ID: [error message]
```

**Possible causes:**
- Counter model database connection issue
- MongoDB connection problem
- Unique constraint violation

---

## 📊 How It Works

### **Old Reports (Before Feature)**
```
Database: { _id: "69a51f867b472818bef848dd", Title: "...", ... }
Display Fallback: Show _id when ticketId missing
Result: "Ticket ID: 69a51f867b472818bef848dd" ❌
```

### **New Reports (After Feature)**
```
Database: { _id: "69a51f867b472818bef848dd", ticketId: "CIVIC-20260302-00001", Title: "...", ... }
Display: Show ticketId when present
Result: "Ticket ID: CIVIC-20260302-00001" ✅
```

---

## ✨ Testing Step-by-Step

1. **Create New Report**
   - Add title, description, location, image
   - Submit report
   - ⏳ Wait for response

2. **Check Server Logs**
   - Should see: `✅ Generated Ticket ID: CIVIC-...`
   - Should see: `✅ Report saved with Ticket ID: CIVIC-...`

3. **Check Report Details**
   - Open the report you just created
   - Scroll to "Ticket ID" section
   - Should show: `CIVIC-20260302-00001` format

4. **Test Copy Button**
   - Click the copy icon next to ticket ID
   - Should see toast: "Ticket ID copied to clipboard"

5. **Verify in Database (Optional)**
   ```bash
   # In MongoDB shell
   db.reports.findOne({ ticketId: { $exists: true } })
   # Should return report with ticketId field
   ```

---

## 📋 Checklist

- [ ] Created new report after ticket ID feature was added
- [ ] Report shows `CIVIC-YYYYMMDD-NNNNN` format (not MongoDB _id)
- [ ] Copy button works and shows toast notification
- [ ] Both admin and user dashboards show the same ticket ID
- [ ] Email received for submission includes ticket ID

---

## 🆘 Still Not Working?

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Restart dev server** (npm run dev)
3. **Check MongoDB** - Ensure reports collection has ticketId field
4. **Check logs** - Look for error messages in terminal
5. **Test with curl** to isolate frontend vs backend issue

---

## 📞 Quick Diagnostic Command

Run in MongoDB compass or mongo shell:

```javascript
// Check how many reports have ticketId
db.reports.find({ ticketId: { $exists: true } }).count()

// Check how many reports are missing ticketId
db.reports.find({ ticketId: { $exists: false } }).count()

// See example of report with ticketId
db.reports.findOne({ ticketId: { $exists: true } })
```

---

## ✅ Success Indicators

When everything works:
- ✅ New reports get sequential ticket IDs
- ✅ Ticket ID format: `CIVIC-20260302-00001`
- ✅ Ticket ID visible in admin/user/administration portals
- ✅ Copy to clipboard works
- ✅ Email includes ticket ID
- ✅ No more MongoDB ObjectIDs shown

---

**Try creating a new report first** - it should automatically get the new ticket ID format! 🚀
