const admin = require("firebase-admin");
const envConfig = require("./env_config");
console.log(envConfig.FIREBASE_SERVICE_ACCOUNT_BASE64);
const buff = Buffer.from(envConfig.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64");
const serviceAccount = JSON.parse(buff.toString("utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firestore = admin.firestore();
const auth = admin.auth();
const { FieldValue } = admin.firestore;

module.exports = { firestore, auth, FieldValue };
