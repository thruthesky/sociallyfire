import * as admin from "firebase-admin";

export interface UserCreate {
  // `email` is used by FlutterFlow,
  // but we don't save it here since it is a private information.

  // `phone_number` is used by FlutterFlow, and ignored.
  // Since it is private information, we don't save it here.

  // User display name.
  // Note, `display_name` is used by FF and must be in `kebab case` to support FF.
  display_name?: string;

  // User photo url.
  // Note, `photo_url` is used by FF and must be in `kebab case` to support FF.
  photo_url?: string;

  first_name?: string;
  middle_name?: string;
  last_name?: string;
  gender?: string;
  birthday?: number;
}

/**
 * UserDocument
 *
 * This must not have any optional properties.
 *
 * - related: `User.completeUserDocument()`.
 */
export interface UserDocument {
  // `id` is the uid and is the key of the document under /users collection
  // and the `id` field is not saved in the document.
  // The `id` is read only and only available on reading by `get()` and it may
  // be delivered to client.
  id: string;
  // User display name.
  // Note, `display_name` is used by FF and must be in `kebab case` to support FF.
  display_name: string;

  // User photo url.
  // Note, `photo_url` is used by FF and must be in `kebab case` to support FF.
  photo_url: string;

  // User registration time.
  // Note, `creation_time` (as kebab case) is used by FlutterFlow and is
  // ignored. Use `registeredAt` instead.
  registered_at: admin.firestore.FieldValue;

  // `phone_number` is used by FlutterFlow, and ignored.
  // Since it is private information, we don't save it here.

  first_name: string;
  middle_name: string;
  last_name: string;

  gender: string;
  birthday: number;

  role: number;

  /**
   * For searching user who has completed their profile.
   */
  has_display_name: boolean;
  has_photo_url: boolean;
  has_first_name: boolean;
  has_last_name: boolean;
  has_gender: boolean;
  has_middle_name: boolean;
  has_birthday: boolean;
}
