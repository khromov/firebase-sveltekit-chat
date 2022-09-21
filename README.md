# Getting started

```
nvm use
npm i
npm run dev
```

# Deploy

### Step 1: Firebase for Firestore

```
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

In Firebase console, enable Anonymous authentication under Build > Authentication.

### Step 2 - Vercel for hosting

Further reading:
* https://github.com/jthegedus/svelte-adapter-firebase