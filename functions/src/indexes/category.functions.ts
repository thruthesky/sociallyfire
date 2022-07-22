import * as functions from "firebase-functions";
import {Category} from "../classes/category/category.class";
import {CategoryCreate} from "../interfaces/category.interfaces";

export const onCategoryCreate = functions.firestore
    .document("categories/{categoryDocumentID}")
    .onCreate((snapshot, context) => {
      return Category.onCreate(
      snapshot.data() as CategoryCreate,
      context.params as { categoryDocumentID: string }
      );
    });

// export const onCategoryUpdate = functions.firestore
//   .document("categories/{categoryDocumentID}")
//   .onUpdate((change, context) => {
//     if (notUpdatable(change.before.data(), change.after.data())) {
//       return null;
//     }
//     return Category.onUpdate(
//       change.after.data() as CategoryDocument,
//       context.params as { categoryDocumentID: string }
//     );
//   });
