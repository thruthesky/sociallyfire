# SociallyFire

SociallyFire(SF) is a framework to help building Soical apps.

It is a derived version of [fireflutter](https://pub.dev/packages/fireflutter) that is tightly coupled with Flutter.
And It is now trying to decouple from Flutter by implementing its core parts into cloud functions(event trigger). So, the final version of SF would work as frame agnostic.


- [SociallyFire](#sociallyfire)
- [Overview](#overview)
  - [Background Functions](#background-functions)
  - [Infinite loop of doucment update](#infinite-loop-of-doucment-update)
- [Installation](#installation)
- [Test](#test)
  - [Testing the test system.](#testing-the-test-system)
- [Lint](#lint)
- [Deploy](#deploy)
- [Database and Document Structure](#database-and-document-structure)


# Overview

## Background Functions

HTTP functions in Cloud Functions are so slow comparing to the direct connection to Firestore with offline support in client side.

When offline supported (which is the default on most of client platform), the client will be updated before saving the data to Firestore and it is fast enough. That is why `SF` goes as `Background Functions(background event trigger)`.


## Infinite loop of doucment update

- See the introduction of the problem on the [infinite loop of document update](https://www.youtube.com/watch?v=rERRuBjxJ80&t=600s). And a solution is introduced in the youtube video tutorial also.

# Installation

- To test, you need to put your firebase project's admin sdk key into `functions/firebase.admin-key.json`.

# Test

The TDD is the most important part of this project. The perfect TDD implementation is the ultimate goal to make this project successful.

The test codes are under `functions/tests` folder.

To test, enter `functions/tests` folder first.

## Testing the test system.

- To test if the testing is working, run `npm run test:test`.

- To test if firebase connection is working, run `npm run test:firebase-connection`.


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



