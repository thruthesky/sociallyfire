# Fire Engine

`Fire Engine` (FE) is a framework to help building Soical apps.

It is a derived version of [fireflutter](https://pub.dev/packages/fireflutter) that is tightly coupled with Flutter.
And It is now trying to decouple from Flutter by implementing its core parts into cloud functions(event trigger). So, the final version of `Fire Engine` would work as frame agnostic.


- [Fire Engine](#fire-engine)
- [Overview](#overview)
- [TODO](#todo)
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
- [Firestore database and Document Structure](#firestore-database-and-document-structure)
  - [User Collection and Document](#user-collection-and-document)
- [Storage structure](#storage-structure)
- [Push message data structure](#push-message-data-structure)
- [Access Control List - Admin permission security](#access-control-list---admin-permission-security)
- [Push messaging guidelines](#push-messaging-guidelines)
- [Test Guidelines](#test-guidelines)
  - [Test](#test-1)
    - [waitUntil](#waituntil)
  - [TODO - seucirty rule check based on user role and category roles](#todo---seucirty-rule-check-based-on-user-role-and-category-roles)
- [Security rules](#security-rules)
  - [Category rules](#category-rules)
- [Client App Development Guide](#client-app-development-guide)
  - [User Build Guide](#user-build-guide)
  - [Category Build Guide](#category-build-guide)
  - [Post Build Guide](#post-build-guide)
  - [Comment Buid Guide](#comment-buid-guide)
- [Bugs or Issues](#bugs-or-issues)



# Overview

- Git repo: https://github.com/thruthesky/Fire Engine

# TODO

- See [Github project](https://github.com/thruthesky/Fire Engine/projects/1).



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
  - For detailed code explanation, see a sample code of `user.create.bg.spec.ts`(https://github.com/thruthesky/Fire Engine/blob/main/functions/tests/user/user.create.bg.spec.ts).


Note, that the test scripts that runs with background functions should be end with `.bg.spec.ts`.

- The TDD is the most important part of this project. The perfect TDD implementation is the ultimate goal to make this project successful.

- The test must be done only in firebase emulator. Do not test on real firebase project.

- The test codes are under `functions/tests` folder.

- To test, enter `functions/tests` folder first.

## Testing the test system.

- The `testing system` is the test codes and its enviromental configuration of `Fire Engine`. When you test the `testing system`, it will do the tests to see if everything in the `testing system` is okay.

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


# Firestore database and Document Structure

- Some of the collections go "plural" forms while others go "singular" forms.
  - plural forms
    - users, posts, comments, categories
  - singular forms
    - chat


- Collection names and field names should be in kebab case.

- Time value should be the Firebase Server Timestamp.

- Field name of document creation should be `created_at`. Exceptions are like the `registered_at` in `/users` collection.
- Field name of document update should be `updated_at`.

- We do not do `collectionQuery()` since some of the client
- For some client platform like `FlutterFlow` cannot generate a custom document id, `Fire Engine` will only use auto generated document id.

- The documents of `categories`, `posts`, and `comments` collections have a field `deleted`.
  - When a user deletes his posts or comment, the document is not actually deleted. Instead, it will mark as `{deleted: true}`.
  - With this flag, client app can display the status on screen if the posts or comments are deleted.
  - For category, app can mark as a category deleted, first. then, the can delete the category completely.

 flatform like `FlutterFlow` does not support collection group query.

- `Background Functions` for firestore tiggers don't have `auth` (or `context.auth`) for user verification(authentication).
  - This means, actions that needs user verfication requires the input documents to have `uid` inside.
    - When a user creates a `category`, `post`, or `comments`, the input object(document data) must have `uid` field to access user data. And the verification of user authentication should be done by the security rules.


- For `users` collection, the user's `id` is not saved by `Fire Engine`.
  - But for apps that are built with `FlutterFlow`, `uid` will be automatically attached. So, `FlutterFlow` can use the `uid` of the `users` collection.

- For `categories` collection, the `document id` will be generated by firestore. User cannot set category id manually.

- Note, if you are building app with `FlutterFlow`, `users` collection will have `uid`, `email`, and `phone_number` with some other properties. the three properties - `uid, email, phone_number` are considered as priate information but `FlutterFlow` open it to public and let users search.
  - Since those three properties are attached by `FlutterFlow` itself, the properties - `uid, email, phone_number` will be not avaiable for other apps (that are built from different paltform).


- When a user registers (creates an account), `Fire Engine` will attach some properties to `/users` collection by `onCreate` background event.
  - `first_name`, `middle_name`, `last_name`, `registered_at`, `gender`, `birthday`, `role`, and `has_xxxx`.
    - App can search based on `has_xxxx` to see if a user has the value of a field `has_xxxx`.
      - For instance, app can display only the users who have `has_display_name=true` and `has_photo=true` order by `registered_at desc`.

## User Collection and Document

- `uid` is the user's uid.

# Storage structure

- Upload folders are divided by each user folder. That is `/users/<uid>/uploads`. And this is compatible with `FlutterFlow`.



# Push message data structure

- Push message tokens are saved under `/users/<uid>/fcm_tokens/` with the property of;
  - `created_at` - the create time of the token, 
  - `device_type` - the device type. ie) android, iOS, 
  - `fcm_token` - the push message token
  And this is compatible with `FlutterFlow`.


# Access Control List - Admin permission security

- There are roles of users to manage their access to the contents.
- The roles are specified in a number.
  - The role can set between `0~999`.  it's called `role level`.
    - Consider to use `role level` from `0` to `9` to make a simple.

- `admin` is also set as role level. If a user has his role level to `999`, then he is an admin.
  - The admin owns the system and have all the permission.
  - Multiple users can have admin role level.
- `subadmin` is also set as role level. If a user as his role level to `998`, then he is a subadmin.
  - The subadmin has the most important permission like `creating a new category`, `updating a new category`, `manaing user's contents`, `blocking/unblocking users` and all most all the permission as `admin`. But some of critical permissions may be excepted like `adding another subadmin`, `deleting a category`, etc.


- Each category has `role level` on `list_role`, `read_role`, `write_role` and `comment_role`.
  - A category can restricts like
    - `list_role` - role level 2
    - `read_role` - role level 3
    - `write_role` - role level 4
    - `commnet_role` - role level 3.
  - Then, if a user has role level 2, then he can list only.
    - If the user has role level 3, then the user can do both of list and read. but not write.
    - the user must have role level 4 and above to list, read, and write.
  - If admin set the reminder forum(category) as `write_role` to `subadmin` and `comment_role` to '0', then anyone can comment on reminders but cannot create a post.

- Each post can have `read_role` and `comment_role`.
  - Admin can set high role to prevent users to read the post.  If the `read_role` is set to `998`, then only admin can read the post. So, it can be used to communicate with admin. The author can still do `RUD(read, update, delete)`.
  - Admin can set high role to prevent users to comment.

- only admins(subadmins) can write under `/admin/` collection.


# Push messaging guidelines

- `admin` can create a document under `/admin/messaging/default_topic/{...}` and all users will receive that message.
  - Background function will send push messages to all users.


# Test Guidelines

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

- `waitUntil` can be written with more complicated way like below.

```ts
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
```






## TODO - seucirty rule check based on user role and category roles
- Need to write test code for secuirty rules.

# Security rules

- All requests of Document CRUD must have user `uid` for user verfication and secuirty validation.

- `/users/<uid>.role` is read only on the security rule. That means, you cannot update his role property in his document.
  - Only admin and subadmin can update the users' role property. Meaning, admin(subadmin) can give higher role to a user.



## Category rules

- check if category exists.
- check if user has role level to crud on that category.

# Client App Development Guide

## User Build Guide

## Category Build Guide

- There is a `deleted` field on category. When a user(admin) wants to delete the category, the app needs to mark it as `{deleted: true}` instead of deleting it.
  - Then, app needs to show the list of the categories that marked as `{deleted: true}`
  - And if the user really wants to delete the category that is marked as `{deleted: true}`, then the category is completely removed from the firestore. 




## Post Build Guide

- The documents of `posts`, and `comments` collections have a field `deleted`.
  - When a user deletes his posts or comment, the document is not actually deleted. Instead, it will mark as `{deleted: true}`.
  - With this flag, client app can display the status on screen if the posts or comments are deleted.


## Comment Buid Guide






# Bugs or Issues

- See [Fire Engine github project](https://github.com/thruthesky/Fire Engine/projects/1).



