/**
 * This tests if the system test is working.
 */
import "mocha";
import { expect } from "chai";

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
});
