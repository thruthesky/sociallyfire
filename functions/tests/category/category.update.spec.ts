/**
 * User document creation test.
 */
import "mocha";
import { expect } from "chai";
import { FirebaseAppInitializer } from "../firebase-app-initializer";
import { TestLibrary } from "../test.library.class";
import { Category } from "../../src/classes/category/category.class";
import { CategoryDocument } from "../../src/interfaces/category.interfaces";

new FirebaseAppInitializer();

describe("Update a category", () => {
  it("Update a category document", async () => {
    const category = await TestLibrary.createCategoryDoc();
    expect(category.comment_role).equals(0);
    await Category.update(category.id, { comment_role: 3 } as CategoryDocument);
    const updated = await Category.get(category.id);
    expect(category.id).equals(updated.id);
    expect(updated.comment_role).equals(3);
  });
});
