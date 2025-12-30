# Firebase Production Setup Guide

This guide covers all steps needed to set up Firebase for **production deployment** on Netlify.

## Prerequisites Checklist

- [ ] Firebase project created
- [ ] All services enabled (Auth, Firestore, Storage)
- [ ] Admin user account created
- [ ] Firebase config copied to `admin/firebase-config.js`
- [ ] Basic security rules in place

---

## Step 1: Review and Update Firebase Project Settings

### 1.1 Project Information
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Project Settings** (gear icon)
3. Verify project name and ID
4. **Note your Project ID** - you'll need it for Netlify

### 1.2 Add Authorized Domains (IMPORTANT for Netlify)
1. In **Project Settings**, go to **Authentication** tab
2. Scroll to **Authorized domains**
3. Add your Netlify domain:
   - `your-site-name.netlify.app` (default Netlify domain)
   - `www.yourdomain.com` (if using custom domain)
   - `yourdomain.com` (if using custom domain)
4. Click **Add**

**Why this matters:** Without authorized domains, Firebase Auth will block login attempts from your Netlify site.

---

## Step 2: Production Security Rules

### 2.1 Firestore Security Rules (Production-Ready)

Go to **Firestore Database** → **Rules** and replace with:

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
      // Anyone can read published items
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

**Click "Publish"** after updating.

### 2.2 Storage Security Rules (Production-Ready)

Go to **Storage** → **Rules** and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Images folder - public read, authenticated write
    match /images/{category}/{allPaths=**} {
      // Anyone can read images (needed for website display)
      allow read: if true;
      // Only authenticated users can upload/delete
      allow write: if request.auth != null 
                   && request.resource.size < 10 * 1024 * 1024 // 10MB limit
                   && request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null;
    }
    
    // Deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

**Click "Publish"** after updating.

---

## Step 3: Create Firestore Indexes (Required for Queries)

Your queries filter by `published == true` and order by `createdAt`. Create indexes:

### 3.1 Trainings Index
1. Go to **Firestore Database** → **Indexes**
2. Click **Create Index**
3. Collection ID: `trainings`
4. Fields to index:
   - `published` (Ascending)
   - `createdAt` (Descending)
5. Query scope: **Collection**
6. Click **Create**

### 3.2 Speaking Index
1. Click **Create Index**
2. Collection ID: `speaking`
3. Fields:
   - `published` (Ascending)
   - `createdAt` (Descending)
4. Click **Create**

### 3.3 Publications Index
1. Click **Create Index**
2. Collection ID: `publications`
3. Fields:
   - `published` (Ascending)
   - `createdAt` (Descending)
4. Click **Create**

**Note:** Index creation can take a few minutes. You'll see a notification when ready.

---

## Step 4: Verify Authentication Setup

### 4.1 Email/Password Provider
1. Go to **Authentication** → **Sign-in method**
2. Ensure **Email/Password** is **Enabled**
3. Verify **Email link (passwordless sign-in)** is disabled (unless you want it)

### 4.2 Admin User Account
1. Go to **Authentication** → **Users**
2. Verify your admin account exists
3. **Test login** with your credentials
4. If needed, create additional admin users:
   - Click **Add user**
   - Enter email and password
   - **Save credentials securely**

---

## Step 5: Update Firebase Configuration

### 5.1 Verify Config File
Open `admin/firebase-config.js` and ensure it has **real values** (not placeholders):

