# DRIMS — Setup Guide

Your site now has real accounts and a real backend, powered by **Firebase**
(Google's free backend service — no server for you to run or maintain).

Files:
- `login.html` — sign up / log in page
- `index.html` — the main app (redirects to `login.html` if not signed in)
- `firebase-config.js` — where you paste your project's keys (shared by both pages)

## 1. Create your Firebase project (5 minutes)

1. Go to **https://console.firebase.google.com** and sign in with any Google account.
2. Click **Add project**, name it `drims` (or anything), finish the wizard.
3. In the left sidebar, open **Build > Authentication** → **Get started** →
   under "Sign-in method" enable **Email/Password**.
4. Open **Build > Firestore Database** → **Create database** → start in
   **production mode** → pick any region.
5. **Skip Storage.** Firebase now requires the paid Blaze plan for Cloud
   Storage (even to stay in the free tier, Google requires a linked card).
   To avoid needing a card, this version of DRIMS doesn't use Storage —
   photos/videos are added by pasting a link (e.g. an Imgur link, a
   Google Photos "share" link, or a direct `.mp4` link) instead of
   uploading a file. If you later get a Blaze-linked card, ask to add
   real uploads back in.
6. Go to **Project settings** (gear icon, top left) → scroll to **Your apps**
   → click the **</>** (Web) icon → register the app (nickname anything,
   no need for Hosting) → Firebase shows you a `firebaseConfig` object.
7. Copy those values into `firebase-config.js`, replacing the
   `PASTE_YOUR_...` placeholders.

## 2. Set security rules

By default Firebase blocks all reads/writes, so paste these in before testing.

**Firestore rules** (Firestore Database → Rules tab → replace all → Publish):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.authorId == request.auth.uid;
      allow update: if request.auth != null; // allows likes/comments from any signed-in friend
      allow delete: if request.auth != null && resource.data.authorId == request.auth.uid;
    }
    match /publicMessages/{msgId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.authorId == request.auth.uid;
    }
    match /chats/{chatId} {
      allow read, write: if request.auth != null && request.auth.uid in resource.data.participants;
      allow create: if request.auth != null && request.auth.uid in request.resource.data.participants;
      match /messages/{msgId} {
        allow read, create: if request.auth != null;
      }
    }
  }
}
```

These rules are deliberately simple and permissive **within your signed-in
friend group** — fine for a class project, not meant for a public app with
strangers.

## 3. Run it

Browsers block Firebase Auth on plain `file://` pages, so serve the folder
over http instead of double-clicking the file. Easiest options:

- **VS Code**: install the "Live Server" extension, right-click
  `login.html` → "Open with Live Server".
- **Firebase Hosting** (also gives you a free public link to share with
  your class): install the Firebase CLI, run `firebase init hosting` in
  this folder, then `firebase deploy`.
- **Netlify / Vercel**: drag-and-drop the folder onto netlify.com (drop
  zone) for an instant public link.

## What's now real vs. still a demo

- ✅ Sign up / log in / log out — real accounts, real passwords (Firebase Auth)
- ✅ Posts, likes, comments — saved in Firestore, live for everyone
- ✅ Photo/video posts — via pasted links, no paid plan needed
- ✅ Public chat and Direct Messages — saved in Firestore, live for everyone
- ⚠️ "Online" dots are decorative — true presence (who's online right now)
  needs a small addition (Firestore `lastSeen` heartbeat) — ask if you want that next
- ⚠️ Grade 11 Groups in the left menu are still placeholder links
- ⚠️ Real file uploads (instead of pasted links) need the Blaze plan +
  Storage — ask if you get a card linked and want that added 
