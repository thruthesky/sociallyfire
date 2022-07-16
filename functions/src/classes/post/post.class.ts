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

  static onCreate(data: PostCreate) {
    return this.create(data);
  }

  static onUpdate(params: { categoryDocId: string }, data: PostDocument) {
    console.log(params, data);
  }

  /**
   * Creates a category document.
   *
   * This will trigger [onCreate] to be invoked.
   *
   * @param createData data to create a user document.
   * @return DocumentReference of the created user doc.
   */
  static async create(createData: PostCreate): Promise<admin.firestore.DocumentReference> {
    const user = await User.get(createData.uid);
    const data: PostDocument = {
      uid: createData.uid,
      category: createData.category,
      title: createData.title ?? "",
      content: createData.content ?? "",
      files: createData.files ?? [],
      author_name: user.display_name,
      author_photo_url: user.photo_url,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      read_role: 0,
      comment_role: 0,
    };

    const ref = await this.col.add(data);

    //
    if (createData.category) {
      //
      Category.increaseNoOfPosts(createData.category);
    }

    return ref;
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
