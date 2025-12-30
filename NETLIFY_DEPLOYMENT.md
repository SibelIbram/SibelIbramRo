# Netlify Deployment Guide

This guide will walk you through deploying your website to Netlify.

## Prerequisites

Before deploying, ensure you've completed:
- [ ] Firebase project is set up (see `FIREBASE_PRODUCTION_SETUP.md`)
- [ ] `admin/firebase-config.js` has real Firebase credentials (not placeholders)
- [ ] All files are in `D:\Cursor_SibelProject\Website_for_Prod\SibelIbramRo\`
- [ ] You've tested the site locally and everything works

---

## Method 1: Deploy via Netlify Dashboard (Easiest - Recommended)

### Step 1: Create Netlify Account

1. Go to [https://www.netlify.com/](https://www.netlify.com/)
2. Click **Sign up** (you can use GitHub, GitLab, Bitbucket, or Email)
3. Complete the signup process

### Step 2: Deploy Your Site

1. Log in to [Netlify Dashboard](https://app.netlify.com/)
2. On the main page, you'll see **"Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"**
3. **Open File Explorer** and navigate to: `D:\Cursor_SibelProject\Website_for_Prod\SibelIbramRo\`
4. **Drag the entire `SibelIbramRo` folder** into the Netlify drop zone
5. Wait for the upload to complete (usually 10-30 seconds)

### Step 3: Get Your Site URL

1. After deployment, Netlify will show you a success message
2. Your site will be available at: `https://random-name-12345.netlify.app`
3. **Copy this URL** - you'll need it for Firebase configuration

### Step 4: Add Netlify Domain to Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Settings** tab
4. Scroll to **Authorized domains**
5. Click **Add domain**
6. Enter your Netlify domain: `your-site-name.netlify.app` (the one from Step 3)
7. Click **Add**
8. If you plan to use a custom domain, add that too

**Why this is critical:** Without this, Firebase Authentication will block login attempts from your Netlify site.

### Step 5: Test Your Deployed Site

1. Visit your Netlify URL: `https://your-site-name.netlify.app`
2. Test the main website:
   - [ ] Homepage loads correctly
   - [ ] Navigation works
   - [ ] Language switching works
   - [ ] Published posts appear
   - [ ] Images load correctly
3. Test the admin panel:
   - [ ] Go to `https://your-site-name.netlify.app/admin/`
   - [ ] Login with your Firebase credentials
   - [ ] Create a test post
   - [ ] Verify it appears on the main site
   - [ ] Test image upload

---

## Method 2: Deploy via Git (For Continuous Deployment)

If you want automatic deployments when you push to Git:

### Step 1: Push Your Code to Git

1. Initialize Git in your project folder (if not already done):
   ```powershell
   cd D:\Cursor_SibelProject\Website_for_Prod\SibelIbramRo
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a repository on GitHub/GitLab/Bitbucket
3. Push your code:
   ```powershell
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

### Step 2: Connect to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click **Add new site** → **Import an existing project**
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Netlify to access your repositories
5. Select your repository
6. Configure build settings:
   - **Build command:** Leave empty (static site)
   - **Publish directory:** `/` (root of repository)
7. Click **Deploy site**

### Step 3: Follow Steps 4-5 from Method 1

Add your Netlify domain to Firebase and test your site.

---

## Netlify Site Configuration

### Update Site Name (Optional)

1. Go to **Site settings** → **Change site name**
2. Enter a custom name (e.g., `sibel-ibram`)
3. Your site will be available at: `https://sibel-ibram.netlify.app`

### Custom Domain (Optional)

If you have a custom domain:

1. Go to **Domain settings** → **Add custom domain**
2. Enter your domain (e.g., `sibelibram.com`)
3. Follow Netlify's DNS configuration instructions
4. **Add your custom domain to Firebase Authorized domains** as well

---

## Important: Firebase Configuration After Deployment

### Update Authorized Domains

After deploying, make sure these domains are in Firebase:

