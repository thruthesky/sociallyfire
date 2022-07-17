/**
 *
 */
import * as admin from "firebase-admin";
import {ERROR_CATEGORY_DOCUMENT_NOT_FOUND} from "../../defines";
import {CategoryCreate, CategoryDocument} from "../../interfaces/category.interfaces";
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

  static onCreate(params: { categoryDocId: string }, data: CategoryCreate) {
    return this.create({
      ...data,
      id: params.categoryDocId,
    });
  }

  static onUpdate(params: { categoryDocId: string }, data: CategoryDocument) {
    // nothing to do
    console.log(
        "----> Category.onUpdate(); nothing to do. Just return",
        params.categoryDocId,
        data
    );
    return null;
  }

  /**
   * Creates a category document.
   *
   * This will trigger [onCreate] to be invoked.
   *
   * @param createData data to create a user document.
   * @return DocumentReference of the created user doc.
   */
  static async create(createData: CategoryCreate): Promise<admin.firestore.DocumentReference> {
    const data: CategoryDocument = {
      id: createData.id,
      uid: createData.uid,
      name: createData.name ?? "",
      description: createData.description ?? "",
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      list_role: 0,
      read_role: 0,
      write_role: 0,
      comment_role: 0,
      no_of_comments: 0,
      no_of_posts: 0,
    };

    await this.doc(data.id).set(data, {merge: true});
    return this.doc(data.id);
  }

  /**
   * Updates a category document with any keys and values.
   *
   * If you want to update indivisual fields, use `this.doc(...).update(...)`
   *
   * @param data an object that will be saved as category. It can contain any fields and values.
   *
   *
   */
  // eslint-disable-next-line
  static async update(id: string, data: any): Promise<admin.firestore.WriteResult> {
    return this.doc(id).update(data);
  }

  /**
   * Returns a category document.
   * @param id id of a category
   */
  static async get(id: string): Promise<CategoryDocument> {
    const snapshot = await this.doc(id).get();
    if (snapshot.exists == false) throw ERROR_CATEGORY_DOCUMENT_NOT_FOUND;
    const data = snapshot.data() as CategoryDocument;
    return data;
  }

  static async increaseNoOfPosts(id: string) {
    return this.update(id, {no_of_posts: admin.firestore.FieldValue.increment(1)});
  }
}
