import * as functions from "firebase-functions";
import {Post} from "../classes/post/post.class";
import {PostCreate, PostDocument} from "../interfaces/post.interfaces";
import {notUpdatable} from "../library";

export const onPostCreate = functions.firestore
    .document("posts/{postDocumentID}")
    .onCreate((snapshot, context) => {
      return Post.onCreate(
      snapshot.data() as PostCreate,
      context.params as { postDocumentID: string }
      );
    });

export const onPostUpdate = functions.firestore
    .document("posts/{postDocumentID}")
    .onUpdate((change, context) => {
      if (notUpdatable(change.before.data(), change.after.data())) {
        return null;
      }
      return Post.onUpdate(
      change.after.data() as PostDocument,
      context.params as { postDocumentID: string }
      );
    });
