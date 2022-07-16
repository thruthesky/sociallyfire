/**
 * @desc Note that, this class is only dealing with `/users` collection in Firestore.
 *        This does not handle anything about the inforation(account) in `Firebase Authentication`.
 * @file user.class.ts
 */
import * as admin from "firebase-admin";
import { UserCreate, UserDocument } from "../../interfaces/user.interfaces";
import { ERROR_USER_DOCUMENT_NOT_FOUND } from "../../defines";
import { UserRecord } from "firebase-functions/v1/auth";
import { DocumentData, DocumentReference } from "@google-cloud/firestore";

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
   * On user creation, it does not have much information. It will simply create `registered_at` field,
   * and copy `/users/<uid>` into `/users-meta/<uid>` with some meta information.
   *
   * @param {UserRecord} user uid is the uid of the user
   *
   */
  static onCreate(user: UserRecord): Promise<DocumentReference<DocumentData>> {
    return this.create(
      {
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
      },
      {}
    );
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
    return User.update(params.uid, this.completeUserDocument(data));
  }

  /**
   * Creates a user document.
   *
   * This will trigger [onCreate] to be invoked.
   *
   * @param createData data to create a user document.
   * @return DocumentReference of the created user doc.
   */
  static async create(
    user: { uid: string; photoURL?: string; displayName?: string },
    createData: UserCreate
  ): Promise<admin.firestore.DocumentReference> {
    const data = {} as UserDocument;

    // / These are the default values and set only time on user account creation.
    data.birthday ??= 0;
    data.display_name ??= "";
    data.first_name ??= "";
    data.gender ??= "";
    data.last_name ??= "";
    data.middle_name ??= "";
    data.photo_url ??= "";
    data.role ??= 0;

    // / If it is nullish, it means the user is creating an account.
    data.registered_at ??= admin.firestore.FieldValue.serverTimestamp();

    await this.update(
      user.uid,
      this.completeUserDocument({
        ...data,
        ...createData,
        photo_url: user.photoURL,
        display_name: user.displayName,
      } as UserDocument)
    );

    return this.doc(user.uid);

    // return this.col.add(this.completeUserDocument(data as UserDocument));
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

  static async delete(uid: string) {
    return this.doc(uid).delete();
  }

  /**
   * Returns user document.
   * @param uid uid of a user
   */
  static async get(uid: string): Promise<UserDocument> {
    const snapshot = await this.doc(uid).get();
    if (snapshot.exists == false) throw ERROR_USER_DOCUMENT_NOT_FOUND;
    const data = snapshot.data() as UserDocument;
    data.id = uid;
    return data;
  }

  /**
   * Returns true or false depending on the user's document existence.
   *
   * @usage Use this method to check if user's document is created(or existing).
   *
   * @param uid uid of a user
   */
  static async exists(uid: string): Promise<boolean> {
    const snapshot = await User.doc(uid).get();
    return snapshot.exists;
  }

  /**
   * Returns after completing user document fields if there are any missing ones.
   *
   * - purpose: `UserDocument` fields are not optional. So, it should have a complete values.
   *
   * @param data user document data.
   *
   */
  static completeUserDocument(data: UserDocument): UserDocument {
    // eslint-disable-next-line
    const doc = {
      ...data,
      has_birthday: !!data.birthday,
      has_display_name: !!data.display_name,
      has_first_name: !!data.first_name,
      has_gender: !!data.gender,
      has_last_name: !!data.last_name,
      has_middle_name: !!data.middle_name,
      has_photo_url: !!data.photo_url,
    } as any;
    if (doc.id) delete doc.id;

    return doc;
  }
}
