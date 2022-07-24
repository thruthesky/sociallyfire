const firebase = require("@firebase/testing");
const TEST_PROJECT_ID = "sociallyfire";

const A = "user_A";
const B = "user_B";
const authA = { uid: A, email: A + "@gmail.com" };
const authB = { uid: B, email: B + "@gmail.com" };

// 특정 사용자 권한이 있는 (사용자 auth 로 로그인을 한) DB 커넥션을 가져온다.
function db(auth = null) {
  return firebase.initializeTestApp({ projectId: TEST_PROJECT_ID, auth: auth }).firestore();
}

// 특정 사용자가 아닌, 관리자 권한이 있는 DB 커넥션을 가져온다.
// 주의, 관리자로 로그인을 한 경우는 Secuirty 검사를 하지 않고 통과한다.
function admin() {
  return firebase.initializeAdminApp({ projectId: TEST_PROJECT_ID }).firestore();
}

// 테스트 전에, 이전의 데이터를 모두 지운다.
beforeEach(async () => {
  await firebase.clearFirestoreData({ projectId: TEST_PROJECT_ID });
});

// 테스트 시작
describe("FireFlutter 0.3.x - Firestore Security Test", () => {
  it("Readonly - read ok", async () => {
    const testDoc = db().collection("readonly").doc("testDoc");
    await firebase.assertSucceeds(testDoc.get());
  });
  it("Readonly - write fail", async () => {
    await firebase.assertFails(db().collection("readonly").doc("testDoc").set({}));
  });

  it("User - create ok", async () => {
    await firebase.assertSucceeds(db().collection("users").add({}));
  });

  it("User - update ok", async () => {
    //// 여기서 부터, 미리 도큐먼트를 만들어야 하나?
    await firebase.assertSucceeds(
      db(authA).collection("users").doc(A).update({
        name: 1,
      })
    );
  });
});
