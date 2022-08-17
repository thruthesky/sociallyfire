/**
 * User document creation test.
 */
import "mocha";
import { expect } from "chai";
import { FirebaseAppInitializer } from "../firebase-app-initializer";
import { TestLibrary } from "../test.library.class";
import { User } from "../../src/classes/user/user.class";
// import { UserDocument } from "../../src/interfaces/user.interfaces";
// import { User } from "../../src/classes/user/user.class";

new FirebaseAppInitializer();

describe("User create", () => {
  it("Create a user document", async () => {
    const user = await TestLibrary.createUserDoc();
    expect(user).to.be.an("object").to.have.ownProperty("first_name").not.to.be.empty;
    const created = await User.get(user.uid);
    expect(created.uid).equals(user.uid);
  });
  it("Check user meta", async () => {
    const user = await TestLibrary.createUserDoc();
    await TestLibrary.waitUntil(() => User.metaExists(user.uid));
    const meta = await User.getMeta(user.uid);
    console.log("meta", meta);
  });
});
