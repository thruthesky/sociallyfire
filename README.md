# Fire Engine

`Fire Engine` 은 소셜 앱, 쇼핑몰 앱, 커뮤니티 앱 등을 만들기 위한 Firebase Cloud Functions 백엔드 툴이다.


- [Fire Engine](#fire-engine)
- [TODO](#todo)
- [개요](#개요)
  - [용어](#용어)
  - [해야 할 작업 목록](#해야-할-작업-목록)
  - [백그라운드 함수만 사용하는 이유](#백그라운드-함수만-사용하는-이유)
- [Installation](#installation)
- [테스트](#테스트)
  - [두 가지 테스트 방식](#두-가지-테스트-방식)
    - [클라우드 함수 테스트](#클라우드-함수-테스트)
    - [코드 유닛 테스트](#코드-유닛-테스트)
  - [테스트가 잘 되는지 테스트하기](#테스트가-잘-되는지-테스트하기)
  - [Testing indiviual test spec](#testing-indiviual-test-spec)
- [Lint](#lint)
- [Deploy](#deploy)
- [파이어베이스 컬렉션 및 문서 구조](#파이어베이스-컬렉션-및-문서-구조)
  - [User Collection and Document](#user-collection-and-document)
  - [친구 기능과 DB 구조](#친구-기능과-db-구조)
- [Storage structure](#storage-structure)
- [Push message data structure](#push-message-data-structure)
- [Access Control List - Admin permission security](#access-control-list---admin-permission-security)
- [Push messaging guidelines](#push-messaging-guidelines)
- [Test Guidelines](#test-guidelines)
  - [Test](#test)
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


# TODO

- 사용자 정보를 생성하고, 삭제하는 것은 완료했는데,
  - 수정할 때, meta 에 저장하는 것을 할 것. 주의: 어렵게 코딩하지 말고, 매우 쉽게 할 것.
  - 메타 문서 테스트
- 카테고리 테스트
- 글 테스트
- 푸시 토큰 저장
- 글 작성, 코멘트 작성시 푸시 알림 테스트

# 개요

- 파이어베이스 기반으로 웹 또는 앱 개발을 할 때, 보다 편리하게 개발 작업을 할 수 있도록 도움을 주는 클라우드 함수 모음이다.


- 본 프로젝트는 백엔드의 역할이 매우 강하다. 그리고 클라우드 함수의 특성상 개발 및 유지보수 작업이 만만치 않다. 그래서 100% 완벽한 유닛 테스트를 바탕으로 개발을 해 나가야 한다. 테스트는 원격 파이어베이스 접속없이 모든 에뮬레이터를 통해서 100% 로컬에서 이루어져야 한다.
  - 100% 완벽한 테스트가 이루어지지 않으면 본 프로젝트는 실패하는 것으로 간주한다.


- 깃허브 소스 저장소: https://github.com/thruthesky/fire-engine


## 용어

- `일부 클라이언트의 기능적 제한` 또는 `클라이언트의 기능 제한`
  - 파이어베이스를 사용하는 모든 클라이언트 앱/웹 개발 플랫폼이 파이어베이스의 모든 기능을 다 사용 할 수 있는 것은 아니다. 예를 들면, `FlutterFlow`의 경우 파이어베이스의 기능을 매우 제한적으로 사용 할 수 있는데, `Firestore`, `Authentication`, `Storage`, `Cloud Messaging` 등 몇 몇 기능만 사용하는데 그 사용하는 기능 중에서도 일 부분만 사용가능하다. 예를 들면, `Firestore` 의 `Collection Query` 를 사용하지 못하고, `Auth Claims` 을 사용하지 못하며, `Cloud Messaging` 에서 `Topic Subscription` 을 하지 못하는 등 제대로 된 파이어베이스 기능을 사용하지 못하도록 되어져 있다. 
    - 또한 `FlutterFlow` 에는 정해진 틀이 있어 사용자 정보는 무조건 `Firestore` 의 `users` 컬렉션에 들어가야하는 등 각종 컬렉션, 필드명 등이 미리 정해져 있고 반드시 그 정해진 것을 사용해야 한다.
    - 그리고 본 프로젝트(`FireEngine`)에서는 모든 클라이언트 개발 플랫폼을 지원하며, `FlutterFlow` 역시 완전히 지원한다.
    - 따라서 `FireEngine` 의 동작 방식이 이러한 `일부 클라이언트의 기능적 제한`으로 인해 약간은 비효율적인 코드가 있을 수 있다.



## 해야 할 작업 목록

- [깃허브 프로젝트 참고](https://github.com/thruthesky/Fire Engine/projects/1).



## 백그라운드 함수만 사용하는 이유

- HTTP Functions 를 쓰면 클라이언트에서 서버로 TCP 접속을 하기 위해서 소모되는 시간과 Firestore 에서 데이터를 읽어 클라이언트로 전송하는 등 많은 시간이 소모됩니다. 특히, Firebase hosting 에서 Cloud Functions 로 접속하는 경우 오직 us-central1 서버만 사용해야하는 최악의 상황에 놓이게 된다.
  - 클라이언트에서 Firestore 에 직접 액세스하는 경우 소켓 접속이 항상 유지되므로 Connectionless 방식의 TCP 접속 시간이 소모되지 않는다.
  - 또한 클라이언트에서 Offline support 를 통해서 문서를 로컬에서 저장 및 읽기를 하므로 매우 빠르게 문서를 액세스 할 수 있다.
  - 이러한 장점으로 인해 클라이언트 개발을 할 때 (`Vue` 또는 `Flutter` 등) Firestore 로 코멘트 저장하면 매우 빠르게 클라이언트가 반응하고, `Fire Engine` 가 `Background Functions` 방식으로 동작하여 푸시 알림을 보내거나 코멘트 트리(들여쓰기) 형식에 맞추어 적절히 저장을 한다.
  즉, `HTTP Functions` 방식에 비해 클라이언트 개발이 쉬워지면서 반응 속도도 더 빨라 백그라운드 함수 방식을 사용하는 것이다.

- 참고로 어떤 클라이언트 개발 툴(`FlutterFlow`)은 `Callable Functions`를 지원하지 않아, `Callable Functions` 개발을 하지 않는다.




# Installation

- To test, you need to put your firebase project's admin sdk key into `functions/firebase.admin-key.json`.

# 테스트

- 클라우드 함수를 사용하는데 있어서, 개발이 어렵고 관리가 어려운 점, 특히 버그 또는 에러가 발생하면 클라이언트 개발자에게 큰 부담이 되는 점을 고려해서, 본 프로젝트에서는 버그가 없는 백엔드 개발을 위해서, TDD 를 매우 중요하게 적용하고 있다. 완벽한 TDD 방식의 개발에 실패하면 본 프로젝트는 자동으로 실패하는 것으로 간주한다.

- 표준적인 테스트 코딩 방식으로 TDD 를 해서, 누구라도 쉽게 테스트하고 업데이트를 할 수 있도록 한다.

- 다만, 모든 테스트는 실제 파이어베이스 프로젝트에 적용한다. 그 이유로는 많은 개발자들이 로컬 (개발자의) 컴퓨터에 에뮬레이터를 설치하고 관리 및 실행하는 것을 어려워하고 있기 때문이다. 하지만, 테스트 작업을 할 때에는 임시 (테스트 전용) 파이어베이스 프로젝트를 생성해서 테스트를 실행 하는 것이 좋다.

- 클라우드 함수 테스트 코드는 `functions/tests` 폴더에 기록된다. 이 폴더에서 테스트를 하기 위해서는 `npm i` 를 하고 `npm run test` 명령을 하면 된다.
  - 개별적인 테스트를 하기 위해서는 `$ npm run test:user:crud` 와 같이 실행하면 된다.


## 두 가지 테스트 방식

- 테스트를 빠르게 진행하기 위해서 두 가지 테스트 방식을 가지고 있다.

### 클라우드 함수 테스트

- 클라우드 함수에 직접 연결해서 테스트하는 것으로, 클라우드 함수가 먼저 deploy 되어야 한다. 로컬 에뮬레이터에서 테스트를 한다면, 소스 코드 수정 후, 에뮬레이터를 종료하고, 다시 빌드해서, 에뮬레이터를 다시 실행해야 한다. 즉, 좀 번거롭지만, 실제 deploy 하는 것 보다는 빠르다.
  - 하지만, 본 프로젝트에서는 에뮬레이터를 통해서 테스트하는 것 아니라, 임시 (테스트 전용) 파이어베이스 프로젝트에 테스트를 하므로, 실제 deploy 를 해야 한다. 클라우드 함수에 deploy 하는 시간이 좀 오래 걸려서 번거로운 점이 있다. 그래서, deploy 하기 전에 최대한 `코드 유닛 테스트`를 해야 한다.
- 클라우드 함수의 경우 테스트 스크립트 파일 이름이 `*.bg.spect.ts` 로 끝이 난다.
- 테스트 예: `user.create.bg.spec.ts`(https://github.com/thruthesky/Fire Engine/blob/main/functions/tests/user/user.create.bg.spec.ts)

### 코드 유닛 테스트

- 클라우드 함수를 직접 호출하지 않고, `Firestore` 에 직접 접속해서 테스트를 한다. 이렇게 하면, 함수 부분을 제외한 내부적인 코드를 빠르게 테스트 할 수 있다. Mocha 와 같은 test 를 통해서 소스 코드 수정 즉시 결과를 알 수 있는 것이다. 소스 코드를 수정 할 때 마다 매 번, 빌드하고 클라우드 함수에 deploy 하는 과정을 거치지 않으므로 빠르게 테스트 작업을 할 수 있다. 내부적인 소스 코드의 테스트가 끝나면, 클라우드 함수로 액세스 할 수 있도록 연결하는 것이다.

- 코드 유닛 테스트의 경우, 스크립트 파일의 확장자는 `*.spect.ts` 로 끝이 난다. 예) `<root>/functions/tests/user/user.create.spec.ts`.

## 테스트가 잘 되는지 테스트하기

- `$ npm run test:test` 명령을 입력하면, 현재 테스트 코드들이 잘 실행될 수 있는지 확인을 한다.
  - 테스트 패키지가 잘 실행하는지, `Firestore` 에 올바로 접속 할 수 있는지 등을 테스트 한다.

- To test if firebase connection is working, run `npm run test:firebase-connection`.

## Testing indiviual test spec

- You can add the test run script in `package.json` and run command like `npm run test:user:create`
- You can also add test command like `mocha --require ts-node/register --watch --watch-files ... tests/user/*.spec.ts`. So, you can test many test files at once.

# Lint

- See `functions/eslintrc.js` for details.

# Deploy

- Run `npm run deploy` to deploy to Firebase.
  - It will do `npm run lint:fix` first and if there is no error, it will deploy.


# 파이어베이스 컬렉션 및 문서 구조

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


- 사용자 계정 생성 또는 정보 업데이트를 할 때, `FireEngine` 이 사진이나 기타 정보를 업로드하는지 체크해서 `/users-meta` 컬렉션에 사용자 문서의 모든 필드와 값을 복사하고 추가로 `has_photo` 와 같은 `has_xxx` 등의 메타 정보가 기타 메타 정보를 추가한다.
  - 예를 들면, 사용자가 프로필 사진을 추가 했으면, `/users-meta/<uid>.has_photo_url` 의 값이 true 가 된다.
  - 사용자 메타 정보 문서를 `/users/<uid>/meta` 에 저장하지 않고, 최 상위에 저장하는 이유는 `FlutterFlow` 와 같이 어떤 클라이언트 플랫폼에서는 Firestore 의 `collection group query` 를 사용 할 수 없기 때문이다.
  - 이런 meta 방식은 `posts` 나 `comments` 에도 동일하게 적용된다.
  - 업데이트가 있는 경우, 동일한 문서에 업데이트 하지 않는 이유는 아무리 코딩을 조심해서 해도, background functions 의 `onUpdate` event trigger 에서 무한 루프를 돌 가능성이 있기 때문이다. 특히, 문서를 업데이트 할 때, 개발자가 미리 정의되지 않은 임의의 필드와 값을 저장할 수 있으므로 더욱 (무한 업데이트 루프 방지) 개발이 어렵게 된다.
  - `xxxxx-meta` 문서에는 원본 문서의 모든 정보가 다 들어가 있으므로, `meta` 를 직접 검색해서 내용을 보여 줄 수 있다.
    - 예를 들어, 사용자 프로필 사진을 업로드한 사용자만 표시하고 싶다면, `users-meta` 폴더만 검색해서 그 문서 안의 사용자 이름, 생년월일, 성별 등을 사용 할 수 있다.
    - 이것은 `posts-meta` 와 `comments-meta` 도 동일한다.


## User Collection and Document

- `uid` is the user's uid.


## 친구 기능과 DB 구조

- `클라이언트의 기능적 제한`으로 인해 채팅 사용자는 `/chat_users` 폴더에 기록이 된다. 이 때, 채팅 사용자 필드에 `{friend: true/false}` 를 두어 해당 사용자가 친구인지 아닌지를 판단 할 수 있으며,
  - `친구 목록`과 `모르는 사람` 목록을 둘 수 있다.



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



