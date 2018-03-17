import React, { Component } from 'react';
import AppRoutes from '../routes';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

export default class App extends Component {
  render() {
    return (
      <div className='app'>
          <AppRoutes />
      </div>
    );
  }
}


