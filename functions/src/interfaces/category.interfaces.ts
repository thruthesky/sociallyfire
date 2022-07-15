import * as admin from "firebase-admin";

export interface CategoryCreate {
  id?: string;
  uid: string;
  name: string;
  description: string;
  registered_at?: admin.firestore.FieldValue;
}
export interface CategoryDocument {
  id: string;
  uid: string;
  name: string;
  description: string;
  registeredAt: admin.firestore.FieldValue;
  list_role: string;
  read_role: string;
  write_role: string;
}
