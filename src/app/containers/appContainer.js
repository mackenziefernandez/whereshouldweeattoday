import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import App from '../components/app';

export default compose(
  withRouter,
  connect(undefined, undefined)
)(App);