/**
 * User document creation test.
 */
import "mocha";
import { expect } from "chai";
import { FirebaseAppInitializer } from "../firebase-app-initializer";
import { TestLibrary } from "../test.library.class";
import { User } from "../../src/classes/user/user.class";

new FirebaseAppInitializer();

describe("User create", () => {
  it("Create a user document", async () => {
    const user = await TestLibrary.createUserDoc();
    expect(user).to.be.an("object").to.have.ownProperty("firstName").not.to.be.empty;
  });
});
