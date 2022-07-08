import * as admin from "firebase-admin";
import { UserMetaDocument } from "../../interfaces/user.interfaces";

export class UserMeta {
  static get col(): admin.firestore.CollectionReference<admin.firestore.DocumentData> {
    return admin.firestore().collection("user-meta");
  }
  static doc(uid: string): admin.firestore.DocumentReference<admin.firestore.DocumentData> {
    return this.col.doc(uid);
  }

  /**
   * Update (Not create or set) the profile document.
   * @param uid uid of the user
   * @param data data to update as the user profile
   *
   */
  static async create(uid: string, data: UserMetaDocument) {
    data.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    return this.doc(uid).set(data);
  }
}
