# Admin Dashboard - Sibel Ibram Website

Welcome to your content management system!

## 🧪 Quick Test (No Setup Required!)

**Want to test locally first?**

1. Open `index.html` in your browser
2. Login with:
   - Email: `demo@test.com`
   - Password: `demo123`
3. Test all features! (Posts save in browser only)

---

## 🎯 Production Setup

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable:
   - **Authentication** (Email/Password)
   - **Firestore Database**
   - **Storage** (for file uploads, optional)

4. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy the config object

5. Edit `firebase-config.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     // ... etc
   };
   ```

### 2. Create Admin User

1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Enter your email and password
4. Save credentials securely

### 3. Firestore Security Rules

Set up Firestore rules in Firebase Console → Firestore Database → Rules:

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

---

## 📝 Usage

### Access Admin
- URL: `yourwebsite.com/admin/` or `yourwebsite.com/admin/index.html`

### Create Content

**Trainings:**
- Title (required)
- Description (required)
- Image URL (optional)
- Learn More Link (optional)

**Speaking Events:**
- Title (required)
- Location (required)
- Date (required)
- Description (required)
- Image URL (optional)
- Links (optional, multiple)

**Publications:**
- Title (required)
- Date (required)
- Category (optional)
- Excerpt (required)
- Content (optional, supports .docx upload)
- Image URL (optional)
- Read More Link (optional)

### .docx File Support

For Publications, you can upload a .docx file:
1. Click "📄 Upload .docx File"
2. Select your .docx file
3. Content will be extracted and inserted into the content field
4. You can edit it further if needed

---

## 🔒 Security

- Only authenticated users can create/edit/delete content
- Published content is visible to everyone
- Drafts are admin-only
- Keep your Firebase credentials secure

---

## 📂 File Structure

```
admin/
├── index.html          # Admin dashboard interface
├── admin-app.js        # Application logic
├── firebase-config.js  # Firebase configuration
├── mammoth.browser.min.js  # .docx file converter
└── README.md          # This file
```

---

## 🆘 Troubleshooting

**Can't Login:**
- Check email/password in Firebase Console
- Make sure Authentication is enabled
- Clear browser cache

**Firebase Error:**
- Verify `firebase-config.js` has correct values
- Check Firestore is enabled
- Verify security rules are published

**Posts Don't Save:**
- Check browser console (F12) for errors
- Verify Firestore database is enabled
- Check security rules allow writes

---

## ✅ Status Check

Before using admin:
- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Authentication enabled
- [ ] Admin user created
- [ ] `firebase-config.js` configured
- [ ] Security rules published
- [ ] Files uploaded to hosting

---

**Ready to manage your content!** 🎉

