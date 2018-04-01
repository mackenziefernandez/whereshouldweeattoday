import { combineReducers } from 'redux';
import { firebaseReducer, DuckbaseState } from 'duckbase';

const rootReducer = combineReducers({
  firebase: firebaseReducer
});

export interface RootState {
  firebase: DuckbaseState;
}

export default rootReducer;
