import * as admin from "firebase-admin";

export interface UserDocument {
  // `uid` is the user uid.
  // It is being used by FlutterFlow, also.
  uid?: string;

  // `email` is used by FlutterFlow,
  // but we don't save it here since it is a private information.

  // User name.
  // Note, `display_name` (as kebab case) is used by FlutterFlow and is
  // ignored. Use `displayName` instead.
  displayName?: string;

  // User photo url.
  // Note, `photo_url` (as kebab case) is used by FlutterFlow and is
  // ignored. Use `photoUrl` instead.
  photoUrl?: string;

  // User registration time.
  // Note, `creation_time` (as kebab case) is used by FlutterFlow and is
  // ignored. Use `registeredAt` instead.
  registeredAt?: admin.firestore.FieldValue;

  // `phone_number` is used by FlutterFlow, and ignored.
  // Since it is private information, we don't save it here.

  firstName?: string;
  middleName?: string;
  lastName?: string;

  //
  gender?: string;

  //
  birthday?: number;
}

/**
 * For searching user who has completed their profile.
 */
export interface UserMetaDocument {
  hasDisplayName: boolean;
  hasPhotoUrl: boolean;
  hasFirstName: boolean;
  hasLastName: boolean;
  hasGender: boolean;
  hasBirthday: boolean;
  updatedAt?: admin.firestore.FieldValue;
}
