<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:** Node.js and MongoDB (local MongoDB or MongoDB Atlas)


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and set `MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, and `GEMINI_API_KEY`.
3. Start MongoDB, then migrate the existing JSON data once:
   `npm run migrate:mongo`
4. Run the app:
   `npm run dev`

MongoDB is now the primary database. The application does not automatically seed demo data. Register a user, enter predictions manually, and the History and Analytics pages will use that user's records.

To permanently clear all application data from MongoDB:

```powershell
npm run reset:mongo
```

The reset clears the `users`, `passwords`, `predictions`, `aiChats`, `notifications`, and `settings` collections. The old JSON file is retained only as a backup and is not loaded unless `MONGODB_BOOTSTRAP_JSON=true` is explicitly configured.
