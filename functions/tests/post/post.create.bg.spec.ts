/**
 * Test on User account creation in Firebase Authentication
 * and test user document that is generated by background function.
 */
import "mocha";
import { FirebaseAppInitializer } from "../firebase-app-initializer";
import { TestLibrary } from "../test.library.class";
import { User } from "../../src/classes/user/user.class";
import { Post } from "../../src/classes/post/post.class";
import { expect } from "chai";

// Initialize firebase
new FirebaseAppInitializer();

describe("User create in Firebase Authentication and update through Background Function", () => {
  it("Create a user account and update", async () => {
    const user = await TestLibrary.createUser();
    await TestLibrary.waitUntil(() => User.exists(user.uid));
    const userDocument = await User.get(user.uid);

    expect(userDocument).to.be.an("object");

    const ref = await Post.create({
      uid: user.uid,
      categoryDocumentID: "xxx",
      title: "test",
      files: ["..."],
    });

    const created = await Post.get(ref.id);

    expect(created.author_name).equals(userDocument.display_name);
    expect(created.author_photo_url).equals(userDocument.photo_url);
    expect(created.has_photo).equals(true);

    await TestLibrary.deleteUser(user.uid);
  });
});
