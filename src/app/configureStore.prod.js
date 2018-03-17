import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import reduxPromise from 'redux-promise';
import rootReducer from './reducers';

export default function configureStore(history, initialState) {
  const enhancer = applyMiddleware(reduxThunk, reduxPromise);
  return createStore(rootReducer, initialState, enhancer);
}
