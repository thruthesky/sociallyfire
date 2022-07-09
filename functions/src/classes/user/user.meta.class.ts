/**
 * @file user.meta.class.ts
 */
import * as admin from "firebase-admin";
import {UserDocument, UserMetaDocument} from "../../interfaces/user.interfaces";
import {ERROR_USER_NOT_FOUND} from "../../defines";

/**
 * UserMeta
 */
export class UserMeta {
  static get col(): admin.firestore.CollectionReference<admin.firestore.DocumentData> {
    return admin.firestore().collection("users-meta");
  }
  static doc(uid: string): admin.firestore.DocumentReference<admin.firestore.DocumentData> {
    return this.col.doc(uid);
  }

  /**
   * Create a user document.
   *
   * This will trigger [onCreate] -> [UserMeta.create] to be invoked.
   *
   * @param data data to create a user document.
   * @return DocumentReference of the created user doc.
   */
  static async update(uid: string, data: UserDocument): Promise<admin.firestore.WriteResult> {
    // Update meta information to search/know if a user has profile photo, or set his name.
    const doc: UserMetaDocument = {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      hasBirthday: !!data.birthday,
      hasDisplayName: !!data.displayName,
      hasFirstName: !!data.firstName,
      hasGender: !!data.gender,
      hasLastName: !!data.lastName,
      hasPhotoUrl: !!data.photoUrl,
    };
    return this.doc(uid).set(doc, {merge: true});
  }

  static async get(uid: string): Promise<UserDocument> {
    const snapshot = await this.doc(uid).get();
    if (snapshot.exists == false) throw ERROR_USER_NOT_FOUND;
    const data = snapshot.data() as UserDocument;
    data.id = uid;
    return data;
  }
}
