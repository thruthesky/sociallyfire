/**
 * @file user.class.ts
 */
import * as admin from "firebase-admin";
import { UserDocument } from "../../interfaces/user.interfaces";
import { ERROR_USER_NOT_FOUND } from "../../defines";

/**
 * User
 */
export class User {
  static get auth() {
    return admin.auth();
  }

  static get col(): admin.firestore.CollectionReference<admin.firestore.DocumentData> {
    return admin.firestore().collection("users");
  }
  static doc(uid: string): admin.firestore.DocumentReference<admin.firestore.DocumentData> {
    return this.col.doc(uid);
  }

  /**
   * This is invoked on user auth creation and it is invoked only once.
   *
   * On user creation, it does not have much information. It will simply create `registeredAt` field,
   * and copy `/users/<uid>` into `/users-meta/<uid>` with some meta information.
   *
   * @param {string} uid uid is the uid of the user
   *
   */
  static async onCreate(uid: string): Promise<admin.firestore.WriteResult> {
    const data = {
      registeredAt: admin.firestore.FieldValue.serverTimestamp(),
    } as UserDocument;
    return User.update(uid, data);
  }

  /**
   * This can be invoked multiple times as user updates his profile information.
   *
   * Update (Not create or set) the profile document.
   *
   * @param {object} params params.uid is the uid of the user
   * @param {UserDocument} data data to update as the user profile
   *
   */
  static async onUpdate(
    params: { uid: string },
    data: UserDocument
  ): Promise<admin.firestore.WriteResult> {
    const doc = {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      hasBirthday: !!data.birthday,
      hasDisplayName: !!data.displayName,
      hasFirstName: !!data.firstName,
      hasGender: !!data.gender,
      hasLastName: !!data.lastName,
      hasPhotoUrl: !!data.photoUrl,
    };
    return User.update(params.uid, doc);
  }

  /**
   * Creates a user document.
   *
   * This will trigger [onCreate] -> [UserMeta.update] to be invoked.
   *
   * @param data data to create a user document.
   * @return DocumentReference of the created user doc.
   */
  static async create(data: UserDocument): Promise<admin.firestore.DocumentReference> {
    data.registeredAt = admin.firestore.FieldValue.serverTimestamp();
    return this.col.add(data);
  }

  /**
   * Updates a user document.
   *
   *
   * @param data data to update a user document.
   * @return DocumentReference of the created user doc.
   */
  static async update(uid: string, data: UserDocument): Promise<admin.firestore.WriteResult> {
    return this.doc(uid).set(data, { merge: true });
  }

  static async get(uid: string): Promise<UserDocument> {
    const snapshot = await this.doc(uid).get();
    if (snapshot.exists == false) throw ERROR_USER_NOT_FOUND;
    const data = snapshot.data() as UserDocument;
    data.id = uid;
    return data;
  }
}
