/**
 * Test on User account creation in Firebase Authentication
 * and test user document that is generated by background function.
 */
import "mocha";
import { expect } from "chai";
import { FirebaseAppInitializer } from "../firebase-app-initializer";
import { TestLibrary } from "../test.library.class";
import { User } from "../../src/classes/user/user.class";

// Initialize firebase
new FirebaseAppInitializer();

describe("User create in Firebase Authentication and update through Background Function", () => {
  it("Create a user account and update", async () => {
    // Create a user account in Firebase authentication
    const user = await TestLibrary.createUser();

    // Wait until the background function - `onUserCreate` to generate the user's document.
    // Retry 10 times on every 0.5 seconds.
    const re = await TestLibrary.waitUntil(async () => {
      // Check if `onUserCreate` has generated its document.
      const snapshot = await User.doc(user.uid).get();
      // If document has been generated, finish the wait by returning true.
      if (snapshot.exists) return true;
      // Or return false to continue test(check) if its document has already generated.
      else return false;
    });

    // If user document has successfully generated by `onUserCreate` background function,
    // it will be true. Otherwise, it will be false.
    expect(re).equals(true);

    // Get the generated user documents.
    const userDoc = await User.get(user.uid);

    // Do some tests
    expect(userDoc).to.be.an("object").to.have.property("first_name").equals("");
    expect(userDoc.id).equals(user.uid);

    // Delete the user account in Firebase Authentication and delete user document under `/users` path.
    await TestLibrary.deleteUser(user.uid);
  });
});
