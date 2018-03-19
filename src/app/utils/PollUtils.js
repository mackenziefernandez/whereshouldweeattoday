import * as FirebaseUtils from './firebaseUtils';

export function startPoll(options) {
  return FirebaseUtils.firebaseDb.ref(`polls`).push(options).key();
}
