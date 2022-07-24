import * as functions from "firebase-functions";
import { Post } from "../classes/post/post.class";
import { PostCreate, PostDocument } from "../interfaces/post.interfaces";

export const onPostCreate = functions
  .region("asia-northeast3")
  .firestore.document("posts/{postDocumentID}")
  .onCreate((snapshot, context) => {
    return Post.onCreate(
      snapshot.data() as PostCreate,
      context.params as { postDocumentID: string }
    );
  });

export const onPostUpdate = functions
  .region("asia-northeast3")
  .firestore.document("posts/{postDocumentID}")
  .onUpdate((change, context) => {
    return Post.onUpdate(
      change.after.data() as PostDocument,
      context.params as { postDocumentID: string }
    );
  });
