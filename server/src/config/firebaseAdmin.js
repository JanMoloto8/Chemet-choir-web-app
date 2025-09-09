import admin from "firebase-admin";

// Load .env only in development
if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}

// Safety checks
const requiredVars = [
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY_ID",
  "FIREBASE_CLIENT_ID",
];

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    throw new Error(`${varName} is not set in environment variables.`);
  }
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
  }),
});

export const db = admin.firestore();
export default admin;
