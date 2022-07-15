/**
 *
 */
import * as admin from "firebase-admin";
import { CategoryCreate, CategoryDocument } from "../../interfaces/category.interfaces";
export class Category {
  /**
   * Category collection reference
   */
  static get col(): admin.firestore.CollectionReference<admin.firestore.DocumentData> {
    return admin.firestore().collection("categories");
  }
  /**
   * The reference of a aategory document.
   * @param id category id
   */
  static doc(id: string): admin.firestore.DocumentReference<admin.firestore.DocumentData> {
    return this.col.doc(id);
  }

  static onCreate(params: { categoryDocId: string }, data: CategoryCreate) {}
  static onUpdate(params: { categoryDocId: string }, data: CategoryDocument) {}
}
