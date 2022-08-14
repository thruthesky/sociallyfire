import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

admin.firestore().settings({ignoreUndefinedProperties: true});

export * from "./cloud-functions/user.functions";
export * from "./cloud-functions/category.functions";
export * from "./cloud-functions/post.functions";
// export * from "./cloud-functions/storage.functions";
// export * from "./cloud-functions/messaging.functions";


export const makeUppercase = functions.firestore.document('/tmp/{documentId}')
.onCreate((snap, context) => {
  const original = snap.data().original;
  console.log('Uppercasing', context.params.documentId, original);
  const uppercase = original.toUpperCase();
  return snap.ref.set({uppercase}, {merge: true});
});

