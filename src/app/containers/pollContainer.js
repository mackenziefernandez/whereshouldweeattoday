import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { firebaseConnect, getValue } from 'duckbase';

import Poll from '../components/poll';

const mapStateToProps = (state, ownProps) => {
  const pollId = ownProps.match.params.pollId;
  const poll = getValue(state.firebase, `/polls/${pollId}`);

  return {
    pollOptions: (poll && poll.options) || [],
    pollId // eventually used for duckbase
  };
};

const mapPropsToPaths = (props) => [`/polls/${props.pollId}`];

export default compose(
  withRouter,
  connect(mapStateToProps, undefined),
  firebaseConnect(mapPropsToPaths)
)(Poll); // Should show poll or poll results conditionally based on if they have submitted votes
