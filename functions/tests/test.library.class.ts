import { User } from "../src/classes/user/user.class";
import { UserDocument } from "../src/interfaces/user.interfaces";

export class TestLibrary {
  /// Create a user
  static async createUser(): Promise<UserDocument> {
    const firstName = "First name-" + new Date().getTime();
    const ref = await User.create({
      firstName: firstName,
    } as UserDocument);

    const created = await User.get(ref.id);
    return created;
  }
}
