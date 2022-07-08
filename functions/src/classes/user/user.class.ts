import * as admin from "firebase-admin";
import { Params } from "../../interfaces/default.interfaces";
import { UserDocument } from "../../interfaces/user.interfaces";
import { UserMeta } from "./user.meta.class";
import { ERROR_USER_NOT_FOUND } from "../../defines";

export class User {
  static get auth() {
    return admin.auth();
  }

  static get col(): admin.firestore.CollectionReference<admin.firestore.DocumentData> {
    return admin.firestore().collection("user");
  }
  static doc(uid: string): admin.firestore.DocumentReference<admin.firestore.DocumentData> {
    return this.col.doc(uid);
  }

  /**
   * Update (Not create or set) the profile document.
   * @param params uid of the user
   * @param data data to update as the user profile
   *
   */
  static async onCreate(params: Params, data: UserDocument) {
    return UserMeta.create(params.uid, {
      hasBirthday: false,
      hasDisplayName: false,
      hasFirstName: false,
      hasGender: false,
      hasLastName: false,
      hasPhotoUrl: false,
    });
  }

  /**
   * Create a user document.
   *
   * This will trigger [onCreate] -> [UserMeta.create] to be invoked.
   *
   * @param data data to create a user document.
   * @return DocumentReference of the created user doc.
   */
  static async create(data: UserDocument): Promise<admin.firestore.DocumentReference> {
    data.registeredAt = admin.firestore.FieldValue.serverTimestamp();
    return this.col.add(data);
  }

  static async get(uid: string): Promise<UserDocument> {
    const snapshot = await this.doc(uid).get();
    if (snapshot.exists) return snapshot.data() as UserDocument;
    throw ERROR_USER_NOT_FOUND;
  }
}
