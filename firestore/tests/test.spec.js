/**
 * 테스트 개요
 *
 * 주의, collection(...).doc(...).update() 를 하기 위해서는 반드시 해당 문서가 존재해야 한다.
 * 그렇지 않으면, update() 명령 자체가 실패해 버려서, Security Rules 가 적용되지(테스트되지) 못한다.
 */
const firebase = require("@firebase/testing");
const TEST_PROJECT_ID = "sociallyfire";

const A = "user_A";
const B = "user_B";
const authA = { uid: A, email: A + "@gmail.com" };
const authB = { uid: B, email: B + "@gmail.com" };

// 파이어베이스 테스트 함수를 짧게 지정
const succeeds = firebase.assertSucceeds;
const fails = firebase.assertFails;

// 사용자 A,B 의 문서. (사용자 권한으로 접속)
// 사용자 A,B 가 자신의 권한을 테스트 할 때 사용.
const userA = db(authA).collection("users").doc(A);
const userB = db(authB).collection("users").doc(B);

// 특정 사용자 권한이 있는 (사용자 auth 로 로그인을 한) DB 커넥션을 가져온다.
function db(auth = null) {
  return firebase.initializeTestApp({ projectId: TEST_PROJECT_ID, auth: auth }).firestore();
}

// 특정 사용자가 아닌, 관리자 권한이 있는 DB 커넥션을 가져온다.
// 주의, 관리자로 로그인을 한 경우는 Secuirty 검사를 하지 않고 통과한다.
function admin() {
  return firebase.initializeAdminApp({ projectId: TEST_PROJECT_ID }).firestore();
}

// 사용자 A,B 의 정보를 가져온다.
// 예) console.log( (await getA()) );
async function getA() {
  return (await admin().collection("users").doc(A).get()).data();
}
async function getB() {
  return (await admin().collection("users").doc(B).get()).data();
}
// 사용자 A,B 의 문서에 JSON(object) 정보를 저장한다.
async function setA(data) {
  return admin().collection("users").doc(A).set(data);
}
async function setB(data) {
  return admin().collection("users").doc(B).set(data);
}

// 사용자 A 를 관리자로 설정한다.
async function Set_A_Admin() {
  return admin().collection("users").doc(A).set({ uid: A, role: 999 });
}

// 사용자 A 를 관리자로 설정하고, 사용자 A 로 접속한 DB 커넥션을 리턴한다.
// 사용 예, 사용자 A 를 관리자로 설정하고, DB 작업을 하려고 할 때 사용한다.
// 예) await succeeds((await adminA()).collection('categories').add({}));
async function adminA() {
  await Set_A_Admin();
  return db(authA);
}

/**
 * 사용자 A 권한으로 접속해서 B 의 문서를 업데이트한다.
 *
 * 주의, 이 함수를 호출하기 전에 필요하면 사용자 A 의 권한을 관리자로 미리 지정해 놓아야 한다.
 * 주의, 이 함수는 before, after 두 개의 문서를 받아 들인다.
 *
 * - (관리자 권한으로) before 의 값으로 B 사용자의 문서를 미리 생성하고,
 * - (사용자 A 의 권한으로) after 의 값으로 업데이트 한다.
 *
 * 예제) A_Update_B({}, {name: 'abc'})
 *
 * 예제) 아래의 두 줄 코드를, 한 줄로 줄일 수 있다.
 *    await setB({});
 *    await succeeds(db(authA).collection("users").doc(B).update({ role: 3 }));
 *
 *    await succeeds(A_Update_B({}, {role: 3})); // 위 두줄과 동일한 코드
 */
async function A_Update_B(before, after) {
  await admin().collection("users").doc(B).set(before);
  return db(authA).collection("users").doc(B).update(after);
}

/**
 * A_Update_B() 를 호출 하기 전에, A 를 관리자로 설정한다.
 *
 * 즉, A 사용자를 관리자로 지정하고, 다른 사용자의 문서를 수정하는 것을 테스트 할 때 사용한다.
 *
 */
async function Admin_A_Update_B(before, after) {
  await Set_A_Admin();
  return A_Update_B(before, after);
}

async function Admin_A_Update_Category(categoryId, before, after) {
  await Set_A_Admin();
  await admin().collection("categories").doc(categoryId).set(before);
  return db(authA).collection("categories").doc(categoryId).update(after);
}
/** ****************** */

// 테스트 전에, 이전의 데이터를 모두 지운다.
beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: TEST_PROJECT_ID });
});

