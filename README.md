# SociallyFire

SociallyFire(SF) is a framework to help building Soical apps.

It is a derived version of [fireflutter](https://pub.dev/packages/fireflutter) that is tightly coupled with Flutter.
And It is now trying to decouple from Flutter by implementing its core parts into cloud functions(event trigger). So, the final version of SF would work as frame agnostic.


- [SociallyFire](#sociallyfire)
- [TODO](#todo)
- [Overview](#overview)
  - [Background Functions](#background-functions)
  - [Idempotence](#idempotence)
- [Test](#test)
  - [Testing the test system.](#testing-the-test-system)
- [Lint](#lint)
- [Deploy](#deploy)
- [Database and Document Structure](#database-and-document-structure)

# TODO

- Idempotence 를 제대로 처리해서, 두번 update 가 되지 않도록 해야 한다.
  - `updated: boolean` 과 `context.eventId` 를 동시에 사용해서, 동일한 업데이트 작업이 두번되지 않도록 한다.
    - 이것이 필요한 이유는, `/users/<uid>` 컬렉션 하나면 괜찮겠지만, category, post, comment, chat 등 수 많은 컬렉션에 다 meta 폴더를 만들 수가 없다.참조한다.
  - 각 functions 의 onUpdate 에서 공통된 함수 `if (notUpdatable(change)) return null;` 를 두어서, chagne.before.data() 와 change.after.data() 의 모든 필드가 같은 값이면, return null 을 하도록 한다.
  - 따라서, 문서에서 `updatedAt` 과 같이, 항상 업데이트 할 때 마다 변하는 값을 저장해서는 안된다.
# Overview

## Background Functions

HTTP functions in Cloud Functions are so slow comparing to the direct connection to Firestore with offline support in client side.

When offline supported (which is the default on most of client platform), the client will be updated before saving the data to Firestore and it is fast enough. That is why `SF` goes as `Background Functions(background event trigger)`.


## Idempotence



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



