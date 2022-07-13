/**
 * @desc Note that, this class is only dealing with `/users` collection in Firestore.
 *        This does not handle anything about the inforation(account) in `Firebase Authentication`.
 * @file user.class.ts
 */
import * as admin from "firebase-admin";
import {UserCreate, UserDocument} from "../../interfaces/user.interfaces";
import {ERROR_USER_NOT_FOUND} from "../../defines";
import {UserRecord} from "firebase-functions/v1/auth";

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
   * @param {UserRecord} user uid is the uid of the user
   *
   */
  static async onCreate(user: UserRecord): Promise<admin.firestore.WriteResult> {
    return User.update(
        user.uid,
        this.completeUserDocument({
          photoUrl: user.photoURL,
          displayName: user.displayName,
        } as UserDocument)
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
    const doc = this.completeUserDocument(data);
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
  static async create(data: UserCreate): Promise<admin.firestore.DocumentReference> {
    return this.col.add(this.completeUserDocument(data as UserDocument));
  }

  /**
   * Updates a user document.
   *
   *
   * @param data data to update a user document.
   * @return DocumentReference of the created user doc.
   */
  static async update(uid: string, data: UserDocument): Promise<admin.firestore.WriteResult> {
    return this.doc(uid).set(data, {merge: true});
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
    if (snapshot.exists == false) throw ERROR_USER_NOT_FOUND;
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
    data.id ??= "";
    data.birthday ??= 0;
    data.displayName ??= "";
    data.firstName ??= "";
    data.gender ??= "";
    data.lastName ??= "";
    data.middleName ??= "";
    data.photoUrl ??= "";

    // / If it is nullish, it means the user is creating an account.
    data.registeredAt ??= admin.firestore.FieldValue.serverTimestamp();

    return {
      ...data,
      hasBirthday: !!data.birthday,
      hasDisplayName: !!data.displayName,
      hasFirstName: !!data.firstName,
      hasGender: !!data.gender,
      hasLastName: !!data.lastName,
      hasPhotoUrl: !!data.photoUrl,
    };
  }
}
