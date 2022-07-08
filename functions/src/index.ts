import * as admin from "firebase-admin";
import { firebaseConfig } from "../firebase.config";

admin.initializeApp({
  storageBucket: firebaseConfig.storageBucket,
});

admin.firestore().settings({ ignoreUndefinedProperties: true });

export * from "./indexes/user.functions";
export * from "./indexes/category.functions";
export * from "./indexes/post.functions";
// export * from "./indexes/storage.functions";
// export * from "./indexes/messaging.functions";
