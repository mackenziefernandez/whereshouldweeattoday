import * as firebase from 'firebase';
import { flatMap, isObject } from 'lodash';
import env from '../env';

export const firebaseApp = firebase.initializeApp(env.firebaseConfig);
export const firebaseAuth = firebaseApp.auth();
export const firebaseDb = firebaseApp.database();

interface FirebaseMapNode<T> { [key: string]: T; }
type Entity<T extends object> = T & { id: string };

export function convertMapToList<T extends object>(data: FirebaseMapNode<T>): Entity<T>[] {
  return Object.keys(data).reduce((acc, id) => {
    acc.push(Object.assign({}, { id }, data[id]));
    return acc;
  }, [] as Entity<T>[]);
}

export function getDeepUpdates(updates: { [key: string]: any }) {
  return Object.keys(updates).reduce((acc, path) => {
    let value = updates[path];
    if (isObject(value)) {
      value = getDeepUpdates(value);
      Object.keys(value).forEach((childPath) => {
        acc[combinePaths(path, childPath)] = value[childPath];
      });
    } else {
      acc[path] = value;
    }

    return acc;
  }, {} as { [key: string]: any });
}

function splitPath(path: string) {
  return path.split('/').filter((p) => !!p);
}

function combinePaths(...paths: string[]) {
  return flatMap(paths, splitPath).join('/');
}
