/**
 * This tests if the system test is working.
 */
 import "mocha";
 import { expect } from "chai";
 import { TestLibrary } from "../test.library.class";
 
 
//  import { User } from "../../src/classes/user/user.class";
 import { FirebaseAppInitializer } from "../firebase-app-initializer";
//  import { UserDocument } from "../../src/interfaces/user.interfaces";
 
 new FirebaseAppInitializer();
 

 
 describe("Firebase connection test", () => {
   it("Create a user on Firebase Auth", async () => {
        const user = await TestLibrary.createUser();
        expect(user).to.be.an('object');
   });
 });