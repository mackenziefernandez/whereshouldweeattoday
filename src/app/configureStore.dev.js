import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import reduxPromise from 'redux-promise';
import rootReducer from './reducers';
import DevTools from './containers/DevTools';

export default function configureStore(history, initialState) {
  const enhancer = compose(
    applyMiddleware(reduxThunk, reduxPromise),
    DevTools.instrument()
  );

  return createStore(rootReducer, initialState, enhancer);
}
