/**
 * @desc Note that, this class is only dealing with `/users` collection in Firestore.
 *        This does not handle anything about the inforation(account) in `Firebase Authentication`.
 * @file user.class.ts
 */
import * as admin from "firebase-admin";
import { UserCreate, UserDocument, UserMetaDocument } from "../../interfaces/user.interfaces";
import { ERROR_USER_DOCUMENT_NOT_FOUND, ERROR_USER_META_DOCUMENT_NOT_FOUND } from "../../defines";
import { UserRecord } from "firebase-functions/v1/auth";

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
  static get metaCol(): admin.firestore.CollectionReference<admin.firestore.DocumentData> {
    return admin.firestore().collection("users-meta");
  }
  static metaDoc(uid: string): admin.firestore.DocumentReference<admin.firestore.DocumentData> {
    return this.metaCol.doc(uid);
  }

  /**
   * This is invoked on [onCreate] of firestore event trigger and update the user document with necessary properties.
   *
   *
   *
   * @param {UserRecord} user uid is the uid of the user
   *
   */
  static onCreate(user: UserRecord): Promise<admin.firestore.WriteResult> {
    return this.update(
      user.uid,
      this.completeUserDocument({
        uid: user.uid,
        photo_url: user.photoURL ?? "",
        display_name: user.displayName ?? "",
      } as UserDocument)
    );
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
  ): Promise<admin.firestore.WriteResult> {
    return this.update(
      user.uid,
      this.completeUserDocument({
        ...createData,
        uid: user.uid,
        photo_url: user.photoURL,
        display_name: user.displayName,
      } as UserDocument)
    );
  }

  /**
   * Background Functions 의 `onUpdate` event trigger.
   *
   * 반복 업데이트 루프를 피하기 위해서, 현재 사용자 문서를 다시 업데이트하지 않는다. 대신, meta 에 저장한다.
   *
   * @param {object} params params.uid is the uid of the user
   * @param {UserDocument} data data to update as the user profile
   *
   */
  static async onUpdate(
    params: { uid: string },
    data: UserDocument
  ): Promise<admin.firestore.WriteResult> {
    return this.updateMeta(params.uid, this.completeUserDocument(data));
  }

  /**
   * Updates a user document.
   *
   * The input data object can have any keys and values.
   *
   * @param data the data object to be updated to a user document.
   * @return DocumentReference of the created user doc.
   */
  // eslint-disable-next-line
  static async update(uid: string, data: UserDocument): Promise<admin.firestore.WriteResult> {
    data = this.completeUserDocument(data);
    await this.doc(uid).set(data, { merge: true });
    return this.updateMeta(uid, data);
  }

  static async updateMeta(uid: string, data: UserDocument) {
    // eslint-disable-next-line
    const doc: UserMetaDocument = {
      ...data,
      uid: uid,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      has_birthday: !!data.birthday,
      has_display_name: !!data.display_name,
      has_first_name: !!data.first_name,
      has_gender: !!data.gender,
      has_last_name: !!data.last_name,
      has_middle_name: !!data.middle_name,
      has_photo_url: !!data.photo_url,
    };

    return this.metaDoc(uid).set(doc);
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
    return snapshot.data() as UserDocument;
  }

  static async getMeta(uid: string): Promise<UserMetaDocument> {
    const snapshot = await this.metaDoc(uid).get();
    if (snapshot.exists == false) throw ERROR_USER_META_DOCUMENT_NOT_FOUND;
    return snapshot.data() as UserMetaDocument;
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
   * 사용자 문서에서 빠진 필드가 있으면 기본 값으로 채워 리턴
   *
   * 사용 예, 회원 가입을 처음 할 때, 사용자 계정을 처음 생성할 때, 모든 필드에 기본 값을 채우기 위해서 사용.
   *
   * @param data user document data.
   *
   */
  static completeUserDocument(data: UserDocument): UserDocument {
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

    // eslint-disable-next-line
    delete (data as any).id;

    return data;
  }
}
