# SociallyFire

SociallyFire(SF) is a framework to help building Soical apps.

It is a derived version of [fireflutter](https://pub.dev/packages/fireflutter) that is tightly coupled with Flutter.
And It is now trying to decouple from Flutter by implementing its core parts into cloud functions(event trigger). So, the final version of SF would work as frame agnostic.


- [SociallyFire](#sociallyfire)
- [Overview](#overview)
  - [Background Functions](#background-functions)
    - [Cloud Functions onUpdate infinite loop](#cloud-functions-onupdate-infinite-loop)
- [Installation](#installation)
- [Test](#test)
  - [Two kinds of testing](#two-kinds-of-testing)
    - [Test by units](#test-by-units)
    - [Test with background functions](#test-with-background-functions)
  - [Testing the test system.](#testing-the-test-system)
  - [Testing indiviual test spec](#testing-indiviual-test-spec)
- [Lint](#lint)
- [Deploy](#deploy)
- [Database and Document Structure](#database-and-document-structure)
- [Coding Guidelines](#coding-guidelines)
  - [Test](#test-1)
    - [waitUntil](#waituntil)
- [Bugs or Issues](#bugs-or-issues)



# Overview

- 
- Git repo: https://github.com/thruthesky/sociallyfire


## Background Functions

The reason why I go with `Background Functions` is very clear. HTTP functions in Cloud Functions are so slow comparing to the direct connection to Firestore with offline support. When the offline mode is supported (which is the default on most of client platform), the client will be updated before saving the data to Firestore and it is fast enough to use as a state management.



### Cloud Functions onUpdate infinite loop


# Installation

- To test, you need to put your firebase project's admin sdk key into `functions/firebase.admin-key.json`.

# Test

- The TDD is the most important part of this project, especially when it is written as background functions. The perfect TDD implementation is the ultimate goal to make this project successful.

- All the test goes with the real firebase project. This means that, Firebase emulators are not needed and when the test runs, it will directly access the real firebase project. So, there might be some garbage data to be left on the firebase project. It is not recommended to run the tests against the production firebase project. Instead, create a temporary firebase project and do the tests.

- The test codes are under `functions/tests` folder.

- To test, enter `functions/tests` folder first and run test like `$ npm run test:user:crud`.


## Two kinds of testing

- There are two different ways of testing.

### Test by units

With this test, when the source code changes, the tests runs and the results are displayed immediately.
This is very convinient on testing small units but it does not test on the functions itself.

- Simply run the tests like `% npm run test:user:create`.

Note, that the test scripts that runs without background functions should be end with `.spec.ts`.

### Test with background functions

With this test, it will test on the background functions. So, the functions need to be deploy before running the test.

- To run a test,
  - `% npm run deploy`
  (or deploy only the function you would like by `% firebase deploy --only functions:...`)
  - `% npm run test:user:create.bg`
  - For detailed code explanation, see a sample code of `user.create.bg.spec.ts`(https://github.com/thruthesky/sociallyfire/blob/main/functions/tests/user/user.create.bg.spec.ts).


Note, that the test scripts that runs with background functions should be end with `.bg.spec.ts`.

- The TDD is the most important part of this project. The perfect TDD implementation is the ultimate goal to make this project successful.

- The test must be done only in firebase emulator. Do not test on real firebase project.

- The test codes are under `functions/tests` folder.

- To test, enter `functions/tests` folder first.

## Testing the test system.

- The `testing system` is the test codes and its enviromental configuration of `sociallyfire`. When you test the `testing system`, it will do the tests to see if everything in the `testing system` is okay.

- To test if the testing is working, run `npm run test:test`.

- To test if firebase connection is working, run `npm run test:firebase-connection`.

## Testing indiviual test spec

- You can add the test run script in `package.json` and run command like `npm run test:user:create`
- You can also add test command like `mocha --require ts-node/register --watch --watch-files ... tests/user/*.spec.ts`. So, you can test many test files at once.

# Lint

- See `functions/eslintrc.js` for details.

# Deploy

- Run `npm run deploy` to deploy to Firebase.
  - It will do `npm run lint:fix` first and if there is no error, it will deploy.


# Database and Document Structure

- Some of the collections go "plural" forms while others go "singular" forms.
  - plural forms
    - users, posts, comments, categories
  - singular forms
    - chat


- Field names should be in camel case.

- Time value should be the Firebase Server Timestamp.

- Field name of document creation should be `createdAt`. Exceptions are like the `registeredAt` in `/users` collection.
- Field name of document update should be `updatedAt`.

- We do not do `collectionQuery()` since some of the client flatform like `FlutterFlow` does not support collection group query.




# Coding Guidelines

## Test

### waitUntil

- Sometimes, it is neccessary to wait until `asynchoronus` work finishes before checking the test results. For instance, when a user registers(creates an account), the `background function` will generate user's document under `/users` path. And the test code wants to check if the document is property generated. That's where `waitUntil` comes for waiting for the work to be done.



```ts
describe("User create in Firebase Authentication", () => {
  it("Create a user account", async () => {

    // Creates a user account on `Firebase Auth` and it will trigger `onUserCreate` background function.
    const user = await TestLibrary.createUser();

    // Wait until the background function `onUserCreate` generates the user document.
    const re = await TestLibrary.waitUntil(() => User.exists(user.uid));

    // If user document has successfully generated by `onUserCreate` background function,
    // in time, then it will return true. Otherwise, it will be false.
    expect(re).equals(true);
  });
});
```


# Bugs or Issues

- See [sociallyfire github project](https://github.com/thruthesky/sociallyfire/projects/1).

