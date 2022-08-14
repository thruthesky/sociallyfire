/**
 * This tests if the system test is working.
 */
import "mocha";
import { expect } from "chai";
import { TestLibrary } from "../test.library.class";


import { User } from "../../src/classes/user/user.class";
import { FirebaseAppInitializer } from "../firebase-app-initializer";
import { UserDocument } from "../../src/interfaces/user.interfaces";

new FirebaseAppInitializer();

describe("Test tests", () => {
  it("checking default options", () => {
    const options = { a: 111, b: "banana" };
    expect(options).to.be.an("object").to.have.property("b").to.equal("banana");
  });

  it("waitUntil false", async () => {
    const re = await TestLibrary.waitUntil(
      async () => {
        return false;
      },
      50,
      3
    );
    expect(re).to.be.an("boolean").equals(false);
  });
  it("waitUntil true", async () => {
    const re = await TestLibrary.waitUntil(
      async () => {
        return true;
      },
      100,
      1
    );
    expect(re).to.be.an("boolean").equals(true);
  });
});


describe("Firebase connection test", () => {
  it("Create a user document", async () => {
    const uid = "uid-" + new Date().getTime();
    const first_name = 'first name';
    const ref = await User.create({ uid: uid }, {
      first_name: first_name,
    } as UserDocument);
    expect(ref).to.be.an("object");
    const created = await User.get(uid);
    expect(created.first_name).equals(first_name);
  });
});