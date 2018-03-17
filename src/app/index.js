import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { FirebaseProvider } from 'duckbase';
import { createHashHistory } from 'history';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from './containers/appContainer';
import DevTools from './containers/DevTools';
import configureStore from './configureStore';
import { firebaseApp } from './utils/FirebaseUtils';

const history = createHashHistory();
const store = configureStore(history);

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <FirebaseProvider firebaseApp={firebaseApp} store={store}>
        <Router>
          <div>
            <App />
            <DevTools />
          </div>
        </Router>
      </FirebaseProvider>
    </Provider>
  </MuiThemeProvider>
  , document.getElementById('react-root'));
