import React, { Component } from 'react';
// import PropTypes from 'prop-types';

export default class PollResults extends Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className='pollResults'>
        {`You're going to Twisted Pine!`}
      </div>
    );
  }
}