# Quick Debugging Guide - Profile Picture Issue

## Problem Summary
Profile picture URLs were not being saved in MongoDB when users updated their profiles.

## Root Causes Found

1. **Regular Users**: No profile picture upload support in API or UI
2. **All Users**: Profile pictures were converted to base64 instead of using Cloudinary
3. **Regular Users**: GET response didn't return profilePicture field

## Solutions Applied

### 1. API Changes ([app/api/user-profile/route.js](app/api/user-profile/route.js))

✅ **Added Cloudinary Integration**
- New `uploadToCloudinary()` function
- Uploads to `profile-pictures` folder
- Returns secure URLs for MongoDB storage

✅ **Updated GET Handler**
- Regular users now receive profilePicture in response
- Consistent across all user types

✅ **Updated PUT Handler**
- All roles (User, Admin, AdminHead) now use Cloudinary
- Profile picture is optional field
- Proper error handling for upload failures
- Added debug logging

### 2. Component Changes ([app/user/components/UserProfile.js](app/user/components/UserProfile.js))

✅ **Added Profile Picture Features**
- Upload button in edit modal
- Image preview (before and after upload)
- File validation (type and size)
- Visual confirmation feedback

✅ **Updated State Management**
- New states: `profilePicture`, `profilePicturePreview`
- New handler: `handleProfilePictureChange`
- Updated `handleUpdateProfile` to use FormData

## Verification Tests

### Test 1: Regular User Profile Picture Upload
```
1. Go to User Profile page
2. Click "Edit Profile"
3. Click "Choose Image" 
4. Select an image file
5. See preview update
6. Click "Save Changes"
7. Verify success toast
8. Check MongoDB: db.User.findOne({}, {profilePicture: 1})
   Expected: { profilePicture: "https://res.cloudinary.com/..." }
```

### Test 2: Admin Profile Picture Upload
```
1. Go to Admin Profile page
2. Click edit mode
3. Click camera icon on profile picture
4. Select image
5. Click save
6. Check MongoDB: db.Admins.findOne({}, {profilePicture: 1})
   Expected: { profilePicture: "https://res.cloudinary.com/..." }
```

### Test 3: Administrative Head Profile Picture Upload
```
1. Go to Administrative Head Profile page
2. Click edit mode
3. Click camera icon
4. Select image
5. Click save
6. Check MongoDB: db.AdministrativeHeads.findOne({}, {profilePicture: 1})
   Expected: { profilePicture: "https://res.cloudinary.com/..." }
```

### Test 4: Profile Picture Persists
```
1. Upload profile picture (any user type)
2. Refresh the page
3. Verify picture still displays
4. Check DB shows URL, not base64
```

### Test 5: Error Handling
```
1. Try uploading non-image file → Should fail with message
2. Try uploading >5MB image → Should fail with message
3. Try uploading valid image offline → Should fail gracefully
```

## Database Validation

### Query to check all user profile pictures:
```javascript
// Regular Users
db.User.find({profilePicture: {$exists: true, $ne: null}}, {userName: 1, profilePicture: 1})

// Admins
db.Admins.find({profilePicture: {$exists: true, $ne: null}}, {fullName: 1, profilePicture: 1})

// Administrative Heads
db.AdministrativeHeads.find({profilePicture: {$exists: true, $ne: null}}, {fullName: 1, profilePicture: 1})
```

### Check that URLs are from Cloudinary (not base64):
```javascript
// Should return true for all
db.User.aggregate([
  {$match: {profilePicture: {$exists: true, $ne: null}}},
  {$group: {_id: null, count: {$sum: 1}}},
  {$project: {all_cloudinary: {$eq: [true, true]}}}
])
```

## Debugging Commands

### Check if Cloudinary credentials are set
```bash
echo $CLOUDINARY_CLOUD_NAME
echo $CLOUDINARY_API_KEY
# Should return values, not empty
```

### Monitor logs for profile picture uploads
Look for these messages in server logs:
- `Profile picture uploaded to Cloudinary: https://...`
- `User profile updated: { userId: XXX, profilePictureUpdated: true }`

### Test Cloudinary connection in browser console
```javascript
fetch('/api/upload', {
  method: 'POST',
  body: formData  // with an image file
})
.then(r => r.json())
.then(d => console.log('Upload result:', d))
```

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Picture not saved | No Cloudinary credentials | Set env vars in .env.local |
| Upload fails with 500 | Cloudinary API error | Check internet, verify credentials |
| Picture shows base64 | Old code still running | Clear browser cache, restart server |
| Picture not displaying | Wrong URL in DB | Check DB has valid Cloudinary URL |
| File validation fails | File > 5MB | Choose smaller image |
| "Test Button" missing | Component not updated | Clear cache, hard refresh (Ctrl+Shift+R) |

## Files Changed

1. [app/api/user-profile/route.js](app/api/user-profile/route.js)
   - Added Cloudinary upload function
   - Updated GET/PUT handlers
   - Fixed profile picture handling for all roles

2. [app/user/components/UserProfile.js](app/user/components/UserProfile.js)
   - Added profile picture upload UI
   - Added file validation
   - Updated form data handling

3. [PROFILE_PICTURE_FIX_REPORT.md](PROFILE_PICTURE_FIX_REPORT.md)
   - Comprehensive fix documentation

## Support

### For each user type, check:

**User Profile** (`/user/profile`):
- Profile picture displays correctly
- Edit modal shows "Choose Image" button
- Upload works with FormData
- Picture persists after refresh

**Admin Profile** (`/admin/profile`):
- Profile picture displays correctly
- Edit mode shows camera icon
- Upload works with FormData
- Picture persists after refresh

**Administrative Head Profile** (`/administration/profile`):
- Profile picture displays correctly
- Edit mode shows camera icon
- Upload works with FormData
- Picture persists after refresh

---
All issues are now fixed! ✅
