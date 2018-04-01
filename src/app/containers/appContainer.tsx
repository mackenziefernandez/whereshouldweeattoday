import * as Duckbase from 'duckbase';
import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { RootState } from '../reducers';
import * as FirebaseUtils from '../utils/FirebaseUtils';
import App from '../components/app';

const mapStateToProps = (state: RootState) => {
  return {
    user: Duckbase.getCurrentUser(state.firebase)
  };
};

type Props = ReturnType<typeof mapStateToProps>;

class AppWrapper extends React.Component<Props> {
  componentDidMount() {
    if (!this.props.user) {
      FirebaseUtils.firebaseAuth.signInAnonymously();
    }
  }

  render() {
    return this.props.user ? <App /> : null;
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, undefined)
)(AppWrapper);
