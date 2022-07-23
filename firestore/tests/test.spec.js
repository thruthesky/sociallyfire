const assert = require('assert');
 
const firebase = require('@firebase/testing');
const TEST_PROJECT_ID = "withcenter-test-project";
 
describe('Firestore security test', () => {
   it('Readonly', async () => {
       const db = firebase.initializeTestApp({ projectId: TEST_PROJECT_ID }).firestore();
       const testDoc = db.collection('readonly').doc('testDoc');
       await firebase.assertSucceeds(testDoc.get());
   });
});
