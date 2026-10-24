# Create a Multi-Room Chat App Using React and Firebase

A real-time chat app built with React and Firebase, featuring Google sign-in, public and private rooms with shareable join codes, and a room-based Firestore data model. This is the companion code for the tutorial — follow along to learn Firebase Authentication, Firestore real-time messaging, and how to structure chat data around rooms.

> **✅ This is the completed app**
>
> This branch holds the **finished code**, with Firebase Authentication, Firestore, and real-time messaging fully wired up. To build it yourself from scratch, start on the [`setup` branch](https://github.com/Timonwa/react-chat/tree/setup) and follow the step-by-step tutorial:
>
> **👉 [Create a Multi-Room Chat App Using React and Firebase](https://tech.timonwa.com/blog/create-multi-room-chat-app-using-react-firebase)**
>
> 🔗 Live demo: **[kl-connect](https://sample-65249.web.app)**

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Scripts \& Data Cleanup](#scripts--data-cleanup)
- [Branch Guide](#branch-guide)
- [Author](#author)
- [License](#license)
- [Additional Resources](#additional-resources)

## Features

- **Google authentication** with Firebase Auth
- **Public and private rooms** with shareable join codes
- **Room search and tabs** for filtering public vs private rooms
- **Real-time messaging** with message timestamps and avatars (with fallbacks)
- **Responsive layout** — side panels collapse into drawers on small screens
- **Room-based Firestore schema** for cleaner, scalable data access
- **Monthly cleanup automation** to keep demo data fresh

## Tech Stack

- **[React](https://react.dev/)** – UI library (Create React App)
- **[Firebase](https://firebase.google.com/)** – Authentication + Cloud Firestore
- **[React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)** – auth state helpers
- **[Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)** – server-side data cleanup script
- **JavaScript** – ES2020+ syntax

## Prerequisites

- Node.js 18+ (or newer)
- A [Firebase project](https://console.firebase.google.com/) with **Authentication** (Google provider) and **Cloud Firestore** enabled

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Timonwa/react-chat.git
   cd react-chat
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your environment file:

   ```bash
   cp .env.example .env
   ```

   Fill in your Firebase web app config. You'll find these values in the Firebase console under **Project settings → General → Your apps**.

   | Variable | Required | Description |
   | --- | --- | --- |
   | `REACT_APP_API_KEY` | Yes | Firebase web API key |
   | `REACT_APP_AUTH_DOMAIN` | Yes | Firebase auth domain (`your_project_id.firebaseapp.com`) |
   | `REACT_APP_PROJECT_ID` | Yes | Firebase project ID |
   | `REACT_APP_STORAGE_BUCKET` | Yes | Firebase storage bucket |
   | `REACT_APP_MESSAGING_SENDER_ID` | Yes | Firebase Cloud Messaging sender ID |
   | `REACT_APP_APP_ID` | Yes | Firebase app ID |
   | `REACT_APP_MEASUREMENT_ID` | No | Google Analytics measurement ID (optional) |

 
