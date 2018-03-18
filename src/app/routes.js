import React from 'react';
import { Route } from 'react-router-dom';
import Home from './containers/homeContainer';
import Poll from './containers/pollContainer';

const AppRoutes = () => (
  <div>
    <Route exact path='/' component={Home}/>
    <Route path='/poll/:pollId' component={Poll}/>
  </div>
);

export default AppRoutes;