```javascript
const firebaseConfig = {
  apiKey: "AIza...", // Real API key
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id", // Real project ID
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 5.2 Get Config from Firebase Console
If you need to get the config again:
1. Go to **Project Settings** → **Your apps**
2. Click on your web app (or create one if needed)
3. Copy the `firebaseConfig` object
4. Replace values in `admin/firebase-config.js`

---

## Step 6: Test Everything Locally

Before deploying to Netlify, test locally:

### 6.1 Test Admin Panel
1. Open `admin/index.html` in browser
2. Login with your Firebase credentials
3. Create a test post in each category
4. Verify posts appear on main website
5. Test image uploads
6. Test publish/unpublish functionality

### 6.2 Test Main Website
1. Open `index.html` in browser
2. Verify published posts appear
3. Verify unpublished posts are hidden
4. Test language switching
5. Test all navigation links
6. Verify images load correctly

### 6.3 Test Detail Pages
1. Click "Read More" on a Training
2. Click "Read More" on a Publication
3. Verify content displays correctly
4. Test back button

---

## Step 7: Prepare for Netlify Deployment

### 7.1 Environment Variables (Optional but Recommended)

For added security, you can use environment variables in Netlify instead of hardcoding in `firebase-config.js`. However, since your config is already in the file, this is optional.

If you want to use environment variables:
1. In Netlify dashboard → **Site settings** → **Environment variables**
2. Add variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

Then update `firebase-config.js` to read from environment variables (requires build tool like Vite).

**For now, keeping config in the file is fine** - Firebase API keys are safe to expose in client-side code.

### 7.2 Verify File Structure
Ensure all files are in place:
```
SibelIbramRo/
├── index.html
├── styles.css
├── script.js
├── content-loader.js
├── training-detail.html
├── training-detail-loader.js
├── publication-detail.html
├── publication-detail-loader.js
├── admin/
│   ├── index.html
│   ├── admin-app.js
│   ├── firebase-config.js
│   └── admin-styles.css
├── images/
│   ├── MainLogo.jpg
│   ├── AboutMePic_v2.jpg
│   └── (other images)
└── (other files)
```

---

## Step 8: Firebase Free Tier Limits (Reference)

### Firestore
- **Storage**: 1 GB total
- **Reads**: 50,000/day
- **Writes**: 20,000/day
- **Deletes**: 20,000/day

### Storage
- **Storage**: 5 GB total
- **Downloads**: 1 GB/day
- **Uploads**: 20,000/day

### Authentication
- **Users**: Unlimited (free tier)

**For a personal website, the free tier is usually sufficient.** Monitor usage in Firebase Console → **Usage and billing**.

---

## Step 9: Final Checklist Before Netlify Deployment

- [ ] Firebase project created and configured
- [ ] All security rules published (Firestore + Storage)
- [ ] Firestore indexes created
- [ ] Authorized domains added (Netlify domain)
- [ ] Admin user account created and tested
- [ ] `firebase-config.js` has real values (not placeholders)
- [ ] Tested admin panel locally - can create/edit/delete/publish posts
- [ ] Tested main website locally - published posts appear
- [ ] Tested image uploads (Firebase Storage working)
- [ ] Tested detail pages (training-detail.html, publication-detail.html)
- [ ] All images are in `images/` folder
- [ ] Language switching works (English/Romanian)
- [ ] Navigation and scroll highlighting work
- [ ] Contact page displays correctly

---

## Step 10: After Netlify Deployment

### 10.1 Add Netlify Domain to Authorized Domains
After deploying to Netlify, you'll get a domain like `your-site.netlify.app`:
1. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add `your-site.netlify.app`
3. If using custom domain, add that too

### 10.2 Test Production Site
1. Visit your Netlify site
2. Test admin login: `https://your-site.netlify.app/admin/`
3. Verify published posts appear on main site
4. Test image uploads from admin panel
5. Test all functionality

### 10.3 Monitor Usage
1. Go to Firebase Console → **Usage and billing**
2. Monitor daily usage
3. Set up billing alerts if needed (optional)

---

## Troubleshooting Production Issues

### "Firebase: Error (auth/unauthorized-domain)"
- **Solution**: Add your Netlify domain to Authorized domains (Step 1.2)

### "Permission denied" errors
- **Solution**: Check Firestore/Storage security rules are published

### Images not loading
- **Solution**: Check Storage security rules allow public read access

### Posts not appearing
- **Solution**: Verify posts are marked as `published: true` in admin panel
- **Solution**: Check Firestore indexes are created (Step 3)

### Admin login not working
- **Solution**: Verify Email/Password auth is enabled
- **Solution**: Check authorized domains include your Netlify domain

---

## Security Best Practices

1. ✅ **Never commit real Firebase config to public repos** (use `.gitignore`)
2. ✅ **Use production security rules** (not test mode)
3. ✅ **Limit authorized domains** to your actual domains
4. ✅ **Use strong passwords** for admin accounts
5. ✅ **Monitor Firebase usage** regularly
6. ✅ **Review security rules** periodically
7. ✅ **Keep Firebase SDKs updated**

---

## Next Steps

Once all steps above are complete:
1. ✅ You're ready to deploy to Netlify
2. ✅ Follow Netlify deployment guide
3. ✅ Add Netlify domain to Firebase authorized domains
4. ✅ Test everything on production site

**You're all set for production!** 🚀

