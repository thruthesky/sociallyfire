import * as functions from "firebase-functions";

// onUpdate() background trigger 에서 infinite update loop 에 빠지지 않도록 확인
// TODO - 테스트를 해야 함.
export function updatable(
    change: functions.Change<functions.firestore.QueryDocumentSnapshot>
): boolean {
  const before = change.before.data();
  const after = change.after.data();

  const beforeKeys = Object.keys(before);
  const afterKeys = Object.keys(after);

  // 키(필드)의 수가 다르면, 업데이트를 해야 함.
  if (beforeKeys.length != afterKeys.length) return true;

  // 키(필드)의 수가 같지만, before 의 키가 after 에 모두 있지 않으면 업데이트를 해야 함.
  if (beforeKeys.every((x) => afterKeys.includes(x)) === false) return true;

  // 키(필드)의 수가 같고, before 와 after 에 모두 포함되지만, 각 필드의 값이 다르면, 업데이트 해야 함.
  for (const k in beforeKeys) {
    if (before[k] !== after[k]) return true;
  }
  // 키(필드)수가 같고, before 와 after 에 모두 같은 필드가 있고, 각 필드의 값이 같다면,
  // 업데이트 할 것이 없음.
  return false;
}

export function notUpdatable(change: functions.Change<functions.firestore.QueryDocumentSnapshot>) {
  return !updatable(change);
}
