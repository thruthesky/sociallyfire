import * as functions from "firebase-functions";
import {UserRecord} from "firebase-functions/v1/auth";
import {User} from "../classes/user/user.class";
import {UserDocument} from "../interfaces/user.interfaces";
import {notUpdatable} from "../library";

export const onUserCreate = functions.auth.user().onCreate((user: UserRecord) => {
  console.log("user; ", user);
  return User.onCreate(user);
});

export const onUserUpdate = functions.firestore // .region("asia-northeast3")
    .document("users/{uid}")
    .onUpdate((change, context) => {
      console.log("-----> onUserUpdate()");
      if (notUpdatable(change.before.data(), change.after.data())) {
        console.log("notUpdatable()", change.before.data(), change.after.data());
        return null;
      } else {
        console.log("-----> updatable --> going to update.");
      }
      return User.onUpdate(context.params as { uid: string }, change.after.data() as UserDocument);
    });
