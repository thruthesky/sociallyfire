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
   * FirebaseAuth 사용자 생성 트리거
   *
   * This is invoked on [onCreate] of firestore event trigger and update the user document with necessary properties.
   *
   * 사용자 문서와 사용자 메타 문서를 생성한다.
   *
   * @param {UserRecord} user uid is the uid of the user
   *
   */
  static onCreate(user: UserRecord): Promise<admin.firestore.WriteResult[]> {
    return this.create(
      {
        uid: user.uid,
        photoURL: user.photoURL ?? "",
        displayName: user.displayName ?? "",
      },
      {}
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
  ): Promise<admin.firestore.WriteResult[]> {
    const data = {
      uid: user.uid,
      photo_url: user.photoURL,
      display_name: user.displayName,
      ...createData,
    };
    return Promise.all([
      this.doc(user.uid).set(data, { merge: true }),
      this.updateMeta(user.uid, data as UserDocument),
    ]);
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
    return this.update(params.uid, data);
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
    await this.doc(uid).set(data, { merge: true });
    return this.updateMeta(uid, data);
  }

  /**
   * 사용자 메타 정보를 저장한다.
   *
   * 특히, 사용자의 생년월일, 성별, 사진 등의 정보가 있는지 없는지를 표시하는 필드를 추가하여
   * /users-meta 컬렉션에 저장한다. 이 후, /users 을 검색 할 필요 없이, /users-meta 를
   * 검색하면 된다.
   *
   * @param uid 사용자 uid
   * @param data 업데이트 할 메타 데이터
   */
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

  static onDelete(user: UserRecord): Promise<admin.firestore.WriteResult> {
    return this.delete(user.uid);
  }

  static async delete(uid: string): Promise<admin.firestore.WriteResult> {
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
   * 사용자 문서가 존재하는지 확인.
   *
   * 사용 예,
   *  - 사용자가 가입하거나 테스트 등에서 문서를 생성한 후에 그 문서가 올바로 생성되었는지 등 확인 할 때 사용
   *  - 또는 사용자 문서가 존재하는지를 확인 할 때에도 사용.
   *
   * @usage Use this method to check if user's document is created(or existing).
   *
   * @param uid uid of a user
   */
  static async exists(uid: string): Promise<boolean> {
    const snapshot = await this.doc(uid).get();
    return snapshot.exists;
  }

  static async notExists(uid: string): Promise<boolean> {
    return !(await this.exists(uid));
  }

  /**
   * 사용자 meta 문서가 존재하는지 확인.
   *
   * 사용 예,
   *  - 사용자가 가입하거나 테스트 등에서 문서를 생성한 후에 사용자의 meta 문서가 올바로 생성되었는지 등 확인 할 때 사용
   *  - 테스트 등에서, 사용자 문서를 생성하고, meta 문서가 생성될 때 까지 wait 등을 할 수 있다.
   *
   * @param uid uid of a user
   */
  static async metaExists(uid: string): Promise<boolean> {
    const snapshot = await this.metaDoc(uid).get();
    return snapshot.exists;
  }
  static async metaNotExists(uid: string): Promise<boolean> {
    return !(await this.metaExists(uid));
  }
}