// 테스트 시작
describe("Fire Engine - Firestore Security Test", () => {
  it("Readonly - read ok", async () => {
    const testDoc = db().collection("readonly").doc("testDoc");
    await succeeds(testDoc.get());
  });
  it("Readonly - write fail", async () => {
    await firebase.assertFails(db().collection("readonly").doc("testDoc").set({}));
  });

  it("User - create ok", async () => {
    await succeeds(db().collection("users").add({}));
  });

  // 사용자 권한 체크
  // - role, uid, registered_at 의 값은 변경이 되면 안된다.
  it("User - update - No fields change. No update event happens.", async () => {
    // 통과, 데이터의 변화가 없다. 즉, update 이벤트 자체가 발생하지 않는다.
    await setA({});
    await succeeds(userA.update({}));
  });

  it("User - update - himself, B can change his doc", async () => {
    await setB({});
    await succeeds(userB.update({ name: "my name" }));
  });

  it("User - update - A change B's uid - fails", async () => {
    await setA({ uid: A });
    await fails(userA.update({ uid: B }));
  });

  it("User - update - registered_at change fails", async () => {
    // 통과, registered_at 변경 불가
    await setA({});
    await fails(userA.update({ registered_at: 123 }));
    await setA({ registered_at: 1 });
    await fails(userA.update({ registered_at: 2 }));
  });

  it("User - update - role change fails", async () => {
    // 통과, role 변경 불가
    await setA({});
    await fails(userA.update({ role: 1 }));
    await setA({ role: 0 });
    await fails(userA.update({ role: 1 }));
  });

  // 통과, 내가 관리자 인 경우에는 다른 사람의 문서 및 나의 role 또는 다른 사람의 role 을 변경 할 수 있다.
  it("A cannot change B doc", async () => {
    // 사용자 A 가 B 의 정보를 수정 할 수 없다.
    await fails(db(authA).collection("users").doc(B).update({ name: "NEW_name" }));
  });
  it("A as admin can change B doc", async () => {
    // 사용자 A 를 관리자로 설정
    await setA({ role: 888 });
    await setB({ name: "B_name" });

    // 관리자 권한이 있는 사용자 A 로 접속해 B 정보 수정
    await succeeds(db(authA).collection("users").doc(B).update({ name: "NEW_name" }));
  });

  //
  it("Admin-A can set User B's role", async () => {
    await succeeds(Admin_A_Update_B({}, { role: 3 }));
  });

  //
  it("Admin-A cannot update uid and registered_at", async () => {
    await Set_A_Admin();
    await fails(db(authA).collection("users").doc(B).update({ uid: "up" }));
    await fails(db(authA).collection("users").doc(B).update({ registered_at: 2 }));
  });

  it("User-A can NOT create a category", async () => {
    await fails(db(authA).collection("categories").add({ id: "id", uid: "uid" }));
  });

  it("Admin-A can create a category", async () => {
    await fails((await adminA()).collection("categories").add({}));
    await fails((await adminA()).collection("categories").add({ id: "cat" }));
    await fails((await adminA()).collection("categories").add({ uid: "uid" }));
    // wrong uid
    await fails((await adminA()).collection("categories").add({ id: "cat", uid: "uid" }));
    // correct uid
    await succeeds((await adminA()).collection("categories").add({ id: "cat", uid: A }));
  });

  it("User-A can NOT update a category", async () => {
    const ref = await admin().collection("categories").add({ id: "a", name: "name" });
    await fails(db(authA).collection("categories").doc(ref.id).update({ name: "up" }));
  });

  it("Admin-A can update a category", async () => {
    await succeeds(Admin_A_Update_Category("cat", { name: "a" }, { name: "b" }));
  });

  it("Admin-A delete a category", async () => {
    const ref = await (await adminA()).collection("categories").add({ id: "cat", uid: A });
    await succeeds((await adminA()).collection("categories").doc(ref.id).delete());
  });

  it("TODO - post create ok - required params, category exists, role, will be my post", async () => {
    const catRef = await admin().collection("categories").add({ id: "cat", uid: A, role_write: 5 });

    //
    await setA({ uid: A, role: 5 });
    await succeeds(db(authA).collection("posts").add({ categoryDocumentID: catRef.id, uid: A }));
  });

  it("TODO - post create tests", async () => {
    const catRef = await admin().collection("categories").add({ id: "cat", uid: A, role_write: 5 });

    // role 이 낮음
    await setA({ uid: A, role: 4 });
    await fails(db(authA).collection("posts").add({ categoryDocumentID: catRef.id, uid: A }));

    // role 이 높음
    await setA({ uid: A, role: 6 });
    await succeeds(db(authA).collection("posts").add({ categoryDocumentID: catRef.id, uid: A }));

    // 입력 값 중에 카테고리 아이디가 틀림. 존재하지 않는 카테고리.
    await fails(db(authA).collection("posts").add({ categoryDocumentID: "wrong", uid: A }));

    // 잘못된 사용자 아이디
    await fails(db(authA).collection("posts").add({ categoryDocumentID: catRef.id, uid: "C" }));

    // 필력 입력 값 누락
    await fails(db(authA).collection("posts").add({ title: "T" }));
  });

  it("TODO - post update ", async () => {});

  it("TODO - post get - rule level test ", async () => {});
  it("TODO - post list - rule level test ", async () => {});
  it("TODO - post delete ", async () => {});

  it("TODO - post like ", async () => {});
  it("TODO - post dislike ", async () => {});
});
