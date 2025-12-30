# Firebase Setup Guide

This guide will help you set up Firebase for your website's admin system.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "sibel-ibram-website")
4. Follow the setup wizard
5. Disable Google Analytics (optional) or enable if you want it

## Step 2: Enable Required Services

### Authentication
1. Go to **Authentication** in the left menu
2. Click **Get Started**
3. Click **Sign-in method** tab
4. Enable **Email/Password**
5. Click **Save**

### Firestore Database
1. Go to **Firestore Database** in the left menu
2. Click **Create database**
3. Choose **Start in test mode** (we'll update rules later)
4. Select a location (choose closest to your users)
5. Click **Enable**

### Storage (Optional - for file uploads)
1. Go to **Storage** in the left menu
2. Click **Get started**
3. Start in test mode
4. Choose location
5. Click **Done**

## Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click the **Web** icon (`</>`)
4. Register app with nickname (e.g., "Website")
5. Copy the `firebaseConfig` object

## Step 4: Configure Admin

1. Open `admin/firebase-config.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 5: Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter your email address
4. Enter a secure password
5. Click **Add user**
6. **Save these credentials securely!**

## Step 6: Set Up Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Trainings collection
    match /trainings/{document=**} {
      allow read: if request.auth == null || resource.data.published == true;
      allow write: if request.auth != null;
    }
    
    // Speaking collection
    match /speaking/{document=**} {
      allow read: if request.auth == null || resource.data.published == true;
      allow write: if request.auth != null;
    }
    
    // Publications collection
    match /publications/{document=**} {
      allow read: if request.auth == null || resource.data.published == true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

## Step 7: Create Firestore Indexes (Optional)

If you get query errors, you may need to create indexes:

1. Go to **Firestore Database** → **Indexes**
2. Click **Create Index**
3. Collection: `trainings`
4. Fields: `published` (Ascending), `createdAt` (Descending)
5. Click **Create**

Repeat for `speaking` and `publications` collections.

## Step 8: Test Admin Access

1. Open `admin/index.html` in your browser
2. Login with your Firebase credentials
3. Create a test item
4. Verify it appears on the main website

## Troubleshooting

**"Firebase not configured" error:**
- Check that `firebase-config.js` has correct values
- Make sure no typos in configuration

**"Permission denied" error:**
- Check Firestore security rules are published
- Verify you're logged in as admin

**"Collection not found" error:**
- Collections are created automatically when you add first item
- This is normal - just create your first item in admin

## Security Notes

- Keep your Firebase credentials secure
- Don't commit `firebase-config.js` with real credentials to public repos
- Use environment variables in production if possible
- Regularly review Firestore security rules

---

**You're all set!** 🎉

Now you can use the admin panel to manage your content.

