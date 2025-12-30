# Image Upload Guide

This guide explains the image upload system implemented for the admin panel and how to configure it.

## Overview

The system supports **two methods** for adding images to posts:

1. **Firebase Storage** (Recommended) - For production use
2. **Base64 Encoding** (Fallback) - For demo mode or when Firebase Storage is not configured

## How It Works

### User Interface

In the admin panel, each category (Trainings, Speaking, Publications) now has:
- A **"📷 Upload Image"** button to select a local file
- An **"Or enter image URL"** field for manual URL entry
- Both methods work - you can use either one

### Upload Process

When you upload an image file:

1. **If Firebase Storage is configured:**
   - Image is uploaded to Firebase Storage
   - A public URL is generated and stored
   - Image is accessible via CDN
   - **Max file size: 10MB**

2. **If Firebase Storage is NOT configured (Demo Mode):**
   - Image is converted to base64 format
   - Base64 string is stored directly in the database
   - **Max file size: 5MB** (due to Firestore limits)
   - Works offline and in demo mode

## Setting Up Firebase Storage

### Step 1: Enable Storage in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on **"Storage"** in the left menu
4. Click **"Get Started"**
5. Choose **"Start in test mode"** (for development) or set up security rules

### Step 2: Configure Security Rules

For production, update your Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload images
    match /{category}/{allPaths=**} {
      allow read: if true; // Public read access
      allow write: if request.auth != null; // Only authenticated users can write
    }
  }
}
```

### Step 3: Update Firebase Config

The Firebase Storage SDK is already included in `admin/index.html`. The `firebase-config.js` file will automatically initialize Storage if your Firebase config is valid.

Make sure your `firebase-config.js` has valid credentials (not placeholders).

## File Size Limits

- **Firebase Storage**: Up to 10MB per image
- **Base64 (Demo Mode)**: Up to 5MB per image
- **Recommended**: Keep images under 2MB for best performance

## Image Formats Supported

- JPEG/JPG
- PNG
- GIF
- WebP
- Any standard image format supported by browsers

## Storage Locations

### Firebase Storage Structure:
```
/{category}/{timestamp}_{filename}
```

Examples:
- `trainings/1234567890_workshop.jpg`
- `speaking/1234567891_conference.png`
- `publications/1234567892_article.jpg`

### Base64 Format:
Stored as data URL: `data:image/jpeg;base64,/9j/4AAQSkZJRg...`

## Troubleshooting

### "Image too large for demo mode"
- **Solution**: Either reduce image size (< 5MB) or configure Firebase Storage

### "Upload failed"
- **Check**: Firebase Storage is enabled in Firebase Console
- **Check**: Security rules allow writes for authenticated users
- **Check**: Browser console for detailed error messages

### Images not showing on website
- **Check**: Image URL is valid (try opening in new tab)
- **Check**: Base64 images start with `data:image/`
- **Check**: Firebase Storage security rules allow public read access

## Best Practices

1. **Optimize images before uploading** - Use tools like TinyPNG or ImageOptim
2. **Use Firebase Storage for production** - Better performance and scalability
3. **Keep file names descriptive** - Helps with organization
4. **Test both upload methods** - Ensure your workflow works in both modes

## Cost Considerations

### Firebase Storage Pricing (as of 2024):
- **Free Tier**: 5GB storage, 1GB/day downloads
- **Paid**: $0.026/GB storage, $0.12/GB downloads

For a typical website with 50 images (~2MB each = 100MB total):
- Storage: ~$0.003/month
- Downloads: Depends on traffic

Base64 storage is free but counts toward Firestore document size limits (1MB per document).



