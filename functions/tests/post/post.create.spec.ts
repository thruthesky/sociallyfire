/**
 * User document creation test.
 */
import "mocha";
import { expect } from "chai";
import { FirebaseAppInitializer } from "../firebase-app-initializer";
import { TestLibrary } from "../test.library.class";
import { Category } from "../../src/classes/category/category.class";
// import { User } from "../../src/classes/user/user.class";

new FirebaseAppInitializer();

describe("Post tests", () => {
  it("Create a post", async () => {
    const post = await TestLibrary.createPostDoc();
    expect(post).to.be.an("object");

    const category = await Category.get(post.categoryDocumentID);
    expect(category.no_of_posts).equals(1);
  });
});
