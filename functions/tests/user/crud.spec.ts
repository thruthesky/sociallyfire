/**
 * This tests if the system test is working.
 */
import "mocha";
import { expect } from "chai";
import { FirebaseAppInitializer } from "../firebase-app-initializer";
import { TestLibrary } from "../test.library.class";
import { User } from "../../src/classes/user/user.class";
import { UserMeta } from "../../src/classes/user/user.meta.class";

new FirebaseAppInitializer();

describe("Firebase connection test", () => {
  it("Create a user document", async () => {
    const user = await TestLibrary.createUser();
    expect(user).to.be.an("object").to.have.ownProperty("firstName").not.to.be.empty;
  });
  it("Trigger - onCreate", async () => {
    const created = await TestLibrary.createUser();
    await User.onCreate(created.id);
    const after = await User.get(created.id!);
    const meta = await UserMeta.get(after.id);

    expect(meta.registeredAt).to.be.an("object");
  });
  it("Trigger - onUpdate", async () => {
    const created = await TestLibrary.createUser();
    await User.update(created.id, { lastName: "Yo" } as any);
    await User.onUpdate({ uid: created.id }, { lastName: "Yo" } as any);
    const after = await User.get(created.id);
    const meta = await UserMeta.get(created.id);

    console.log(meta);

    expect(after.lastName).equals(meta.lastName);
  });
});
