/**
 * This tests if the system test is working.
 */
import "mocha";
import { expect } from "chai";
import { TestLibrary } from "../test.library.class";


import { FirebaseAppInitializer } from "../firebase-app-initializer";

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

