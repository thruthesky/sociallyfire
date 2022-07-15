/**
 * User document creation test.
 */
import "mocha";
import { expect } from "chai";
import { FirebaseAppInitializer } from "../firebase-app-initializer";
import { TestLibrary } from "../test.library.class";
// import { User } from "../../src/classes/user/user.class";

new FirebaseAppInitializer();

describe("Create a category", () => {
  it("Create a category document", async () => {
    const category = await TestLibrary.createCategoryDoc();
    expect(category).to.be.an("object").to.have.ownProperty("id").not.to.be.empty;
    expect(category.id).equals(category.name);
  });
});
