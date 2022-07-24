import * as admin from "firebase-admin";

export interface PostCreate {
  uid: string;
  // Category Document ID
  categoryDocumentID: string;
  title?: string;
  content?: string;
  files?: string[];
}
export interface PostDocument {
  // User ID
  // Read only. Not updatable.
  uid: string;

  // Category Document ID
  categoryDocumentID: string;

  title: string;
  content: string;
  files: string[];

  author_name: string;
  author_photo_url: string;

  created_at: admin.firestore.FieldValue;

  // User can set read role. He can set the post to be read by admin only.
  read_role: number;

  // User can set comment under the post or not.
  comment_role: number;

  likes: string[];
  dislikes: string[];

  no_of_comments: number;

  has_photo: boolean;

  deleted: boolean;
}
