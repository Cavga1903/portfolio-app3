// Firebase Firestore Setup Script
// Run this in your Firebase Console or use Firebase CLI

// 1. Create Firestore Database
// Go to Firebase Console > Firestore Database > Create Database
// Choose "Start in test mode" for development
// Select your preferred location

// 2. Firestore Security Rules (for production)
// Go to Firestore Database > Rules tab
// Replace the default rules with:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to project stats
    match /projectStats/{projectId} {
      allow read: if true;
    }
    
    // Allow read/write access to project likes
    match /projectLikes/{likeId} {
      allow read, write: if true; // For development
      // For production, you might want to add authentication:
      // allow read, write: if request.auth != null;
    }
  }
}

// 3. Collections Structure:
// projectStats/{projectId}
//   - projectId: string
//   - totalLikes: number
//   - uniqueLikers: number
//   - lastUpdated: timestamp

// projectLikes/{likeId}
//   - projectId: string
//   - userId: string
//   - liked: boolean
//   - createdAt: timestamp
//   - updatedAt: timestamp

// 4. Indexes (Firestore will create these automatically, but you can optimize):
// Collection: projectLikes
// Fields: projectId (Ascending), userId (Ascending)
// Fields: projectId (Ascending), liked (Ascending)

// 5. Firebase CLI Commands (optional):
// npm install -g firebase-tools
// firebase login
// firebase init firestore
// firebase deploy --only firestore:rules

// 6. Environment Variables:
// Add these to your .env file:
// REACT_APP_FIREBASE_API_KEY=your_api_key
// REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
// REACT_APP_FIREBASE_PROJECT_ID=your-project-id
// REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
// REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
// REACT_APP_FIREBASE_APP_ID=your-app-id
