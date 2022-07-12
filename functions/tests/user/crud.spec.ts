/**
 * User CRUD test.
 */
import "mocha";
import { expect } from "chai";
import { FirebaseAppInitializer } from "../firebase-app-initializer";
import { TestLibrary } from "../test.library.class";
import { User } from "../../src/classes/user/user.class";

new FirebaseAppInitializer();

describe("Firebase connection test", () => {
  it("Create a user document", async () => {
    const user = await TestLibrary.createUserDoc();
    expect(user).to.be.an("object").to.have.ownProperty("firstName").not.to.be.empty;
  });
  it("Trigger - onCreate", async () => {
    const created = await TestLibrary.createUserDoc();
    await User.onCreate(created.id);
    const after = await User.get(created.id!);

    expect(after.registeredAt).to.be.an("object");
  });
});
