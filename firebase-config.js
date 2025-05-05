// Firebase configuration (Replace with your Firebase project details)
const firebaseConfig = {
  apiKey: "AIzaSyAnmNcCzO056AJgFlT6Fm10HU7Z9MyMalM",
  authDomain: "hosp-db-30fe4.firebaseapp.com",
  projectId: "hosp-db-30fe4",
  storageBucket: "hosp-db-30fe4.firebasestorage.app", 
  messagingSenderId: "1064888464315",
  appId: "1:1064888464315:web:3bec002320bf1a0e668a9e"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);
