# Getting started

```
nvm use
npm i
npm run dev
```

If you want to set your own firebase settings via env vars, run:

```
cp .env.sample .env
```

And look inside `lib/firebase.ts` for the environment variables used to configure Firebase SDK.
You can also switch from `$env/dynamic/public` to `$env/static/public`
to bake these variables at build time.

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

- Go to https://vercel.com/new
- Create a new project and connect your GitHub repository

# Further reading

- https://github.com/jthegedus/svelte-adapter-firebase
