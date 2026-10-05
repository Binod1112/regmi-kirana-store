# Regmi Kirana Store

This is the Regmi Kirana Store Next.js storefront. It uses Firebase Authentication and Cloud Firestore, and exports as a static site for GitHub Pages.

## Firebase setup

The Firebase web configuration is in `src/lib/firebase.ts`. Enable Email/Password authentication in the Firebase Console, create the first admin user, and deploy the root `firestore.rules` file with the Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

The public storefront can read products, categories, and store settings. Writes require a signed-in Firebase user.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub Pages

```bash
npm run build
```

The static output is created in `out/`. The workflow in `.github/workflows/deploy-pages.yml` publishes it automatically from the `main` branch.
