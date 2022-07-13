/**
 * This tests if the system test is working.
 */
import "mocha";
import { expect } from "chai";
import { TestLibrary } from "../test.library.class";
import { notUpdatable, updatable } from "../../src/library";

describe("Test tests", () => {
  // the tests container
  it("checking default options", () => {
    // the single test
    const options = { a: 111, b: "banana" };

    expect(options).to.be.an("object");
    expect(options.a).to.equal(111);
    expect(options).not.to.be.empty;
    // this is a little more complex, but still really clear
    expect(options).to.be.an("object").to.have.property("b").to.equal("banana");
    // expect(options).is.an("number");
  });

  it("updatable()", () => {
    let re = updatable({ a: "apple" }, { a: "banana" });
    expect(re).equals(true);
    re = updatable({ a: "apple" }, { b: "banana" });
    expect(re).equals(true);
    re = updatable({ c: "cherry" }, { c: "cherry" });
    expect(re).equals(false);
    re = notUpdatable({ c: "cherry" }, { c: "cherry" });
    expect(re).equals(true);
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
