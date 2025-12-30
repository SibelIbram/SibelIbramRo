# How to Get Your Firebase Configuration Values

This guide shows you exactly where to find each Firebase config value in the Firebase Console.

## Step 1: Go to Firebase Console

1. Open your browser and go to: [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. **Sign in** with your Google account
3. **Select your Firebase project** (or create a new one if you haven't already)

## Step 2: Access Project Settings

1. Click the **gear icon** (⚙️) in the top left, next to "Project Overview"
2. Click **Project settings**

## Step 3: Get Your Firebase Config

1. In the **Project settings** page, scroll down to the **"Your apps"** section
2. You'll see a list of apps (web, iOS, Android, etc.)

### If You Already Have a Web App:

1. Click on your **web app** (it will have a `</>` icon)
2. You'll see a code snippet that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

3. **Copy this entire config object**

### If You Don't Have a Web App Yet:

1. In the **"Your apps"** section, click **"Add app"** or the **`</>`** (web) icon
2. **Register your app:**
   - App nickname: `Sibel Ibram Website` (or any name you prefer)
   - **Do NOT check** "Also set up Firebase Hosting" (we're using Netlify)
   - Click **Register app**
3. You'll see the config code snippet - **copy it**

## Step 4: Update Your firebase-config.js File

1. Open: `D:\Cursor_SibelProject\Website_for_Prod\SibelIbramRo\admin\firebase-config.js`
2. Replace the placeholder values with your actual Firebase config:

**Find this:**
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**Replace with your actual values** (from Step 3):
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",  // Your actual API key
  authDomain: "your-project-id.firebaseapp.com",  // Your actual auth domain
  projectId: "your-project-id",  // Your actual project ID
  storageBucket: "your-project-id.appspot.com",  // Your actual storage bucket
  messagingSenderId: "123456789012",  // Your actual sender ID
  appId: "1:123456789012:web:abc123def456"  // Your actual app ID
};
```

## Step 5: Verify Each Value

Here's what each value should look like:

| Field | Example | Where to Find |
|-------|---------|---------------|
| `apiKey` | `AIzaSyC...` (starts with "AIza") | From Firebase Console → Project Settings → Your apps |
| `authDomain` | `myproject.firebaseapp.com` | Auto-generated from your project ID |
| `projectId` | `myproject-12345` | Your Firebase project ID |
| `storageBucket` | `myproject-12345.appspot.com` | Auto-generated from your project ID |
| `messagingSenderId` | `123456789012` (12 digits) | From Firebase Console |
| `appId` | `1:123456789012:web:abc123` | From Firebase Console |

## Step 6: Test Your Configuration

1. **Save** the `firebase-config.js` file
2. Open `admin/index.html` in your browser
3. Open the browser console (F12 → Console tab)
4. You should see: **"Firebase initialized successfully"**
5. Try logging in with your Firebase credentials

## Troubleshooting

### "Firebase config has placeholder values"
- **Solution:** Make sure you replaced ALL placeholder values with real ones
- Check that there are no quotes around `YOUR_API_KEY` - it should be your actual key

### "Firebase: Error (app/duplicate-app)"
- **Solution:** This is usually fine - it means Firebase is already initialized. Check the console for "Firebase initialized successfully"

### "Firebase: Error (auth/unauthorized-domain)"
- **Solution:** Add `localhost` to Firebase Authorized domains:
  1. Go to Firebase Console → Authentication → Settings
  2. Scroll to "Authorized domains"
  3. Add `localhost` if it's not there

### Can't Find Project Settings
- **Solution:** Make sure you're logged in and have selected the correct Firebase project
- The gear icon is in the top-left of the Firebase Console

## Quick Reference: Direct Links

- **Firebase Console:** [https://console.firebase.google.com/](https://console.firebase.google.com/)
- **Project Settings:** [https://console.firebase.google.com/project/_/settings/general](https://console.firebase.google.com/project/_/settings/general)
  (Replace `_` with your project ID)

## What to Do After Getting Config

1. ✅ Update `admin/firebase-config.js` with your config
2. ✅ Test admin login locally
3. ✅ Create a test post
4. ✅ Verify it appears on the main website
5. ✅ Deploy to Netlify
6. ✅ Add Netlify domain to Firebase Authorized domains

---

**Need help?** Check `FIREBASE_PRODUCTION_SETUP.md` for complete Firebase setup instructions.

