import * as functions from "firebase-functions";
import { User } from "../classes/user/user.class";

export const onUserCreate = functions
  .region("asia-northeast3")
  .database.ref("/users/{uid}")
  .onCreate((snapshot, context) => {
    return User.onCreate(context.params.uid, {});
  });
