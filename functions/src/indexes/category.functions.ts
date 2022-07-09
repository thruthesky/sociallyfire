import * as functions from "firebase-functions";
import { Category } from "../classes/category/category.class";

export const onCategoryCreate = functions
  .region("asia-northeast3")
  .database.ref("/categories/{categoryId}")
  .onCreate((snapshot, context) => {
    return Category.onCreate(context.params.uid, {} as any);
  });
