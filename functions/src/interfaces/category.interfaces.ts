import * as admin from "firebase-admin";

export interface CategoryCreate {
  uid: string;
  name?: string;
  description?: string;
}
export interface CategoryDocument {
  // Read only. This [id] does not exists on database. It is only added upon document read.
  // This is for convinience of accessing its document id.
  id?: string;
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
  deleted: boolean;
}
