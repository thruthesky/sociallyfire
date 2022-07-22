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

  read_role: number;
  comment_role: number;

  has_photo: boolean;

  deleted: boolean;
}
