import { combineReducers } from 'redux';
import { firebaseReducer } from 'duckbase';

const rootReducer = combineReducers({
  firebase: firebaseReducer
});

export default rootReducer;
