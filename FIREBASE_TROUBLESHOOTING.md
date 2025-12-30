# Firebase Troubleshooting Guide

## Issue: "Missing or insufficient permissions" Error

If you're getting permission errors when trying to load or save posts, follow these steps:

### Step 1: Verify Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **sibram**
3. Go to **Firestore Database** → **Rules**
4. Make sure your rules look like this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if document is published
    function isPublished() {
      return resource.data.published == true;
    }
    
    // Trainings collection
    match /trainings/{documentId} {
      // Anyone can read published items, authenticated users can read all
      allow read: if isPublished() || isAuthenticated();
      // Only authenticated users can write
      allow create, update: if isAuthenticated();
      allow delete: if isAuthenticated();
    }
    
    // Speaking collection
    match /speaking/{documentId} {
      allow read: if isPublished() || isAuthenticated();
      allow create, update: if isAuthenticated();
      allow delete: if isAuthenticated();
    }
    
    // Publications collection
    match /publications/{documentId} {
      allow read: if isPublished() || isAuthenticated();
      allow create, update: if isAuthenticated();
      allow delete: if isAuthenticated();
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **Publish** to save the rules

### Step 2: Verify You're Logged In

1. Check the admin panel - you should see your email address in the top right
2. If you see "Not authenticated", log out and log back in
3. Check the browser console (F12) for any authentication errors

### Step 3: Check Firestore Indexes (Optional but Recommended)

If you're getting errors about missing indexes:

1. Go to **Firestore Database** → **Indexes**
2. Click **Create Index** if needed
3. For each collection (trainings, speaking, publications), create an index:
   - Collection ID: `trainings` (or `speaking` or `publications`)
   - Fields to index:
     - `published` (Ascending)
     - `createdAt` (Descending)
   - Query scope: **Collection**
4. Click **Create**

**Note:** The code will work without these indexes, but it will be slower. The code automatically falls back to loading all documents if the index doesn't exist.

### Step 4: Verify Authentication is Working

1. Open browser console (F12)
2. Look for any Firebase errors
3. Check that `firebaseInitialized` is `true`
4. Verify that `auth.currentUser` is not null

### Step 5: Test with Browser Console

Open the browser console and run:

```javascript
// Check if Firebase is initialized
console.log('Firebase initialized:', typeof firebase !== 'undefined');
console.log('Auth:', auth);
console.log('Current user:', auth?.currentUser);
console.log('DB:', db);
```

If any of these are `null` or `undefined`, there's a configuration issue.

## Issue: Save/Publish Buttons Don't Work

If buttons don't respond or don't show errors:

### Step 1: Check Browser Console

1. Open browser console (F12)
2. Try to save a post
3. Look for any errors in the console
4. Check the Network tab for failed requests

### Step 2: Verify Form Validation

Make sure all required fields are filled:
- **Trainings**: Title, Description
- **Speaking**: Title, Location, Date, Description
- **Publications**: Title, Date, Excerpt

### Step 3: Check Error Messages

The code now shows specific error messages. Look for alerts at the top of the form or in the list view.

### Step 4: Verify Authentication State

The save functions now check authentication before saving. If you see "Not authenticated" errors:
1. Log out and log back in
2. Refresh the page
3. Check that your session hasn't expired

## Common Error Messages and Solutions

### "Permission denied. Check Firestore security rules"
- **Solution**: Follow Step 1 above to verify your security rules are correct and published

### "Not authenticated. Please log in again."
- **Solution**: Log out and log back in. Your session may have expired.

### "Firebase Firestore not initialized"
- **Solution**: Check `admin/firebase-config.js` - make sure all config values are correct (not placeholders)

### "orderBy query failed"
- **Solution**: This is normal if indexes don't exist. The code will automatically fall back to loading all documents. You can create indexes (Step 3) for better performance.

## Still Having Issues?

1. **Clear browser cache** and refresh
2. **Check Firebase Console** for any service outages
3. **Verify your Firebase project** is active and billing is enabled (if needed)
4. **Check browser console** for detailed error messages
5. **Try logging out and back in** to refresh your authentication token

## Testing Checklist

- [ ] Firestore security rules are published
- [ ] You're logged in (see your email in admin panel)
- [ ] Browser console shows no Firebase errors
- [ ] Can load existing posts
- [ ] Can create new posts
- [ ] Can edit existing posts
- [ ] Can publish/unpublish posts
- [ ] Can delete posts

