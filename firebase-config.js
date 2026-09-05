/* =========================================================================
   DRIMS — Firebase configuration (drims-friend-base project)
   This file is loaded by both login.html and index.html.
========================================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyAudoqUy4b46liPXJYXmgjXbGxBC-hUbNg",
  authDomain: "drims-friend-base.firebaseapp.com",
  projectId: "drims-friend-base",
  storageBucket: "drims-friend-base.firebasestorage.app",
  messagingSenderId: "436738751588",
  appId: "1:436738751588:web:7d63c1625e2e861cfdb371",
  measurementId: "G-W8W4XB1W5J"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
