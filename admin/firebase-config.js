// Firebase Configuration
// TODO: Replace with your Firebase project credentials
// Get these from: https://console.firebase.google.com/

const firebaseConfig = {
  apiKey: "AIzaSyBmKyW035l88FTu1H9BorQ3ftrhlGFWu9w",
  authDomain: "sibram.firebaseapp.com",
  projectId: "sibram",
  storageBucket: "sibram.firebasestorage.app",
  messagingSenderId: "296315358166",
  appId: "1:296315358166:web:2dbf9e87992907a519b277"
};

// Initialize Firebase
let firebaseInitialized = false;
let auth = null;
let db = null;
let storage = null;

try {
  // Check if config has placeholder values
  if (firebaseConfig.apiKey === 'YOUR_API_KEY' || firebaseConfig.projectId === 'YOUR_PROJECT_ID') {
    console.log("Firebase config has placeholder values. Using demo mode (localStorage).");
    console.log("To use Firebase, update admin/firebase-config.js with your credentials from: https://console.firebase.google.com/");
    firebaseInitialized = false;
  } else {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
    firebaseInitialized = true;
    
    // Initialize Auth (only if available - main website doesn't need it)
    try {
      if (typeof firebase.auth === 'function') {
        auth = firebase.auth();
        console.log("Firebase Auth initialized");
      } else {
        console.log("Firebase Auth not available (not loaded on this page)");
        auth = null;
      }
    } catch (authError) {
      console.warn("Firebase Auth not available:", authError);
      auth = null;
    }
    
    // Initialize Firestore (required for main website)
    try {
      db = firebase.firestore();
      console.log("Firebase Firestore initialized");
    } catch (firestoreError) {
      console.error("Firebase Firestore initialization failed:", firestoreError);
      db = null;
    }
    
    // Initialize Firebase Storage (only if available)
    try {
      if (typeof firebase.storage === 'function') {
        storage = firebase.storage();
        console.log("Firebase Storage initialized");
      } else {
        console.log("Firebase Storage not available (not loaded on this page)");
        storage = null;
      }
    } catch (storageError) {
      console.warn("Firebase Storage not available:", storageError);
      storage = null;
    }
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
  if (error.code === 'app/duplicate-app') {
    console.log("Firebase app already initialized");
    firebaseInitialized = true;
    
    // Initialize Auth (only if available)
    try {
      if (typeof firebase.auth === 'function') {
        auth = firebase.auth();
        console.log("Firebase Auth initialized");
      } else {
        auth = null;
      }
    } catch (authError) {
      auth = null;
    }
    
    // Initialize Firestore
    try {
      db = firebase.firestore();
      console.log("Firebase Firestore initialized");
    } catch (firestoreError) {
      console.error("Firebase Firestore initialization failed:", firestoreError);
      db = null;
    }
    
    // Try to get storage if app already exists
    try {
      if (typeof firebase.storage === 'function') {
        storage = firebase.storage();
        console.log("Firebase Storage initialized");
      } else {
        storage = null;
      }
    } catch (storageError) {
      console.warn("Firebase Storage not available:", storageError);
      storage = null;
    }
  } else {
    console.log("Firebase configuration error. Using demo mode (localStorage).");
    firebaseInitialized = false;
    db = null;
  }
}

// Collections
const TRAININGS_COLLECTION = 'trainings';
const SPEAKING_COLLECTION = 'speaking';
const PUBLICATIONS_COLLECTION = 'publications';

