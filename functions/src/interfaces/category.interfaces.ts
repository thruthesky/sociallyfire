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
  list_role: string;
  read_role: string;
  write_role: string;
  comment_role: string;
}