1. Go to Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Ensure these are listed:
   - `localhost` (for local testing)
   - `your-site-name.netlify.app` (your Netlify domain)
   - `www.yourdomain.com` (if using custom domain)
   - `yourdomain.com` (if using custom domain)

---

## Troubleshooting

### Issue: "Firebase: Error (auth/unauthorized-domain)"

**Solution:**
- Add your Netlify domain to Firebase Authorized domains (see Step 4 above)
- Wait a few minutes for changes to propagate

### Issue: Images Not Loading

**Solution:**
- Check that image paths in your HTML are relative (e.g., `images/photo.jpg` not `../images/photo.jpg`)
- Verify images are in the `images/` folder
- Check browser console for 404 errors

### Issue: Admin Login Not Working

**Solution:**
- Verify Firebase config in `admin/firebase-config.js` has real values
- Check that Email/Password auth is enabled in Firebase Console
- Ensure Netlify domain is in Firebase Authorized domains
- Check browser console for error messages

### Issue: Posts Not Appearing

**Solution:**
- Verify posts are marked as `published: true` in admin panel
- Check Firestore security rules allow public read access
- Verify Firestore indexes are created (see `FIREBASE_PRODUCTION_SETUP.md`)

### Issue: 404 Errors on Detail Pages

**Solution:**
- Netlify needs a redirect rule for client-side routing
- Create `_redirects` file in root directory (see below)

---

## Create _redirects File for Client-Side Routing

If you're using detail pages (`training-detail.html`, `publication-detail.html`), create a `_redirects` file:

1. Create a new file: `D:\Cursor_SibelProject\Website_for_Prod\SibelIbramRo\_redirects`
2. Add this content:
   ```
   /training-detail.html  /training-detail.html  200
   /publication-detail.html  /publication-detail.html  200
   /admin/*  /admin/index.html  200
   ```

3. Redeploy to Netlify (drag and drop again, or push to Git if using Method 2)

---

## Updating Your Site

### If Using Drag-and-Drop (Method 1)

1. Make changes to your local files
2. Test locally
3. Drag and drop the folder to Netlify again
4. Netlify will create a new deployment

### If Using Git (Method 2)

1. Make changes to your local files
2. Commit and push to Git:
   ```powershell
   git add .
   git commit -m "Update description"
   git push
   ```
3. Netlify will automatically deploy your changes (usually within 1-2 minutes)

---

## Netlify Free Tier Limits

- **Bandwidth**: 100 GB/month
- **Build minutes**: 300 minutes/month
- **Sites**: Unlimited
- **Custom domains**: Unlimited

**For a personal website, the free tier is more than sufficient.**

---

## Security Notes

1. ✅ **Firebase API keys are safe to expose** in client-side code (they're meant to be public)
2. ✅ **Don't commit sensitive data** to public Git repositories
3. ✅ **Use production security rules** in Firebase (not test mode)
4. ✅ **Monitor Firebase usage** to avoid unexpected costs

---

## Final Checklist

Before considering deployment complete:

- [ ] Site is deployed to Netlify
- [ ] Netlify domain added to Firebase Authorized domains
- [ ] Main website loads and displays correctly
- [ ] Published posts appear on main site
- [ ] Admin panel accessible at `/admin/`
- [ ] Can login to admin panel with Firebase credentials
- [ ] Can create/edit/delete posts from admin panel
- [ ] Can upload images from admin panel
- [ ] Language switching works (English/Romanian)
- [ ] Navigation and scroll highlighting work
- [ ] Detail pages work (training-detail.html, publication-detail.html)
- [ ] Contact page displays correctly
- [ ] All images load correctly

---

## Next Steps After Deployment

1. **Share your site URL** with others
2. **Set up a custom domain** (optional but recommended)
3. **Monitor Firebase usage** in Firebase Console
4. **Regularly update content** via admin panel
5. **Backup your Firebase data** periodically (export from Firestore)

---

**Congratulations! Your website is now live on Netlify! 🎉**

If you encounter any issues, check the troubleshooting section above or review the Firebase production setup guide.


