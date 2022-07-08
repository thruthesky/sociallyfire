import * as admin from "firebase-admin";
import { UserDocument } from "../../interfaces/user.interfaces";

export class User {
  static get auth() {
    return admin.auth();
  }

  /**
   * Update (Not create or set) the profile document.
   * @param uid uid of the user
   * @param data data to update as the user profile
   *
   */
  static async onCreate(uid: string, data: UserDocument) {}
}
