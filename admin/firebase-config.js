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
    auth = firebase.auth();
    db = firebase.firestore();
    // Initialize Firebase Storage
    try {
      storage = firebase.storage();
      console.log("Firebase Storage initialized");
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
    auth = firebase.auth();
    db = firebase.firestore();
    // Try to get storage if app already exists
    try {
      storage = firebase.storage();
      console.log("Firebase Storage initialized");
    } catch (storageError) {
      console.warn("Firebase Storage not available:", storageError);
      storage = null;
    }
  } else {
    console.log("Firebase configuration error. Using demo mode (localStorage).");
    firebaseInitialized = false;
  }
}

// Collections
const TRAININGS_COLLECTION = 'trainings';
const SPEAKING_COLLECTION = 'speaking';
const PUBLICATIONS_COLLECTION = 'publications';

