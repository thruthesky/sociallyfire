import * as functions from "firebase-functions";

export function notUpdatable(
    change: functions.Change<functions.firestore.QueryDocumentSnapshot>
): boolean {
  const before = change.before.data();
  const after = change.after.data();

  for (const k in Object.keys(before)) {
    if (before[k] !== after[k]) return false;
  }
  return true;
}
