export interface UserDocument {
  // `uid` exists here for the compatibility of FlutterFlow
  // `email` exists here for the compatibility of FlutterFlow
  email?: string;

  // `display_name` is a kebab case for compatibility of FlutterFlow
  display_name?: string;

  // `photo_url` is a kebab case for compatibility of FlutterFlow
  photo_url?: string;

  // It should be named as `createdAt`, but named as `created_time` for the compatibility of FlutterFlow,
  created_time?: any;

  // `phone_number` exists for the compatibility of FlutterFlow
  phone_number?: string;

  firstName?: string;
  middleName?: string;
  lastName?: string;

  gender?: string;

  updatedAt?: number;
  birthday?: number;
  profileReady?: number;
}
