/**
 * scripts/provision-admin.js
 *
 * SECURE OFFLINE ADMIN PROVISIONING SCRIPT
 *
 * This script is executed locally by the project owner using the Firebase Admin SDK.
 * It grants the "admin" role to an authorized UID directly in Firestore users/{uid}.
 * It is NEVER deployed as a public API route or callable Cloud Function.
 *
 * Usage:
 *   node scripts/provision-admin.js <USER_UID> [EMAIL]
 *
 * Prerequisites:
 *   Set the environment variable GOOGLE_APPLICATION_CREDENTIALS to the path
 *   of your service-account-key.json file downloaded from Firebase Console.
 */

const admin = require("firebase-admin");

const targetUid = process.argv[2];
const targetEmail = process.argv[3] || "";

if (!targetUid) {
  console.error("❌ ERROR: Missing target UID.");
  console.error("Usage: node scripts/provision-admin.js <USER_UID> [EMAIL]");
  process.exit(1);
}

// Initialize Admin SDK with Application Default Credentials
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

async function provisionAdmin() {
  console.log(`\n======================================================`);
  console.log(`🔐 THE NON LOCALS — SECURE ADMIN ROLE PROVISIONING`);
  console.log(`======================================================`);
  console.log(`Target UID   : ${targetUid}`);
  if (targetEmail) console.log(`Target Email : ${targetEmail}`);

  const userRef = db.doc(`users/${targetUid}`);

  await userRef.set(
    {
      uid: targetUid,
      email: targetEmail,
      role: "admin",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`\n✅ SUCCESS: Administrator privileges provisioned for ${targetUid}.`);
  console.log(`The user can now sign in at /admin/login to access the portal.\n`);
}

provisionAdmin().catch((err) => {
  console.error("❌ Failed to provision admin:", err);
  process.exit(1);
});

