/**
 * This tests if the system test is working.
 */
 import "mocha";
 import { expect } from "chai";
 
 
 import { User } from "../../src/classes/user/user.class";
 import { FirebaseAppInitializer } from "../firebase-app-initializer";
 import { UserDocument } from "../../src/interfaces/user.interfaces";
 
 new FirebaseAppInitializer();
 
 describe("Firebase connection test", () => {  
   it("Create a user document", async () => {
     const uid = "uid-" + new Date().getTime();
     const first_name = 'JayYo';
     const ref = await User.create({ uid: uid }, {
       first_name: first_name,
     } as UserDocument);
     expect(ref).to.be.an("object");
     const created = await User.get(uid);
     expect(created.first_name).equals(first_name);
   });
 });




