import * as admin from "firebase-admin";
import { firebaseConfig } from "../firebase.config";
var serviceAccount = require("../firebase.admin-key.json");

export class FirebaseAppInitializer {
  constructor() {
    if (admin.apps.length) return;
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: firebaseConfig.storageBucket,
      });

      admin.firestore().settings({ ignoreUndefinedProperties: true });
    } catch (e) {
      console.error("initialization failed; ", e);
    }
  }
}
