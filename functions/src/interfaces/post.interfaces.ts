import * as admin from "firebase-admin";

export interface PostCreate {
  uid: string;
  category: string;
  title?: string;
  content?: string;
  files?: string[];
}
export interface PostDocument {
  // User ID
  uid: string;

  // Category ID
  category: string;

  title: string;
  content: string;
  files: string[];

  author_name: string;
  author_photo_url: string;

  created_at: admin.firestore.FieldValue;

  read_role: number;
  comment_role: number;
}
