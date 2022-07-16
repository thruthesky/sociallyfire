import * as admin from "firebase-admin";

export interface CategoryCreate {
  id: string;
  uid: string;
  name?: string;
  description?: string;
}
export interface CategoryDocument {
  id: string;
  uid: string;
  name: string;
  description: string;
  created_at: admin.firestore.FieldValue;
  list_role: number;
  read_role: number;
  write_role: number;
  comment_role: number;
  no_of_posts: number;
  no_of_comments: number;
}
