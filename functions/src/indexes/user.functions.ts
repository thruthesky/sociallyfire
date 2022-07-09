import * as functions from "firebase-functions";
import { UserRecord } from "firebase-functions/v1/auth";
import { User } from "../classes/user/user.class";
import { UserDocument } from "../interfaces/user.interfaces";

export const onUserCreate = functions.auth
  .user()
  .onCreate((user: UserRecord) => User.onCreate(user.uid));

export const onUserUpdate = functions
  .region("asia-northeast3")
  .firestore.document("/users/{uid}")
  .onUpdate((snapshot, context) => {
    return User.onUpdate(context.params as { uid: string }, snapshot.after.data() as UserDocument);
  });
