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
    expect(created.lastName).is.empty;

    await User.update(created.id, { lastName: "Song" } as UserDocument);
    const updated = User.get(created.id);

    expect(updated).to.be.an("object").to.have.property("lastName").equals("Song");
  });
  //   it("Trigger - onCreate", async () => {
  //     await User.onCreate("abc");
  //     const after = await User.get("abc");
  //     expect(after.registeredAt).to.be.an("object");
  //   });
});
