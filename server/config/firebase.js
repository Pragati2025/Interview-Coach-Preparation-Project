const admin = require("firebase-admin");
const serviceAccount = require("../firebase-service-account.json"); // Ensure this file exists

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET,
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
