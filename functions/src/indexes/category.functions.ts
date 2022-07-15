import * as functions from "firebase-functions";
import { Category } from "../classes/category/category.class";
import { CategoryCreate, CategoryDocument } from "../interfaces/category.interfaces";
import { notUpdatable } from "../library";

export const onCategoryCreate = functions.firestore
  .document("categories/{categoryDocId}")
  .onCreate((snapshot, context) => {
    return Category.onCreate(
      context.params as { categoryDocId: string },
      snapshot.data() as CategoryCreate
    );
  });

export const onCategoryUpdate = functions.firestore
  .document("categories/{categoryDocId}")
  .onUpdate((change, context) => {
    if (notUpdatable(change.before.data(), change.after.data())) {
      return null;
    }
    return Category.onUpdate(
      context.params as { categoryDocId: string },
      change.after.data() as CategoryDocument
    );
  });
