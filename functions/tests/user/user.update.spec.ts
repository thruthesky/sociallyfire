/**
 * User document update test.
 */
import "mocha";
import { expect } from "chai";
import { FirebaseAppInitializer } from "../firebase-app-initializer";
import { TestLibrary } from "../test.library.class";
import { User } from "../../src/classes/user/user.class";
import { UserDocument } from "../../src/interfaces/user.interfaces";

new FirebaseAppInitializer();

describe("User update", () => {
  it("Update a user document", async () => {
    const created = await TestLibrary.createUserDoc();
    expect(created.last_name).is.empty;

    await User.update(created.id, {
      last_name: "Song",
      photo_url: "https://.....png",
    } as UserDocument);
    const updated = await User.get(created.id);

    expect(updated).to.be.an("object").to.have.property("last_name").equals("Song");
    expect(updated.has_last_name).equals(true);
    expect(updated.has_photo_url).equals(true);
    expect(updated.has_birthday).equals(false);

    await TestLibrary.deleteUsearDoc(updated.id);
  });
});
