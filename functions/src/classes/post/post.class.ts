/**
 *
 */
import * as admin from "firebase-admin";
import { ERROR_POST_DOCUMENT_NOT_FOUND } from "../../defines";
import { PostCreate, PostDocument } from "../../interfaces/post.interfaces";
import { Category } from "../category/category.class";
import { User } from "../user/user.class";
export class Post {
  /**
   * Post collection reference
   */
  static get col(): admin.firestore.CollectionReference<admin.firestore.DocumentData> {
    return admin.firestore().collection("posts");
  }
  /**
   * The reference of a aategory document.
   * @param id category id
   */
  static doc(id: string): admin.firestore.DocumentReference<admin.firestore.DocumentData> {
    return this.col.doc(id);
  }

  static async getInitialDocument(createData: PostCreate) {
    const user = await User.get(createData.uid);
    const files = createData.files ?? [];
    const data: PostDocument = {
      uid: createData.uid,
      categoryDocumentID: createData.categoryDocumentID,
      title: createData.title ?? "",
      content: createData.content ?? "",
      files: files,
      author_name: user.display_name,
      author_photo_url: user.photo_url,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      read_role: 0,
      comment_role: 0,
      has_photo: files.length > 0,
      likes: [],
      dislikes: [],
      no_of_comments: 0,
      deleted: false,
    };
    return data;
  }

  /**
   * 카테고리 글 개수 업데이트 및 posts-meta 정보 등, 글 생성 또는 수정 후, 필요한 작업을 한다.
   *
   * @param data post document
   */
  static updatePostMeta(data: PostDocument) {
    //
    if (data.categoryDocumentID) {
      //
      Category.increaseNoOfPosts(data.categoryDocumentID);
    }
  }

  static async onCreate(createData: PostCreate, params: { postDocumentID: string }) {
    const data = await this.getInitialDocument(createData);
    const ref = await this.doc(params.postDocumentID).set(data, { merge: true });
    this.updatePostMeta(data);
    return ref;
  }

  /**
   * Creates a category document.
   *
   * Note, This will trigger [onCreate] to be invoked.
   *
   * @param createData data to create a user document.
   * @return DocumentReference of the created user doc.
   */
  static async create(createData: PostCreate): Promise<admin.firestore.DocumentReference> {
    const data = await this.getInitialDocument(createData);
    const ref = await this.col.add(data);
    this.updatePostMeta(data);
    return ref;
  }

  static onUpdate(data: PostDocument, params: { postDocumentID: string }) {
    console.log(params, data);
  }

  /**
   * Updates a category document.
   *
   *
   */
  static async update(id: string, data: PostDocument): Promise<admin.firestore.WriteResult> {
    return this.doc(id).set(data, { merge: true });
  }

  /**
   * Returns a category document.
   * @param id id of a category
   */
  static async get(id: string): Promise<PostDocument> {
    const snapshot = await this.doc(id).get();
    if (snapshot.exists == false) throw ERROR_POST_DOCUMENT_NOT_FOUND;
    const data = snapshot.data() as PostDocument;
    return data;
  }
}
