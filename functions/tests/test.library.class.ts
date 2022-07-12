import * as admin from "firebase-admin";
import { UserRecord } from "firebase-functions/v1/auth";
import { User } from "../src/classes/user/user.class";
import { UserDocument } from "../src/interfaces/user.interfaces";

export class TestLibrary {
  /**
   * Create a user document under `/users` path.
   *
   * Note, it does not create the actual user authentication in Firebase Auth. It only creates
   * user document.
   */
  static async createUserDoc(): Promise<UserDocument> {
    const firstName = "First name-" + new Date().getTime();
    const ref = await User.create({
      firstName: firstName,
    } as UserDocument);

    const created = await User.get(ref.id);
    return created;
  }

  /**
   * Creates a user account in Firebase Authentication and returns UserRecord.
   *
   * Note, it will trigger `onCreate` background function.
   */
  static async createUser(): Promise<UserRecord> {
    const id = "id" + this.getTimestamp();

    return admin.auth().createUser({
      email: id + "@test.com",
      emailVerified: false,
      phoneNumber: "+11234" + this.getRandomInt(111111, 999999),
      password: "secretPassword",
      displayName: "John Doe",
      photoURL: "http://www.example.com/12345678/photo.png",
      disabled: false,
    });
  }

  /**
   * Deletes a user account and the user document under `/users` path.
   *
   * @param uid uid of the user to be deleted
   */
  static async deleteUser(uid: string): Promise<void> {
    await admin.auth().deleteUser(uid);
    await User.delete(uid);
  }

  static async delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  /**
   * wait until for an event to be fullfilled.
   *
   * @param retry how many times to retry
   * @param time dealy time in ms
   * @param callback callback function that returns true of false. If true is returns, it is fullfilled.
   */
  static async waitUntil(retry: number, time: number, callback: () => Promise<boolean>) {
    for (let i = 0; i < retry; i++) {
      await this.delay(time);
      const re = await callback();
      if (re) return true;
    }
    return false;
  }
  /**
   * Returns unix timestamp
   *
   * @return int unix timestamp
   */
  static getTimestamp(servertime?: any) {
    if (servertime) {
      const d = servertime.toDate();
      return Math.round(d.getTime() / 1000);
    } else {
      return Math.round(new Date().getTime() / 1000);
    }
  }

  /**
   *
   * @param min
   * @param max
   * @returns
   */
  static getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
