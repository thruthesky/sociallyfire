import * as functions from "firebase-functions";
import {UserRecord} from "firebase-functions/v1/auth";
import {User} from "../classes/user/user.class";
import {UserDocument} from "../interfaces/user.interfaces";

export const onUserCreate = functions
    .region("asia-northeast3")
    .auth.user()
    .onCreate((user: UserRecord) => {
      console.log("user; ", user);
      return User.onCreate(user);
    });

export const onUserUpdate = functions
    .region("asia-northeast3")
    .firestore.document("users/{uid}")
    .onUpdate((change, context) => {
      return User.onUpdate(context.params as { uid: string }, change.after.data() as UserDocument);
    });
