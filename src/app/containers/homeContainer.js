import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Home from '../components/home';

const mapDispatchToProps = {
  startPoll: () => {} // break out options by line, push to FB, nav to poll page
};

export default compose(
  withRouter,
  connect(undefined, mapDispatchToProps)
)(Home);
