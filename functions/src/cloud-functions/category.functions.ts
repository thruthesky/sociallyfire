import * as functions from "firebase-functions";
import {Category} from "../classes/category/category.class";
import {CategoryCreate} from "../interfaces/category.interfaces";

export const onCategoryCreate = functions
    .region("asia-northeast3")
    .firestore.document("categories/{categoryDocumentID}")
    .onCreate((snapshot, context) => {
      return Category.onCreate(
      snapshot.data() as CategoryCreate,
      context.params as { categoryDocumentID: string }
      );
    });
