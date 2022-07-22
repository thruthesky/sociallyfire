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

  /**
   * Returns the complete category document with all the neccessary properties for
   * updating newly created category.
   *
   * It gets [createData] from background function and add neccessary properties on top of it.
   *
   * @usage This method must be called to fill all the neccessary properties onto newly created categories.
   *
   * @param createData object that has minimal properties for category creation.
   *
   * @return Complete category document.
   */
  static getInitialDocument(createData: CategoryCreate): CategoryDocument {
    return {
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
      deleted: false,
    };
  }

  /**
   * It completes the newly created category docuemnt with all neccessary properties.
   *
   * Note, this will be invoked on [onCreate] of the background functon
   *
   *
   * @return 카테고리 DocumentReference
   */
  static async onCreate(data: CategoryCreate, params: { categoryDocumentID: string }) {
    await this.doc(params.categoryDocumentID).set(this.getInitialDocument(data), {
      merge: true,
    });
    return this.doc(params.categoryDocumentID);
  }

  /**
   * Create a category (by programmatically)
   *
   * Note, the category may exists if it is invoked by background function. So, {merge: true} is needed.
   * (FIY, since it updates with a complete category document, it can be set.)
   *
   * 참고, Background Function 에 의해 호출되는 경우 카테고리를 이미 생성되어 있어, merge: true 해야 한다.
   * 참고, 만약, 카테고리가 이미 생성되어져 있지 않으면 Background Function [onCreate] 을 호출 할 수 있다.
   *
   * @param createData data to create a user document.
   * @return DocumentReference of the created user doc.
   */
  static async create(
      categoryDocumentID: string,
      createData: CategoryCreate
  ): Promise<admin.firestore.DocumentReference> {
    await this.doc(categoryDocumentID).set(this.getInitialDocument(createData), {merge: true});
    return this.doc(categoryDocumentID);
  }

  /**
   * It is invoked on [onUpdate] by background function 에 의해서 카테고리 문서가 업데이트 될 때, 이 함수가 호출
   *
   * @attention This method has nothing to do. And not being in use.
   *
   * @param data category document object
   * @param params object that has category document id
   */
  static onUpdate(data: CategoryDocument, params: { categoryDocumentID: string }) {
    // nothing to do
    console.log("This has nothing to do. Just return", params.categoryDocumentID, data);
    return null;
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
    data.id = snapshot.id;
    return data;
  }

  static async increaseNoOfPosts(id: string) {
    return this.update(id, {no_of_posts: admin.firestore.FieldValue.increment(1)});
  }
}
