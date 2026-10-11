# KL Connect staging and administration

## Security model

The Admin tab is only rendered after Firebase Authentication returns an ID token with `admin: true`. This is a convenience only: Firestore rules independently check that custom claim, and destructive actions use deployed callable Cloud Functions that verify it again. Never add an admin flag in browser storage or a Firestore document.

Administrators can inspect profile data and shared-room messages for legitimate moderation. Access should be restricted to trained staff, documented in the university privacy notice, and reviewed through the `moderationLogs` audit trail. The dashboard intentionally reports only counts it can actually query; it does not fabricate active-user or total-message metrics.

## Project configuration and first administrator

This checkout is configured for the existing `sample-65249` Firebase project. `.firebaserc` makes it the Firebase CLI default, but does not deploy, change rules, or access data by itself. Treat any `firebase deploy` command as a production change and obtain review before running it.

1. In the Firebase Console for `sample-65249`, ensure Google Authentication and Cloud Firestore are enabled.
2. The local `.env` uses the supplied Web App configuration; use `.env.example` as the documented template for another checkout.
3. Authenticate locally to the staging project with application-default credentials or set `FIREBASE_SERVICE_ACCOUNT` to a service-account JSON string. Do not commit keys.
4. Have the future administrator sign in once, then run:

   ```powershell
   npm run grant:admin -- naseemaarsha02@gmail.com
   ```

5. The script verifies that this designated account has a verified email before adding the custom claim. The user must sign out and sign in again before the Admin tab appears.

## Deploy after explicit production approval

Install the Firebase CLI and deploy only after reviewing the rules and functions:

```powershell
firebase deploy --only firestore:rules,functions
npm start
```

Install function dependencies once before the deploy:

```powershell
npm install --prefix functions
```

This command targets `sample-65249`. It can change live rules and deploy callable Functions, so do not run it without explicit production approval. Cloud Functions generally require the Blaze billing plan. The rules rely on the existing room, membership, and message schema. New profile documents are created automatically the next time each user signs in; no migration or database reset is required.

## Deletion policy

`deleteUser` deletes the Firebase Auth account, its `/users/{uid}` profile, membership documents, and messages authored by that UID. It refuses self-deletion and deletion of the final administrator. `moderateMessage` deletes precisely one message and writes an audit record with moderator, reason, time, room, and message author. Both cleanup paths process query pages to avoid a batch-size mass deletion.

The dashboard displays only the latest 100 profiles/rooms and latest 75 messages per selected room. This is deliberate incremental loading; add server-side pagination before using it for a larger institution.

## Room deletion policy

`deleteRoom` is a trusted callable Function. After an explicit confirmation it deletes the selected room document, all messages in that room, and membership documents for that room in pages of 300. It protects the `general` room. If a paged deletion fails, the Function reports an error and no success audit record is written; retry only after reviewing the remaining data. The dashboard uses real-time listeners for users, rooms, room messages, and the exact message count.
