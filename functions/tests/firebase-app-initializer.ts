import * as admin from "firebase-admin";
var serviceAccount = require("../firebase.admin-key.json");

export class FirebaseAppInitializer {
  constructor() {
    if (admin.apps.length) return;
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      admin.firestore().settings({ ignoreUndefinedProperties: true });
    } catch (e) {
      console.error("initialization failed; ", e);
    }
  }
}
